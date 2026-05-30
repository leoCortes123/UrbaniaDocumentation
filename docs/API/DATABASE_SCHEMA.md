# 🗄️ DATABASE_SCHEMA
## Esquema de Base de Datos de Urbania API

> **Consultar**: Si la tarea involucra tablas, relaciones, migraciones, o modificaciones de esquema.
> **Relacionado con**: ARCHITECTURE.md, API_CONTRACT.md, FEATURES_INDEX.md

---

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Tablas | snake_case, plural | `residents`, `common_zone_reservations` |
| Columnas | snake_case | `first_name`, `created_at` |
| Claves primarias | `id` (UUID v4) | `550e8400-e29b-41d4-a716-446655440000` |
| Claves foráneas | `{tabla_singular}_id` | `resident_id`, `property_id` |
| Timestamps | `created_at`, `updated_at` | Laravel automático |
| Soft deletes | `deleted_at` | Laravel automático |
| Índices | `idx_{tabla}_{columnas}` | `idx_residents_email` |
| Constraints | `fk_{tabla}_{columna}` | `fk_reservations_resident_id` |
| Enums BD | `{tabla}_{columna}_enum` | `residents_role_enum` |

---

## Tablas Detalladas

### 1. properties

Información de la propiedad horizontal (conjunto residencial).

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `name` | `varchar(255)` | NO | — | — | Nombre del conjunto |
| `address` | `text` | NO | — | — | Dirección completa |
| `total_units` | `integer` | NO | — | — | Total de unidades/apartamentos |
| `admin_name` | `varchar(255)` | NO | — | — | Nombre del administrador |
| `admin_phone` | `varchar(20)` | YES | NULL | — | Teléfono del administrador |
| `admin_email` | `varchar(255)` | YES | NULL | — | Email del administrador |
| `logo_url` | `varchar(500)` | YES | NULL | — | URL del logo |
| `settings` | `jsonb` | YES | `{}` | — | Configuración adicional |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Índices:**
- `PRIMARY KEY (id)`
- `idx_properties_name` (name)

**Constraints:**
- `chk_properties_total_units_positive` CHECK (total_units > 0)

---

### 2. residents

Usuarios residentes y administradores de la propiedad.

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `property_id` | `uuid` | NO | — | FK → properties | Propiedad asociada |
| `name` | `varchar(255)` | NO | — | — | Nombre completo |
| `email` | `varchar(255)` | NO | — | UNIQUE | Email único |
| `password_hash` | `varchar(255)` | NO | — | — | Hash de contraseña (bcrypt) |
| `phone` | `varchar(20)` | YES | NULL | — | Teléfono |
| `unit` | `varchar(50)` | NO | — | — | Número de apartamento/oficina |
| `avatar_url` | `varchar(500)` | YES | NULL | — | URL de foto de perfil |
| `role` | `residents_role_enum` | NO | `'resident'` | — | `admin`, `resident` |
| `status` | `residents_status_enum` | NO | `'active'` | — | `active`, `inactive`, `pending` |
| `email_verified_at` | `timestamp` | YES | NULL | — | Verificación de email |
| `last_login_at` | `timestamp` | YES | NULL | — | Último login |
| `remember_token` | `varchar(100)` | YES | NULL | — | Token de "remember me" |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Enums:**
```sql
CREATE TYPE residents_role_enum AS ENUM ('admin', 'resident');
CREATE TYPE residents_status_enum AS ENUM ('active', 'inactive', 'pending');
```

**Índices:**
- `PRIMARY KEY (id)`
- `idx_residents_email` (email) - UNIQUE
- `idx_residents_property_id` (property_id)
- `idx_residents_role` (role)
- `idx_residents_status` (status)
- `idx_residents_property_unit` (property_id, unit) - UNIQUE

**Constraints:**
- `fk_residents_property_id` FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT
- `chk_residents_email_format` CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{`{2,}`}$')

---

### 3. common_zones

