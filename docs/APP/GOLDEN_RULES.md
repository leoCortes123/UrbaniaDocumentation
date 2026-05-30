# ⚡ GOLDEN_RULES
## Reglas Inquebrantables del Proyecto Urbania

> **Consultar**: Antes de escribir cualquier línea de código.

---

## 1. Arquitectura Feature-First + Clean Architecture Simplificada
- Cada feature es un módulo aislado en `/lib/[feature]/`
- Estructura interna: `domain/` → `data/` → `presentation/`
- **NUNCA** un feature importa de otro feature. Comunicación solo vía `core/` o estado global Riverpod

## 2. Separación Estricta de Capas
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

## 3. Responsabilidad Única
- Ninguna clase hace más de una cosa
- Archivos >300 líneas → refactorizar inmediatamente
- Una clase = un propósito claro y documentado

## 4. No AI Slop
- Código debe responder a un caso de uso real del negocio
- No código genérico, boilerplate innecesario, o "por si acaso"
- Cada línea justificada por un requerimiento funcional

## 5. Estado Predecible con Riverpod
- Exclusivamente `@riverpod` y `AsyncNotifier`
- No `StateNotifierProvider`, no `ChangeNotifier`, no `Bloc`, no `MobX`
- Estado global via `ProviderScope`, estado local via `ConsumerWidget`
- **Ver ejemplo en ARCHITECTURE.md Sección 5**

## 6. Tipado Estricto
- Evitar `dynamic` en cualquier contexto
- Modelos bien definidos con `freezed` + `json_serializable`
- Parámetros de funciones tipados, no posicionales genéricos

## 7. Errores Controlados con Either
- **TODAS** las funciones que pueden fallar retornan `Either<Failure, T>` (fpdart)
- **NUNCA** lanzar excepciones crudas (`throw Exception`)
- **NUNCA** usar `try/catch` sin mapear a `Failure`
- Usar sealed class `Failure` con subclases específicas
- **Ver definición en ARCHITECTURE.md Sección 4**

## 8. UI Desacoplada
- Lógica de negocio en `domain/` o `providers/`, **nunca** en widgets
- Widgets reciben datos y callbacks, no toman decisiones de negocio
- Presentación pura, sin `if/else` de lógica compleja

## 9. Alertas Estandarizadas
- Todo mensaje al usuario DEBE usar el sistema de alertas (`AlertService`)
- **Prohibido** usar SnackBar, AlertDialog, showDialog, showModalBottomSheet, Toast directamente
- Ver documento ALERT_SYSTEM.md para tipos y usos correctos

## 10. Documentación Viva
- Completar secciones `** Pendiente **` con código real de implementación
- Actualizar FEATURES_INDEX cuando se agrega/modifica un feature
- Documentar decisiones técnicas no obvias en comentarios de código

## 11. Migración-Transparente
- `MockRepository` debe ser intercambiable por `ApiRepository` sin tocar `domain/`
- Interfaces de repository definidas en `domain/`, implementaciones en `data/`
- Preparar `ApiDatasource` con mismas interfaces que `MockDatasource`

## 12. Flujo de Inicio de la Aplicación
- La app **siempre inicia en `/login`** (no en `/splash`)
- **CRÍTICO**: El redirect de GoRouter debe usar `refreshListenable` con un `ChangeNotifier` que escuche el auth state. Ver ROUTING.md para el patrón correcto.
- No hay splash screen separada; el loading se maneja en la pantalla de login
- Si hay sesión guardada, redirigir automáticamente a `/` desde el login
- Ver implementación en ROUTING.md

## 14. Prohibiciones Absolutas
- ❌ No usar `setState` para lógica de negocio
- ❌ No usar `dynamic` en ningún contexto
- ❌ No usar `get_it`, `injectable` ni service locator externo (usar Riverpod)
- ❌ No usar `print()`, usar `log()` de `dart:developer`
- ❌ No crear archivos > 300 líneas
- ❌ No importar entre features (usar `core/` o `shared/`)
- ❌ No dejar código comentado o TODOs sin resolver
- ❌ No usar `BuildContext` fuera de la capa de presentación
- ❌ No hardcodear strings (usar `AppConstants` o localización)
- ❌ No hardcodear colores fuera de `AppColors`

---

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Clases | PascalCase | `LoginUseCase`, `ResidentEntity` |
| Archivos | snake_case | `login_use_case.dart`, `resident_entity.dart` |
| Providers | camelCase + Provider | `authProvider`, `loginControllerProvider` |
| Constantes | camelCase | `apiBaseUrl`, `maxRetryAttempts` |
| Enums | PascalCase valores | `enum AuthStatus { authenticated, unauthenticated }` |
| Directorios de feature | snake_case | `/auth`, `/reservations`, `/notifications` |
| Mock classes | Mock + nombre | `MockAuthRepository`, `MockReservationDatasource` |

---

## Convenciones de Imports Ordenados

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

---

## Estructura de Archivo Dart

```dart
// 1. Imports
// 2. Part directives (si aplica)
// 3. Constants privadas
// 4. Clase principal
// 5. Clases privadas auxiliares
// 6. Extensiones
```
