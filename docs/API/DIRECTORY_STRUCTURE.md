# 📁 ESTRUCTURA DE DIRECTORIOS DE DOCUMENTACIÓN

> **Este documento es la guía maestra de organización.**
> Todo agente de desarrollo DEBE seguir esta estructura estrictamente.
> Los documentos fuera de su ubicación correcta serán ignorados.

---

## Árbol Completo

```
/docs/
├── AGENTS_GUIDE.md              ← Mapa de navegación (SIEMPRE primero)
├── GOLDEN_RULES.md              ← Reglas inquebrantables
├── ARCHITECTURE.md              ← Stack, estructura, principios
├── DATABASE_SCHEMA.md           ← Esquema completo de base de datos
├── API_CONTRACT.md              ← Endpoints, request/response, autenticación
├── FEATURES_INDEX.md            ← Catálogo de módulos y estado
├── DEVELOPMENT_GUIDE.md       ← Setup, flujo de trabajo, convenciones
├── DEMO_SETUP.md                ← Modo offline, credenciales, mock data
├── DIRECTORY_STRUCTURE.md       ← ESTE DOCUMENTO
├── IMPLEMENTATION_REPORT.md     ← Historial de iteraciones (solo lectura)
│
└── /features/
    │
    ├── /auth/
    │   ├── auth.md              ← Spec completo del módulo
    │   └── /recursos/           ← Recursos si son necesarios según el spec
    │
    ├── /property/
    │   ├── property.md          ← Spec completo del módulo
    │   └── /recursos/
    │
    ├── /resident/
    │   ├── resident.md          ← Spec completo del módulo
    │   └── /recursos/
    │
    ├── /dashboard/
    │   ├── dashboard.md         ← Spec completo del módulo
    │   └── /recursos/
    │
    ├── /common-zone/
    │   ├── common-zone.md       ← Spec completo del módulo
    │   └── /recursos/
    │
    ├── /reservation/
    │   ├── reservation.md       ← Spec completo del módulo
    │   └── /recursos/
    │
    ├── /payment/
    │   ├── payment.md           ← Spec completo del módulo
    │   └── /recursos/
    │
    ├── /pqr/
    │   ├── pqr.md               ← Spec completo del módulo
    │   └── /recursos/
    │
    ├── /notification/
    │   ├── notification.md      ← Spec completo del módulo
    │   └── /recursos/
    │
    ├── /chat/
    │   ├── chat.md              ← Spec completo del módulo
    │   └── /recursos/
    │
    └── /ingreso/
        ├── ingreso.md           ← Spec completo del módulo
        └── /recursos/
```

---

## Flujo de Trabajo por Tipo de Tarea (con rutas exactas)

### Implementar módulo nuevo:
```
/docs/AGENTS_GUIDE.md
  → /docs/GOLDEN_RULES.md
  → /docs/ARCHITECTURE.md
  → /docs/DATABASE_SCHEMA.md
  → /docs/API_CONTRACT.md
  → /docs/FEATURES_INDEX.md
  → /docs/DEVELOPMENT_GUIDE.md
  → /docs/DEMO_SETUP.md
  → /docs/features/[feature]/[feature].md
```

### Modificar módulo existente:
```
/docs/AGENTS_GUIDE.md
  → /docs/GOLDEN_RULES.md
  → /docs/ARCHITECTURE.md
  → /docs/DATABASE_SCHEMA.md (si cambia BD)
  → /docs/features/[feature]/[feature].md
  → /docs/DEVELOPMENT_GUIDE.md
  → /docs/API_CONTRACT.md (si hay endpoints nuevos)
```

### Crear endpoint nuevo:
```
/docs/AGENTS_GUIDE.md
  → /docs/GOLDEN_RULES.md
  → /docs/ARCHITECTURE.md
  → /docs/API_CONTRACT.md
  → /docs/DATABASE_SCHEMA.md (si requiere nueva tabla/columna)
  → /docs/DEVELOPMENT_GUIDE.md
```

### Modificar esquema de base de datos:
```
/docs/AGENTS_GUIDE.md
  → /docs/GOLDEN_RULES.md
  → /docs/ARCHITECTURE.md
  → /docs/DATABASE_SCHEMA.md
  → /docs/FEATURES_INDEX.md
  → /docs/DEVELOPMENT_GUIDE.md
```

---

## Estructura de Código (src/)

