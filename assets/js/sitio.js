// Fix Art — comportamiento del sitio (sin librerías externas).
(() => {
  const raiz = document.documentElement;
  const sinAnimar = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Pantalla de carga ----------
  // Solo se ve la primera vez por visita (sessionStorage); al navegar entre páginas no se repite.
  const cargador = document.querySelector('.cargador');
  if (cargador) {
    if (sessionStorage.getItem('fixart-cargado') || sinAnimar) {
      cargador.remove();
    } else {
      const inicio = performance.now();
      const ocultar = () => {
        const espera = Math.max(0, 700 - (performance.now() - inicio));
        setTimeout(() => {
          cargador.classList.add('oculto');
          sessionStorage.setItem('fixart-cargado', '1');
          setTimeout(() => cargador.remove(), 600);
        }, espera);
      };
      if (document.readyState === 'complete') ocultar();
      else addEventListener('load', ocultar, { once: true });
      setTimeout(ocultar, 4000); // por si alguna imagen tarda demasiado
    }
  }

  // ---------- Transición al cambiar de página (navegadores sin View Transitions) ----------
  const tieneTransiciones = 'onpagereveal' in window;
  if (!tieneTransiciones && !sinAnimar) {
    document.body.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], {
      duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)',
    });
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || a.hasAttribute('download')) return;
      e.preventDefault();
      document.body.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-8px)' }], { duration: 220, fill: 'forwards' })
        .finished.then(() => { location.href = url.href; });
    });
    // Al volver con "atrás", la página puede quedar invisible: se restaura.
    addEventListener('pageshow', (e) => { if (e.persisted) document.body.getAnimations().forEach((a) => a.cancel()); });
  }

  // ---------- Cabecera ----------
  const cabecera = document.querySelector('.cabecera');
  const alDesplazar = () => raiz.classList.toggle('desplazado', scrollY > 30);
  alDesplazar();
  addEventListener('scroll', alDesplazar, { passive: true });

  const botonMenu = document.querySelector('.boton-menu');
  if (botonMenu) {
    botonMenu.addEventListener('click', () => {
      const abierto = cabecera.classList.toggle('abierta');
      botonMenu.setAttribute('aria-expanded', abierto);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { cabecera.classList.remove('abierta'); botonMenu.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ---------- Aparición al bajar ----------
  const revelar = document.querySelectorAll('[data-revelar]');
  if ('IntersectionObserver' in window && !sinAnimar) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revelar.forEach((el) => obs.observe(el));
  } else {
    revelar.forEach((el) => el.classList.add('visible'));
  }

  // ---------- Imágenes: quitar el brillo de carga al terminar ----------
  document.querySelectorAll('.marco img').forEach((img) => {
    const listo = () => img.closest('.marco').classList.add('lista');
    if (img.complete && img.naturalWidth) listo();
    else { img.addEventListener('load', listo, { once: true }); img.addEventListener('error', listo, { once: true }); }
  });

  // ---------- Luz que sigue al mouse en las tarjetas ----------
  if (matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tarjeta').forEach((t) => {
      t.addEventListener('pointermove', (e) => {
        const r = t.getBoundingClientRect();
        t.style.setProperty('--mx', `${e.clientX - r.left}px`);
        t.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // ---------- Galería: filtros y visor ----------
  const figuras = [...document.querySelectorAll('.galeria figure')];
  document.querySelectorAll('.filtros button').forEach((b, _, todos) => {
    b.addEventListener('click', () => {
      todos.forEach((x) => x.setAttribute('aria-pressed', x === b));
      figuras.forEach((f) => f.classList.toggle('escondida', b.dataset.cat !== 'todo' && f.dataset.cat !== b.dataset.cat));
    });
  });

  const visor = document.querySelector('.visor');
  if (visor && figuras.length) {
    const img = visor.querySelector('img');
    let actual = 0;
    const visibles = () => figuras.filter((f) => !f.classList.contains('escondida'));
    const mostrar = (i) => {
      const lista = visibles();
      actual = (i + lista.length) % lista.length;
      const fuente = lista[actual].querySelector('img');
      img.src = fuente.src; img.alt = fuente.alt;
    };
    let ultimoFoco = null;
    const abrir = (fig) => { ultimoFoco = document.activeElement; mostrar(visibles().indexOf(fig)); visor.classList.add('abierto'); visor.querySelector('.cerrar').focus(); };
    const cerrar = () => { visor.classList.remove('abierto'); ultimoFoco?.focus(); };
    figuras.forEach((f) => f.querySelector('button').addEventListener('click', () => abrir(f)));
    visor.querySelector('.cerrar').addEventListener('click', cerrar);
    visor.querySelector('.ant').addEventListener('click', () => mostrar(actual - 1));
    visor.querySelector('.sig').addEventListener('click', () => mostrar(actual + 1));
    visor.addEventListener('click', (e) => { if (e.target === visor) cerrar(); });
    document.addEventListener('keydown', (e) => {
      if (!visor.classList.contains('abierto')) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowLeft') mostrar(actual - 1);
      if (e.key === 'ArrowRight') mostrar(actual + 1);
    });
  }

  // ---------- Copiar la huella del APK ----------
  document.querySelectorAll('[data-copiar]').forEach((b) => {
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(document.querySelector(b.dataset.copiar).textContent.trim());
        const antes = b.textContent; b.textContent = '¡Copiado!'; setTimeout(() => { b.textContent = antes; }, 1600);
      } catch { /* sin permiso de portapapeles */ }
    });
  });

  document.querySelectorAll('[data-anio]').forEach((e) => { e.textContent = new Date().getFullYear(); });
})();
