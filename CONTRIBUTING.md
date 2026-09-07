# Guía de contribución — Equipo Aforo

## Flujo de trabajo

1. Tomar una tarjeta del backlog (`planificacion/jira-backlog.csv` / tablero Jira).
2. Crear una rama desde `develop`: `feature/<módulo>-<breve-descripción>`.
3. Hacer commits pequeños y descriptivos: `tipo: descripción corta` (`feat`, `fix`, `docs`, `style`, `refactor`, `chore`).
4. Abrir Pull Request hacia `develop`, referenciando el ID de Jira (ej. `Closes AF-6`).
5. Solicitar revisión de al menos un integrante antes de mergear.
6. Actualizar el estado de la tarjeta en Jira al mover el PR.

## Convenciones

- Nombres de ramas y commits en minúscula, sin tildes.
- Un PR = una tarjeta del backlog (evitar PRs que mezclen varias historias).
- El README debe mantenerse actualizado con el estado real de avance en cada corte.

## Roles del equipo

| Integrante | Frente principal |
|---|---|
| Julián Torres | Repositorio, Git/GitHub, configuración de Jira |
| Valentina Gómez | Modelado UML, base de datos |
| Samuel Ortiz | Frontend — módulo cliente |
| Camila Ríos | Frontend — módulo agente / maquetado |
