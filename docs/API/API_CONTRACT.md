# 🔌 API_CONTRACT
## Contrato de API RESTful de Urbania

> **Consultar**: Si la tarea involucra endpoints nuevos, modificación de request/response, o autenticación.
> **Relacionado con**: ARCHITECTURE.md, DATABASE_SCHEMA.md, FEATURES_INDEX.md

---

## Convenciones Generales

### Base URL
```
Desarrollo:   http://localhost:8080/api/
Producción:   https://api.urbania.com/
```

### Headers Obligatorios
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>    (excepto endpoints públicos)
X-Trace-Id: <uuid>                   (opcional, generado por cliente)
```

### Formato de Respuesta de Éxito
```json
{
  "data": { ... },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Formato de Respuesta de Error
```json
{
  "error": {
    "code": "RESIDENT_NOT_FOUND",
    "message": "El residente solicitado no existe",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Códigos HTTP

| Código | Uso |
|--------|-----|
| 200 OK | GET exitoso, recurso encontrado |
| 201 Created | POST exitoso, recurso creado |
| 204 No Content | DELETE exitoso, PUT sin body |
| 400 Bad Request | Error de validación de negocio |
| 401 Unauthorized | Token inválido o expirado |
| 403 Forbidden | Sin permisos para el recurso |
| 404 Not Found | Recurso no existe |
| 409 Conflict | Conflicto de estado (ej: reserva duplicada) |
| 422 Unprocessable Entity | Error de validación de campos |
| 429 Too Many Requests | Rate limit excedido |
| 500 Internal Server Error | Error del servidor |
| 503 Service Unavailable | Servicio no disponible (health check) |

### Paginación

Todas las listas usan paginación por cursor (recomendado) o offset:

**Request:**
```
GET /api/v1/residents?page=1&per_page=20
```

**Response:**
```json
{
  "data": [ ... ],
  "links": {
    "first": "/api/v1/residents?page=1",
    "last": "/api/v1/residents?page=5",
    "prev": null,
    "next": "/api/v1/residents?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "per_page": 20,
    "to": 20,
    "total": 100,
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### Filtros y Búsqueda

```
GET /api/v1/reservations?status=confirmed&date_from=2026-05-01&date_to=2026-05-31
GET /api/v1/payments?status=pending&resident_id=xxx
GET /api/v1/pqrs?type=complaint&status=in_progress
GET /api/v1/notifications?unread=true
GET /api/v1/residents?search=Juan&role=resident
```

### Ordenamiento

```
GET /api/v1/reservations?sort_by=date&sort_order=asc
GET /api/v1/payments?sort_by=due_date&sort_order=desc
```

---

## 1. Autenticación (`/auth`)

### 1.1 Login
```
POST /api/v1/auth/login
```

**Request:**
```json
{
  "email": "residente@urbania.demo",
  "password": "Residente2026!"
}
```

**Response 200:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Residente Demo",
      "email": "residente@urbania.demo",
      "phone": "3001234567",
      "unit": "Apto 101",
      "role": "resident",
      "status": "active",
      "avatar_url": null,
      "property": {
        "id": "prop-001",
        "name": "Conjunto Residencial Los Pinos",
        "address": "Calle 123 # 45-67, Bogotá"
      }
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 401:**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Las credenciales proporcionadas son incorrectas",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 1.2 Register
```
POST /api/v1/auth/register
```

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@email.com",
  "password": "SecurePass123!",
  "password_confirmation": "SecurePass123!",
  "phone": "3001234567",
  "unit": "Apto 205",
  "property_id": "prop-001"
}
```

**Response 201:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Juan Pérez",
    "email": "juan.perez@email.com",
    "phone": "3001234567",
    "unit": "Apto 205",
    "role": "resident",
    "status": "pending",
    "message": "Registro exitoso. Espera la aprobación del administrador."
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 1.3 Logout
```
POST /api/v1/auth/logout
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 204:** (No Content)

### 1.4 Refresh Token
```
POST /api/v1/auth/refresh
```

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response 200:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "bearer",
    "expires_in": 3600
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 1.5 Me (Perfil Actual)
```
GET /api/v1/auth/me
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response 200:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Residente Demo",
    "email": "residente@urbania.demo",
    "phone": "3001234567",
    "unit": "Apto 101",
    "role": "resident",
    "status": "active",
    "avatar_url": null,
    "property": {
      "id": "prop-001",
      "name": "Conjunto Residencial Los Pinos",
      "address": "Calle 123 # 45-67, Bogotá",
      "total_units": 48,
      "admin_name": "Admin Demo",
      "admin_phone": "3001234567"
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 1.6 Forgot Password
```
POST /api/v1/auth/forgot-password
```

**Request:**
```json
{
  "email": "residente@urbania.demo"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "Se ha enviado un enlace de recuperación a tu correo electrónico"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 1.7 Reset Password
```
POST /api/v1/auth/reset-password
```

**Request:**
```json
{
  "token": "reset-token-from-email",
  "email": "residente@urbania.demo",
  "password": "NewPassword123!",
  "password_confirmation": "NewPassword123!"
}
```

**Response 200:**
```json
{
  "data": {
    "message": "Contraseña actualizada exitosamente"
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## 2. Residentes (`/residents`)

### 2.1 Listar Residentes
```
GET /api/v1/residents
```

**Query Params:**
```
?search=Juan&role=resident&status=active&page=1&per_page=20
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Juan Pérez",
      "email": "juan@email.com",
      "phone": "3001234567",
      "unit": "Apto 101",
      "role": "resident",
      "status": "active",
      "avatar_url": null
    }
  ],
  "links": { ... },
  "meta": { ... }
}
```

### 2.2 Obtener Residente
```
GET /api/v1/residents/{id}
```

**Response 200:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "phone": "3001234567",
    "unit": "Apto 101",
    "role": "resident",
    "status": "active",
    "avatar_url": null,
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-05-20T14:30:00Z"
  },
  "meta": { ... }
}
```