```
/src/
├── /Shared
│   ├── /Domain
│   │   ├── /ValueObjects
│   │   ├── /Exceptions
│   │   ├── /Events
│   │   └── /Contracts
│   ├── /Application
│   │   ├── /DTOs
│   │   └── /Bus
│   └── /Infrastructure
│       ├── /Exceptions
│       ├── /Persistence
│       ├── /Bus
│       ├── /Logging
│       └── /Middleware
│
├── /Auth
│   ├── /Domain
│   │   ├── /Entities
│   │   ├── /ValueObjects
│   │   ├── /Repositories
│   │   ├── /Exceptions
│   │   └── /Events
│   ├── /Application
│   │   ├── /DTOs
│   │   └── /UseCases
│   └── /Infrastructure
│       ├── /Persistence
│       ├── /Services
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
├── /Property
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
├── /Resident
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
├── /Dashboard
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           └── /Resources
│
├── /CommonZone
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
├── /Reservation
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
├── /Payment
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
├── /PQR
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
├── /Notification
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
├── /Chat
│   ├── /Domain
│   ├── /Application
│   └── /Infrastructure
│       └── /Http
│           ├── /Controllers
│           ├── /Requests
│           └── /Resources
│
└── /Ingreso
    ├── /Domain
    ├── /Application
    └── /Infrastructure
        └── /Http
            ├── /Controllers
            ├── /Requests
            └── /Resources
```

---

## Estructura de Tests (tests/)

```
/tests/
├── /Unit
│   ├── /Shared
│   │   ├── /Domain
│   │   └── /Infrastructure
│   ├── /Auth
│   │   ├── /Domain
│   │   │   ├── /Entities
│   │   │   └── /ValueObjects
│   │   └── /Application
│   │       └── /UseCases
│   ├── /Property
│   ├── /Resident
│   ├── /Dashboard
│   ├── /CommonZone
│   ├── /Reservation
│   ├── /Payment
│   ├── /PQR
│   ├── /Notification
│   ├── /Chat
│   └── /Ingreso
│
├── /Integration
│   ├── /Auth
│   │   └── /Infrastructure
│   │       └── /Persistence
│   ├── /Property
│   ├── /Resident
│   └── ...
│
└── /Feature
    ├── /Auth
    │   └── /Http
    │       └── AuthControllerTest.php
    ├── /Property
    ├── /Resident
    └── ...
```

---

## Reglas de Ubicación

| Tipo de archivo | Ubicación correcta | Ejemplo |
|-----------------|-------------------|---------|
| Documentación de módulo | `/docs/features/[feature]/[feature].md` | `/docs/features/auth/auth.md` |
| Recursos de diseño | `/docs/features/[feature]/recursos/` | `/docs/features/auth/recursos/` |
| Entidad de dominio | `src/[BC]/Domain/Entities/` | `src/Auth/Domain/Entities/User.php` |
| Value Object | `src/[BC]/Domain/ValueObjects/` | `src/Auth/Domain/ValueObjects/Email.php` |
| Repositorio (interface) | `src/[BC]/Domain/Repositories/` | `src/Auth/Domain/Repositories/UserRepository.php` |
| Use Case | `src/[BC]/Application/UseCases/` | `src/Auth/Application/UseCases/LoginUseCase.php` |
| DTO | `src/[BC]/Application/DTOs/` | `src/Auth/Application/DTOs/LoginRequestDto.php` |
| Repositorio (impl) | `src/[BC]/Infrastructure/Persistence/` | `src/Auth/Infrastructure/Persistence/EloquentUserRepository.php` |
| Controller | `src/[BC]/Infrastructure/Http/Controllers/` | `src/Auth/Infrastructure/Http/Controllers/AuthController.php` |
| Request | `src/[BC]/Infrastructure/Http/Requests/` | `src/Auth/Infrastructure/Http/Requests/LoginRequest.php` |
| Resource | `src/[BC]/Infrastructure/Http/Resources/` | `src/Auth/Infrastructure/Http/Resources/UserResource.php` |
| Migration | `database/migrations/` | `database/migrations/2026_05_20_000001_create_residents_table.php` |
| Factory | `database/factories/` | `database/factories/ResidentFactory.php` |
| Seeder | `database/seeders/` | `database/seeders/ResidentSeeder.php` |
| Test Unit | `tests/Unit/[BC]/` | `tests/Unit/Auth/Domain/Entities/UserTest.php` |
| Test Integration | `tests/Integration/[BC]/` | `tests/Integration/Auth/Infrastructure/Persistence/UserRepositoryTest.php` |
| Test Feature | `tests/Feature/[BC]/` | `tests/Feature/Auth/Http/AuthControllerTest.php` |
| Route | `routes/api.php` | `Route::post('/auth/login', ...)` |
| Middleware | `src/Shared/Infrastructure/Middleware/` | `src/Shared/Infrastructure/Middleware/TraceIdMiddleware.php` |
| Exception Handler | `src/Shared/Infrastructure/Exceptions/` | `src/Shared/Infrastructure/Exceptions/Handler.php` |
