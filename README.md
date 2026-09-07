# Aforo · Sistema de Gestión de Eventos y Espectáculos

Proyecto Integrador 2026-2 · Bases de Datos y Programación en Ambiente Web I

## Objetivo general

Aplicar los conceptos de Bases de Datos y Programación en Ambiente Web I mediante el análisis, diseño y desarrollo de un sistema web para la gestión de eventos y espectáculos, que permite el registro e inicio de sesión de usuarios, la administración de clientes, agentes y eventos, así como la realización de reservas, implementando una base de datos relacional para facilitar la gestión de la información.

El sistema está inspirado en plataformas como Tuboleta, Taquilla Live, Eventbrite o Ticketmaster.

## Equipo de trabajo

| Integrante | Rol principal en el proyecto |
|---|---|
| Stiven Manzano | Modelado de base de datos, reservas y autenticación de cliente, backlog Jira |
| Nicolás Ceballos | Catálogo y registro de eventos, repositorio GitHub, maquetado frontend |

Las tareas más complejas (análisis UML, modelo entidad-relación, diseño en Figma, revisión final y documentación del corte) se trabajan en conjunto por todo el equipo — ver detalle en `planificacion/jira-backlog.csv`.

## Estado actual — Corte #1

- [x] Prototipo de interfaz navegable (HTML) — `frontend/prototipo/aforo.html`
- [x] Backlog planificado (Épicas, Historias, Tareas, Subtareas) — `planificacion/jira-backlog.csv`
- [x] Prototipos de alta fidelidad en Figma — [ver enlace](https://www.figma.com/design/4r8vN6w9xOFWarOO1prsjp/Sin-t%C3%ADtulo?node-id=2-33) (guía de pantallas en `docs/figma-guia-pantallas.md`)
- [ ] Backend y base de datos (próximo corte)

## Estructura del repositorio

```
proyecto-aforo/
├── docs/                        Documentación funcional y de diseño
│   ├── modelo-datos.md          Reglas de negocio y estructura de datos
│   ├── requerimientos.md        Requerimientos funcionales por perfil
│   └── figma-guia-pantallas.md  Guía de pantallas para el prototipo en Figma
├── frontend/
│   └── prototipo/
│       └── aforo.html           Prototipo navegable (HTML + CSS + JS, datos mock)
├── backend/                     Backend (se implementa en próximos cortes)
├── database/                    Scripts y modelo de base de datos (PostgreSQL)
├── planificacion/
│   └── jira-backlog.csv         Backlog exportado/importable en Jira
└── .github/
    └── ISSUE_TEMPLATE/          Plantillas para issues del repositorio
```

## Tecnologías

- **Frontend:** HTML5, CSS3, Bootstrap, JavaScript, TypeScript
- **Backend:** por definir (próximo corte)
- **Base de datos:** PostgreSQL
- **Gestión ágil:** Jira (Scrum, Sprints, Story Points)
- **Diseño:** Figma
- **Control de versiones:** Git / GitHub

## Cómo ver el prototipo

El prototipo es una página estática, no requiere instalación:

1. Clonar el repositorio: `git clone <url-del-repo>`
2. Abrir `frontend/prototipo/aforo.html` directamente en el navegador.

## Convención de ramas y commits

- **Ramas:** `main` (estable) ← `develop` ← `feature/<módulo>-<breve-descripción>` (ej. `feature/reservas-cliente`)
- **Commits:** formato `tipo: descripción corta` — tipos usados: `feat`, `fix`, `docs`, `style`, `refactor`, `chore` (ej. `feat: agrega vista de catálogo de eventos`)
- Cada Pull Request a `develop`/`main` debe referenciar el ID de la tarjeta en Jira (ej. `AF-6`).

## Planificación (Jira)

El detalle de épicas, historias de usuario, tareas y subtareas del Sprint 1, con responsable, estimación en Story Points, fechas y estado, se encuentra en [`planificacion/jira-backlog.csv`](planificacion/jira-backlog.csv), listo para importar en un proyecto Scrum de Jira.

## Prototipo de diseño (Figma)

Prototipo de interfaces en Figma: [Aforo — Prototipo UI](https://www.figma.com/design/4r8vN6w9xOFWarOO1prsjp/Sin-t%C3%ADtulo?node-id=2-33)

## Licencia

Proyecto académico — Corporación/Institución del curso Bases de Datos y Programación en Ambiente Web I, 2026-2.