### 2.3 Actualizar Residente (Admin o Propio)
```
PUT /api/v1/residents/{id}
```

**Request:**
```json
{
  "name": "Juan Pérez Actualizado",
  "phone": "3009876543",
  "avatar_url": "https://..."
}
```

**Response 200:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez Actualizado",
    "phone": "3009876543",
    "avatar_url": "https://...",
    "updated_at": "2026-05-20T15:00:00Z"
  },
  "meta": { ... }
}
```

### 2.4 Cambiar Estado (Admin)
```
PATCH /api/v1/residents/{id}/status
```

**Request:**
```json
{
  "status": "inactive"
}
```

**Response 200:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "inactive",
    "message": "Estado actualizado exitosamente"
  },
  "meta": { ... }
}
```

---

## 3. Dashboard (`/dashboard`)

### 3.1 Métricas del Dashboard
```
GET /api/v1/dashboard/metrics
```

**Response 200:**
```json
{
  "data": {
    "total_residents": 8,
    "upcoming_reservations": 2,
    "pending_payments": 3,
    "open_pqrs": 1,
    "unread_notifications": 5,
    "property": {
      "id": "prop-001",
      "name": "Conjunto Residencial Los Pinos",
      "total_units": 48,
      "admin_name": "Admin Demo",
      "admin_phone": "3001234567"
    }
  },
  "meta": { ... }
}
```

### 3.2 Acciones Rápidas
```
GET /api/v1/dashboard/quick-actions
```

**Response 200:**
```json
{
  "data": {
    "actions": [
      {
        "id": "action_reservation",
        "label": "Nueva Reserva",
        "icon": "calendar",
        "route": "/reservations/create"
      },
      {
        "id": "action_payment",
        "label": "Ver Pagos",
        "icon": "credit_card",
        "route": "/payments"
      },
      {
        "id": "action_pqr",
        "label": "Nuevo PQR",
        "icon": "message_square",
        "route": "/pqrs/create"
      },
      {
        "id": "action_ingreso",
        "label": "Registrar Ingreso",
        "icon": "log_in",
        "route": "/ingresos/create"
      }
    ]
  },
  "meta": { ... }
}
```

---

## 4. Zonas Comunes (`/common-zones`)

