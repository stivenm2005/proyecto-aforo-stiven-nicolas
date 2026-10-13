# EVENTA

Sitio estático para descubrir eventos, guardar favoritos y administrar reservas. El proyecto no necesita instalar dependencias.

## Preparar el sitio

Instala las dependencias de compilación una vez y genera las versiones minificadas que carga la página:

```powershell
py -m pip install -r requirements.txt
py build.py
```

Vuelve a ejecutar `py build.py` después de editar `styles.css` o `script.js`. La compilación actualiza las referencias con una huella del contenido para que Chrome no reutilice CSS o JavaScript antiguos desde su caché.

## Ejecutar y evaluar localmente

Inicia el servidor preparado para Lighthouse. Sirve los archivos solo en tu computadora, comprime HTML/CSS/JavaScript y aplica una política de caché a los recursos estáticos:

```powershell
py lighthouse_server.py
```

Abre `http://127.0.0.1:8766/` en Chrome y espera a que cargue Inicio. Si el puerto está ocupado, ejecuta `$env:PORT=8767; py lighthouse_server.py` y visita `http://127.0.0.1:8767/`.

1. Abre DevTools con `F12`.
2. Elige **Lighthouse** en la barra de pestañas; si no aparece, búscala en el menú `»`.
3. Selecciona **Mobile** o **Desktop** y las categorías **Performance**, **Accessibility**, **Best Practices** y **SEO**.
4. Pulsa **Analyze page load**.

Mantén abierta la ventana de PowerShell del servidor mientras pruebas el sitio.

## Privacidad y publicación

El servidor escucha exclusivamente en `127.0.0.1`: otras personas no pueden abrir esta dirección desde sus dispositivos. En este repositorio público, el código fuente y las imágenes de EVENTA son visibles para cualquiera. La carpeta contiene solo archivos estáticos y recursos usados por la página; no contiene datos del navegador ni credenciales. El servidor local no despliega el sitio en Internet.
