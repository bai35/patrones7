// PATRON PROXY (RealSubject): esta clase hace el trabajo de verdad
// (calcular el reporte financiero). NO sabe nada de roles ni permisos;
// esa responsabilidad vive en ReportProxy, no aqui (SRP).
class ReportService {
  constructor(userRepository, productRepository, orderRepository) {
    this.userRepository = userRepository;
    this.productRepository = productRepository;
    this.orderRepository = orderRepository;
  }

  async obtenerReporteCompleto() {
    const [productos, pedidos] = await Promise.all([
      this.productRepository.listar(),
      this.orderRepository.listarTodos()
    ]);

    const totalVentas = pedidos
      .filter((p) => p.estado === 'procesado')
      .reduce((suma, p) => suma + p.total, 0);

    return {
      totalProductos: productos.length,
      totalPedidos: pedidos.length,
      pedidosProcesados: pedidos.filter((p) => p.estado === 'procesado').length,
      pedidosCancelados: pedidos.filter((p) => p.estado === 'cancelado').length,
      totalVentas
    };
  }
}

module.exports = ReportService;
