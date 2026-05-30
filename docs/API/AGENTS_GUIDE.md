# 📚 URBANIA API - AGENTS_GUIDE
## Documento Principal de Referencia Rápida para el Backend

> **Instrucción para el agente**: Lee este documento SIEMPRE al inicio de cada tarea. Es tu mapa de navegación. Extrae las reglas de oro. Luego consulta la fase específica según el tipo de tarea.

> ** Inicia un nuevo ssd para el proyecto en modo automatico y con persistencia en engram **

---

## 📁 Antes de Empezar

> **⚠️ OBLIGATORIO**: Consulta `DIRECTORY_STRUCTURE.md` ANTES de crear cualquier archivo nuevo.
> Este documento define dónde debe ir cada tipo de documento. Los archivos fuera de su ubicación correcta serán ignorados.

## Tu Rol
Ingeniero senior especializado en Laravel y PostgreSQL. Construir API RESTful para la app Urbania (administración de propiedades horizontales). Escalable, mantenible, modular.

---

## 🗺�?Mapa de Documentación

### Fases Esenciales (Leer siempre)

| Orden | Documento | Cuándo consultar |
|-------|-----------|------------------|
| 0 | **DIRECTORY_STRUCTURE** | Antes de crear cualquier archivo nuevo |
| 1 | **AGENTS_GUIDE** (este) | Siempre primero |
| 2 | **GOLDEN_RULES** | Antes de escribir cualquier código |
| 3 | **ARCHITECTURE** | Antes de implementar cualquier módulo |

### Fases de Apoyo (Consultar según tarea)

| Orden | Documento | Cuándo consultar |
|-------|-----------|------------------|
| 4 | **DATABASE_SCHEMA** | Si la tarea involucra tablas, relaciones o migraciones |
| 5 | **API_CONTRACT** | Si la tarea involucra endpoints nuevos o modificación de contrato |
| 6 | **FEATURES_INDEX** | Si es un módulo nuevo o modificación de módulo existente |
| 7 | **DEVELOPMENT_GUIDE** | Antes de empezar a codear |

---

## 🔀 Flujo de Trabajo por Tipo de Tarea

### Implementar módulo nuevo:
```
AGENTS_GUIDE ->DIRECTORY_STRUCTURE ->GOLDEN_RULES ->ARCHITECTURE ->DATABASE_SCHEMA ->API_CONTRACT ->FEATURES_INDEX ->DEVELOPMENT_GUIDE->/docs/features/[feature]/[feature].md
```

### Modificar módulo existente:
```
AGENTS_GUIDE ->DIRECTORY_STRUCTURE ->GOLDEN_RULES ->ARCHITECTURE ->DATABASE_SCHEMA ->/docs/features/[feature]/[feature].md ->DEVELOPMENT_GUIDE ->API_CONTRACT (si hay endpoints nuevos)
```

### Crear endpoint nuevo:
```
AGENTS_GUIDE ->DIRECTORY_STRUCTURE ->GOLDEN_RULES ->ARCHITECTURE ->API_CONTRACT ->DATABASE_SCHEMA ->DEVELOPMENT_GUIDE
```

### Modificar esquema de base de datos:
```
AGENTS_GUIDE ->DIRECTORY_STRUCTURE ->GOLDEN_RULES ->ARCHITECTURE ->DATABASE_SCHEMA ->FEATURES_INDEX ->DEVELOPMENT_GUIDE
```

### Setup inicial del proyecto:
```
AGENTS_GUIDE ->DIRECTORY_STRUCTURE ->GOLDEN_RULES ->ARCHITECTURE ->DATABASE_SCHEMA ->DEVELOPMENT_GUIDE
```

---

## Reglas de Oro (Nunca violar)

1. **Arquitectura**: Clean Architecture + DDD (Domain Driven Design). Separación estricta entre Dominio, Aplicación, Infraestructura y Presentación.
2. **TDD Estricto**: Ciclo Red-Green-Refactor. Las pruebas se escriben ANTES que el código de producción.
3. **No AI Slop**: Código debe responder a un caso de uso real del negocio. No código genérico, boilerplate innecesario, o "por si acaso". Cada clase debe tener una responsabilidad única. Si un controlador o servicio supera las 200 líneas, refactorizar inmediatamente.
4. **Documentación Viva**: Usar Laravel Scribe. Mantener actualizado el `README.md`. Completar secciones `** Pendiente **` con código real de implementación.
5. **Estado Predecible**: Respuestas JSON estandarizadas. Códigos HTTP correctos. Manejo de errores uniforme.
6. **Tipado Estricto**: Usar tipos de PHP 8.3+. Evitar `mixed` sin justificación. DTOs bien definidos.
7. **Errores Controlados**: JSON con `error_code`, `message`, `trace_id` (UUID v4). Nunca exponer stack traces en producción.
8. **UI Desacoplada**: La API no conoce la UI. Respuestas agnósticas de presentación.
9. **Alertas Estandarizadas**: Respuestas de error consistentes. Códigos de error documentados.
10. **Migración-Transparente**: El esquema de BD debe soportar evolución sin pérdida de datos. Migrations reversibles.

