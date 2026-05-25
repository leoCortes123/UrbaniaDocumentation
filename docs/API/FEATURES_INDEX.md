# 📋 FEATURES_INDEX
## Catálogo de Módulos del Proyecto Urbania API

> **Consultar**: Si es un módulo nuevo o modificación de módulo existente.
> **Actualizar**: Cada vez que se agrega, completa o modifica un módulo.

---

## Estado de Módulos

| # | Módulo | Prioridad | Estado | Dependencias | Archivo de Spec |
|---|--------|-----------|--------|--------------|-----------------|
| 1 | Auth | P0 | Pendiente | — | `features/auth/auth.md` |
| 2 | Property | P0 | Pendiente | — | `features/property/property.md` |
| 3 | Resident | P0 | Pendiente | Auth, Property | `features/resident/resident.md` |
| 4 | Dashboard | P0 | Pendiente | Auth, Resident | `features/dashboard/dashboard.md` |
| 5 | Common Zone | P1 | Pendiente | Property | `features/common-zone/common-zone.md` |
| 6 | Reservation | P1 | Pendiente | Auth, Resident, Common Zone | `features/reservation/reservation.md` |
| 7 | Payment | P1 | Pendiente | Auth, Resident | `features/payment/payment.md` |
| 8 | PQR | P1 | Pendiente | Auth, Resident | `features/pqr/pqr.md` |
| 9 | Notification | P1 | Pendiente | Auth, Resident | `features/notification/notification.md` |
| 10 | Chat | P2 | Pendiente | Auth, Resident | `features/chat/chat.md` |
| 11 | Ingreso | P2 | Pendiente | Auth, Resident | `features/ingreso/ingreso.md` |

---

## Definición de Prioridades

- **P0**: Bloqueante para MVP. Sin esto no hay API.
- **P1**: Core functionality. Necesario para lanzamiento.
- **P2**: Value-add. Puede esperar a post-lanzamiento.

---

> **⚠️ Ubicación correcta**: Todo spec de módulo debe ir en `/docs/features/[feature]/[feature].md`.
> Ver `DIRECTORY_STRUCTURE.md` para la guía completa de organización.

## Checklist al Agregar/Modificar Módulo

- [ ] Revisar recursos de diseño en `/docs/features/[feature]/recursos/` (si son requeridos)
- [ ] Actualizar tabla de estado en este documento
- [ ] Crear/actualizar endpoints en `/docs/features/[feature]/endpoints.md`
- [ ] Verificar que no excede prioridad sin dependencias resueltas
- [ ] Actualizar API_CONTRACT.md si agrega/modifica endpoints
- [ ] Actualizar DATABASE_SCHEMA.md si agrega/modifica tablas