Zonas comunes disponibles para reserva (salón social, piscina, etc.).

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `property_id` | `uuid` | NO | — | FK → properties | Propiedad asociada |
| `name` | `varchar(100)` | NO | — | — | Nombre de la zona |
| `description` | `text` | YES | NULL | — | Descripción detallada |
| `capacity` | `integer` | YES | NULL | — | Capacidad máxima de personas |
| `opening_hours` | `jsonb` | YES | NULL | — | Horarios por día de semana |
| `rules` | `text` | YES | NULL | — | Reglas de uso |
| `image_url` | `varchar(500)` | YES | NULL | — | Imagen representativa |
| `status` | `common_zones_status_enum` | NO | `'active'` | — | `active`, `maintenance`, `inactive` |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Enums:**
```sql
CREATE TYPE common_zones_status_enum AS ENUM ('active', 'maintenance', 'inactive');
```

**Índices:**
- `PRIMARY KEY (id)`
- `idx_common_zones_property_id` (property_id)
- `idx_common_zones_status` (status)

**Constraints:**
- `fk_common_zones_property_id` FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
- `chk_common_zones_capacity_positive` CHECK (capacity IS NULL OR capacity > 0)

---

### 4. reservations

Reservas de zonas comunes por los residentes.

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `resident_id` | `uuid` | NO | — | FK → residents | Residente que reserva |
| `zone_id` | `uuid` | NO | — | FK → common_zones | Zona reservada |
| `date` | `date` | NO | — | — | Fecha de la reserva |
| `start_time` | `time` | NO | — | — | Hora de inicio |
| `end_time` | `time` | NO | — | — | Hora de fin |
| `status` | `reservations_status_enum` | NO | `'pending'` | — | `pending`, `confirmed`, `cancelled`, `completed` |
| `notes` | `text` | YES | NULL | — | Notas adicionales |
| `cancelled_at` | `timestamp` | YES | NULL | — | Fecha de cancelación |
| `cancelled_reason` | `text` | YES | NULL | — | Motivo de cancelación |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Enums:**
```sql
CREATE TYPE reservations_status_enum AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
```

**Índices:**
- `PRIMARY KEY (id)`
- `idx_reservations_resident_id` (resident_id)
- `idx_reservations_zone_id` (zone_id)
- `idx_reservations_date` (date)
- `idx_reservations_status` (status)
- `idx_reservations_zone_date` (zone_id, date)

**Constraints:**
- `fk_reservations_resident_id` FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE RESTRICT
- `fk_reservations_zone_id` FOREIGN KEY (zone_id) REFERENCES common_zones(id) ON DELETE RESTRICT
- `chk_reservations_time_valid` CHECK (start_time < end_time)
- `chk_reservations_date_future` CHECK (date >= CURRENT_DATE OR status != 'pending')

---

### 5. payments

Pagos y administración de cuotas de los residentes.

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `resident_id` | `uuid` | NO | — | FK → residents | Residente que paga |
| `property_id` | `uuid` | NO | — | FK → properties | Propiedad |
| `concept` | `varchar(255)` | NO | — | — | Concepto del pago |
| `amount` | `decimal(12,2)` | NO | — | — | Monto |
| `currency` | `varchar(3)` | NO | `'COP'` | — | Moneda (ISO 4217) |
| `due_date` | `date` | NO | — | — | Fecha de vencimiento |
| `paid_at` | `timestamp` | YES | NULL | — | Fecha de pago |
| `payment_method` | `varchar(50)` | YES | NULL | — | Método de pago |
| `payment_reference` | `varchar(255)` | YES | NULL | — | Referencia de transacción |
| `status` | `payments_status_enum` | NO | `'pending'` | — | `pending`, `paid`, `overdue`, `cancelled` |
| `receipt_url` | `varchar(500)` | YES | NULL | — | URL del comprobante |
| `notes` | `text` | YES | NULL | — | Notas |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Enums:**
```sql
CREATE TYPE payments_status_enum AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
```

**Índices:**
- `PRIMARY KEY (id)`
- `idx_payments_resident_id` (resident_id)
- `idx_payments_property_id` (property_id)
- `idx_payments_status` (status)
- `idx_payments_due_date` (due_date)
- `idx_payments_resident_status` (resident_id, status)

**Constraints:**
- `fk_payments_resident_id` FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE RESTRICT
- `fk_payments_property_id` FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT
- `chk_payments_amount_positive` CHECK (amount > 0)

---

### 6. pqrs

