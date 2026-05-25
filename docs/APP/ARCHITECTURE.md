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
| Local DB (demo) | Hive + Drift | ^latest | Hive para sesión/settings, Drift para datos estructurados |
| Local DB (prod) | Drift + Hive | ^latest | Drift principal, Hive caché ligera |
| Seguridad | flutter_secure_storage | ^latest | Keychain/Keystore nativo |
| Serialización | freezed + json_serializable | ^latest | Inmutabilidad + codegen automático. Requiere `part 'file.g.dart'` y `part 'file.freezed.dart'` |
| Inyección DI | riverpod (ProviderScope) | ^latest | No usar get_it ni injectable |
| Testing | flutter_test + mocktail | ^latest | Mocking sin boilerplate |
| Functional Programming | fpdart | ^latest | Tipo Either para errores |
| Auth Social | google_sign_in, flutter_facebook_auth, sign_in_with_apple | ^latest | OAuth 2.0 nativo |
| Demo Data | faker | ^latest | Generación de datos mock realistas |
| Local JWT (demo) | dart:convert | Built-in | Tokens locales para demo (base64Encode manual) |

> **Regla de versiones**: Siempre última estable. Si hay conflicto, documentar en tabla con columna "Restricción" e intentar instalar la version que no genere conflicto siempre priorizando las librerias mas importantes.

> **Modo Demo**: En demo, Dio está configurado pero no se usa. Los `FakeRepository` simulan latencia. Ver DEMO_SETUP.md.

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
│   ├── /demo               # DemoData, DemoCredentials, FakeRepositories
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
│   │   │   ├── /fake       # FakeAuthDatasource (demo)
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
- `core/` = todo lo transversal: networking, database, demo, errores, tema, router, utilidades
- `shared/` = widgets y utilidades reutilizables entre múltiples features
- `core/demo/` = **solo para modo demo**. Contiene datos mock, fake repositories, credenciales demo. Fácilmente eliminable para producción.

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
- **NUNCA** `domain/` importa de `core/demo/` (demo es solo implementación en data/)

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

// Errores específicos para demo
class DemoModeFailure extends Failure {
  const DemoModeFailure(String message) : super(message);
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

## 6. Configuración de Dio (Singleton) - Preparado para Demo

```dart
// /core/network/dio_client.dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class DioClient {
  static Dio? _instance;
  static bool _isDemoMode = true; // Flag para modo demo

  static Dio get instance {
    _instance ??= _createDio();
    return _instance!;
  }

  static void setDemoMode(bool isDemo) => _isDemoMode = isDemo;

  static Dio _createDio() {
    final dio = Dio(BaseOptions(
      baseUrl: _isDemoMode 
        ? 'https://demo.local' // No se usa realmente en demo
        : 'https://urbaniaapi.tuapp.com/v1',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));

    dio.interceptors.addAll([
      AuthInterceptor(),
      LogInterceptor(requestBody: true, responseBody: true),
    ]);

    return dio;
  }
}

class AuthInterceptor extends Interceptor {
  final _storage = const FlutterSecureStorage();

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _storage.read(key: 'jwt_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      await const FlutterSecureStorage().delete(key: 'jwt_token');
      // GoRouter redirigirá a login automáticamente
    }
    handler.next(err);
  }
}
```

---

## 7. Configuración de Base de Datos Local (Drift)

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

  // Seeding de datos demo
  Future<void> seedDemoData() async {
    // Implementar en DEMO_SETUP.md
  }
}
```

---

## 8. Testing Obligatorio

Cada feature DEBE incluir:
- Unit tests para usecases
- Unit tests para repositories (mock datasource)
- Widget tests para screens principales
- Mock de datasources con mocktail
- Tests de integración para flujo demo (login -> dashboard -> feature)

---

## 9. Breakpoints de Diseño

| Nombre | Ancho | Uso |
|--------|-------|-----|
| Mobile | < 600px | Layout por defecto |
| Tablet | 600-1024px | 2 columnas en grids |
| Desktop | > 1024px | 3 columnas, drawer permanente |
