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
| Stiven Manzano | Modelado de base de datos, reservas y autenticación de cliente, backlog Jira |
| Nicolás Ceballos | Catálogo y registro de eventos, repositorio GitHub, maquetado frontend |

Tareas de mayor complejidad (análisis UML, modelo entidad-relación, diseño en Figma, revisión final y documentación del corte) se asignan a "Equipo completo" y se trabajan en conjunto.
