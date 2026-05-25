# 🛠️ DEVELOPMENT_GUIDE
## Guía de Desarrollo del Proyecto Urbania API

> **Consultar**: Antes de empezar a codear cualquier tarea.
> **Relacionado con**: ARCHITECTURE.md, GOLDEN_RULES.md

---

## Setup Inicial del Proyecto

### 1. Requisitos del Sistema

- **PHP**: 8.3 o superior (recomendado 8.4/8.5)
- **Composer**: 2.7 o superior
- **PostgreSQL**: 18.x
- **Redis**: 7.x
- **Docker** (opcional): Docker Engine 24.x + Docker Compose 2.x

### 2. Crear Proyecto Laravel

```bash
# Crear proyecto con Laravel Installer
composer global require laravel/installer
laravel new urbania-api --no-interaction

# O con Composer
cd /var/www
composer create-project laravel/laravel urbania-api
cd urbania-api
```

### 3. Dependencias (composer.json)

```bash
# Dependencias de producción
composer require tymon/jwt-auth
composer require ramsey/uuid
composer require predis/predis

# Dependencias de desarrollo
composer require --dev pestphp/pest
composer require --dev pestphp/pest-plugin-laravel
composer require --dev phpstan/phpstan
composer require --dev laravel/pint
composer require --dev knuckleswtf/scribe
composer require --dev fakerphp/faker

# Opcional: para DDD estricto
composer require --dev nunomaduro/larastan
```

### 4. Configuración de Entorno (.env)

```env
APP_NAME=UrbaniaAPI
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8080

# Database - PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=urbania
DB_USERNAME=urbania
DB_PASSWORD=secret

# Redis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# JWT
JWT_SECRET=...
JWT_TTL=60
JWT_REFRESH_TTL=20160
JWT_ALGO=HS256

# Logging
LOG_CHANNEL=stack
LOG_LEVEL=debug
LOG_ALL_REQUESTS=true

# Mail (para recuperación de contraseña)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=...
MAIL_PASSWORD=...

# Scribe (documentación)
SCRIBE_AUTH_KEY=...
```

### 5. Generar Clave JWT

```bash
php artisan jwt:secret
```

### 6. Ejecutar Migraciones y Seeders

```bash
# Crear base de datos
php artisan migrate

# Poblar con datos demo
php artisan db:seed --class=DatabaseSeeder

# O todo junto
php artisan migrate:fresh --seed
```

### 7. Iniciar Servidor de Desarrollo

```bash
# Sin Docker
php artisan serve --host=0.0.0.0 --port=8000

# Con Docker Compose
docker-compose up -d
# La API estará disponible en http://localhost:8080
```

---

## Estructura de Directorios del Proyecto

```
urbania-api/
├── app/
│   ├── Console/
│   ├── Exceptions/
│   ├── Http/
│   │   ├── Controllers/          # Controllers base de Laravel
│   │   ├── Middleware/           # Middleware base
│   │   └── Kernel.php
│   ├── Models/                   # Models Eloquent (solo para infraestructura)
│   ├── Providers/
│   └── bootstrap.php
├── bootstrap/
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── database.php
│   ├── jwt.php
│   └── ...
├── database/
│   ├── factories/                # Factories de Eloquent
│   ├── migrations/               # Migraciones
│   └── seeders/                  # Seeders
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   ├── php/
│   │   └── Dockerfile
│   └── postgres/
│       └── init.sql
├── docs/                         # ← Documentación del proyecto
│   ├── AGENTS_GUIDE.md
│   ├── GOLDEN_RULES.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_CONTRACT.md
│   ├── FEATURES_INDEX.md
│   ├── DEVELOPMENT_GUIDE.md
│   ├── DIRECTORY_STRUCTURE.md
│   └── features/
│       ├── auth/
│       ├── property/
│       ├── resident/
│       ├── dashboard/
│       ├── common-zone/
│       ├── reservation/
│       ├── payment/
│       ├── pqr/
│       ├── notification/
│       ├── chat/
│       └── ingreso/
├── public/
├── resources/
├── routes/
│   ├── api.php                   # Rutas de API
│   └── web.php
├── src/                          # ← Código de dominio (Clean Architecture + DDD)
│   ├── Shared/
│   │   ├── Domain/
│   │   │   ├── ValueObjects/
│   │   │   ├── Exceptions/
│   │   │   ├── Events/
│   │   │   └── Contracts/
│   │   ├── Application/
│   │   │   ├── DTOs/
│   │   │   └── Bus/
│   │   └── Infrastructure/
│   │       ├── Exceptions/
│   │       ├── Persistence/
│   │       ├── Bus/
│   │       ├── Logging/
│   │       └── Middleware/
│   ├── Auth/
│   ├── Property/
│   ├── Resident/
│   ├── Dashboard/
│   ├── CommonZone/
│   ├── Reservation/
│   ├── Payment/
│   ├── PQR/
│   ├── Notification/
│   ├── Chat/
│   └── Ingreso/
├── storage/
├── tests/
│   ├── Unit/
│   │   ├── Shared/
│   │   ├── Auth/
│   │   ├── Property/
│   │   ├── Resident/
│   │   ├── Reservation/
│   │   ├── Payment/
│   │   ├── PQR/
│   │   ├── Notification/
│   │   ├── Chat/
│   │   └── Ingreso/
│   ├── Integration/
│   │   ├── Auth/
│   │   ├── Property/
│   │   └── ...
│   └── Feature/
│       ├── Auth/
│       ├── Property/
│       └── ...
├── vendor/
├── .env
├── .env.example
├── composer.json
├── docker-compose.yml
├── phpunit.xml
├── phpstan.neon
├── pint.json
└── README.md
```

