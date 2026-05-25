# 📋 FEATURES_INDEX
## Catálogo de Features del Proyecto Urbania

> **Consultar**: Si es un feature nuevo o modificación de feature existente.
> **Actualizar**: Cada vez que se agrega, completa o modifica un feature.

---

## Estado de Features

| # | Feature | Prioridad | Estado | Dependencias | Archivo de Spec | Demo Ready |
|---|---------|-----------|--------|--------------|-----------------|------------|
| 1 | Autenticación | P0 | Completado | — | `features/auth/auth.md` | Login con credenciales demo |
| 2 | Home | P0 | En desarrollo | Auth | `features/home/home.md` | Métricas locales |

---

## Definición de Prioridades

- **P0**: Bloqueante para MVP. Sin esto no hay app.
- **P1**: Core functionality. Necesario para lanzamiento.
- **P2**: Value-add. Puede esperar a post-lanzamiento.

---

## Demo Features (Modo Offline)

### Credenciales de Acceso Rápido
```
Admin:    admin@urbania.demo / Urbania2026!
Resident: residente@urbania.demo / Residente2026!
```

> **Nota**: Solo 2 credenciales funcionan en modo demo. Los 8 residentes generados en demo data
> son para mostrar datos de ejemplo (lista de residentes, reservas, etc.), pero solo 2 pueden
> iniciar sesión. Esto es intencional para simplificar el flujo de demo.

### Datos Pre-cargados
- **1 Propiedad**: Conjunto Residencial Los Pinos (48 unidades)
- **8 Residentes**: Generados con faker (1 admin, 7 residentes) — solo 2 pueden loguear
- **2 Reservas**: Salón Social y Piscina
- **Pagos**: Historial de 6 meses
- **PQRS**: 3 casos de ejemplo
- **Notificaciones**: 5 notificaciones recientes
- **Chat**: Conversación demo con administración

---

> **⚠️ Ubicación correcta**: Todo spec de feature debe ir en `/docs/features/[feature]/[feature].md`.
> Ver `DIRECTORY_STRUCTURE.md` para la guía completa de organización.

## Checklist al Agregar/Modificar Feature

- [ ] Revisar recursos de diseño en `/docs/features/[feature]/recursos/` (si son requeridos)
- [ ] Actualizar tabla de estado en este documento
- [ ] Crear/actualizar endpoints en `/docs/features/[feature]/endpoints.md`
- [ ] Verificar que no excede prioridad sin dependencias resueltas
- [ ] Agregar datos mock en `core/demo/demo_data.dart` si aplica
- [ ] Actualizar DEMO_SETUP.md si cambia persistencia local
- [ ] Actualizar ROUTING.md si agrega/modifica rutas

---

## Endpoints

> Se debe crear/actualizar el archivo `docs/features/endpoints.md` con la estructura de los edpoint requeridos para la integracion futura con el api.
