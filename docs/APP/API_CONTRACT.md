# 🔌 API_CONTRACT
## Contrato con Backend (Referencia Futura)

> **⚠️ IMPORTANTE**: Actualmente la app opera en **modo demo offline**. Este documento define el contrato que se implementará cuando el API esté listo. Los `FakeRepository` siguen estas mismas interfaces.
> **Consultar**: Solo cuando se planee la migración a API real. No necesario para desarrollo en modo demo.

---

## Base URL
- Desarrollo: `https://urbaniaapidev.tuapp.com/v1`
- Producción: `https://urbaniaapi.tuapp.com/v1`
- **Demo**: `https://demo.local` (no se usa, datos locales)

## Autenticación
- Todos los endpoints (excepto login/register/social-login) requieren header:
  `Authorization: Bearer <jwt_token>`
- **En demo**: El token se genera localmente con firma dummy (ver DEMO_SETUP.md)

---

## Endpoints

- Informacion de endpoints @endpoints

---

## Simulación de Endpoints en Demo

Cada endpoint documentado tiene su equivalente `Fake`:

| Endpoint Real | FakeRepository | Latencia Simulada |
|---------------|----------------|-------------------|
| POST /auth/login | `FakeAuthRepository.login()` | 600ms |
| POST /auth/register | `FakeAuthRepository.register()` | 600ms |
| POST /auth/logout | `FakeAuthRepository.logout()` | 200ms |
| GET /auth/me | `FakeAuthRepository.getCurrentUser()` | 300ms |
| GET /residents | `FakeResidentRepository.getAll()` | 800ms |
| GET /reservations | `FakeReservationRepository.getAll()` | 800ms |
| POST /reservations | `FakeReservationRepository.create()` | 600ms |
| GET /payments | `FakePaymentRepository.getHistory()` | 800ms |
| GET /pqrs | `FakePqrRepository.getAll()` | 800ms |
| POST /pqrs | `FakePqrRepository.create()` | 600ms |
| GET /notifications | `FakeNotificationRepository.getAll()` | 500ms |
| GET /chat/messages | `FakeChatRepository.getMessages()` | 600ms |
| POST /chat/messages | `FakeChatRepository.send()` | 400ms |

---

## Estrategia de Migración

Cuando el API esté listo:

1. **Fase 1**: Implementar `RemoteDatasource` con Dio
2. **Fase 2**: Implementar `NetworkInfo` para detectar conectividad
3. **Fase 3**: Crear `HybridRepository` que decide local vs remote
4. **Fase 4**: Reemplazar providers en `main.dart`:
   ```dart
   // ANTES (demo):
   authRepositoryProvider.overrideWith((ref) => FakeAuthRepository(ref.read(hiveStorageProvider)))

   // DESPUÉS (prod):
   authRepositoryProvider.overrideWith((ref) => RemoteAuthRepository(ref.read(dioClientProvider)))
   ```
5. **Fase 5**: Implementar sync engine con conflict resolution


---

## Nota sobre Demo Mode

> **jwt_dart eliminado**: El paquete `jwt_dart` no existe en pub.dev. En modo demo, los tokens JWT se generan manualmente usando `dart:convert` (base64Encode). Ver DEMO_SETUP.md para la implementación.
