# El Taller Web

Next.js, React, TypeScript y Tailwind CSS. Home editorial bilingüe, catálogo de propuestas y formulario de colaboración en `/colabora`.

## Desarrollo

Node.js 22+ y pnpm. Ejecutar `pnpm install`, copiar `.env.example` a `.env.local` y ejecutar `pnpm dev`. Si el entorno no permite procesos de Turbopack, usar `pnpm exec next dev --webpack`. Verificar con `pnpm typecheck`, `pnpm test` y `pnpm build`.

## Contenido

- `locales/site.ts`: home ES/EN.
- `locales/form.ts`: botones, validación y mensajes del formulario.
- `lib/form.ts`: preguntas, opciones normalizadas y lógica condicional.
- `data/experiences.ts`: experiencias y colaboraciones. Los ejemplos son propuestas, no eventos confirmados. Para publicar uno, completar fecha, hora, duración, edad, cupos, precio y tallerista, cambiar `status` a `scheduled` y añadir una fotografía autorizada.
- `components/ExperienceCard.tsx`: tarjetas reutilizables de experiencia y colaboración.
- La galería se mantiene sin fotos de eventos hasta contar con imágenes reales autorizadas. Las únicas imágenes del proyecto son el logo original y la visualización suministrada por la propietaria, identificada como tal.

## Contacto y formulario

Los enlaces al formulario dependen de `NEXT_PUBLIC_COLLABORATOR_FORM_URL`, por defecto `/colabora`. WhatsApp, Instagram, email y ubicación se configuran una sola vez en las variables públicas. No introducir secretos en variables `NEXT_PUBLIC_`.

El formulario tiene seis pasos, cambio de idioma sin perder las respuestas, campos condicionales, validación cliente/servidor y envío real solo cuando el servidor confirma el guardado. Los campos ocultos no se envían. No se guarda información personal en el almacenamiento del navegador.

## Google Sheets

1. Crear una hoja con pestaña `Propuestas`.
2. Activar Google Sheets API en un proyecto de Google Cloud y crear una cuenta de servicio.
3. Compartir únicamente la hoja de respuestas con el correo de la cuenta de servicio como editor.
4. Configurar `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY` como secretos del servidor en Vercel. No subir el JSON de credenciales a Git ni pegarlo en el navegador.
5. Enviar una propuesta de prueba y verificar su fila antes de anunciar el formulario.

El backend crea las cabeceras si la pestaña está vacía. Guarda los valores estables (ej. `art_creativity`), selecciones múltiples separadas por `|`, idioma, fecha e identificador. Usa `RAW` para evitar interpretar texto como fórmulas. La API no expone respuestas existentes. Detecta reintentos con el mismo identificador; Sheets no ofrece una transacción de lectura y escritura, por lo que dos peticiones simultáneas idénticas podrían duplicarse. Antes de difusión masiva, configurar controles de abuso en Vercel Firewall según el tráfico.

Documentación: https://developers.google.com/workspace/sheets/api/guides/values y https://developers.google.com/identity/protocols/oauth2/service-account

Sin credenciales configuradas devuelve 503 y muestra un aviso honesto: no simula envíos ni descarta respuestas.

## GitHub y Vercel

Repositorio previsto: `el-taller-web`. Crear remoto privado en la cuenta elegida, añadirlo como `origin` y subir `main`. En Vercel, importar ese repositorio, seleccionar Next.js y configurar las variables de `.env.example`. Establecer `NEXT_PUBLIC_SITE_URL` con la URL definitiva. Cada push a `main` despliega producción tras conectar el proyecto. El repositorio local no implica que el remoto o el despliegue ya existan.

## SEO y revisión

Metadata, Open Graph, imagen social derivada de la referencia suministrada, favicon, robots y sitemap configurados. El sitemap usa exclusivamente la URL definitiva, sin dominios inventados. Imágenes WebP locales con `next/image`. Home revisada en 1440px y 390px. No se afirma una puntuación Lighthouse sin medirla.

## GitHub Pages
Repository: DayanaGonz/eltaller. Workflow pages.yml builds with scripts/build-pages.mjs and publishes the static export. Enable Settings → Pages → GitHub Actions if initial automatic enablement fails. Expected URL after successful deployment: https://dayanagonz.github.io/eltaller/. The static publication explicitly shows that form submissions are not enabled; WhatsApp remains available. The server API is preserved in source but excluded from the static export.