---

## Flujo de Trabajo por Módulo (TDD)

### Paso 1: Definir Contrato (Domain)
```
src/[BoundedContext]/Domain/Entities/
src/[BoundedContext]/Domain/ValueObjects/
src/[BoundedContext]/Domain/Repositories/      (interfaces)
src/[BoundedContext]/Domain/Exceptions/
src/[BoundedContext]/Domain/Events/
```

### Paso 2: Escribir Tests de Dominio (Red)
```bash
# Crear test unitario para entidad/value object
# Ejecutar: debe fallar (Red)
php artisan test tests/Unit/Auth/Domain/Entities/UserTest.php
```

### Paso 3: Implementar Dominio (Green)
```bash
# Implementar entidad/value object
# Ejecutar: debe pasar (Green)
php artisan test tests/Unit/Auth/Domain/Entities/UserTest.php
```

### Paso 4: Refactorizar (Refactor)
```bash
# Mejorar código manteniendo tests verdes
php artisan test tests/Unit/Auth/Domain/
```

### Paso 5: Escribir Tests de Use Case (Red)
```bash
# Crear test para use case con mock de repositorio
php artisan test tests/Unit/Auth/Application/UseCases/LoginUseCaseTest.php
```

### Paso 6: Implementar Use Case (Green)
```bash
# Implementar use case
php artisan test tests/Unit/Auth/Application/UseCases/LoginUseCaseTest.php
```

### Paso 7: Implementar Infraestructura
```
src/[BoundedContext]/Infrastructure/Persistence/     (Eloquent repositories)
src/[BoundedContext]/Infrastructure/Services/        (JWT, Mail, etc.)
src/[BoundedContext]/Infrastructure/Http/
    ├── Controllers/
    ├── Requests/
    └── Resources/
```

### Paso 8: Escribir Tests de Integración
```bash
php artisan test tests/Integration/Auth/Infrastructure/Persistence/
```

### Paso 9: Escribir Tests de Feature (HTTP)
```bash
php artisan test tests/Feature/Auth/Http/AuthControllerTest.php
```

### Paso 10: Agregar Seeders y Factories
```bash
database/factories/ResidentFactory.php
database/seeders/ResidentSeeder.php
```

---

## Comandos Útiles

```bash
# ─── Tests ───
# Ejecutar todos los tests
php artisan test

# Ejecutar tests con cobertura
php artisan test --coverage

# Ejecutar tests de un módulo
php artisan test tests/Unit/Auth/

# Ejecutar tests con filtro
php artisan test --filter=LoginUseCaseTest

# Modo watch (requiere entr)
php artisan test --watch

# ─── Análisis Estático ───
# PHPStan
vendor/bin/phpstan analyse --configuration=phpstan.neon

# Laravel Pint (formateo)
vendor/bin/pint

# Pint con dry-run
vendor/bin/pint --test

# ─── Documentación ───
# Generar docs con Scribe
php artisan scribe:generate

# ─── Migraciones ───
# Crear migration
php artisan make:migration create_residents_table

# Ejecutar migraciones
php artisan migrate

# Rollback última migración
php artisan migrate:rollback

# Resetear todas las migraciones
php artisan migrate:reset

# Fresh (drop + migrate)
php artisan migrate:fresh

# Fresh con seeders
php artisan migrate:fresh --seed

# ─── Seeders ───
# Ejecutar seeder específico
php artisan db:seed --class=ResidentSeeder

# ─── Cache ───
# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# ─── JWT ───
# Generar secreto
php artisan jwt:secret

# ─── Docker ───
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Ejecutar comando en contenedor
docker-compose exec app php artisan migrate

# ─── Laravel ───
# Crear controller
php artisan make:controller AuthController

# Crear model
php artisan make:model Resident

# Crear request (validación)
php artisan make:request LoginRequest

# Crear resource
php artisan make:resource ResidentResource

# Crear middleware
php artisan make:middleware TraceIdMiddleware

# Listar rutas
php artisan route:list

# ─── Optimización Producción ───
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Configuración de Testing

### phpunit.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
>
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory>tests/Integration</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>src</directory>
            <directory>app</directory>
        </include>
    </source>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="pgsql"/>
        <env name="DB_DATABASE" value="urbania_test"/>
        <env name="CACHE_DRIVER" value="array"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
    </php>
</phpunit>
```

