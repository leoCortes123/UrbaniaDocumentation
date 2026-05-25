# 🔐 Auth Feature Specification

> **Estado**: Para revisión previa a implementación  
> **Última actualización**: 2026-05-22

---

## 1. Overview

### Propósito
Exponer endpoints de autenticación token-based para consumo del portal web y app móvil.

### Stack Tecnológico
- **Autenticación**: Laravel Sanctum 4 (token-based)
- **Modelo de usuario**: `Users` (tabla `users`)
- **Paquete**: `laravel/sanctum`

### Modelo de Usuario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | int | PK | Identificador único |
| name | string | Sí | Nombre completo |
| email | string | Sí, único | Correo electrónico |
| password | string | Sí | Hash bcrypt |
| documento | string | Sí | Número de documento |
| telefono | string | No | Teléfono de contacto |
| foto_url | string | No | URL de foto de perfil |
| estado | boolean | No | Activo/Inactivo |
| ultimo_acceso | datetime | No | Último acceso |
| tipo_documento_id | int | Sí | FK a `tbl_users_tipos_documentos` |
| rol_id | int | Sí | FK a `tbl_roles` |
| users_estado_id | int | Sí | FK a `tbl_users_estados` |

### Tablas de Referencia Requeridas

| Tabla | Uso |
|-------|-----|
| `tbl_users_tipos_documentos` | Tipos de documento (CC, CE, TI, etc.) |
| `tbl_users_estados` | Estados del usuario (Activo, Inactivo, Pendiente) |
| `tbl_roles` | Roles (Admin, Residente, etc.) |

---

## 2. Endpoints

### 2.1 Login

**URI**: `POST /api/auth/login`

**Descripción**: Autentica un usuario y devuelve un token de acceso.

**Headers**:
```
Content-Type: application/json
Accept: application/json
```

**Request Body**:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "device_name": "iPhone 15 Pro"
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| email | string | Sí | Formato email válido |
| password | string | Sí | Mínimo 8 caracteres |
| device_name | string | Sí | Identificador del dispositivo (ej: "iPhone 15", "Chrome Windows") |

**Respuesta Éxito (200)**:
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "documento": "12345678",
      "telefono": "+573001234567",
      "foto_url": "https://...",
      "estado": true,
      "tipo_documento": {
        "id": 1,
        "nombre_tipodocu": "Cédula de Ciudadanía"
      },
      "rol": {
        "id": 2,
        "nombre_rol": "Residente",
        "codigo_rol": "residente"
      },
      "users_estado": {
        "id": 1,
        "nombre_useresta": "Activo"
      }
    },
    "token": "1|abc123xyz...",
    "token_type": "Bearer",
    "expires_at": null
  }
}
```

**Respuesta Error (401)**:
```json
{
  "message": "Las credenciales proporcionadas son incorrectas."
}
```

**Respuesta Error (422)** - Validación:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["El campo email es requerido."],
    "password": ["El campo password es requerido."],
    "device_name": ["El campo device name es requerido."]
  }
}
```

---

### 2.2 Register

**URI**: `POST /api/auth/register`

**Descripción**: Registra un nuevo usuario en el sistema.

**Headers**:
```
Content-Type: application/json
Accept: application/json
```

**Request Body**:
```json
{
  "name": "María García",
  "email": "maria@ejemplo.com",
  "password": "securePassword123",
  "password_confirmation": "securePassword123",
  "documento": "87654321",
  "telefono": "+573009876543",
  "tipo_documento_id": 1,
  "rol_id": 2,
  "users_estado_id": 2
}
```

| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| name | string | Sí | Mínimo 3, máximo 255 caracteres |
| email | string | Sí | Formato email válido, único en BD |
| password | string | Sí | Mínimo 8 caracteres, confirmar |
| password_confirmation | string | Sí | Debe coincidir con password |
| documento | string | Sí | Máximo 50 caracteres |
| telefono | string | No | Máximo 30 caracteres |
| tipo_documento_id | int | Sí | Debe existir en `tbl_users_tipos_documentos` |
| rol_id | int | Sí | Debe existir en `tbl_roles` |
| users_estado_id | int | Sí | Debe existir en `tbl_users_estados` |

