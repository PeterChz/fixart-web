// Construye el sitio de Fix Art.
//
//   node tools/construir.mjs
//
// - Cada página está en src/paginas/*.html. La primera línea es un comentario con sus datos:
//     <!--{"ruta":"servicios.html","titulo":"…","descripcion":"…","menu":"servicios"}-->
//   y el resto es el contenido. Dentro se puede usar:
//     {{r}}            → prefijo para llegar a la raíz del sitio (funciona en subcarpetas)
//     {{i:nombre}}     → ícono SVG (ver ICONOS)
//     {{apk:campo}}    → datos de la descarga de Bolsillo (ver APK)
// - Las páginas legales de Bolsillo se generan desde ../bolsillo/lib/legal/textos_legales.dart,
//   así la app y la web dicen SIEMPRE lo mismo.
// - El resultado se escribe en la raíz del repositorio (lo que publica GitHub Pages).
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = 'https://peterchz.github.io/fixart-web/'; // cambiar a https://fixart.com.ec/ al migrar
const CONTACTO = { correo: 'fixart3dprint@gmail.com', whatsapp: '593988344178', whatsappVisible: '098 834 4178', tiktok: 'fix_art1' };

// ---- Descarga de Bolsillo (actualizar en cada versión nueva) ----
const APK = {
  version: '1.2.0',
  fecha: '25 de noviembre de 2026',
  peso: '54,8 MB',
  android: 'Android 7.0 o superior',
  sha256: '8BD97E3C90EE3DBB22122757560D1B24CAB17AC91F74D7FAD7AD125B6F694D30',
  enlace: 'https://drive.google.com/uc?export=download&id=1spAG7s9KLt6Sks6JbaUZKK7nmBgPOWQw',
  enlaceDrive: 'https://drive.google.com/file/d/1spAG7s9KLt6Sks6JbaUZKK7nmBgPOWQw/view',
};

// ---- Íconos (trazos estilo Lucide, licencia ISC) ----
const svg = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const ICONOS = {
  cubo: svg('<path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"/><path d="m3 7 9 5 9-5M12 12v10"/>'),
  web: svg('<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M8 21h8"/>'),
  movil: svg('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>'),
  crecer: svg('<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
  llave: svg('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5Z"/>'),
  paleta: svg('<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A5.6 5.6 0 0 0 22 10c0-4.4-4.5-8-10-8Z"/>'),
  descargar: svg('<path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14"/>', ' stroke-width="2.2"'),
  escudo: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>'),
  alerta: svg('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>'),
  correo: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  mapa: svg('<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>'),
  reloj: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  basura: svg('<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>'),
  candado: svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  mas: svg('<path d="M12 5v14M5 12h14"/>'),
  tarjetas: svg('<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/>'),
  pastel: svg('<path d="M21 12a9 9 0 1 1-9-9v9h9Z"/>'),
  meta: svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
  repetir: svg('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>'),
  grafico: svg('<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>'),
  nube: svg('<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4.5 12 3.5 3.5 0 0 0 6 19h11.5Z"/>'),
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4Z"/></svg>',
  tiktok:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 2h-3.3v13.3a2.8 2.8 0 1 1-2-2.7V9.2a6.1 6.1 0 1 0 5.3 6V8.6a7.4 7.4 0 0 0 4.4 1.4V6.7a4.4 4.4 0 0 1-4.4-4.7Z"/></svg>',
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
};

// ---- Menú principal ----
const MENU = [
  ['inicio', 'index.html', 'Inicio'],
  ['servicios', 'servicios.html', 'Servicios'],
  ['trabajos', 'trabajos.html', 'Trabajos'],
  ['apps', 'apps.html', 'Apps'],
  ['consejos', 'consejos.html', 'Consejos'],
  ['nosotros', 'nosotros.html', 'Nosotros'],
];

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function plantilla(p, contenido) {
  const nivel = p.ruta.split('/').length - 1;
  const r = '../'.repeat(nivel);
  const enlace = (id, href, texto) =>
    `<a href="${r}${href}"${p.menu === id ? ' aria-current="page"' : ''}>${texto}</a>`;
  const cuerpo = contenido
    .replaceAll('{{r}}', r)
    .replace(/\{\{i:(\w+)\}\}/g, (_, n) => ICONOS[n] ?? (() => { throw new Error(`Ícono desconocido: ${n} (${p.ruta})`); })())
    .replace(/\{\{apk:(\w+)\}\}/g, (_, c) => APK[c] ?? (() => { throw new Error(`Dato APK desconocido: ${c}`); })())
    .replace(/\{\{c:(\w+)\}\}/g, (_, c) => CONTACTO[c]);
  const url = SITIO + p.ruta.replace(/index\.html$/, '');
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.titulo)}</title>
<meta name="description" content="${esc(p.descripcion)}">
<meta name="theme-color" content="#14213d">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(p.titulo)}">
<meta property="og:description" content="${esc(p.descripcion)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITIO}${p.imagen ?? 'assets/marca/favicon-512.png'}">
<meta property="og:locale" content="es_EC">
<link rel="icon" href="${r}${p.favicon ?? 'assets/marca/favicon.svg'}">
<link rel="apple-touch-icon" href="${r}assets/marca/favicon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Poppins:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${r}assets/css/estilos.css">
<script>document.documentElement.classList.add('js');if(sessionStorage.getItem('fixart-cargado'))document.documentElement.classList.add('sin-cargador');</script>
</head>
<body class="${p.clase ?? ''}">
<!-- Archivo GENERADO con tools/construir.mjs desde src/paginas. No editar a mano. -->
<div class="cargador" aria-hidden="true"><div><img class="robot" src="${r}assets/marca/robot-oscuro.svg" alt="" width="120" height="120"><div class="barra"></div><p>Cargando…</p></div></div>
<a class="saltar" href="#contenido">Saltar al contenido</a>
<header class="cabecera">
  <div class="barra-sup">
    <a class="logo" href="${r}index.html" aria-label="Fix Art, inicio"><img src="${r}assets/marca/logo-horizontal-color.svg" alt="Fix Art" width="150" height="34"></a>
    <button class="boton-menu" aria-label="Abrir menú" aria-expanded="false">${ICONOS.menu}</button>
    <nav class="menu" aria-label="Principal">
      ${MENU.map(([id, href, t]) => enlace(id, href, t)).join('\n      ')}
      <a class="boton boton-naranja" href="${r}contacto.html"${p.menu === 'contacto' ? ' aria-current="page"' : ''}>Escríbenos</a>
    </nav>
  </div>
