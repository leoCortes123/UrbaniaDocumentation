# 🏗️ ARCHITECTURE
## Arquitectura del Proyecto Urbania API

> **Consultar**: Antes de implementar cualquier módulo nuevo o modificar la estructura.
> **Relacionado con**: GOLDEN_RULES.md, DEVELOPMENT_GUIDE.md, DATABASE_SCHEMA.md

---

## 1. Stack Tecnológico

| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Framework | Laravel | ^13.0 | Framework PHP moderno, soporte hasta Q3 2027 citeweb_search:5#2 |
| Lenguaje | PHP | 8.3 - 8.5 | Tipado estricto, property hooks, performance. Laravel 13 requiere PHP 8.3+ citeweb_search:5#2 |
| Base de Datos | PostgreSQL | ^18.0 | Última versión estable, soporte hasta Nov 2030 citeweb_search:5#0 |
| Contenedor | Docker + Docker Compose | Latest | Orquestación personalizada (NO Sail) |
| Web Server | Nginx | Latest | Reverse proxy, SSL termination |
| Cache | Redis | Latest | Sesiones, cache, colas |
| Testing | Pest | ^3.0 | Testing moderno para PHP, compatible con PHPUnit |
| Documentación | Laravel Scribe | ^5.0 | Generación automática de docs de API |
| Análisis Estático | PHPStan | ^2.0 | Nivel máximo (10) para tipado estricto |
| Formateo | Pint | ^1.0 | Estilo de código Laravel estándar |
| Autenticación | JWT (tymon/jwt-auth) | ^2.0 | Tokens stateless para API REST |
| Serialización | Laravel Resources | Built-in | Transformación de modelos a JSON |
| Data Generation | FakerPHP | ^1.0 | Generación de datos para testing |
| UUID | ramsey/uuid | ^4.0 | UUID v4 para trace_id y entidades |

> **Regla de versiones**: Siempre última estable. Si hay conflicto, documentar en tabla con columna "Restricción" e intentar instalar la versión que no genere conflicto, priorizando las librerías más importantes.

---

## 2. Arquitectura: Clean Architecture + DDD (Domain Driven Design)

```
/src
├── /Shared                    # Bounded context compartido
│   ├── /Domain
│   │   ├── /ValueObjects      # Uuid, Email, Money, etc.
│   │   ├── /Exceptions        # DomainException, ValidationException
│   │   ├── /Events            # DomainEvent, EventBus
│   │   └── /Contracts         # Interfaces compartidas
│   ├── /Application
│   │   ├── /DTOs              # DTOs compartidos
│   │   └── /Bus              # CommandBus, QueryBus
│   └── /Infrastructure
│       ├── /Exceptions        # ExceptionHandler, HttpException
│       ├── /Persistence       # BaseEloquentRepository
│       ├── /Bus              # LaravelEventBus, LaravelCommandBus
│       ├── /Logging          # JsonLogger, RequestLogger
│       └── /Middleware       # RequestLogging, TraceId
│
├── /Auth                      # Bounded context: Autenticación
│   ├── /Domain
│   │   ├── /Entities          # User, RefreshToken
│   │   ├── /ValueObjects      # Password, JwtToken
│   │   ├── /Repositories      # UserRepository (interface)
│   │   ├── /Exceptions        # InvalidCredentials, TokenExpired
│   │   └── /Events            # UserLoggedIn, UserRegistered
│   ├── /Application
│   │   ├── /DTOs              # LoginRequestDto, LoginResponseDto
│   │   ├── /UseCases          # LoginUseCase, RegisterUseCase, LogoutUseCase
│   │   └── /Services          # JwtService (interface)
│   ├── /Infrastructure
│   │   ├── /Persistence       # EloquentUserRepository
│   │   ├── /Services          # TymonJwtService
│   │   └── /Http
│   │       ├── /Controllers   # AuthController
│   │       ├── /Requests      # LoginRequest, RegisterRequest
│   │       └── /Resources     # UserResource, TokenResource
│   └── /Presentation          # Routes, Middleware de auth
│
├── /Property                  # Bounded context: Propiedades
│   ├── /Domain
│   │   ├── /Entities          # Property, CommonZone
│   │   ├── /ValueObjects      # Address, PropertyName
│   │   ├── /Repositories      # PropertyRepository, CommonZoneRepository
│   │   └── /Events            # PropertyCreated, ZoneReserved
│   ├── /Application
│   │   ├── /DTOs              # CreatePropertyDto, PropertyResponseDto
│   │   └── /UseCases          # CreatePropertyUseCase, ListPropertiesUseCase
│   └── /Infrastructure
│       ├── /Persistence       # EloquentPropertyRepository
│       └── /Http
│           ├── /Controllers   # PropertyController
│           ├── /Requests      # StorePropertyRequest
│           └── /Resources     # PropertyResource
│
├── /Resident                  # Bounded context: Residentes
├── /Reservation               # Bounded context: Reservas
├── /Payment                   # Bounded context: Pagos
├── /PQR                       # Bounded context: PQRS (Peticiones, Quejas, Reclamos, Sugerencias)
├── /Notification              # Bounded context: Notificaciones
├── /Chat                      # Bounded context: Chat
└── /Ingreso                   # Bounded context: Control de Ingresos
```