**Respuesta Éxito (201)**:
```json
{
  "data": {
    "user": {
      "id": 2,
      "name": "María García",
      "email": "maria@ejemplo.com",
      "documento": "87654321",
      "telefono": "+573009876543",
      "foto_url": null,
      "estado": null,
      "tipo_documento": {
        "id": 1,
        "nombre_tipodocu": "Cédula de Ciudadanía"
      },
      "rol": {
        "id": 2,
        "nombre_rol": "Residente",
        "codigo_rol": "residente"
      },
      "users_estado": {
        "id": 2,
        "nombre_useresta": "Pendiente"
      }
    },
    "token": "2|def456uvw...",
    "token_type": "Bearer",
    "expires_at": null
  }
}
```

**Respuesta Error (422)** - Validación:
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["El correo electrónico ya ha sido registrado."],
    "password": ["Las contraseñas no coinciden."]
  }
}
```

---

### 2.3 Logout

**URI**: `POST /api/auth/logout`

**Descripción**: Invalida el token actual del usuario.

**Headers**:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

**Request Body**: Vacío

**Respuesta Éxito (200)**:
```json
{
  "message": "Sesión cerrada correctamente."
}
```

**Respuesta Error (401)**:
```json
{
  "message": "Unauthenticated."
}
```

---

### 2.4 Usuario Autenticado

**URI**: `GET /api/auth/user`

**Descripción**: Obtiene la información del usuario autenticado.

**Headers**:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

**Respuesta Éxito (200)**:
```json
{
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "documento": "12345678",
    "telefono": "+573001234567",
    "foto_url": "https://...",
    "estado": true,
    "ultimo_acceso": "2026-05-22T10:30:00+00:00",
    "tipo_documento": {
      "id": 1,
      "nombre_tipodocu": "Cédula de Ciudadanía"
    },
    "rol": {
      "id": 2,
      "nombre_rol": "Residente",
      "codigo_rol": "residente",
      "nivel_rol": 3
    },
    "users_estado": {
      "id": 1,
      "nombre_useresta": "Activo"
    },
    "conjuntos": [
      {
        "id": 1,
        "nombre_conjunto": "Conjunto Residencial Los Pinos",
        "nit_conjunto": "901234567-8"
      }
    ]
  }
}
```

**Respuesta Error (401)**:
```json
{
  "message": "Unauthenticated."
}
```

---

## 3. Estructura de Respuestas

### 3.1 Envelope Estándar

Todas las respuestas exitosas de recursos únicos siguen este formato:

```json
{
  "data": { ... }
}
```

Para respuestas de colección (no aplica en auth, pero documentado para consistencia):

```json
{
  "data": [ ... ],
  "links": { ... },
  "meta": { ... }
}
```

### 3.2 Estructura de Error

```json
{
  "message": "Descripción del error"
}
```

Para errores de validación (422):

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "campo": ["mensaje de error"]
  }
}
```

---

## 4. Flujos de Autenticación

### 4.1 Flujo Mobile App

```
1. App muestra pantalla de Login
2. Usuario ingresa email + password + device_name
3. App llama POST /api/auth/login
4. Si éxito: guardar token localmente, mostrar dashboard
5. Si error: mostrar mensaje de error
6. Para cada request protegida:
   - Incluir header: Authorization: Bearer {token}
7. Al cerrar sesión: llamar POST /api/auth/logout
```

### 4.2 Flujo Web Portal

```
1. Portal muestra formulario de Login
2. Usuario ingresa email + password + device_name
3. Portal llama POST /api/auth/login
4. Si éxito: guardar token en localStorage/cookie, redirigir a dashboard
5. Si error: mostrar mensaje de error
6. Para cada request protegida:
   - Incluir header: Authorization: Bearer {token}
7. Al cerrar sesión: llamar POST /api/auth/logout, limpiar token
```

### 4.3 Manejo de Token Vencido

Si el servidor retorna 401:

```
1. Detectar respuesta 401
2. Limpiar token local
3. Redirigir a pantalla de login
4. Mostrar mensaje: "Tu sesión ha expirado. Por favor ingresa nuevamente."
```