</header>
<main id="contenido">
${cuerpo.trim()}
</main>
<footer class="pie">
  <div class="manchas"><i></i><i></i></div>
  <div class="contenedor">
    <div>
      <img src="${r}assets/marca/logo-horizontal-oscuro.svg" alt="Fix Art" width="190" height="42">
      <p>Tecnología hecha a la medida en Tulcán, Carchi, Ecuador. Impresión 3D, páginas web, aplicaciones, posicionamiento de marca y soporte técnico.</p>
    </div>
    <div>
      <h4>Fix Art</h4>
      <ul><li><a href="${r}servicios.html">Servicios</a></li><li><a href="${r}trabajos.html">Trabajos</a></li><li><a href="${r}consejos.html">Consejos</a></li><li><a href="${r}nosotros.html">Nosotros</a></li><li><a href="${r}contacto.html">Contacto</a></li></ul>
    </div>
    <div>
      <h4>Apps</h4>
      <ul><li><a href="${r}apps/bolsillo/index.html">Bolsillo</a></li><li><a href="${r}apps/bolsillo/descargar.html">Descargar Bolsillo</a></li><li><a href="${r}apps/bolsillo/privacidad.html">Privacidad de Bolsillo</a></li><li><a href="${r}apps/bolsillo/terminos.html">Términos de Bolsillo</a></li><li><a href="${r}apps/bolsillo/eliminar-cuenta.html">Eliminar cuenta</a></li></ul>
    </div>
    <div>
      <h4>Contacto</h4>
      <ul><li><a href="https://wa.me/${CONTACTO.whatsapp}" target="_blank" rel="noopener">WhatsApp ${CONTACTO.whatsappVisible}</a></li><li><a href="https://www.tiktok.com/@${CONTACTO.tiktok}" target="_blank" rel="noopener">TikTok @${CONTACTO.tiktok}</a></li><li><a href="mailto:${CONTACTO.correo}">${CONTACTO.correo}</a></li><li>Tulcán · Carchi · Ecuador</li></ul>
    </div>
    <div class="legal">
      <span>© <span data-anio>2026</span> Fix Art. Todos los derechos reservados.</span>
      <span><a href="${r}legal/aviso-legal.html">Aviso legal</a> · <a href="${r}legal/privacidad.html">Privacidad del sitio</a> · Este sitio no usa cookies.</span>
    </div>
  </div>
