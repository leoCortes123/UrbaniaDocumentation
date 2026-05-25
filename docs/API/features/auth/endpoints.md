# Auth - Endpoints

> Documento complementario a `auth.md` - Solo lista de endpoints

---

## Endpoints

| Método | URI | Auth | Descripción |
|--------|-----|------|-------------|
| POST | `/api/auth/login` | No | Login con email/password |
| POST | `/api/auth/register` | No | Registro de nuevo usuario |
| POST | `/api/auth/logout` | Sí | Cerrar sesión |
| GET | `/api/auth/user` | Sí | Obtener usuario autenticado |

---

## Route Definitions ( Laravel )

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
});
```

---

## Middleware

- `auth:sanctum` - Verifica token de autenticación

---

## Rate Limits

| Endpoint | Límite |
|----------|--------|
| POST /auth/login | 5/minuto/IP |
| POST /auth/register | 3/hora/IP |
| POST /auth/logout | 10/minuto |
| GET /auth/user | Sin límite específico |