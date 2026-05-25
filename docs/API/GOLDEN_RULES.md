# ⚡ GOLDEN_RULES
## Reglas Inquebrantables del Proyecto Urbania API

> **Consultar**: Antes de escribir cualquier línea de código.

---

## 1. Arquitectura Clean Architecture + DDD (Domain Driven Design)
- Cada bounded context es un módulo aislado en `src/[BoundedContext]/`
- Estructura interna: `Domain/` → `Application/` → `Infrastructure/` → `Presentation/`
- **NUNCA** un módulo de dominio importa de otro módulo de dominio. Comunicación solo vía `Shared/` o eventos de dominio
- **NUNCA** la capa de dominio depende de Laravel, Eloquent, o paquetes de terceros
- **NUNCA** `Shared/` importa de ningún bounded context específico
- **NUNCA** `Domain/` importa de `Infrastructure/`

## 2. Separación Estricta de Capas
```
Presentation -> Application -> Domain <- Infrastructure
     ^              ^              ^
   Controllers   Services      Repositories
                 Use Cases       Entities
                 DTOs            Value Objects
```
- **Presentation** depende de **Application** (DTOs de entrada/salida)
- **Application** depende de **Domain** (use cases orquestan entidades)
- **Infrastructure** depende de **Domain** (implementa interfaces de repositorio)
- **Domain** NO depende de nada externo (ni Laravel, ni paquetes de terceros)
- **NUNCA** una capa superior importa de una inferior
- **NUNCA** un módulo importa de otro módulo (usar `Shared/`)
- **NUNCA** `Shared/` importa de ningún módulo
- **NUNCA** `Domain/` importa de `Infrastructure/`

## 3. Responsabilidad Única
- Ninguna clase hace más de una cosa
- Archivos de dominio > 200 líneas → refactorizar inmediatamente
- Archivos de infraestructura > 300 líneas → refactorizar inmediatamente
- Una clase = un propósito claro y documentado
- Un método = una operación atómica

## 4. No AI Slop
- Código debe responder a un caso de uso real del negocio
- No código genérico, boilerplate innecesario, o "por si acaso"
- Cada línea justificada por un requerimiento funcional
- No generar interfaces vacías "para el futuro"

## 5. TDD Estricto
- Ciclo **Red-Green-Refactor** obligatorio
- Tests ANTES del código de producción
- Cobertura mínima: 80% de líneas, 100% de casos de uso
- Tests unitarios para Domain, tests de integración para Infrastructure
- Pest como framework de testing con `DatabaseTransactions`

## 6. Tipado Estricto
- `declare(strict_types=1);` en TODOS los archivos PHP
- Evitar `mixed` en cualquier contexto sin justificación documentada
- DTOs bien definidos con tipos explícitos
- Parámetros de funciones tipados, no posicionales genéricos
- Return types obligatorios en todos los métodos públicos

## 7. Errores Controlados con Excepciones de Dominio
- **TODAS** las funciones que pueden fallar lanzan excepciones de dominio tipadas
- **NUNCA** lanzar excepciones genéricas de PHP (`\Exception`, `\RuntimeException`)
- **NUNCA** usar `try/catch` sin mapear a una excepción de dominio o a respuesta HTTP apropiada
- Usar sealed class / enum de errores de dominio con subclases específicas
- **Ver definición en ARCHITECTURE.md Sección 4**

## 8. API Desacoplada
- Lógica de negocio en `Domain/` o `Application/`, **nunca** en controllers
- Controllers reciben DTOs y devuelven DTOs/Resources, no toman decisiones de negocio
- Presentación pura: serialización, validación de entrada, códigos HTTP

## 9. Respuestas Estandarizadas
- Todo mensaje de error DEBE seguir el formato estándar:
  ```json
  {
    "error_code": "RESIDENT_NOT_FOUND",
    "message": "El residente solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
  ```