---

## 5. Consideraciones de Seguridad

### 5.1 Contraseñas
- Se almacenan con bcrypt (Laravel default)
- Mínimo 8 caracteres
- No se retornan en ninguna respuesta
- No se loguean en archivos de auditoría

### 5.2 Tokens
- Tokens de Sanctum (plain text tokens)
- Almacenados en tabla `personal_access_tokens`
- No expiran por defecto (configurable en `config/sanctum.php`)
- Un usuario puede tener múltiples tokens (uno por dispositivo)

### 5.3 Rate Limiting
- Login: 5 intentos por minuto por IP
- Register: 3 registros por hora por IP
- Logout: 10 requests por minuto

### 5.4 Validación de Entrada
- Todos los inputs se sanitizan
- Email se valida formato y unicidad
- HTML tags se escapan automáticamente

---

## 6. Códigos de Error

| HTTP Code | Uso |
|-----------|-----|
| 200 | Éxito (GET, POST logout, logout) |
| 201 | Creado (POST register exitoso) |
| 401 | No autenticado / Token inválido |
| 422 | Error de validación |
| 429 | Rate limit excedido |
| 500 | Error interno del servidor |

---

## 7. Dependencias de Datos

Para que el módulo auth funcione, las siguientes tablas deben estar sembradas:

### tbl_users_tipos_documentos
| id | nombre_tipodocu | codigo_tipodocu | estado_tipodocu |
|----|-----------------|-----------------|-----------------|
| 1 | Cédula de Ciudadanía | CC | true |
| 2 | Cédula de Extranjería | CE | true |
| 3 | Tarjeta de Identidad | TI | true |
| 4 | Pasaporte | PAS | true |

### tbl_users_estados
| id | nombre_useresta | codigo_useresta | descripcion_useresta | orden_useresta | estado_useresta |
|----|-----------------|-----------------|---------------------|----------------|-----------------|
| 1 | Activo | ACT | Usuario puede acceder | 1 | true |
| 2 | Pendiente | PEN | Esperando verificación | 2 | true |
| 3 | Inactivo | INA | Usuario bloqueado | 3 | true |

### tbl_roles
| id | nombre_rol | codigo_rol | descripcion_rol | nivel_rol | estado_rol |
|----|-----------|------------|-----------------|-----------|-----------|
| 1 | Administrador | admin | Acceso total | 1 | true |
| 2 | Residente | residente | Acceso limitado | 2 | true |
| 3 | Visitante | visitante | Solo lectura | 3 | true |

---

## 8. Tasks Pendientes de Implementación

- [ ] Crear `AuthController` en `app/Http/Controllers/Api/AuthController.php`
- [ ] Crear `LoginRequest` en `app/Http/Requests/Auth/LoginRequest.php`
- [ ] Crear `RegisterRequest` en `app/Http/Requests/Auth/RegisterRequest.php`
- [ ] Crear `UserResource` en `app/Http/Resources/UsersResource.php`
- [ ] Definir rutas en `routes/api.php`
- [ ] Crear seeder para tablas de referencia (tipos doc, estados, roles)
- [ ] Configurar rate limiting en `bootstrap/app.php`
- [ ] Escribir tests de feature para auth

---

## 9. Archivos a Crear

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       └── AuthController.php
│   ├── Requests/
│   │   └── Auth/
│   │       ├── LoginRequest.php
│   │       └── RegisterRequest.php
│   └── Resources/
│       └── UsersResource.php

database/
├── seeders/
│   └── UsersReferenceSeeder.php

routes/
└── api.php  (agregar rutas auth)

tests/
└── Feature/
    └── Auth/
        └── AuthControllerTest.php
```

---

## 10. Preguntas para Revisión

1. ¿Se requiere verificación de email antes de activar la cuenta?
2. ¿Se necesita funcionalidad de "recordar contraseña"?
3. ¿Los tokens deben tener fecha de expiración?
4. ¿Se requiere soporte para múltiples dispositivos (ver tokens activos)?
5. ¿El campo `users_estado_id` debe默认为 "Activo" (1) o "Pendiente" (2)?