Peticiones, Quejas, Reclamos y Sugerencias de los residentes.

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `resident_id` | `uuid` | NO | — | FK → residents | Residente que crea el PQR |
| `property_id` | `uuid` | NO | — | FK → properties | Propiedad |
| `type` | `pqrs_type_enum` | NO | — | — | `petition`, `complaint`, `claim`, `suggestion` |
| `subject` | `varchar(255)` | NO | — | — | Asunto |
| `description` | `text` | NO | — | — | Descripción detallada |
| `status` | `pqrs_status_enum` | NO | `'received'` | — | `received`, `in_progress`, `resolved`, `closed`, `rejected` |
| `priority` | `pqrs_priority_enum` | NO | `'medium'` | — | `low`, `medium`, `high`, `urgent` |
| `assigned_to` | `uuid` | YES | NULL | FK → residents | Admin asignado |
| `response` | `text` | YES | NULL | — | Respuesta del admin |
| `resolved_at` | `timestamp` | YES | NULL | — | Fecha de resolución |
| `attachment_urls` | `jsonb` | YES | `[]` | — | URLs de adjuntos |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Enums:**
```sql
CREATE TYPE pqrs_type_enum AS ENUM ('petition', 'complaint', 'claim', 'suggestion');
CREATE TYPE pqrs_status_enum AS ENUM ('received', 'in_progress', 'resolved', 'closed', 'rejected');
CREATE TYPE pqrs_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
```

**Índices:**
- `PRIMARY KEY (id)`
- `idx_pqrs_resident_id` (resident_id)
- `idx_pqrs_property_id` (property_id)
- `idx_pqrs_type` (type)
- `idx_pqrs_status` (status)
- `idx_pqrs_priority` (priority)
- `idx_pqrs_assigned_to` (assigned_to)
- `idx_pqrs_created_at` (created_at)

**Constraints:**
- `fk_pqrs_resident_id` FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE RESTRICT
- `fk_pqrs_property_id` FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT
- `fk_pqrs_assigned_to` FOREIGN KEY (assigned_to) REFERENCES residents(id) ON DELETE SET NULL

---

### 7. notifications

Notificaciones push y locales para los residentes.

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `resident_id` | `uuid` | NO | — | FK → residents | Residente destinatario |
| `property_id` | `uuid` | NO | — | FK → properties | Propiedad |
| `type` | `notifications_type_enum` | NO | — | — | `payment_reminder`, `reservation_confirmed`, `pqr_update`, `general`, `system`, `chat` |
| `title` | `varchar(255)` | NO | — | — | Título |
| `message` | `text` | NO | — | — | Mensaje |
| `data` | `jsonb` | YES | `{}` | — | Datos adicionales (payload) |
| `action_url` | `varchar(500)` | YES | NULL | — | URL de acción |
| `read_at` | `timestamp` | YES | NULL | — | Fecha de lectura |
| `sent_at` | `timestamp` | YES | NULL | — | Fecha de envío |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Enums:**
```sql
CREATE TYPE notifications_type_enum AS ENUM (
    'payment_reminder',
    'reservation_confirmed',
    'reservation_cancelled',
    'pqr_update',
    'general',
    'system',
    'chat',
    'ingreso_approved',
    'ingreso_rejected'
);
```

**Índices:**
- `PRIMARY KEY (id)`
- `idx_notifications_resident_id` (resident_id)
- `idx_notifications_property_id` (property_id)
- `idx_notifications_type` (type)
- `idx_notifications_read_at` (read_at)
- `idx_notifications_created_at` (created_at)
- `idx_notifications_resident_read` (resident_id, read_at)

**Constraints:**
- `fk_notifications_resident_id` FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE
- `fk_notifications_property_id` FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE

---

### 8. chat_messages

Mensajes del chat entre residentes y administración.

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `sender_id` | `uuid` | NO | — | FK → residents | Remitente |
| `receiver_id` | `uuid` | YES | NULL | FK → residents | Destinatario (NULL = broadcast a admins) |
| `property_id` | `uuid` | NO | — | FK → properties | Propiedad |
| `message` | `text` | NO | — | — | Contenido del mensaje |
| `attachment_url` | `varchar(500)` | YES | NULL | — | URL de adjunto |
| `attachment_type` | `varchar(50)` | YES | NULL | — | `image`, `document`, `audio` |
| `read_at` | `timestamp` | YES | NULL | — | Fecha de lectura |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Índices:**
- `PRIMARY KEY (id)`
- `idx_chat_messages_sender_id` (sender_id)
- `idx_chat_messages_receiver_id` (receiver_id)
- `idx_chat_messages_property_id` (property_id)
- `idx_chat_messages_created_at` (created_at)
- `idx_chat_messages_conversation` (sender_id, receiver_id, created_at)