</footer>
<script src="${r}assets/js/sitio.js" defer></script>
</body>
</html>
`;
}

// ---- Páginas escritas a mano ----
const paginas = [];
const carpeta = join(RAIZ, 'src', 'paginas');
for (const archivo of readdirSync(carpeta).filter((f) => f.endsWith('.html')).sort()) {
  const texto = readFileSync(join(carpeta, archivo), 'utf8');
  const m = texto.match(/^<!--(\{[\s\S]*?\})-->\s*/);
  if (!m) throw new Error(`Falta la cabecera de datos en ${archivo}`);
  const datos = JSON.parse(m[1]);
  for (const k of ['titulo', 'descripcion']) datos[k] = datos[k].replace(/\{\{apk:(\w+)\}\}/g, (_, c) => APK[c]);
  paginas.push({ datos, contenido: texto.slice(m[0].length) });
}

// ---- Páginas legales de Bolsillo (desde la app) ----
const dartRuta = join(RAIZ, '..', 'bolsillo', 'lib', 'legal', 'textos_legales.dart');
if (existsSync(dartRuta)) {
  const dart = readFileSync(dartRuta, 'utf8');
  const constante = (n) => dart.match(new RegExp(`const\\s+\\w+\\s+${n}\\s*=\\s*'([^']*)'`))[1];
  const correo = constante('kContactoLegal');
  const fecha = constante('kFechaLegal');
  const version = dart.match(/kVersionLegal\s*=\s*(\d+)/)[1];
  const literales = (trozo) => {
    const out = [];
    const re = /'((?:\\.|[^'\\])*)'/g;
    let x;
    while ((x = re.exec(trozo))) out.push(x[1].replace(/\\'/g, "'").replaceAll('$kContactoLegal', correo));
    return out;
  };
  const secciones = (nombre) => {
    const ini = dart.indexOf(`const List<SeccionLegal> ${nombre}`);
    const fin = dart.indexOf('\n];', ini);
    return dart
      .slice(ini, fin)
      .split('SeccionLegal(')
      .slice(1)
      .map((s) => {
        const [titulo] = literales(s.slice(0, s.indexOf(',')));
        const cuerpo = s.slice(s.indexOf('[') + 1, s.lastIndexOf(']'));
        const parrafos = cuerpo.split(/',\s*\n/).map((p) => literales(p.endsWith("'") ? p : `${p}'`).join('')).filter(Boolean);
        return { titulo, parrafos };
      });
  };
  const enlazar = (t) => esc(t).replaceAll(esc(correo), `<a href="mailto:${correo}">${correo}</a>`);
  const parrafo = (p) => {
    if (!p.includes(' • ')) return `<p>${enlazar(p)}</p>`;
    const [a, ...items] = p.split(' • ');
    return `<p>${enlazar(a.trim())}</p><ul>${items.map((i) => `<li>${enlazar(i.trim())}</li>`).join('')}</ul>`;
  };
  const legal = (ruta, titulo, lista, intro) => ({
    datos: {
      ruta,
      titulo: `${titulo} · Bolsillo · Fix Art`,
      descripcion: `${titulo} de Bolsillo, la app de finanzas personales de Fix Art.`,
      menu: 'apps',
      favicon: 'apps/bolsillo/img/icono.png',
    },
    contenido: `
<section class="encabezado-pagina puntos">
  <div class="manchas"><i></i><i></i><i></i></div>
  <div class="contenedor">
    <p class="migas"><a href="{{r}}index.html">Fix Art</a> › <a href="{{r}}apps.html">Apps</a> › <a href="{{r}}apps/bolsillo/index.html">Bolsillo</a> › ${titulo}</p>
    <h1>${titulo}</h1>
    <p class="lead">${intro}<br>Versión ${version} · Última actualización: ${fecha}.</p>
  </div>
</section>
<section class="seccion seccion-blanca">
  <div class="contenedor legal-rejilla">
    <aside class="legal-indice"><h4>Contenido</h4><ol>${lista.map((s, i) => `<li><a href="#s${i + 1}">${esc(s.titulo.replace(/^\d+\.\s*/, ''))}</a></li>`).join('')}</ol></aside>
    <div class="legal-texto">
${lista.map((s, i) => `<h2 id="s${i + 1}">${esc(s.titulo)}</h2>\n${s.parrafos.map(parrafo).join('\n')}`).join('\n')}
      <p style="margin-top:40px" class="texto-2">Este texto es el mismo que aceptas dentro de la app. ¿Dudas? Escríbenos a <a href="mailto:${correo}">${correo}</a>.</p>
    </div>
  </div>
</section>`,
  });
  paginas.push(
    legal('apps/bolsillo/privacidad.html', 'Política de Privacidad', secciones('kPoliticaPrivacidad'),
      'Qué datos usa Bolsillo, para qué, dónde se guardan y cómo ejercer tus derechos según la LOPDP de Ecuador.'),
    legal('apps/bolsillo/terminos.html', 'Términos y Condiciones', secciones('kTerminos'),
      'Las reglas de uso de Bolsillo, conforme a la ley ecuatoriana de comercio electrónico y de defensa del consumidor.'),
  );
} else {
  console.warn('AVISO: no se encontró la app Bolsillo; se mantienen las páginas legales existentes.');
}

// ---- Escribir ----
for (const { datos, contenido } of paginas) {
  const destino = join(RAIZ, datos.ruta);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, plantilla(datos, contenido));
}
console.log(`Listo: ${paginas.length} páginas generadas.`);