### Principios
- Cada directorio en `/src` (excepto `Shared`) = **bounded context de negocio completo**
- **Ningún bounded context importa de otro bounded context**. Comunicación solo a través de `Shared/` o eventos de dominio
- `Shared/` = todo lo transversal: value objects, excepciones base, contratos, buses
- `Domain/` = lógica pura, sin dependencias externas
- `Application/` = orquestación de casos de uso, DTOs
- `Infrastructure/` = implementaciones concretas (Eloquent, JWT, HTTP)
- `Presentation/` = rutas, middleware, configuración de rutas

---

## 3. Reglas de Dependencia (SOLID estricto)

```
Presentation -> Application -> Domain
     ^                            ^
   Controllers              Repositories (interfaces)
   Requests                 Entities
   Resources                Value Objects
   Routes                   Events
                            Exceptions
Infrastructure -> Domain
     ^
   Eloquent Repositories
   JWT Service
   Mail Service
   Event Bus (Laravel)
```

- **Presentation** depende de **Application** (DTOs de request/response)
- **Application** depende de **Domain** (use cases orquestan entidades)
- **Infrastructure** depende de **Domain** (implementa interfaces de repositorio)
- **Domain** NO depende de nada externo (ni Laravel, ni paquetes de terceros)
- **NUNCA** una capa superior importa de una inferior
- **NUNCA** un bounded context importa de otro bounded context
- **NUNCA** `Shared/` importa de ningún bounded context
- **NUNCA** `Domain/` importa de `Infrastructure/`

---

## 4. Manejo de Errores (Excepciones de Dominio)

**TODAS** las funciones que pueden fallar lanzan excepciones de dominio tipadas:
- Usar excepciones específicas de dominio, no genéricas de PHP
- **NUNCA** lanzar excepciones crudas (`\Exception`, `\RuntimeException`)
- **NUNCA** usar `try/catch` sin mapear a una excepción de dominio o respuesta HTTP

```php
<?php

declare(strict_types=1);

namespace Urbania\Shared\Domain\Exceptions;

abstract class DomainException extends \Exception
{
    public function __construct(
        string $message,
        private readonly string $errorCode,
        int $httpStatusCode = 400,
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);
    }

    public function errorCode(): string
    {
        return $this->errorCode;
    }

    public function httpStatusCode(): int
    {
        return $this->httpStatusCode;
    }
}
```

### Excepciones Específicas

