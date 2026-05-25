# 🔔 ALERT_SYSTEM
## Sistema de Alertas y Notificaciones de Urbania

> **Consultar**: Si la tarea muestra mensajes al usuario, estados de carga, o requiere confirmación.
> **Regla de oro**: No uses SnackBar, AlertDialog, showDialog, showModalBottomSheet o Toast directamente.

---

## Principios Generales

Toda comunicación visual de estado al usuario DEBE pasar por el sistema de alertas. **No uses SnackBar, AlertDialog, showDialog, showModalBottomSheet o Toast directamente** sin utilizar la API de alertas.

---

## API de Uso

```dart
// Desde cualquier provider o widget:
ref.read(alertServiceProvider).show(
  type: AlertType.error,      // error | success | warning | info | system
  title: 'Título',
  message: 'Descripción opcional',
  actionLabel: 'Reintentar',  // opcional
  onAction: () { ... },       // opcional
  dismissible: true,          // opcional, default true
);
```

---

## Tipos de Alertas

### Error
| Atributo | Valor |
|----------|-------|
| Icono | `Icons.error_rounded` |
| Color | `AppColors.error` (fondo 0.1 opacidad, texto e icono sólido) |
| Duración | 6s o manual |
| Posición | Top (debajo del AppBar) |
| Acción | "Cerrar" o "Reintentar" |
| Vibración | Patrón corto (solo Android) |

**Usar cuando**: Error de red, servidor (500), credenciales inválidas, permiso denegado, validación fallida, error de auth social
**NO usar cuando**: Error de validación de formulario (usar inline en campo), error que requiere decisión (usar Confirmación)

