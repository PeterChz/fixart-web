# Fix Art · Sitio web

Web de Fix Art (Tulcán, Ecuador), publicada con GitHub Pages en **https://peterchz.github.io/fixart-web/**.

## Cómo se edita

Las páginas **no se editan directamente**: se escriben en `src/paginas/` y se generan con:

```
node tools/construir.mjs
```

El generador pone a todas la misma cabecera de cristal, pie, pantalla de carga, íconos y
metadatos, y escribe el resultado en la raíz (lo que publica GitHub Pages).

| Carpeta / archivo | Qué es |
|---|---|
| `src/paginas/*.html` | Contenido de cada página. La 1.ª línea es un comentario JSON con ruta, título y descripción. |
| `tools/construir.mjs` | Generador. Aquí están el menú, los íconos, los datos de contacto y **los datos del APK de Bolsillo**. |
| `assets/css/estilos.css` | Estilos (colores y letras del Manual de marca 2026, efectos de cristal y animaciones). |
| `assets/js/sitio.js` | Pantalla de carga, transiciones, aparición al bajar, galería y visor. |
| `assets/marca/`, `assets/img/` | Logos, mascota, fotos de trabajos y portadas de videos. |
| `legal/` | Aviso legal y privacidad del sitio. |
| `apps/bolsillo/` | Página de Bolsillo, descarga, eliminar cuenta, privacidad y términos. |

En las páginas se puede usar `{{r}}` (ruta a la raíz), `{{i:nombre}}` (ícono), `{{apk:campo}}` y `{{c:campo}}` (contacto).

## Tareas frecuentes

- **Nueva versión de Bolsillo:** sube el APK a Drive (compartido con "cualquier persona con el enlace"),
  actualiza el objeto `APK` en `tools/construir.mjs` (versión, fecha, peso, SHA-256 y enlace) y vuelve a generar.
  La huella se calcula con: `Get-FileHash Bolsillo-X.Y.Z.apk -Algorithm SHA256`.
- **Cambiar la privacidad o los términos de Bolsillo:** edita `bolsillo/lib/legal/textos_legales.dart` y genera
  la web (o desde `bolsillo`: `node tool/generar_web_legal.mjs`). Así la app y la web dicen siempre lo mismo.
- **Agregar una foto a la galería:** copia la imagen a `assets/img/trabajos/` (mejor `.webp`, máx. 900 px; sin
  rostros ni placas) y agrega su `<figure>` en `src/paginas/trabajos.html`.

## Migrar al dominio propio (fixart.com.ec)

1. En el DNS del dominio: registros `A` para `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`, y `CNAME` para `www` → `peterchz.github.io`.
2. GitHub → repo `fixart-web` → **Settings → Pages → Custom domain** → `fixart.com.ec` y **Enforce HTTPS**.
3. En `tools/construir.mjs` cambia `SITIO` por `https://fixart.com.ec/`, en `404.html` cambia `/fixart-web/` por `/`, y genera.
4. En Google Cloud (proyecto `bolsillo-login` → Google Auth Platform → Información de la marca) actualiza los
   enlaces de inicio, privacidad y términos, y agrega `fixart.com.ec` como dominio autorizado.