```php
<?php

declare(strict_types=1);

namespace Urbania\Auth\Domain\Exceptions;

use Urbania\Shared\Domain\Exceptions\DomainException;

class InvalidCredentialsException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: 'Las credenciales proporcionadas son incorrectas',
            errorCode: 'INVALID_CREDENTIALS',
            httpStatusCode: 401
        );
    }
}

class TokenExpiredException extends DomainException
{
    public function __construct()
    {
        parent::__construct(
            message: 'El token de autenticación ha expirado',
            errorCode: 'TOKEN_EXPIRED',
            httpStatusCode: 401
        );
    }
}

class UserNotFoundException extends DomainException
{
    public function __construct(string $userId)
    {
        parent::__construct(
            message: "El usuario con ID {$userId} no fue encontrado",
            errorCode: 'USER_NOT_FOUND',
            httpStatusCode: 404
        );
    }
}
```

### Excepciones de Infraestructura

```php
<?php

declare(strict_types=1);

namespace Urbania\Shared\Infrastructure\Exceptions;

use Urbania\Shared\Domain\Exceptions\DomainException;

class DatabaseException extends DomainException
{
    public function __construct(string $operation)
    {
        parent::__construct(
            message: "Error en la base de datos durante: {$operation}",
            errorCode: 'DATABASE_ERROR',
            httpStatusCode: 500
        );
    }
}
```

---

## 5. Estado de UI con DTOs y Resources

> **IMPORTANTE**: La API no mantiene estado de UI. Cada request es stateless.

```php
<?php

declare(strict_types=1);

namespace Urbania\Auth\Application\DTOs;

final readonly class LoginRequestDto
{
    public function __construct(
        public string $email,
        public string $password
    ) {}
}

final readonly class LoginResponseDto
{
    public function __construct(
        public string $accessToken,
        public string $refreshToken,
        public string $tokenType,
        public int $expiresIn,
        public UserResponseDto $user
    ) {}
}
```

### Resource de Laravel (Presentación)

```php
<?php

declare(strict_types=1);

namespace Urbania\Auth\Infrastructure\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

final class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id(),
            'name' => $this->resource->name(),
            'email' => $this->resource->email(),
            'phone' => $this->resource->phone(),
            'unit' => $this->resource->unit(),
            'role' => $this->resource->role()->value,
            'status' => $this->resource->status()->value,
            'avatar_url' => $this->resource->avatarUrl(),
            'created_at' => $this->resource->createdAt()->toIso8601String(),
        ];
    }
}
```

---

## 6. Configuración de JWT (Tymon JWT-Auth)

```php
<?php

// config/jwt.php (configuración estándar de tymon/jwt-auth)
// Las claves se generan con: php artisan jwt:secret

return [
    'secret' => env('JWT_SECRET'),
    'keys' => [
        'public' => env('JWT_PUBLIC_KEY'),
        'private' => env('JWT_PRIVATE_KEY'),
        'passphrase' => env('JWT_PASSPHRASE'),
    ],
    'ttl' => env('JWT_TTL', 60), // minutos
    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160), // minutos (2 semanas)
    'algo' => env('JWT_ALGO', 'HS256'),
    'required_claims' => ['iss', 'iat', 'exp', 'nbf', 'sub', 'jti'],
    'persistent_claims' => [],
    'lock_subject' => true,
    'leeway' => env('JWT_LEEWAY', 0),
    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),
    'decrypt_cookies' => false,
    'providers' => [
        'jwt' => Tymon\JWTAuth\Providers\JWT\Lcobucci::class,
        'auth' => Tymon\JWTAuth\Providers\Auth\Illuminate::class,
        'storage' => Tymon\JWTAuth\Providers\Storage\Illuminate::class,
    ],
];
```

---

## 7. Configuración de Base de Datos (PostgreSQL)

```php
<?php

// config/database.php - configuración PostgreSQL

'pgsql' => [
    'driver' => 'pgsql',
    'url' => env('DB_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'urbania'),
    'username' => env('DB_USERNAME', 'urbania'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => env('DB_CHARSET', 'utf8'),
    'prefix' => '',
    'prefix_indexes' => true,
    'search_path' => 'public',
    'sslmode' => 'prefer',
],
```

---

## 8. Testing Obligatorio

Cada bounded context DEBE incluir:
- Unit tests para Domain (entities, value objects, exceptions)
- Unit tests para Application (use cases con mocks de repositorios)
- Integration tests para Infrastructure (repositories con BD real)
- Feature tests para Presentation (endpoints HTTP)
- Mock de repositorios con Pest/Mockery

