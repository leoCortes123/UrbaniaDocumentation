# 🏗️ ARCHITECTURE
## Arquitectura del Proyecto Urbania

> **Consultar**: Antes de implementar cualquier feature nuevo o modificar la estructura.
> **Relacionado con**: GOLDEN_RULES.md, DEVELOPMENT_GUIDE.md

---

## 1. Stack Tecnológico

| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Framework | Flutter | Última estable | UI multiplataforma oficial de Google |
| Lenguaje | Dart | Última estable | Null-safety nativo |
| Gestión de estado | Riverpod | ^2.x | Inyección de dependencias nativa, sin context |
| Router | GoRouter | ^latest | Declarativo, deep linking, tipado fuerte |
| HTTP Client | Dio | ^latest | Interceptors, cancel tokens |
| Local DB (prod) | Drift + Hive | ^latest | Drift principal, Hive caché ligera |
| Seguridad | flutter_secure_storage | ^latest | Keychain/Keystore nativo |
| Serialización | freezed + json_serializable | ^latest | Inmutabilidad + codegen automático. Requiere `part 'file.g.dart'` y `part 'file.freezed.dart'` |
| Inyección DI | riverpod (ProviderScope) | ^latest | No usar get_it ni injectable |
| Testing | flutter_test + mocktail | ^latest | Mocking sin boilerplate |
| Functional Programming | fpdart | ^latest | Tipo Either para errores |
| Auth Social | google_sign_in, flutter_facebook_auth, sign_in_with_apple | ^latest | OAuth 2.0 nativo |

> **Regla de versiones**: Siempre última estable. Si hay conflicto, documentar en tabla con columna "Restricción" e intentar instalar la version que no genere conflicto siempre priorizando las librerias mas importantes.
> **IMPORTANTE**: Consulta si hay reportados problemas de seguridad en librerias o frameworks. Si se encuentra alguna alerta de seguridad, se debe detener el proceso, informar la alerta y esperar instrucciones.

---

## 2. Arquitectura: Feature-First Clean Architecture (Simplificada)

```
/lib
├── main.dart
├── /core
│   ├── /constants          # AppConstants, ApiConstants, RouteNames
│   ├── /network            # DioClient, NetworkInfo, ApiException
│   ├── /database           # Drift config, DAOs, migrations
│   ├── /storage            # HiveStorage, SecureStorage
│   ├── /errors             # Failure (sealed class), ErrorHandler
│   ├── /utils              # Extensions, Helpers, Validators
│   ├── /theme              # AppTheme, AppColors, AppTypography
│   └── /router             # AppRouter (configuración central de GoRouter)
├── /auth                   # Feature: Autenticación
│   ├── /domain
│   │   ├── /entities
│   │   ├── /repositories
│   │   └── /usecases
│   ├── /data
│   │   ├── /models
│   │   ├── /datasources
│   │   │   └── /remote     # RemoteAuthDatasource (futuro)
│   │   └── /repositories
│   └── /presentation
│       ├── /pages
│       ├── /widgets
│       ├── /providers
│       └── /states
├── /home                   # Feature: Dashboard principal
├── /profile                # Feature: Perfil de usuario
├── /reservations           # Feature: Reservas de zonas comunes
├── /payments               # Feature: Pagos y administración
├── /pqrs                   # Feature: PQRS
├── /notifications          # Feature: Notificaciones push y locales
├── /chat                   # Feature: Chat con administración
├── /shared
│   └── /widgets             # Widgets globales (AppButton, AppTextField, etc.)
└── /generated               # Código generado (freezed, json_serializable, drift)
```

### Principios
- Cada directorio en `/lib` (excepto `core` y `shared`) = **funcionalidad de negocio completa**
- **Ningún feature importa de otro feature**. Comunicación solo a través de `core/` o estado global Riverpod
- `core/` = todo lo transversal: networking, database, errores, tema, router, utilidades
- `shared/` = widgets y utilidades reutilizables entre múltiples features

---

## 3. Reglas de Dependencia (SOLID estricto)

```
Presentation -> Domain <- Data
     ^              ^
   Riverpod      Repositories
```

- **Presentation** depende de **Domain** (usecases y entities)
- **Data** depende de **Domain** (implementa interfaces)
- **Domain** NO depende de nada externo (ni Flutter, ni paquetes de terceros)
- **NUNCA** una capa superior importa de una inferior
- **NUNCA** un feature importa de otro feature
- **NUNCA** `core/` importa de ningún feature

