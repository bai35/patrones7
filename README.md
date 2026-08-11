# Confianza — arquitectura en capas (SOLID + GRASP)

Misma funcionalidad que la versión simplificada (registro, login, productos,
noticias), pero reorganizada en capas siguiendo SOLID y GRASP. Útil si el
proyecto va a crecer o si te lo van a revisar académicamente.

## Estructura

```
confianza-solid/
├── server.js              Punto de entrada: solo conecta DB y levanta el servidor
├── seed.js                 Script de datos de ejemplo
├── src/
│   ├── app.js               Composition root: arma la app e inyecta dependencias
│   ├── config/
│   │   └── database.js       Conexión a MongoDB
│   ├── models/                Esquemas de Mongoose (User, Product, News)
│   ├── repositories/           Acceso a datos (aísla Mongoose)
│   ├── services/                Lógica de negocio (Information Expert)
│   ├── controllers/              Traducen HTTP a llamadas de servicio (GRASP Controller)
│   ├── routes/                    Definen endpoints, reciben el controlador ya armado
│   ├── middleware/                 Autenticación JWT, rate limiting, manejo de errores
│   └── utils/                       PasswordHasher, TokenService, ApiError, asyncHandler
└── public/                 Frontend componentizado (ver seccion de abajo)
```

## Frontend componentizado (SOLID)

El frontend es JavaScript puro con módulos ES nativos del navegador (sin build,
sin frameworks), organizado igual que el backend: servicios → componentes →
composition root.

```
public/
├── index.html / login.html / registro.html   "Cascarones": solo <div> contenedores
├── styles.css
└── js/
    ├── core/
    │   └── Component.js          Clase base: define el contrato render/mount
    ├── services/
    │   ├── ApiClient.js           Unico lugar que hace fetch()
    │   ├── SessionStorageService.js  Unico lugar que toca localStorage
    │   ├── AuthService.js          Logica de login/registro/sesion
    │   ├── ProductService.js
    │   └── NewsService.js
    ├── components/
    │   ├── HeaderComponent.js      Nav + estado de sesion
    │   ├── HeroComponent.js         Seccion principal (estatico)
    │   ├── ProductListComponent.js
    │   ├── NewsListComponent.js
    │   ├── LoginFormComponent.js
    │   └── RegisterFormComponent.js
    ├── main-home.js                Composition root de index.html
    ├── main-login.js                Composition root de login.html
    └── main-registro.js              Composition root de registro.html
```

**Cómo se aplican los principios:**

- **SRP:** `ApiClient` solo hace peticiones HTTP; `SessionStorageService` solo lee/escribe
  `localStorage`; cada componente solo pinta su porción de pantalla.
- **DIP:** los componentes reciben sus servicios por constructor
  (`new ProductListComponent('#lista-productos', productService)`), nunca crean
  un `ApiClient` ellos mismos.
- **OCP:** para agregar una nueva sección (ej. testimonios de clientes) creas un
  `TestimonialListComponent.js` nuevo, sin tocar los demás componentes.
- **Liskov:** todos los componentes heredan de `Component` y respetan el mismo
  contrato `render()` / `mount()`, así que cualquiera puede montarse de la misma forma.
- **Composition root:** `main-home.js`, `main-login.js` y `main-registro.js` son
  los únicos archivos donde se decide qué implementación concreta usa cada página.

## Cómo se aplican los principios

**SOLID**

- **S — Single Responsibility:** cada archivo hace una sola cosa. `UserRepository`
  solo habla con Mongoose; `AuthService` solo decide reglas de negocio;
  `AuthController` solo traduce HTTP.
- **O — Open/Closed:** puedes agregar un nuevo tipo de repositorio (por ejemplo uno
  que use otra base de datos) sin modificar `AuthService`, siempre que respete los
  mismos métodos.
- **L — Liskov:** cualquier repositorio que implemente los mismos métodos
  (`buscarPorEmail`, `crear`, etc.) puede sustituir a otro sin romper el servicio.
- **I — Interface Segregation:** los controladores solo exponen los métodos que
  las rutas necesitan, no un objeto gigante con todo.
- **D — Dependency Inversion:** `AuthService` recibe `userRepository` por
  constructor (inyección de dependencias) en vez de crear un `new UserRepository()`
  dentro de sí mismo. Todo se conecta en un único lugar: `src/app.js`
  (el "composition root").

**GRASP**

- **Controller:** `AuthController`, `ProductController`, `NewsController` — reciben
  la petición HTTP y delegan, sin lógica de negocio propia.
- **Information Expert:** `AuthService` decide si un login es válido porque tiene
  la información (usuario, hash, comparador) para hacerlo.
- **Pure Fabrication:** `PasswordHasher`, `TokenService`, `ApiError`,
  `asyncHandler` — clases que no representan un concepto del negocio, creadas solo
  para mantener el código ordenado y con bajo acoplamiento.
- **Low Coupling / High Cohesion:** el flujo siempre va en una dirección
  `ruta → controlador → servicio → repositorio → modelo`, cada capa solo conoce a
  la siguiente.

## Cómo correrlo

```bash
npm install
cp .env.example .env
```

Edita `.env` con tu `MONGO_URI` de MongoDB Atlas y un `JWT_SECRET` seguro.

```bash
npm run seed   # opcional: carga productos y noticias de ejemplo
npm run dev
```

Abre `http://localhost:4000` (o el puerto que definas en `.env`).

## Endpoints