**Constraints:**
- `fk_chat_messages_sender_id` FOREIGN KEY (sender_id) REFERENCES residents(id) ON DELETE RESTRICT
- `fk_chat_messages_receiver_id` FOREIGN KEY (receiver_id) REFERENCES residents(id) ON DELETE SET NULL
- `fk_chat_messages_property_id` FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE

---

### 9. ingresos

Control de ingresos y visitas de los residentes.

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `uuid` | NO | `gen_random_uuid()` | PK | Identificador único |
| `resident_id` | `uuid` | NO | — | FK → residents | Residente que registra |
| `property_id` | `uuid` | NO | — | FK → properties | Propiedad |
| `visitor_name` | `varchar(255)` | NO | — | — | Nombre del visitante |
| `visitor_phone` | `varchar(20)` | YES | NULL | — | Teléfono del visitante |
| `visitor_id_number` | `varchar(50)` | YES | NULL | — | Número de identificación |
| `visit_type` | `ingresos_type_enum` | NO | `'visit'` | — | `visit`, `delivery`, `service`, `family`, `other` |
| `expected_date` | `date` | NO | — | — | Fecha esperada |
| `expected_time` | `time` | YES | NULL | — | Hora esperada |
| `actual_entry_at` | `timestamp` | YES | NULL | — | Fecha/hora real de entrada |
| `actual_exit_at` | `timestamp` | YES | NULL | — | Fecha/hora real de salida |
| `status` | `ingresos_status_enum` | NO | `'pending'` | — | `pending`, `approved`, `rejected`, `completed`, `expired` |
| `approved_by` | `uuid` | YES | NULL | FK → residents | Admin que aprueba |
| `notes` | `text` | YES | NULL | — | Notas |
| `vehicle_plate` | `varchar(20)` | YES | NULL | — | Placa del vehículo |
| `created_at` | `timestamp` | NO | `now()` | — | — |
| `updated_at` | `timestamp` | NO | `now()` | — | — |
| `deleted_at` | `timestamp` | YES | NULL | — | Soft delete |

**Enums:**
```sql
CREATE TYPE ingresos_type_enum AS ENUM ('visit', 'delivery', 'service', 'family', 'other');
CREATE TYPE ingresos_status_enum AS ENUM ('pending', 'approved', 'rejected', 'completed', 'expired');
```

**Índices:**
- `PRIMARY KEY (id)`
- `idx_ingresos_resident_id` (resident_id)
- `idx_ingresos_property_id` (property_id)
- `idx_ingresos_status` (status)
- `idx_ingresos_expected_date` (expected_date)
- `idx_ingresos_approved_by` (approved_by)

**Constraints:**
- `fk_ingresos_resident_id` FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE RESTRICT
- `fk_ingresos_property_id` FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT
- `fk_ingresos_approved_by` FOREIGN KEY (approved_by) REFERENCES residents(id) ON DELETE SET NULL

---

### 10. password_reset_tokens

Tokens para recuperación de contraseña (tabla nativa de Laravel, adaptada).

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `email` | `varchar(255)` | NO | — | PK | Email del residente |
| `token` | `varchar(255)` | NO | — | — | Token de reset |
| `created_at` | `timestamp` | YES | NULL | — | Fecha de creación |

**Índices:**
- `PRIMARY KEY (email)`
- `idx_password_reset_tokens_token` (token)

---

### 11. personal_access_tokens

Tokens de acceso personal (Sanctum/JWT - tabla nativa de Laravel).

| Columna | Tipo | Nullable | Default | Índice | Descripción |
|---------|------|----------|---------|--------|-------------|
| `id` | `bigserial` | NO | auto | PK | — |
| `tokenable_type` | `varchar(255)` | NO | — | — | Tipo de modelo |
| `tokenable_id` | `uuid` | NO | — | — | ID del modelo |
| `name` | `varchar(255)` | NO | — | — | Nombre del token |
| `token` | `varchar(64)` | NO | — | UNIQUE | Hash del token |
| `abilities` | `text` | YES | NULL | — | Capacidades (JSON) |
| `last_used_at` | `timestamp` | YES | NULL | — | Último uso |
| `expires_at` | `timestamp` | YES | NULL | — | Expiración |
| `created_at` | `timestamp` | YES | NULL | — | — |
| `updated_at` | `timestamp` | YES | NULL | — | — |

