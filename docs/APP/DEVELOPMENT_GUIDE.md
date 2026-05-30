# 🛠️ DEVELOPMENT_GUIDE
## Guía de Desarrollo del Proyecto Urbania

> **Consultar**: Antes de empezar a codear cualquier tarea.
> **Relacionado con**: ARCHITECTURE.md, GOLDEN_RULES.md

---

## Setup Inicial del Proyecto

### 1. Crear proyecto Flutter
```bash
flutter create --org com.urbania urbania
cd urbania_app
```

### 2. Dependencias (pubspec.yaml)
```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_riverpod: ^latest
  riverpod_annotation: ^latest

  # Router
  go_router: ^latest

  # HTTP
  dio: ^latest

  # Local DB
  drift: ^latest
  drift_flutter: ^latest
  hive: ^latest
  hive_flutter: ^latest

  # Security
  flutter_secure_storage: ^latest

  # Serialization
  freezed_annotation: ^latest
  json_annotation: ^latest

  # Functional Programming
  fpdart: ^latest

  # Utils
  connectivity_plus: ^latest
  intl: ^latest

  # Environment
  flutter_dotenv: ^latest

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^latest
  freezed: ^latest
  json_serializable: ^latest
  riverpod_generator: ^latest
  drift_dev: ^latest
  mocktail: ^latest
  flutter_lints: ^latest
```

### 3. Generar código (OBLIGATORIO antes de compilar)
> **⚠️ CRÍTICO**: Los archivos `.g.dart` y `.freezed.dart` son necesarios para compilar. Si no existen, la app fallará.

```bash
# Generar código generado (freezed, riverpod, json_serializable, drift)
dart run build_runner build --delete-conflicting-outputs

# Modo watch (recompila automáticamente al guardar)
dart run build_runner watch --delete-conflicting-outputs
```

> **Nota**: Ejecutar este comando cada vez que se modifique un archivo con `@riverpod`, `@freezed`, `@DriftDatabase`, o `@JsonSerializable`.



### 3.5. Configuración de Variables de Entorno (.env)

Crear archivo `.env` en la raíz del proyecto:

```
USE_MOCK=true
API_BASE_URL=https://urbaniaapidev.com
```

> **Nota**: El archivo `.env` debe estar incluido en `.gitignore` para no subir credenciales al repositorio.

Actualizar `pubspec.yaml` para incluir el archivo `.env`:

```yaml
flutter:
  assets:
    - .env
```

### 4. Inicialización en main.dart
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'core/database/app_database.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Cargar variables de entorno
  await dotenv.load(fileName: '.env');

  // Inicializar Hive
  await Hive.initFlutter();
  await HiveStorage.init(); // ← OBLIGATORIO: abre las boxes antes de usar

  // Inicializar Drift
  final database = AppDatabase();

  // Determinar modo mock
  final useMock = dotenv.env['USE_MOCK']?.toLowerCase() == 'true';

  runApp(
    ProviderScope(
      overrides: [
        databaseProvider.overrideWithValue(database),
        if (useMock) ...[
          // Overrides para datasources mock
          authDatasourceProvider.overrideWithValue(MockAuthDatasource()),
        ],
      ],
      child: const UrbaniaApp(),
    ),
  );
}

class UrbaniaApp extends ConsumerWidget {
  const UrbaniaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'Urbania',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      routerConfig: router,
    );
  }
}
```

---

## Comandos Útiles

```bash
# Generar código
dart run build_runner build --delete-conflicting-outputs

# Watch mode
dart run build_runner watch --delete-conflicting-outputs

# Tests
dart test
flutter test

# Coverage
dart run test_cov

# Lint
flutter analyze

```

---

## Convenciones de Código

### Imports ordenados
```dart
// 1. Dart/Flutter SDK
import 'dart:async';
import 'package:flutter/material.dart';

// 2. Paquetes externos
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// 3. Core (absolutos)
import 'package:urbania/core/errors/failure.dart';
import 'package:urbania/core/theme/app_colors.dart';

// 4. Features (absolutos)
import 'package:urbania/auth/domain/entities/resident_entity.dart';

// 5. Relativos (mismo feature)
import '../providers/auth_controller.dart';
import 'login_page.dart';
```

### Estructura de archivo
```dart
// 1. Imports
// 2. Part directives (si aplica)
// 3. Constants privadas
// 4. Clase principal
// 5. Clases privadas auxiliares
// 6. Extensiones
```


---

## ✅ Checklist de Verificación Post-Implementación

Antes de considerar una tarea completada, verificar:

```bash
# 1. Generar código
flutter pub get
dart run build_runner build --delete-conflicting-outputs

# 2. Analizar código (debe retornar 0 errores)
flutter analyze

# 3. Verificar que no hay imports entre features
# Buscar: import '../[otro_feature]/' o import 'package:urbania/[otro_feature]/'

# 4. Verificar que no se usa dynamic
# Buscar: 'dynamic' en archivos de lib/

# 5. Verificar que no hay archivos > 300 líneas
find lib -name '*.dart' -exec wc -l {} + | sort -n | tail -10

# 6. Verificar que todos los mensajes al usuario usan AlertService
# Buscar: SnackBar, showDialog, showModalBottomSheet, Toast

# 7. Verificar que todas las funciones que pueden fallar retornan Either<Failure, T>
# Buscar: 'throw Exception' o 'throw' sin mapear a Failure
```

> **Regla de oro**: Si `flutter analyze` retorna errores, la tarea NO está completa.
