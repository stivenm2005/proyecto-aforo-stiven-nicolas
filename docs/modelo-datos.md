# Modelo de datos y reglas de negocio

Basado en el enunciado del Proyecto Integrador 2026-2.

## Ubicación geográfica

- **País** — id, nombre. Un país tiene varios departamentos.
- **Departamento** — id, nombre, país (FK). Pertenece a un único país; tiene varias ciudades.
- **Ciudad** — id, nombre, departamento (FK). Pertenece a un único departamento.

## Personas

Entidad base **Persona**, con especialización en Cliente, Agente y Administrador.

- Atributos comunes: número de identificación, nombre completo, correo electrónico, dirección, ciudad (FK), uno o varios teléfonos.
- **Cliente**: puntos acumulados, visualización de publicidad (sí/no). Puede realizar muchas reservas.
- **Agente**: comisión, experiencia. Puede registrar muchos eventos.
- **Administrador**: salario, horario.

## Eventos / Espectáculos

- Código único, nombre, descripción, teatro, ciudad de realización (FK), fecha/hora de inicio, fecha/hora estimada de finalización, capacidad total, precio base, observaciones.
- Estado: `Programado`, `En Boletería`, `En Vivo`, `Finalizado`, `Cancelado`. Siempre debe tener un estado.
- Un evento puede tener múltiples reservas asociadas.

## Reservas

- Identificador único, fecha y hora, valor total, número de entradas, observaciones.
- Estado: `Reservada`, `Confirmada`, `Cancelada`. Siempre debe tener un estado.
- Cada reserva pertenece a un único cliente y a un único evento.

## Relaciones principales

- País (1) — (N) Departamento
- Departamento (1) — (N) Ciudad
- Ciudad (1) — (N) Persona
- Persona (1) — (1) {Cliente | Agente | Administrador}
- Cliente (1) — (N) Reserva
- Evento (1) — (N) Reserva
- Agente (1) — (N) Evento (registrado por)

> El diagrama de clases y el modelo entidad-relación completos se documentan en las tarjetas `AF-2` y `AF-3` del backlog (`planificacion/jira-backlog.csv`).