**Índices:**
- `PRIMARY KEY (id)`
- `idx_personal_access_tokens_token` (token) - UNIQUE
- `idx_personal_access_tokens_tokenable` (tokenable_type, tokenable_id)

---

## Vistas Materializadas (Opcional - Performance)

### mv_dashboard_metrics

Vista materializada para métricas del dashboard (actualizable cada 5 minutos).

```sql
CREATE MATERIALIZED VIEW mv_dashboard_metrics AS
SELECT
    p.id AS property_id,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'active') AS total_residents,
    COUNT(DISTINCT res.id) FILTER (WHERE res.status = 'confirmed' AND res.date >= CURRENT_DATE) AS upcoming_reservations,
    COUNT(DISTINCT pay.id) FILTER (WHERE pay.status = 'pending') AS pending_payments,
    COUNT(DISTINCT pqr.id) FILTER (WHERE pqr.status IN ('received', 'in_progress')) AS open_pqrs,
    COUNT(DISTINCT n.id) FILTER (WHERE n.read_at IS NULL) AS unread_notifications
FROM properties p
LEFT JOIN residents r ON r.property_id = p.id
LEFT JOIN reservations res ON res.zone_id IN (SELECT id FROM common_zones WHERE property_id = p.id)
LEFT JOIN payments pay ON pay.property_id = p.id
LEFT JOIN pqrs pqr ON pqr.property_id = p.id
LEFT JOIN notifications n ON n.property_id = p.id
GROUP BY p.id;

CREATE UNIQUE INDEX idx_mv_dashboard_metrics_property_id ON mv_dashboard_metrics(property_id);
```

---

## Seeders y Factories

Cada tabla debe tener:
1. **Factory**: Para generar datos de prueba
2. **Seeder**: Para poblar la BD en desarrollo/demo

### Orden de ejecución de Seeders

```
1. PropertySeeder     → Crea 1 propiedad demo
2. ResidentSeeder     → Crea 8 residentes (1 admin, 7 residentes)
3. CommonZoneSeeder   → Crea zonas comunes (salón social, piscina, etc.)
4. ReservationSeeder  → Crea 2 reservas demo
5. PaymentSeeder     → Crea historial de 6 meses
6. PQRSeeder         → Crea 3 PQRS de ejemplo
7. NotificationSeeder → Crea 5 notificaciones
8. ChatMessageSeeder  → Crea conversación demo
9. IngresoSeeder     → Crea registros de ingreso demo
```

### Credenciales Demo

| Rol | Email | Password |
|-----|-------|----------|
| Admin | `admin@urbania.demo` | `Urbania2026!` |
| Residente | `residente@urbania.demo` | `Residente2026!` |

---

## Migraciones Reversibles

Toda migration DEBE implementar el método `down()`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('residents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('property_id')->constrained('properties')->restrictOnDelete();
            $table->string('name', 255);
            $table->string('email', 255)->unique();
            $table->string('password_hash', 255);
            $table->string('phone', 20)->nullable();
            $table->string('unit', 50);
            $table->string('avatar_url', 500)->nullable();
            $table->enum('role', ['admin', 'resident'])->default('resident');
            $table->enum('status', ['active', 'inactive', 'pending'])->default('active');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index('property_id');
            $table->index('email');
            $table->index('role');
            $table->index('status');
            $table->unique(['property_id', 'unit']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
```

---

## Checklist al Modificar el Esquema

- [ ] Revisar impacto en API_CONTRACT.md
- [ ] Crear migration reversible (up + down)
- [ ] Actualizar Factory correspondiente
- [ ] Actualizar Seeder si aplica
- [ ] Actualizar DTOs en Application/
- [ ] Actualizar Resources en Presentation/
- [ ] Actualizar tests unitarios e integración
- [ ] Ejecutar `php artisan migrate:fresh --seed` para verificar
- [ ] Actualizar Laravel Scribe si cambia contrato de API
