# 📋 FEATURES_INDEX
## Catálogo de Features del Proyecto Portal Web Urbania

> **Consultar**: Si es un feature nuevo o modificación de feature existente.
> **Actualizar**: Cada vez que se agrega, completa o modifica un feature.

---

## Estado de Features

| # | Feature | Prioridad | Estado | Dependencias | Archivo de Spec |
|---|---------|-----------|--------|--------------|-----------------|
| 1 | Autenticación | P0 | Completado | — | `features/auth/auth.md` |
| 2 | Home | P0 | En desarrollo | Auth | `features/home/home.md` |

---

## Definición de Prioridades

- **P0**: Bloqueante para MVP. Sin esto no hay app.
- **P1**: Core functionality. Necesario para lanzamiento.
- **P2**: Value-add. Puede esperar a post-lanzamiento.

---


> **⚠️ Ubicación correcta**: Todo spec de feature debe ir en `/docs/features/[feature]/[feature].md`.
> Ver `DIRECTORY_STRUCTURE.md` para la guía completa de organización.

## Checklist al Agregar/Modificar Feature

- [ ] Revisar recursos de diseño en `/docs/features/[feature]/recursos/` (si son requeridos)
- [ ] Actualizar tabla de estado en este documento
- [ ] Crear/actualizar endpoints en `/docs/features/[feature]/endpoints.md`
- [ ] Verificar que no excede prioridad sin dependencias resueltas

---

