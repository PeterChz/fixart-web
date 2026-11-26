# Fix Art · Sitio web

Web de Fix Art (Tulcán, Ecuador): servicios, galería de trabajos, nuestras apps y contacto.
Publicada gratis con GitHub Pages en **https://peterchz.github.io/fixart-web/**.

## Estructura

```
index.html                  Página principal (servicios, trabajos, apps, consejos, nosotros, contacto)
404.html                    Página de "no encontrada"
apps/bolsillo/              Página de la app Bolsillo
  index.html                Funciones, descarga, eliminar cuenta, soporte
  privacidad.html           GENERADA: no editar a mano (ver abajo)
  terminos.html             GENERADA: no editar a mano
assets/css/estilos.css      Estilos (colores y letras del Manual de marca 2026)
assets/js/sitio.js          Menú del celular y filtros de la galería
assets/marca/               Logos, favicon y mascota (copiados de Escritorio/Pc/Fix Art/01 Marca)
assets/img/trabajos/        Fotos de la galería (optimizadas en .webp)
assets/img/videos/          Portadas de los videos de consejos
```

## Tareas frecuentes

- **Poner el enlace de descarga de Bolsillo:** en `apps/bolsillo/index.html` busca `CAMBIAR`, pon el
  enlace de Google Drive en `href` y quita `aria-disabled="true"`.
- **Actualizar la privacidad o los términos de Bolsillo:** edita `bolsillo/lib/legal/textos_legales.dart`
  y luego, desde la carpeta `bolsillo`, ejecuta `node tool/generar_web_legal.mjs`. Así la app y la web
  siempre dicen lo mismo.
- **Agregar una foto a la galería:** copia la imagen (mejor `.webp`, máximo 900 px) a
  `assets/img/trabajos/` y agrega una línea `<figure>` en la sección `#trabajos` de `index.html`.
- **Agregar otra app:** copia la carpeta `apps/bolsillo` como `apps/<nueva-app>` y añade su tarjeta en
  la sección `#apps` de `index.html`.

## Migrar al dominio propio (fixart.com.ec)

Todos los enlaces internos son relativos, así que la web funciona igual en el dominio nuevo.

1. Compra el dominio y, en su panel de DNS, crea estos registros:
   - `A` para `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` para `www` → `peterchz.github.io`
2. En GitHub: repo `fixart-web` → **Settings → Pages → Custom domain** → `fixart.com.ec` y activa
   **Enforce HTTPS** (GitHub crea el archivo `CNAME`).
3. En `404.html` cambia `/fixart-web/` por `/`.
4. En Google Cloud (proyecto `bolsillo-login` → Google Auth Platform → Información de la marca)
   cambia los enlaces de página principal, privacidad y términos, y agrega `fixart.com.ec` como dominio autorizado.