---

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Clases (Dominio) | PascalCase | `LoginUseCase`, `ResidentEntity` |
| Clases (Infraestructura) | PascalCase + sufijo | `EloquentResidentRepository`, `JwtTokenService` |
| Archivos | snake_case | `login_use_case.php`, `resident_entity.php` |
| Tablas BD | snake_case, plural | `residents`, `common_zone_reservations` |
| Columnas BD | snake_case | `first_name`, `created_at` |
| Endpoints | kebab-case | `/api/v1/resident-profile` |
| Providers | camelCase | `authServiceProvider` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Enums | PascalCase valores | `enum UserRole { ADMIN, RESIDENT }` |
| Directorios de feature | PascalCase (Dominio) / snake_case (Infra) | `src/Auth/Domain/`, `src/Auth/Infrastructure/` |
| Fake/Seed classes | Fake + nombre | `FakeResidentRepository`, `ResidentSeeder` |

---

## Convenciones de Imports Ordenados (PHP)

```php
<?php

// 1. Declaraciones de namespace y use (PHP nativo)
namespace Urbania\Auth\Domain\UseCases;

use DateTimeImmutable;
use InvalidArgumentException;

// 2. Paquetes de terceros
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

// 3. Core / Shared (absolutos)
use Urbania\Shared\Domain\ValueObjects\Uuid;
use Urbania\Shared\Domain\Exceptions\DomainException;

// 4. Features (absolutos, mismo dominio)
use Urbania\Auth\Domain\Entities\Resident;
use Urbania\Auth\Domain\Repositories\ResidentRepository;

// 5. Relativos (mismo módulo)
use ..\ValueObjects\Email;
use ..\ValueObjects\Password;
```

---

## Estructura de Archivo PHP

```php
<?php

declare(strict_types=1);

namespace Urbania\Feature\Domain\UseCases;

// 1. Imports (ver convenciones arriba)

// 2. Constantes privadas (si aplica)

// 3. Clase principal
final class LoginUseCase
{
    // 4. Propiedades
    // 5. Constructor
    // 6. Métodos públicos
    // 7. Métodos privados
}

// 8. Clases/Enums privados auxiliares (mismo archivo solo si son pequeños)
```

---

## Checklist Final antes de entregar

- [ ] Leí AGENTS_GUIDE antes de empezar
- [ ] Leí GOLDEN_RULES antes de codear
- [ ] Leí DATABASE_SCHEMA si involucra BD
- [ ] Leí API_CONTRACT si involucra endpoints
- [ ] Leí todos los documentos relevantes para la tarea
- [ ] No violé ninguna Regla de Oro
- [ ] Las pruebas pasan (`composer test` o `php artisan test`)
- [ ] El análisis estático pasa (`phpstan` nivel máximo)
- [ ] No usé `mixed` sin justificación
- [ ] No importé entre módulos de dominio (usar `Shared/`)
- [ ] No excedí 200 líneas por archivo de dominio / 300 líneas de infraestructura
- [ ] Escribí tests ANTES del código de producción (TDD)
- [ ] Actualicé FEATURES_INDEX si fue necesario
- [ ] Documenté endpoints nuevos en API_CONTRACT
- [ ] Actualicé el esquema de BD en DATABASE_SCHEMA si aplica

---

## 📁 Estructura de Documentos

```
/docs/
├── AGENTS_GUIDE.md          ->Este documento (siempre primero)
├── GOLDEN_RULES.md            ->Reglas inquebrantables
├── ARCHITECTURE.md            ->Stack, estructura, principios
├── DATABASE_SCHEMA.md         ->Esquema de base de datos
├── API_CONTRACT.md            ->Endpoints, request/response, autenticación
├── FEATURES_INDEX.md          ->Catálogo de módulos y estado
├── DEVELOPMENT_GUIDE.md       ->Setup, flujo de trabajo, convenciones
├── DIRECTORY_STRUCTURE.md     ->Guía de organización de carpetas
├── IMPLEMENTATION_REPORT.md   ->Historial de iteraciones (solo lectura)
└── /features/
    ├── /auth/
		├── auth.md              ->Spec completo del módulo
		└── /recursos/           ->Recursos adicionales si son necesarios
	├── /home/
		├── home.md              ->Spec completo del módulo
		└── /recursos/           ->Recursos adicionales si son necesarios
    
```

> **Siempre consulta estos archivos antes de implementar cualquier endpoint o migración.**

---

> **Recuerda**: Esta documentación contiene TODA la información que necesitas. No consultes documentos externos durante la implementación. Si tienes una duda específica sobre un endpoint o un tipo de dato, busca en la fase correspondiente, pero vuelve inmediatamente a ejecutar.