### 4.1 Listar Zonas
```
GET /api/v1/common-zones
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "zone-001",
      "name": "Salón Social",
      "description": "Salón para eventos sociales, capacidad 50 personas",
      "capacity": 50,
      "opening_hours": {
        "monday": "08:00-22:00",
        "tuesday": "08:00-22:00",
        "wednesday": "08:00-22:00",
        "thursday": "08:00-22:00",
        "friday": "08:00-23:00",
        "saturday": "08:00-23:00",
        "sunday": "09:00-20:00"
      },
      "rules": "No se permite música después de las 22:00",
      "image_url": "https://...",
      "status": "active"
    }
  ],
  "meta": { ... }
}
```

### 4.2 Obtener Zona
```
GET /api/v1/common-zones/{id}
```

### 4.3 Crear Zona (Admin)
```
POST /api/v1/common-zones
```

**Request:**
```json
{
  "name": "Gimnasio",
  "description": "Gimnasio equipado",
  "capacity": 20,
  "opening_hours": {
    "monday": "06:00-21:00",
    "tuesday": "06:00-21:00"
  },
  "rules": "Usar toalla obligatoria",
  "image_url": "https://..."
}
```

### 4.4 Actualizar Zona (Admin)
```
PUT /api/v1/common-zones/{id}
```

### 4.5 Eliminar Zona (Admin)
```
DELETE /api/v1/common-zones/{id}
```

---

## 5. Reservas (`/reservations`)

### 5.1 Listar Reservas
```
GET /api/v1/reservations
```

**Query Params:**
```
?status=confirmed&date_from=2026-05-01&date_to=2026-05-31&zone_id=zone-001
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "resv-001",
      "zone": {
        "id": "zone-001",
        "name": "Salón Social"
      },
      "resident": {
        "id": "res-001",
        "name": "Residente Demo",
        "unit": "Apto 101"
      },
      "date": "2026-05-22",
      "start_time": "14:00",
      "end_time": "18:00",
      "status": "confirmed",
      "notes": "Cumpleaños familiar"
    }
  ],
  "meta": { ... }
}
```

### 5.2 Obtener Reserva
```
GET /api/v1/reservations/{id}
```

### 5.3 Crear Reserva
```
POST /api/v1/reservations
```

**Request:**
```json
{
  "zone_id": "zone-001",
  "date": "2026-05-25",
  "start_time": "14:00",
  "end_time": "18:00",
  "notes": "Reunión de vecinos"
}
```

**Response 201:**
```json
{
  "data": {
    "id": "resv-003",
    "zone": { "id": "zone-001", "name": "Salón Social" },
    "resident": { "id": "res-001", "name": "Residente Demo", "unit": "Apto 101" },
    "date": "2026-05-25",
    "start_time": "14:00",
    "end_time": "18:00",
    "status": "pending",
    "notes": "Reunión de vecinos",
    "message": "Reserva creada. Espera confirmación del administrador."
  },
  "meta": { ... }
}
```