### Estructura de Tests (espejo de src/)

```
tests/
├── Unit/
│   ├── Shared/
│   │   ├── Domain/
│   │   └── Infrastructure/
│   ├── Auth/
│   │   ├── Domain/
│   │   │   ├── Entities/
│   │   │   └── ValueObjects/
│   │   └── Application/
│   │       └── UseCases/
│   ├── Property/
│   ├── Resident/
│   ├── Reservation/
│   ├── Payment/
│   ├── PQR/
│   ├── Notification/
│   ├── Chat/
│   └── Ingreso/
├── Integration/
│   ├── Auth/
│   │   └── Infrastructure/
│   │       └── Persistence/
│   ├── Property/
│   └── ...
└── Feature/
    ├── Auth/
    │   └── Http/
    │       └── AuthControllerTest.php
    ├── Property/
    └── ...
```

---

## 9. Breakpoints de Diseño (para documentación de API)

| Nombre | Ancho | Uso |
|--------|-------|-----|
| Mobile | < 600px | Referencia para app móvil |
| Tablet | 600-1024px | Referencia para app tablet |
| Desktop | > 1024px | Panel de administración web |

---

## 10. Docker Compose (Desarrollo)

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: urbania-api
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./:/var/www
    networks:
      - urbania-network
    depends_on:
      - db
      - redis
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
      - DB_HOST=db
      - DB_PORT=5432
      - DB_DATABASE=urbania
      - DB_USERNAME=urbania
      - DB_PASSWORD=secret
      - REDIS_HOST=redis
      - REDIS_PORT=6379

  nginx:
    image: nginx:alpine
    container_name: urbania-nginx
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./:/var/www
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    networks:
      - urbania-network
    depends_on:
      - app

  db:
    image: postgres:18.4-alpine
    container_name: urbania-db
    restart: unless-stopped
    ports:
      - "5433:5432"
    environment:
      POSTGRES_DB: urbania
      POSTGRES_USER: urbania
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - urbania-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U urbania"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: urbania-redis
    restart: unless-stopped
    ports:
      - "6380:6379"
    networks:
      - urbania-network

networks:
  urbania-network:
    driver: bridge

volumes:
  postgres-data:
```

> **Nota**: Puerto alternativo 5433 para PostgreSQL y 6380 para Redis para evitar conflictos con instancias locales.

---

## 11. Health Check

```php
<?php

declare(strict_types=1);

namespace Urbania\Shared\Application\Services;

use Illuminate\Support\Facades\DB;

final class HealthCheckService
{
    public function check(): array
    {
        $checks = [
            'database' => $this->checkDatabase(),
            'redis' => $this->checkRedis(),
            'storage' => $this->checkStorage(),
        ];

        $allHealthy = !in_array(false, array_column($checks, 'healthy'), true);

        return [
            'status' => $allHealthy ? 'healthy' : 'unhealthy',
            'timestamp' => now()->toIso8601String(),
            'checks' => $checks,
        ];
    }

    private function checkDatabase(): array
    {
        try {
            DB::connection()->getPdo();
            return ['healthy' => true, 'message' => 'Connected'];
        } catch (\Exception $e) {
            return ['healthy' => false, 'message' => $e->getMessage()];
        }
    }

    private function checkRedis(): array
    {
        try {
            \Redis::ping();
            return ['healthy' => true, 'message' => 'Connected'];
        } catch (\Exception $e) {
            return ['healthy' => false, 'message' => $e->getMessage()];
        }
    }

    private function checkStorage(): array
    {
        $path = storage_path('framework/cache');
        return [
            'healthy' => is_writable($path),
            'message' => is_writable($path) ? 'Writable' : 'Not writable',
        ];
    }
}
```

### Endpoint de Health Check

```php
// routes/api.php
Route::get('/health', [HealthController::class, 'check']);
```

- **200 OK**: Todos los servicios healthy
- **503 Service Unavailable**: Algún servicio unhealthy