### Pest Configuration (pest.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<pest>
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory>src</directory>
        </include>
        <exclude>
            <directory>src/*/Infrastructure/Http</directory>
        </exclude>
    </coverage>
</pest>
```

---

## Configuración de PHPStan (phpstan.neon)

```yaml
includes:
    - vendor/larastan/larastan/extension.neon

parameters:
    level: max
    paths:
        - src
        - app
        - routes
        - tests
    excludePaths:
        - src/*/Infrastructure/Http/Resources/*
        - src/*/Infrastructure/Http/Requests/*
    ignoreErrors:
        - '#Call to an undefined method Illuminate\Database\Eloquent\Builder::#'
    checkMissingIterableValueType: false
```

---

## Configuración de Pint (pint.json)

```json
{
    "preset": "laravel",
    "rules": {
        "declare_strict_types": true,
        "ordered_imports": {
            "sort_algorithm": "alpha"
        },
        "no_unused_imports": true,
        "single_quote": true,
        "trailing_comma_in_multiline": true
    },
    "exclude": [
        "storage",
        "bootstrap",
        "vendor"
    ]
}
```

---

## Configuración de Scribe (scribe.php)

```php
<?php

use Knuckles\Scribe\Extracting\Strategies;

return [
    'title' => 'Urbania API',
    'description' => 'API RESTful para la administración de propiedades horizontales',
    'routes' => [
        [
            'match' => [
                'prefixes' => ['api/v1/*'],
                'domains' => ['*'],
            ],
            'include' => [],
            'exclude' => [],
        ],
    ],
    'type' => 'static',
    'static' => [
        'output_path' => 'public/docs',
    ],
    'auth' => [
        'enabled' => true,
        'default' => false,
        'in' => 'bearer',
        'name' => 'token',
        'use_value' => env('SCRIBE_AUTH_KEY'),
        'placeholder' => 'YOUR_JWT_TOKEN',
        'extra_info' => 'Obtén un token en POST /api/v1/auth/login',
    ],
];
```

---

## Convenciones de Código

### PHP

```php
<?php

declare(strict_types=1);

namespace Urbania\Auth\Domain\UseCases;

// 1. PHP nativo
use DateTimeImmutable;

// 2. Terceros
use Illuminate\Support\Facades\Hash;

// 3. Shared
use Urbania\Shared\Domain\ValueObjects\Uuid;

// 4. Mismo bounded context
use Urbania\Auth\Domain\Entities\User;
use Urbania\Auth\Domain\Repositories\UserRepository;

// 5. Relativos
use ..\ValueObjects\Email;

final class LoginUseCase
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly JwtService $jwtService,
    ) {}

    public function execute(LoginRequestDto $dto): LoginResponseDto
    {
        $user = $this->userRepository->findByEmail($dto->email);

        if ($user === null || !Hash::check($dto->password, $user->passwordHash())) {
            throw new InvalidCredentialsException();
        }

        $token = $this->jwtService->generateToken($user);

        return new LoginResponseDto(
            accessToken: $token,
            user: $user,
        );
    }
}
```

---

## ✅ Checklist de Verificación Post-Implementación

Antes de considerar una tarea completada, verificar:

```bash
# 1. Tests pasan
php artisan test

# 2. Análisis estático pasa
vendor/bin/phpstan analyse

# 3. Formateo correcto
vendor/bin/pint --test

# 4. Verificar que no hay imports entre módulos de dominio
# Buscar: use Urbania\[ModuloA]\ en src/[ModuloB]/Domain/

# 5. Verificar que no se usa mixed sin justificación
# Buscar: ': mixed' en src/

# 6. Verificar que no hay archivos > 200 líneas (dominio) / > 300 (infraestructura)
find src -name '*.php' -exec wc -l {} + | sort -n | tail -10

# 7. Verificar que todas las funciones públicas tienen return type
# PHPStan nivel máximo cubre esto

# 8. Verificar que todos los endpoints están documentados
php artisan scribe:generate

# 9. Verificar migraciones reversibles
php artisan migrate:fresh --seed

# 10. Verificar que el módulo funciona con datos de demo
php artisan db:seed --class=[Modulo]Seeder
```

> **Regla de oro**: Si `php artisan test` o `vendor/bin/phpstan analyse` fallan, la tarea NO está completa.