- Éxito: código HTTP apropiado (200, 201, 204) + body según recurso
- Errores de validación: 422 con detalle de campos
- Errores de negocio: 400/409 con `error_code` específico
- Errores del servidor: 500 con `trace_id` (sin detalles internos)

## 10. Documentación Viva
- Completar secciones `** Pendiente **` con código real de implementación
- Actualizar FEATURES_INDEX cuando se agrega/modifica un módulo
- Documentar decisiones técnicas no obvias en comentarios de código
- Mantener Laravel Scribe actualizado con cada endpoint nuevo

## 11. Demo-Ready
- Todo módulo debe funcionar con datos de demo
- Seeders con datos realistas usando Faker
- Factories para cada entidad del dominio
- Credenciales demo pre-cargadas para pruebas rápidas

## 12. Migración-Transparente
- El esquema de BD debe soportar evolución sin pérdida de datos
- Migrations reversibles (método `down()` implementado)
- Preparar `RemoteRepository` con mismas interfaces que `EloquentRepository`
- Zero cambios en Domain/ o Application/ al cambiar infraestructura

## 13. Flujo de Autenticación
- La API usa **JWT** (JSON Web Tokens) para autenticación stateless
- Token en header: `Authorization: Bearer <jwt_token>`
- Refresh tokens con rotación
- Middleware de autenticación en capa de presentación
- Roles y permisos verificados en capa de aplicación (policies/gates)

## 14. Prohibiciones Absolutas
- ❌ No usar `request()` helper en capa de dominio o aplicación
- ❌ No usar `mixed` sin justificación documentada
- ❌ No usar `eval()`, `exec()`, ni funciones peligrosas
- ❌ No crear archivos > 300 líneas (infraestructura) / > 200 líneas (dominio)
- ❌ No importar entre módulos de dominio (usar `Shared/` o eventos)
- ❌ No dejar código comentado o TODOs sin resolver
- ❌ No exponer stack traces en respuestas de producción
- ❌ No hardcodear strings (usar constantes o archivos de configuración)
- ❌ No hardcodear configuraciones de BD (usar `.env`)
- ❌ No usar credenciales demo en builds de producción
- ❌ No escribir SQL crudo en controllers o use cases
- ❌ No usar Eloquent en capa de dominio (solo en Infrastructure/)

---

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Clases (Dominio) | PascalCase | `LoginUseCase`, `ResidentEntity` |
| Clases (Infra) | PascalCase + sufijo | `EloquentResidentRepository`, `JwtTokenService` |
| Archivos | snake_case | `login_use_case.php`, `resident_entity.php` |
| Tablas BD | snake_case, plural | `residents`, `common_zone_reservations` |
| Columnas BD | snake_case | `first_name`, `created_at` |
| Endpoints | kebab-case | `/api/v1/resident-profile` |
| Enums | PascalCase valores | `enum UserRole { ADMIN, RESIDENT }` |
| Directorios de módulo | PascalCase (Dominio) / snake_case (Infra) | `src/Auth/Domain/`, `src/Auth/Infrastructure/` |
| Factories | PascalCase + Factory | `ResidentFactory` |
| Seeders | PascalCase + Seeder | `ResidentSeeder` |
| DTOs | PascalCase + Dto | `LoginRequestDto`, `ResidentResponseDto` |
| Resources | PascalCase + Resource | `ResidentResource` |

---

## Convenciones de Imports Ordenados (PHP)

```php
<?php

declare(strict_types=1);

// 1. Declaraciones PHP nativas
namespace Urbania\Auth\Domain\UseCases;

use DateTimeImmutable;

// 2. Paquetes de terceros (Laravel, Symfony, etc.)
use Illuminate\Support\Facades\Hash;

// 3. Core / Shared (absolutos)
use Urbania\Shared\Domain\ValueObjects\Uuid;
use Urbania\Shared\Domain\Exceptions\DomainException;

// 4. Features (absolutos, mismo bounded context)
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

// 1. Imports
// 2. Constantes privadas
// 3. Clase principal
// 4. Clases/Enums privados auxiliares (solo si son pequeños)
```
