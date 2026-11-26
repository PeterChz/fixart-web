// Menú del celular
const cabecera = document.querySelector('.cabecera');
const botonMenu = document.querySelector('.boton-menu');
if (botonMenu) {
  botonMenu.addEventListener('click', () => {
    const abierto = cabecera.classList.toggle('abierta');
    botonMenu.setAttribute('aria-expanded', abierto);
  });
  cabecera.querySelectorAll('.menu a').forEach((a) =>
    a.addEventListener('click', () => { cabecera.classList.remove('abierta'); botonMenu.setAttribute('aria-expanded', 'false'); })
  );
}

// Filtros de la galería
const filtros = document.querySelectorAll('.filtros button');
filtros.forEach((b) =>
  b.addEventListener('click', () => {
    filtros.forEach((x) => x.setAttribute('aria-pressed', x === b));
    const cat = b.dataset.cat;
    document.querySelectorAll('.galeria figure').forEach((f) => { f.hidden = cat !== 'todo' && f.dataset.cat !== cat; });
  })
);

// Año del pie de página
document.querySelectorAll('[data-anio]').forEach((e) => { e.textContent = new Date().getFullYear(); });