### Success
| Atributo | Valor |
|----------|-------|
| Icono | `Icons.check_circle_rounded` |
| Color | `AppSemanticColors.success` (#006E1C, fondo 0.1 opacidad) |
| Duración | 4s o manual |
| Posición | Top |
| Acción | "Cerrar" (opcional) |

**Usar cuando**: Login exitoso, registro completado, reserva creada, pago procesado, perfil actualizado, mensaje enviado
**NO usar cuando**: Navegación automática post-éxito, acciones menores (usar micro-interacciones)

### Warning
| Atributo | Valor |
|----------|-------|
| Icono | `Icons.warning_amber_rounded` |
| Color | `AppSemanticColors.warning` (fondo 0.1 opacidad, texto más oscuro) |
| Duración | 6s o manual |
| Posición | Top |
| Acción | "Entendido" o "Ver más" |

**Usar cuando**: Conexión inestable (modo offline), sesión próxima a expirar, datos desactualizados, límite alcanzado
**NO usar cuando**: Error crítico (usar Error), requiere decisión sí/no (usar Confirmación)

### Info
| Atributo | Valor |
|----------|-------|
| Icono | `Icons.info_rounded` |
| Color | `AppSemanticColors.info` (#002855, fondo 0.1 opacidad, texto más oscuro) |
| Duración | 5s o manual |
| Posición | Top |
| Acción | "Cerrar" o "Saber más" |

**Usar cuando**: Nuevas funciones, tips, mantenimiento programado, actualización de términos
**NO usar cuando**: Requiere acción inmediata (usar Warning/Error)

### System
| Atributo | Valor |
|----------|-------|
| Icono | `Icons.notifications_active_rounded` |
| Color | `AppColors.primary` (fondo 0.1 opacidad) |
| Duración | 5s o persistente |
| Posición | Top o Bottom (sobre BottomNav) |
| Acción | "Ver" o "Cerrar" |

**Usar cuando**: Notificación push recibida, actualización disponible, sincronización background, cambio de estado de reserva, nuevo mensaje en chat
**NO usar cuando**: Es un error (usar Error), es éxito de acción del usuario (usar Success)

---

## Diseño Visual

### Banner (por defecto)
```
┌─────────────────────────────────────────────┐
│ [ICON]  Título del mensaje            [X]   │
│         Descripción opcional del mensaje    │
│         [Acción opcional]                   │
└─────────────────────────────────────────────┘
```
- Ancho: 100% - `AppSpacing.lg` (32px) padding horizontal
- Border radius: `AppShapes.sm` (8px)
- Padding interno: `AppSpacing.md` (16px)
- Margin: `AppSpacing.md` (16px) desde top
- Elevation: 4
- Icono: 24px, alineado top con título
- Título: titleMD (Hanken Grotesk, 20px, w600)
- Descripción: labelMD (Inter, 14px, w400)
- Botón acción: TextButton con color del tipo
- Botón cerrar: IconButton `Icons.close`, 20px

### Toast (solo éxitos menores)
```
┌──────────────────────────────────┐
│ [ICON]  Mensaje breve            │
└──────────────────────────────────┘
```
- Ancho: `min(400px, 90% del screen)`
- Border radius: `AppShapes.md` (12px)
- Padding: vertical 16px, horizontal 24px
- Posición: Bottom center, 80px desde bottom
- Elevation: 8
- Duración: 3s
- Sin botón de cerrar

**Restricción**: Solo para éxitos menores ("Guardado", "Copiado"). Todo lo demás usar Banner.

---

## Estados de Carga y Progreso

### Loading Overlay
- Fondo: `Colors.black` con opacidad 0.3
- Spinner: `CircularProgressIndicator` con `AppColors.primary`
- Texto opcional debajo del spinner
- Bloquea UI (full screen overlay)
- **Usar**: Login, registro, carga crítica, procesamiento de pago

### Skeleton Loading
- Color base: `AppColors.surfaceContainer`
- Color highlight: `AppColors.outlineVariant`
- Border radius igual al widget real
- Animación: shimmer izquierda a derecha, 1.5s
- **Usar**: Carga inicial de dashboard, listas, perfil

### Progress Indicator
- `LinearProgressIndicator` en bottom de screen
- Color: `AppColors.primary`
- Mostrar porcentaje si es determinístico
- **Usar**: Subida de archivos, sincronización, proceso multi-paso

---

## Alertas de Confirmación (Dialog)

```
┌─────────────────────────────────────┐
│           [Icono opcional]          │
│           Título                    │
│                                     │
│   Descripción del mensaje que       │
│   requiere confirmación del         │
│   usuario para continuar.           │
│                                     │
│   [  Cancelar  ]  [  Confirmar  ]   │
└─────────────────────────────────────┘
```
- Ancho: `min(360px, 90% del screen)`
- Border radius: `AppShapes.lg` (16px)
- Padding: `AppSpacing.xl` (32px)
- Título: titleMD, centrado
- Descripción: bodyMD, centrada
- Cancelar: `AppButton` variant `ghost`
- Confirmar: `AppButton` variant `primary` (o `secondary` si destructivo)
- Icono: 48px, centrado, color según severidad

**Usar cuando**: Cerrar sesión, cancelar reserva, eliminar cuenta, confirmar pago, abandonar formulario con cambios
**NO usar**: Error simple (usar Banner Error), información simple (usar Banner Info)

---

## Errores de Formulario (Inline)

Los errores de validación de formularios **NO** usan el sistema de alertas Banner. Usan validación inline en los campos.

| Atributo | Valor |
|----------|-------|
| Color de borde | `AppColors.error` |
| Color de texto de error | `AppColors.error` |
| Icono de error | `Icons.error_outline`, 16px, al final del campo |
| Texto de error | labelMD, debajo del campo |
| Espaciado | `AppSpacing.xs` (4px) entre campo y mensaje |
| Animación | Fade in, 200ms |

**Reglas**:
- Mostrar error al perder foco (onBlur) o al intentar submit
- Ocultar error al empezar a escribir (onChange)
- No mostrar error en campo vacío hasta intentar submit
- Mensaje específico y accionable

---

## Accesibilidad

- **Screen readers**: Cada alerta con `Semantics(label: ...)` descriptivo
- **Contraste**: Ratio mínimo 4.5:1 entre texto y fondo
- **Tamaño táctil**: Botones mínimo 48x48px
- **Duración**: Alertas auto-cerrables visibles al menos 5s
- **Gestos**: Swipe horizontal para cerrar Banner
- **Teclado**: Escape para cerrar alertas (web/desktop)

---

## Reglas de Oro para Alertas

1. Una alerta a la vez (nueva reemplaza anterior o encola)
2. No bloquear sin razón (solo Loading Overlay o Confirmación Dialog cuando estrictamente necesario)
3. Mensajes claros: título + descripción que explique qué pasó y qué hacer
4. Acción accionable: siempre ofrecer una salida
5. No spam: no mostrar la misma alerta >1 vez por minuto
6. Contexto correcto: usar tipo de alerta apropiado
7. Consistencia: todas las alertas se ven y comportan igual

---

## Tests Requeridos

- [ ] `alert_service_test.dart` — Mostrar, cerrar, reemplazar alerta
- [ ] `alert_banner_test.dart` — Renderizado de cada tipo, tap en acción, tap en cerrar
- [ ] `alert_toast_test.dart` — Auto-cierre, tap para cerrar
- [ ] `confirmation_dialog_test.dart` — Tap confirmar, tap cancelar, cierre con Escape
- [ ] `loading_overlay_test.dart` — Bloqueo de UI, cierre programático
- [ ] `form_error_test.dart` — Validación inline, animación, limpieza al escribir


---

## Implementación de AlertService

```dart
// /core/alert/alert_service.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final alertServiceProvider = Provider<AlertService>((ref) => AlertService());

class AlertService {
  final List<Alert> _alerts = [];

  void show({
    required AlertType type,
    required String title,
    String? message,
    String? actionLabel,
    VoidCallback? onAction,
    bool dismissible = true,
  }) {
    // Implementación: añadir a una lista observable o usar un StateNotifier
    // El widget AlertBanner escucha esta lista y muestra las alertas
  }

  void dismiss() {
    _alerts.clear();
  }
}

enum AlertType { error, success, warning, info, system }

class Alert {
  final AlertType type;
  final String title;
  final String? message;
  final String? actionLabel;
  final VoidCallback? onAction;
  final bool dismissible;

  Alert({
    required this.type,
    required this.title,
    this.message,
    this.actionLabel,
    this.onAction,
    this.dismissible = true,
  });
}
```

> **Nota**: Esta es una implementación mínima. El widget `AlertBanner` debe ser un `ConsumerWidget` que escuche el estado de alertas y muestre un `MaterialBanner` o widget personalizado.
