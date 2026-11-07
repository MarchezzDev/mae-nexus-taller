# Taller de la web · enlaces (7 nov 2026, 21:50)

## Para las clientas
- Taller: https://marchezzdev.github.io/mae-nexus-taller/
- Reabrir lo guardado: el mismo enlace con `?code=MAE-XXXX`, o el botón "Tengo un código".
- Al pulsar "Enviar" se abre WhatsApp con el código y el enlace; ellas eligen el grupo (no hay número fijado: `GRUPO_WA` vacío en `index.html`).

Mensaje para el grupo (opcional, si se manda el taller en vez del Form):

> Os paso el taller de la web: https://marchezzdev.github.io/mae-nexus-taller/
> Elegís el ambiente, los colores y las letras, escribís vuestros textos y lo veis al momento en una web de muestra. Al final, "Enviar" nos lo manda por aquí con un código. Se guarda solo, podéis parar y seguir otro día. Cada una la suya.

## Dónde llega lo que guardan (Drive de Marc)
- Hoja de respuestas "MAE Nexus · Taller (respuestas)": https://docs.google.com/spreadsheets/d/15zK5fG5VjQIdBh8UuS_ikNuZ0xEvFCTxHN1qTCfVYR8/edit
  (una fila por código, con tema, colores, letras, eslogan y todo el estado en JSON; se sobrescribe al volver a guardar con el mismo código)
- Carpeta "MAE Nexus · Taller" con una subcarpeta por código para el logo y las fotos: https://drive.google.com/drive/folders/1pba7fyuN3GJpiVDhr4qzk-YuVvgZamZd
- Filas de prueba que se pueden borrar: MAE-QF63, MAE-T48H, MAE-6JAX (y la carpeta MAE-6JAX).

## Técnico
- Código: repositorio público https://github.com/MarchezzDev/mae-nexus-taller (GitHub Pages, rama `main`). Cambiar `index.html`, commit y push: Pages tarda medio minuto.
- Servicio de guardado: proyecto Apps Script "MAE Nexus · Taller (guardado)" en la cuenta de Marc, https://script.google.com/home/projects/1AqxGp43ahw77-mnNchR95XCe_Ceids-vKG8VSG567IURteMO2LhuhyfG/edit (copia del código en `backend/Code.gs`).
- URL del servicio (constante `BACKEND` de `index.html`, implementación v2, ejecutar como Marc, acceso cualquier usuario): https://script.google.com/macros/s/AKfycbymMU41HLqZ5ThsXwZHv8h5f4r5UzWZ86yH-KRX1s81Z3ACgmNJ07-hi8A5N-DZAYG1Pg/exec
- Si se toca `Code.gs`: pegarlo en el editor, guardar, y en Implementar → Gestionar implementaciones → lápiz → Versión nueva → Implementar (la URL no cambia).
- El parámetro de la URL es `code` y no `c`: Google devuelve 400 a los valores largos de `c`.
- Guardar con logo y foto grandes (unos 2,5 MB) tarda 20-40 s; la página muestra "Guardando…" mientras tanto.
