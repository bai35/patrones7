// PATRON MEMENTO (Caretaker): mantiene la pila de snapshots por pedido.
// No mira ni modifica el contenido de cada memento, solo los guarda y los
// devuelve en orden (LIFO) cuando se pide revertir (RF8).
//
// Se guarda en memoria del proceso: para un caso academico/demo es
// suficiente; en produccion se persistiria en su propia coleccion.
class PedidoHistorial {
  constructor() {
    this._pilaPorPedido = new Map(); // pedidoId -> PedidoMemento[]
  }

  guardar(pedidoId, memento) {
    const clave = String(pedidoId);
    if (!this._pilaPorPedido.has(clave)) {
      this._pilaPorPedido.set(clave, []);
    }
    this._pilaPorPedido.get(clave).push(memento);
  }

  // Saca (y elimina) el ultimo snapshot guardado para poder revertir a el.
  restaurarUltimo(pedidoId) {
    const clave = String(pedidoId);
    const pila = this._pilaPorPedido.get(clave);
    if (!pila || pila.length === 0) return null;
    return pila.pop();
  }

  listar(pedidoId) {
    const clave = String(pedidoId);
    return (this._pilaPorPedido.get(clave) || []).map((m) => ({
      fecha: m.fecha,
      estado: m.obtenerEstado()
    }));
  }
}

module.exports = PedidoHistorial;
