# Guía de pantallas para Figma — Aforo

Esta guía traduce el prototipo navegable (`frontend/prototipo/aforo.html`) a un plan de pantallas para construir el archivo de Figma del Corte #1. Úsala como checklist de frames dentro de un único archivo de Figma llamado **"Aforo — Prototipo UI"**, organizado en páginas por perfil de usuario.

## Sistema de diseño base (Figma → Styles)

- **Tipografías:** encabezados en serif tipo *Fraunces*; texto general en sans-serif tipo *Work Sans*.
- **Paleta:** violeta primario `#6C4AB6`, violeta oscuro `#4B3182`, ámbar `#F2A93B`, coral `#E85D6B`, teal `#2FA891`, fondo crema `#FBF8FF`, tinta `#241B3A`.
- **Radios:** 14px en tarjetas, 999px (pill) en botones y badges.
- Crea estos como *Color Styles* y *Text Styles* antes de maquetar las pantallas, para reutilizarlos en todos los frames.

## Página 1 — Autenticación (público)

1. **Inicio de sesión** — formulario correo + contraseña, botón "Ingresar".
2. **Registro** — selector "Soy cliente / Soy agente", datos comunes de persona (identificación, nombre, correo, país/departamento/ciudad, dirección, teléfono) + campos específicos (comisión y experiencia para agente; puntos y publicidad para cliente).

## Página 2 — Perfil Cliente

3. **Catálogo de eventos** — grid de tarjetas de evento (imagen/banner, estado, nombre, teatro/ciudad, fecha, aforo, precio) con filtros por ciudad y estado.
4. **Modal de reserva** — selección de número de entradas y resumen de valor total.
5. **Mis reservas** — tabla con evento, fecha, entradas, valor, observaciones y estado (Reservada/Confirmada/Cancelada).

## Página 3 — Perfil Agente

6. **Panel agente — Eventos registrados** — tabla con código, nombre, ciudad, teatro, fecha, capacidad, precio, estado.
7. **Modal "Registrar evento"** — formulario con todos los campos del evento.
8. **Panel agente — Administrar reservas** — tabla de reservas recibidas con selector para cambiar estado.

## Página 4 — Perfil Administrador

9. **Dashboard de reportes** — tarjetas KPI (clientes, agentes, administradores, eventos, reservas) + gráfica de ingresos por mes + gráfica de reservas por evento.

## Página 5 — Planificación del equipo (evidencia del proceso, no del producto)

10. **Tablero de planificación** — vista tipo tabla o kanban con épicas/historias/tareas, responsable, story points y sprint (referencia: `planificacion/jira-backlog.csv`).
11. **Seguimiento Daily Scrum** — tabla de seguimiento diario (se construye en el siguiente corte).

## Flujo de navegación a diagramar (Figma → prototype mode)

`Inicio de sesión → Catálogo de eventos → Modal de reserva → Mis reservas`
`Registro (agente) → Panel agente (Eventos) → Registrar evento → Administrar reservas`

## Recomendación de trabajo

- Si el equipo quiere partir de algo visual en vez de una pantalla en blanco, puede usar un plugin de "HTML/URL to Figma" (por ejemplo *html.to.design*) importando `frontend/prototipo/aforo.html` como punto de partida y luego ajustar tipografías, componentes y estados sobre esa base, en vez de recrear cada pantalla desde cero.
- Crear los estados de cada componente (badge de estado de evento/reserva) como *variantes* de un mismo componente para reutilizarlos en todas las pantallas.