**Response 409:**
```json
{
  "error": {
    "code": "RESERVATION_CONFLICT",
    "message": "La zona ya está reservada en ese horario",
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### 5.4 Cancelar Reserva
```
PATCH /api/v1/reservations/{id}/cancel
```

**Request:**
```json
{
  "reason": "Cambio de planes"
}
```

**Response 200:**
```json
{
  "data": {
    "id": "resv-001",
    "status": "cancelled",
    "cancelled_at": "2026-05-20T16:00:00Z",
    "cancelled_reason": "Cambio de planes"
  },
  "meta": { ... }
}
```

### 5.5 Confirmar Reserva (Admin)
```
PATCH /api/v1/reservations/{id}/confirm
```

**Response 200:**
```json
{
  "data": {
    "id": "resv-001",
    "status": "confirmed",
    "message": "Reserva confirmada exitosamente"
  },
  "meta": { ... }
}
```

---

## 6. Pagos (`/payments`)

### 6.1 Listar Pagos
```
GET /api/v1/payments
```

**Query Params:**
```
?status=pending&resident_id=xxx&date_from=2026-01-01&date_to=2026-12-31
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "pay-001",
      "resident": {
        "id": "res-001",
        "name": "Residente Demo",
        "unit": "Apto 101"
      },
      "concept": "Cuota administrativa - Mayo 2026",
      "amount": 250000.00,
      "currency": "COP",
      "due_date": "2026-05-15",
      "paid_at": null,
      "payment_method": null,
      "payment_reference": null,
      "status": "pending",
      "receipt_url": null
    }
  ],
  "meta": { ... }
}
```

### 6.2 Obtener Pago
```
GET /api/v1/payments/{id}
```

### 6.3 Registrar Pago (Admin)
```
POST /api/v1/payments
```

**Request:**
```json
{
  "resident_id": "res-001",
  "concept": "Cuota administrativa - Junio 2026",
  "amount": 250000.00,
  "currency": "COP",
  "due_date": "2026-06-15"
}
```

### 6.4 Marcar como Pagado
```
PATCH /api/v1/payments/{id}/pay
```

**Request:**
```json
{
  "payment_method": "transfer",
  "payment_reference": "TRX-123456789",
  "receipt_url": "https://..."
}
```

**Response 200:**
```json
{
  "data": {
    "id": "pay-001",
    "status": "paid",
    "paid_at": "2026-05-20T16:00:00Z",
    "payment_method": "transfer",
    "payment_reference": "TRX-123456789"
  },
  "meta": { ... }
}
```

---

## 7. PQRS (`/pqrs`)

### 7.1 Listar PQRS
```
GET /api/v1/pqrs
```

**Query Params:**
```
?type=complaint&status=in_progress&priority=high&resident_id=xxx
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "pqr-001",
      "resident": {
        "id": "res-001",
        "name": "Residente Demo",
        "unit": "Apto 101"
      },
      "type": "complaint",
      "subject": "Ruido excesivo en zona común",
      "description": "Durante la noche del viernes hubo mucho ruido...",
      "status": "in_progress",
      "priority": "high",
      "assigned_to": {
        "id": "admin-001",
        "name": "Admin Demo"
      },
      "response": "Estamos investigando el incidente...",
      "resolved_at": null,
      "attachment_urls": ["https://..."],
      "created_at": "2026-05-15T10:00:00Z"
    }
  ],
  "meta": { ... }
}
```

### 7.2 Obtener PQR
```
GET /api/v1/pqrs/{id}
```

### 7.3 Crear PQR
```
POST /api/v1/pqrs
```

**Request:**
```json
{
  "type": "suggestion",
  "subject": "Instalar más iluminación",
  "description": "Sugiero instalar más lámparas en el parqueadero...",
  "priority": "medium",
  "attachment_urls": ["https://..."]
}
```

**Response 201:**
```json
{
  "data": {
    "id": "pqr-004",
    "type": "suggestion",
    "subject": "Instalar más iluminación",
    "status": "received",
    "priority": "medium",
    "message": "PQR recibido. Te notificaremos cuando sea atendido."
  },
  "meta": { ... }
}
```

### 7.4 Responder PQR (Admin)
```
PATCH /api/v1/pqrs/{id}/respond
```

**Request:**
```json
{
  "response": "Gracias por tu sugerencia. La incluiremos en el próximo presupuesto.",
  "status": "resolved"
}
```

### 7.5 Asignar PQR (Admin)
```
PATCH /api/v1/pqrs/{id}/assign
```

**Request:**
```json
{
  "assigned_to": "admin-002"
}
```

---

## 8. Notificaciones (`/notifications`)

### 8.1 Listar Notificaciones
```
GET /api/v1/notifications
```

**Query Params:**
```
?unread=true&type=payment_reminder&page=1&per_page=20
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "notif-001",
      "type": "payment_reminder",
      "title": "Pago pendiente",
      "message": "Tienes un pago pendiente por $250,000 COP vencido el 15 de mayo",
      "data": {
        "payment_id": "pay-001",
        "amount": 250000,
        "currency": "COP",
        "due_date": "2026-05-15"
      },
      "action_url": "/payments/pay-001",
      "read_at": null,
      "created_at": "2026-05-16T08:00:00Z"
    }
  ],
  "meta": { ... }
}
```

### 8.2 Marcar como Leída
```
PATCH /api/v1/notifications/{id}/read
```

**Response 200:**
```json
{
  "data": {
    "id": "notif-001",
    "read_at": "2026-05-20T16:00:00Z"
  },
  "meta": { ... }
}
```

### 8.3 Marcar Todas como Leídas
```
PATCH /api/v1/notifications/read-all
```

**Response 200:**
```json
{
  "data": {
    "message": "Todas las notificaciones marcadas como leídas",
    "count": 5
  },
  "meta": { ... }
}
```

### 8.4 Contador de No Leídas
```
GET /api/v1/notifications/unread-count
```

**Response 200:**
```json
{
  "data": {
    "count": 5
  },
  "meta": { ... }
}
```

---

## 9. Chat (`/chat`)

### 9.1 Listar Conversaciones
```
GET /api/v1/chat/conversations
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "conv-001",
      "participant": {
        "id": "admin-001",
        "name": "Admin Demo",
        "avatar_url": null,
        "role": "admin"
      },
      "last_message": {
        "id": "msg-005",
        "message": "Perfecto, quedamos atentos",
        "created_at": "2026-05-20T14:30:00Z",
        "read_at": null
      },
      "unread_count": 2
    }
  ],
  "meta": { ... }
}
```

### 9.2 Listar Mensajes de Conversación
```
GET /api/v1/chat/conversations/{resident_id}/messages
```

**Query Params:**
```
?page=1&per_page=50
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "msg-001",
      "sender": {
        "id": "res-001",
        "name": "Residente Demo",
        "avatar_url": null
      },
      "message": "Hola, tengo una consulta sobre el pago de la cuota",
      "attachment_url": null,
      "attachment_type": null,
      "read_at": "2026-05-20T10:05:00Z",
      "created_at": "2026-05-20T10:00:00Z"
    }
  ],
  "meta": { ... }
}
```

### 9.3 Enviar Mensaje
```
POST /api/v1/chat/messages
```

**Request:**
```json
{
  "receiver_id": "admin-001",
  "message": "Hola, ¿podrían confirmar mi reserva?",
  "attachment_url": null,
  "attachment_type": null
}
```

**Response 201:**
```json
{
  "data": {
    "id": "msg-006",
    "sender": {
      "id": "res-001",
      "name": "Residente Demo"
    },
    "receiver": {
      "id": "admin-001",
      "name": "Admin Demo"
    },
    "message": "Hola, ¿podrían confirmar mi reserva?",
    "read_at": null,
    "created_at": "2026-05-20T16:00:00Z"
  },
  "meta": { ... }
}
```

---

## 10. Ingresos (`/ingresos`)

### 10.1 Listar Ingresos
```
GET /api/v1/ingresos
```

**Query Params:**
```
?status=pending&resident_id=xxx&expected_date=2026-05-25
```

**Response 200:**
```json
{
  "data": [
    {
      "id": "ing-001",
      "resident": {
        "id": "res-001",
        "name": "Residente Demo",
        "unit": "Apto 101"
      },
      "visitor_name": "Carlos Gómez",
      "visitor_phone": "3009876543",
      "visitor_id_number": "1234567890",
      "visit_type": "visit",
      "expected_date": "2026-05-25",
      "expected_time": "15:00",
      "actual_entry_at": null,
      "actual_exit_at": null,
      "status": "pending",
      "vehicle_plate": "ABC123",
      "notes": "Visita familiar",
      "created_at": "2026-05-20T10:00:00Z"
    }
  ],
  "meta": { ... }
}
```

### 10.2 Crear Ingreso
```
POST /api/v1/ingresos
```

**Request:**
```json
{
  "visitor_name": "Carlos Gómez",
  "visitor_phone": "3009876543",
  "visitor_id_number": "1234567890",
  "visit_type": "visit",
  "expected_date": "2026-05-25",
  "expected_time": "15:00",
  "vehicle_plate": "ABC123",
  "notes": "Visita familiar"
}
```

**Response 201:**
```json
{
  "data": {
    "id": "ing-002",
    "visitor_name": "Carlos Gómez",
    "status": "pending",
    "message": "Ingreso registrado. Espera aprobación del portero/administrador."
  },
  "meta": { ... }
}
```

### 10.3 Aprobar Ingreso (Admin/Portero)
```
PATCH /api/v1/ingresos/{id}/approve
```

**Response 200:**
```json
{
  "data": {
    "id": "ing-002",
    "status": "approved",
    "approved_by": {
      "id": "admin-001",
      "name": "Admin Demo"
    },
    "message": "Ingreso aprobado"
  },
  "meta": { ... }
}
```

### 10.4 Registrar Entrada
```
PATCH /api/v1/ingresos/{id}/entry
```

**Response 200:**
```json
{
  "data": {
    "id": "ing-002",
    "actual_entry_at": "2026-05-25T15:05:00Z",
    "status": "completed"
  },
  "meta": { ... }
}
```

### 10.5 Registrar Salida
```
PATCH /api/v1/ingresos/{id}/exit
```

**Response 200:**
```json
{
  "data": {
    "id": "ing-002",
    "actual_exit_at": "2026-05-25T18:30:00Z",
    "status": "completed"
  },
  "meta": { ... }
}
```

---

## 11. Health Check (`/health`)

### 11.1 Health Check
```
GET /api/v1/health
```

**Response 200 (Healthy):**
```json
{
  "data": {
    "status": "healthy",
    "timestamp": "2026-05-20T16:00:00Z",
    "checks": {
      "database": {
        "healthy": true,
        "message": "Connected"
      },
      "redis": {
        "healthy": true,
        "message": "Connected"
      },
      "storage": {
        "healthy": true,
        "message": "Writable"
      }
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response 503 (Unhealthy):**
```json
{
  "data": {
    "status": "unhealthy",
    "timestamp": "2026-05-20T16:00:00Z",
    "checks": {
      "database": {
        "healthy": false,
        "message": "Connection refused"
      },
      "redis": {
        "healthy": true,
        "message": "Connected"
      },
      "storage": {
        "healthy": true,
        "message": "Writable"
      }
    }
  },
  "meta": {
    "trace_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Códigos de Error Completos

| Código | HTTP | Descripción |
|--------|------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email o contraseña incorrectos |
| `TOKEN_EXPIRED` | 401 | El token JWT ha expirado |
| `TOKEN_INVALID` | 401 | El token JWT es inválido |
| `UNAUTHORIZED` | 401 | No autenticado |
| `FORBIDDEN` | 403 | Sin permisos para esta acción |
| `RESIDENT_NOT_FOUND` | 404 | Residente no encontrado |
| `PROPERTY_NOT_FOUND` | 404 | Propiedad no encontrada |
| `ZONE_NOT_FOUND` | 404 | Zona común no encontrada |
| `RESERVATION_NOT_FOUND` | 404 | Reserva no encontrada |
| `PAYMENT_NOT_FOUND` | 404 | Pago no encontrado |
| `PQR_NOT_FOUND` | 404 | PQR no encontrado |
| `NOTIFICATION_NOT_FOUND` | 404 | Notificación no encontrada |
| `INGRESO_NOT_FOUND` | 404 | Ingreso no encontrado |
| `RESERVATION_CONFLICT` | 409 | Zona ya reservada en ese horario |
| `EMAIL_ALREADY_EXISTS` | 409 | El email ya está registrado |
| `UNIT_ALREADY_ASSIGNED` | 409 | La unidad ya tiene un residente activo |
| `VALIDATION_ERROR` | 422 | Error de validación de campos |
| `DATABASE_ERROR` | 500 | Error de base de datos |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

---

## Rate Limiting

| Endpoint | Límite | Ventana |
|----------|--------|---------|
| `POST /auth/login` | 5 intentos | 1 minuto |
| `POST /auth/register` | 3 intentos | 1 hora |
| `POST /auth/forgot-password` | 3 intentos | 1 hora |
| API general (autenticado) | 1000 requests | 1 hora |
| API general (no autenticado) | 60 requests | 1 hora |

---

## Checklist al Agregar/Modificar Endpoint

- [ ] Documentar request/response en este archivo
- [ ] Crear/actualizar Controller
- [ ] Crear/actualizar Request (validación)
- [ ] Crear/actualizar Resource (serialización)
- [ ] Crear/actualizar Use Case
- [ ] Escribir tests de feature (HTTP)
- [ ] Escribir tests de integración
- [ ] Actualizar Laravel Scribe
- [ ] Verificar rate limiting
- [ ] Verificar permisos/roles
- [ ] Documentar códigos de error nuevos
