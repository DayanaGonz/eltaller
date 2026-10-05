# Activar recepción de respuestas de El Taller

1. Abre https://script.google.com/home/start y crea un proyecto llamado `El Taller - Respuestas`.
2. En `Código.gs`, sustituye el contenido por TODO el archivo `Code.gs` de esta carpeta y guarda.
3. Selecciona la función `setup` arriba y pulsa Ejecutar. Autoriza el acceso solicitado a tus hojas de cálculo. Crea una hoja privada llamada `El Taller - Respuestas de colaboradores`. Su enlace aparece en el Registro de ejecución. No compartas públicamente esa hoja.
4. Pulsa Implementar → Nueva implementación → engranaje → Aplicación web.
5. Selecciona Ejecutar como: Yo; Quién tiene acceso: Cualquier usuario (incluidos quienes no hayan iniciado sesión). Implementa. Si tu cuenta no permite acceso anónimo, detente: hará falta otra opción de alojamiento.
6. Comparte con Codex la URL de la aplicación web que termina en `/exec` y el enlace de la hoja. No compartas contraseñas ni tokens.

## Qué hace el código

Recibe solo nuevas propuestas, valida todos los campos y el consentimiento, guarda respuestas en la hoja del propietario y confirma el ID del envío. No ofrece ninguna ruta para leer respuestas. `doGet` muestra únicamente el nombre del servicio y si está configurado. Los datos no se guardan en GitHub.

El endpoint es público porque el formulario acepta colaboradores sin cuenta; la hoja permanece privada. Tiene un campo trampa para bots y un límite global de 30 guardados/minuto, sin prometer protección completa contra spam. Google impone además sus cuotas.

La hoja incluye identificadores y preguntas en español; las selecciones se guardan normalizadas, independientemente del idioma. Un bloqueo evita duplicados concurrentes. Los textos se guardan como texto, no fórmulas. No se escriben respuestas en logs. `setup` se puede volver a ejecutar y reutiliza la misma hoja; no cambia permisos de Drive.

## Conexión y comprobación pendientes

Una vez desplegado, poner la URL en `data/form-connection.json`, reconstruir y publicar. El build habilita el formulario únicamente con una URL Apps Script válida. Realizar envío de prueba desde un navegador contra el endpoint publicado, verificar la confirmación y la fila privada. Comprobar también móvil, español/inglés y un reintento. No usar `no-cors`: una respuesta opaca NO confirma el guardado. Si Google bloquea CORS en la implementación real, mantener deshabilitado el formulario y adaptar el transporte antes de anunciarlo funcional.

Al modificar preguntas, ejecutar `node scripts/build-apps-script.cjs`, actualizar el código de Google e implementar una nueva versión. Si los encabezados de la hoja no coinciden, el receptor se detiene para evitar mezclar columnas; migrar la hoja antes de activar un nuevo esquema.

Referencias: https://developers.google.com/apps-script/guides/web y https://developers.google.com/apps-script/guides/content