---

## 4. Manejo de Errores (Sealed Class Obligatorio)

**TODAS** las funciones que pueden fallar retornan `Either<Failure, T>`
- Usar `fpdart` para el tipo `Either`
- **NUNCA** lanzar excepciones crudas (`throw Exception`)
- **NUNCA** usar `try/catch` sin mapear a `Failure`

```dart
// /core/errors/failure.dart
sealed class Failure {
  final String message;
  const Failure(this.message);
}

class NetworkFailure extends Failure {
  const NetworkFailure() : super('Verifica tu conexión a internet');
}

class ServerFailure extends Failure {
  const ServerFailure() : super('Error del servidor. Inténtalo más tarde');
}

class UnauthorizedFailure extends Failure {
  const UnauthorizedFailure() : super('Sesión expirada. Inicia sesión de nuevo');
}

class ValidationFailure extends Failure {
  const ValidationFailure(String message) : super(message);
}

class ConflictFailure extends Failure {
  const ConflictFailure(String message) : super(message);
}

class NotFoundFailure extends Failure {
  const NotFoundFailure() : super('Recurso no encontrado');
}

class BusinessLogicFailure extends Failure {
  const BusinessLogicFailure(String message) : super(message);
}

```

---

## 5. Estado de UI con Riverpod (Patrón AsyncNotifier - API Moderna)

> **IMPORTANTE**: Usar exclusivamente `@riverpod` + `AsyncNotifier`. NO usar `StateNotifierProvider`.

```dart
// /auth/presentation/providers/auth_controller.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_controller.g.dart';

@riverpod
class AuthController extends _$AuthController {
  @override
  AsyncValue<AuthState> build() {
    return const AsyncValue.data(AuthState.unauthenticated());
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();

    final result = await ref.read(loginUseCaseProvider)(email, password);

    state = result.fold(
      (failure) => AsyncValue.error(failure, StackTrace.current),
      (user) => AsyncValue.data(AuthState.authenticated(user)),
    );
  }
}
```

---


---

## 6. Configuración de Base de Datos Local (Drift)

```dart
// /core/database/app_database.dart
import 'package:drift/drift.dart';
import 'package:drift_flutter/drift_flutter.dart';

part 'app_database.g.dart';

@DriftDatabase(tables: [/* tablas de cada feature */])
class AppDatabase extends _$AppDatabase {
  AppDatabase() : super(_openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return driftDatabase(name: 'urbania_database');
  }
}
```



---

## 7. Modo Mock (Desarrollo Local)

### Configuración

El modo mock se controla mediante la variable de entorno `USE_MOCK` en `.env`:

```
USE_MOCK=true   # Activa modo mock (datos locales)
USE_MOCK=false  # Usa API real
```

### Arquitectura de Datasources

```
/lib
├── /core
│   └── /network
│       ├── /datasources
│       │   ├── /interfaces       # Contratos de datasource
│       │   ├── /mock           # Implementaciones mock
│       │   └── /api            # Implementaciones API real
│       └── dio_client.dart
```

### Inyección Condicional

```dart
// /core/network/datasource_provider.dart
final authDatasourceProvider = Provider<AuthDatasource>((ref) {
  final useMock = dotenv.env['USE_MOCK']?.toLowerCase() == 'true';

  if (useMock) {
    return MockAuthDatasource();
  }

  return ApiAuthDatasource(ref.read(dioClientProvider));
});
```

### Reglas

- `MockDatasource` y `ApiDatasource` implementan la **misma interfaz**
- **Zero cambios** en domain/, presentation/ ni widgets
- Los datos mock son **realistas** y cubren casos de uso principales
- El cambio de modo no requiere recompilación

---

---

## 8. Testing Obligatorio

Cada feature DEBE incluir:
- Unit tests para usecases
- Unit tests para repositories (mock datasource)
- Widget tests para screens principales
- Mock de datasources con mocktail

---

## 9. Breakpoints de Diseño

| Nombre | Ancho | Uso |
|--------|-------|-----|
| Mobile | < 600px | Layout por defecto |
| Tablet | 600-1024px | 2 columnas en grids |
| Desktop | > 1024px | 3 columnas, drawer permanente |
