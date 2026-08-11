// SRP: unica responsabilidad = hacer peticiones HTTP y normalizar errores.
// Ningun componente ni servicio de negocio llama a fetch() directamente;
// todos dependen de esta abstraccion (DIP), asi que si mañana cambias fetch
// por axios, solo se toca este archivo.
export default class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(ruta, token) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const respuesta = await fetch(`${this.baseUrl}${ruta}`, { headers });
    return this._procesarRespuesta(respuesta);
  }

  async post(ruta, body, token) {
    return this._enviar('POST', ruta, body, token);
  }

  async put(ruta, body, token) {
    return this._enviar('PUT', ruta, body, token);
  }

  async patch(ruta, body, token) {
    return this._enviar('PATCH', ruta, body, token);
  }

  async _enviar(metodo, ruta, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const respuesta = await fetch(`${this.baseUrl}${ruta}`, {
      method: metodo,
      headers,
      body: JSON.stringify(body)
    });
    return this._procesarRespuesta(respuesta);
  }

  async _procesarRespuesta(respuesta) {
    const data = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(data.mensaje || 'Ocurrio un error al conectar con el servidor.');
    }
    return data;
  }
}
