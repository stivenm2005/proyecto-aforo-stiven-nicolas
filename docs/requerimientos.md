# Requerimientos funcionales por perfil

## Autenticación y registro

- Inicio de sesión con correo electrónico y contraseña.
- Registro de nuevos usuarios como cliente o agente, con los campos propios de cada perfil.

## Cliente

- Visualizar todos los eventos disponibles (con filtros por ciudad y estado).
- Realizar reservas a los eventos.
- Visualizar todas sus reservas con el estado actual.

## Agente

- Registrar eventos.
- Visualizar todos los eventos registrados.
- Administrar reservas: visualizar todas las reservas solicitadas y actualizar su estado.

## Administrador

- Visualizar reportes del sistema mediante gráficas o tablas:
  - Reporte general de registros (clientes, agentes, administradores, reservas, eventos).
  - Reportes comerciales (ingresos promedio por agente/cliente, ingresos totales por mes, reservas por evento y mes, eventos por agente y ciudad).
  - Reportes de cobertura (eventos por país/departamento/ciudad).
  - Reportes de operación (historial de reservas por cliente, reservas y eventos cancelados con su causa).

## Gestión de datos (CRUD transversal)

Registrar, modificar, eliminar y consultar: personas, clientes, agentes, administradores, eventos, reservas, países, departamentos y ciudades.

## Estado de avance en el prototipo (`frontend/prototipo/aforo.html`)

| Requerimiento | Estado en el prototipo |
|---|---|
| Login / Registro (cliente y agente) | Maquetado, con datos simulados |
| Catálogo de eventos + filtros | Maquetado, funcional en el prototipo |
| Reserva de entradas | Maquetado, funcional en el prototipo |
| Mis reservas (cliente) | Maquetado |
| Registrar evento (agente) | Maquetado, funcional en el prototipo |
| Administrar reservas (agente) | Maquetado, funcional en el prototipo |
| Dashboard de reportes (admin) | Maquetado con gráficas de ejemplo |
| CRUD completo contra base de datos | Pendiente — próximo corte (requiere backend) |
