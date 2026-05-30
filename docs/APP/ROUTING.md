# 🧭 ROUTING
## Sistema de Navegación de Urbania

> **Consultar**: Si la tarea involucra navegación, nuevas pantallas, o modificación de flujo de autenticación.
> **Relacionado con**: ARCHITECTURE.md, FEATURES_INDEX.md

---

## Configuración GoRouter

```dart
// /core/router/app_router.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// ═══════════════════════════════════════════════════════════════════════════
// AUTH ROUTER NOTIFIER - Patrón CRÍTICO para GoRouter + Riverpod
// Este notifier escucha cambios en el auth state y notifica al router
// para que re-evalúe el redirect automáticamente.
// ═══════════════════════════════════════════════════════════════════════════
class AuthRouterNotifier extends ChangeNotifier {
  AuthRouterNotifier(this._ref) {
    // Escucha cambios en el auth controller y notifica al router
    _ref.listen<AsyncValue<AuthState>>(
      authControllerProvider,
      (previous, next) {
        // Solo notificar cuando el estado de autenticación cambia realmente
        // (no durante loading)
        if (next is! AsyncLoading) {
          notifyListeners();
        }
      },
    );
  }
  final Ref _ref;
}

// Provider para el notifier (usado por refreshListenable)
final authRouterNotifierProvider = Provider<AuthRouterNotifier>((ref) {
  return AuthRouterNotifier(ref);
});

// Provider principal del router
final appRouterProvider = Provider<GoRouter>((ref) {
  // Obtener el notifier que escucha cambios de auth
  final notifier = ref.watch(authRouterNotifierProvider);

  // Obtener el estado actual de autenticación
  final authAsync = ref.watch(authControllerProvider);
  final currentAuthState = authAsync.valueOrNull;

  return GoRouter(
    navigatorKey: GlobalKey<NavigatorState>(), // ← IMPORTANTE: evita rebuild del árbol
    initialLocation: '/login',

    // ═══════════════════════════════════════════════════════════════════════
    // refreshListenable: CRÍTICO para que el redirect funcione con Riverpod
    // Sin esto, el redirect NO se re-evalúa cuando cambia el auth state
    // ═══════════════════════════════════════════════════════════════════════
    refreshListenable: notifier,

    redirect: (context, state) {
      return _redirectLogic(currentAuthState, state.matchedLocation);
    },

    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterPage()),
      GoRoute(path: '/forgot-password', builder: (_, __) => const ForgotPasswordPage()),
      GoRoute(path: '/', builder: (_, __) => const HomePage()),
      GoRoute(path: '/profile', builder: (_, __) => const ProfilePage()),
      GoRoute(path: '/payments', builder: (_, __) => const PaymentsPage()),
      GoRoute(path: '/notifications', builder: (_, __) => const NotificationsPage()),
      GoRoute(path: '/ingresos', builder: (_, __) => const IngresosPage()),
      GoRoute(path: '/reservations', builder: (_, __) => const ReservationsPage()),
      GoRoute(path: '/pqrs', builder: (_, __) => const PqrsPage()),
      GoRoute(path: '/chat', builder: (_, __) => const ChatPage()),
    ],
  );
});

// Lógica de redirect separada para testabilidad
String? _redirectLogic(AuthState? authState, String location) {
  final isAuthenticated = authState is Authenticated;
  final isAuthRoute = location == '/login' || 
                      location == '/register' ||
                      location == '/forgot-password';

  if (!isAuthenticated && !isAuthRoute) {
    return '/login';
  }
  if (isAuthenticated && isAuthRoute) {
    return '/';
  }
  return null;
}
```

> **⚠️ CRÍTICO - Patrón GoRouter + Riverpod**:
> 
> El `redirect` de GoRouter **NO** se re-evalúa automáticamente cuando cambia un provider de Riverpod. 
> Es necesario usar `refreshListenable` con un `ChangeNotifier` que escuche los cambios del estado de autenticación y llame a `notifyListeners()`.
> 
> **Sin este patrón**, el login parece funcionar (el estado cambia a `Authenticated`) pero la navegación no ocurre.

> **Nota**: No hay splash screen separada. El loading inicial se maneja en la pantalla de login.
> Si hay sesión guardada, el `AuthController` redirige automáticamente a `/` desde el login.

---

## Rutas Definidas

### Rutas Públicas (No requieren autenticación)

| Ruta | Pantalla | Descripción |
|------|----------|-------------|
| `/login` | LoginPage | Login email/password + botones sociales |
| `/register` | RegisterPage | Registro de nuevo usuario |
| `/forgot-password` | ForgotPasswordPage | Recuperación de contraseña |

### Rutas Protegidas (Requieren autenticación)

| Ruta | Pantalla | Feature | Descripción |
|------|----------|---------|-------------|
| `/` | HomePage | Home | Dashboard principal del residente |
| `/profile` | ProfilePage | Profile | Perfil y configuración de usuario |
| `/payments` | PaymentsPage | Payments | Pagos y administración |
| `/notifications` | NotificationsPage | Notifications | Notificaciones push y locales |
| `/ingresos` | IngresosPage | Ingresos | Control de ingresos/visitas |
| `/reservations` | ReservationsPage | Reservations | Reservas de zonas comunes |
| `/pqrs` | PqrsPage | PQRS | PQRS del residente |
| `/chat` | ChatPage | Chat | Chat con administración |

### Rutas del Bottom Navigation Bar

El BottomNav principal (definido en HomePage) navega a:
- **Inicio** → `/`
- **Pagos** → `/payments`
- **Notific.** → `/notifications`
- **Ingresos** → `/ingresos`

---

## Agregar una Nueva Ruta

1. Definir la ruta en la tabla de arriba
2. Agregar `GoRoute` en `app_router.dart`
3. Actualizar lógica de `redirect` si aplica restricciones de auth
4. Crear la página en `/lib/[feature]/presentation/pages/`
5. Agregar navegación usando `context.go('/ruta')` o `context.push('/ruta')`
6. Actualizar FEATURES_INDEX.md si es un feature nuevo
7. Si la ruta debe aparecer en BottomNav, actualizar el widget en HomePage

---

## Navegación Programática

```dart
// Navegar a ruta (reemplaza stack)
context.go('/profile');

// Navegar a ruta (agrega al stack)
context.push('/profile');

// Volver atrás
context.pop();

// Navegar con parámetros
context.go('/reservations/${reservationId}');

// Navegar con query params
context.go('/reservations?zone=salon-social');
```

---

## Deep Linking

- Configurar esquemas de URL en `AndroidManifest.xml` y `Info.plist`
- Usar `GoRouter` para parsear parámetros de ruta
- Ejemplo: `urbania://reservations/123` → abre detalle de reserva 123
