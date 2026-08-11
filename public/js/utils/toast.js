// Pure Fabrication: no representa un concepto del negocio, solo existe para
// que cualquier componente pueda mostrar un aviso flotante sin duplicar HTML/CSS.
export function mostrarToast(mensaje, tipo = 'exito', duracionMs = 3200) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  const icono = tipo === 'exito' ? 'ti-circle-check' : tipo === 'error' ? 'ti-alert-circle' : 'ti-info-circle';
  toast.innerHTML = `<i class="ti ${icono}"></i><span>${mensaje}</span>`;

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-visible'));

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => toast.remove(), 250);
  }, duracionMs);
}