| Método | Ruta                  | Protegida |
|--------|-----------------------|-----------|
| POST   | `/api/auth/registro`  | No        |
| POST   | `/api/auth/login`     | No        |
| GET    | `/api/auth/perfil`    | Sí (JWT)  |
| GET    | `/api/productos`      | No        |
| GET    | `/api/productos/catalogo` | No    |
| POST   | `/api/productos`      | Sí (admin)|
| PATCH  | `/api/productos/:id/stock` | Sí (admin) |
| GET    | `/api/noticias`       | No        |

## Patrones de diseño agregados

Sobre la base SOLID/GRASP se agregaron 6 patrones GoF, cada uno resolviendo
un requerimiento funcional concreto. Todos siguen la misma convención de
capas: `ruta → controlador → servicio → (repositorio/adapter/strategy/etc.)`.

### Adapter — Pasarelas de pago (RF1, RF2)

`src/adapters/` define `PaymentGatewayAdapter` (contrato común `pagar()`) y
tres implementaciones concretas: `PayPalAdapter`, `YapeAdapter`, `PlinAdapter`.
`PaymentService` (`src/services/PaymentService.js`) nunca habla con el SDK
real de cada pasarela, solo con el adaptador. El estado habilitado/deshabilitado
se guarda en `PaymentGatewayConfig` (Mongo) y lo administra el admin.

| Método | Ruta | Protegida |
|--------|------|-----------|
| GET | `/api/pasarelas` | No |
| PATCH | `/api/pasarelas/:nombre` (`{ habilitada: true/false }`) | Sí (admin) — RF2 |
| POST | `/api/pasarelas/pagar` (`{ pasarela, monto, datos }`) | No |

### Proxy — Reportes financieros (RF3, RF4)

`ReportService` (RealSubject) calcula el reporte. `ReportProxy`
(`src/proxies/ReportProxy.js`) expone la misma interfaz pero valida que
`usuario.rol` sea `gerente` o `contador` antes de delegar. El controlador
solo conoce el proxy.

| Método | Ruta | Protegida |
|--------|------|-----------|
| GET | `/api/reportes/completo` | Sí (JWT + rol Gerente/Contador) |

### Observer — Alertas de inventario (RF5, RF6)

`InventoryNotifier` (Subject) mantiene observadores suscritos;
`RolNotificationObserver` (ConcreteObserver) guarda una notificación por rol
(Gerente, Compras) cuando el stock de un producto cae por debajo de su
`stockMinimo` (configurable por producto en el modelo `Product`).

| Método | Ruta | Protegida |
|--------|------|-----------|
| PATCH | `/api/productos/:id/stock` (`{ stockActual }`) | Sí (admin) — dispara el Observer si corresponde |
| GET | `/api/notificaciones` | Sí (JWT) — devuelve las notificaciones del rol del usuario logueado |

### Command + Memento — Procesamiento de pedidos (RF7, RF8)

Cada acción sobre un pedido (`CrearPedidoCommand`, `ProcesarPedidoCommand`,
`AplicarDescuentoCommand`, `CancelarPedidoCommand`) es un objeto `Command`
en `src/commands/`. `OrderService` actúa como Invoker: ejecuta el comando y
lo registra en `historialComandos` (RF7). Antes de mutar un pedido existente,
cada comando guarda un `PedidoMemento` en el `PedidoHistorial` (Caretaker),
lo que permite revertir el pedido a su estado anterior (RF8).

| Método | Ruta | Protegida |
|--------|------|-----------|
| POST | `/api/pedidos` (`{ productos }`) | Sí (JWT) |
| GET | `/api/pedidos/:id` | Sí (JWT) |
| POST | `/api/pedidos/:id/procesar` | Sí (JWT) |
| POST | `/api/pedidos/:id/descuento` (`{ porcentaje }`) | Sí (JWT) |
| POST | `/api/pedidos/:id/cancelar` | Sí (JWT) |
| POST | `/api/pedidos/:id/revertir` | Sí (JWT) — restaura el último Memento |
| GET | `/api/pedidos/:id/historial` | Sí (JWT) — snapshots guardados (Memento) |
| GET | `/api/pedidos/comandos/historial` | Sí (JWT) — comandos ejecutados (RF7) |

### Strategy — Políticas de precios (RF9, RF10)

`EstrategiaPrecio` define el contrato `calcular(producto)`.
`PrecioEstandarStrategy`, `PrecioDescuentoPorcentualStrategy` y
`PrecioDinamicoStrategy` son las implementaciones concretas.
`PricingService` (Context) lee la configuración activa (`PricingConfig` en
Mongo) y delega el cálculo en la estrategia correspondiente, sin saber cómo
calcula cada una.

| Método | Ruta | Protegida |
|--------|------|-----------|
| GET | `/api/precios/configuracion` | No |
| PUT | `/api/precios/configuracion` (`{ estrategia, porcentajeDescuento, factorDemanda }`) | Sí (admin) — RF10 |
| GET | `/api/precios/:productoId` | No — RF9 |

### Iterator — Catálogo de productos (RF11, RF12)

`ProductCatalogIterator` (`src/iterators/ProductCatalogIterator.js`) expone
`hasNext()`/`next()` sobre una página de resultados ya filtrada/paginada por
`ProductRepository.listarPaginado()`. El controlador arma la respuesta
recorriendo el iterador, sin acceder nunca al arreglo interno.

| Método | Ruta | Protegida |
|--------|------|-----------|
| GET | `/api/productos/catalogo?pagina=1&limite=10&categoria=credito&busqueda=texto` | No |

