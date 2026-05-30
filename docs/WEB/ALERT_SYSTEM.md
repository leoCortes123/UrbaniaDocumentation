# 🔔 ALERT_SYSTEM
## Sistema de Alertas y Notificaciones del Portal Web

> **Consultar**: Si la tarea muestra mensajes al usuario, estados de carga, o requiere confirmación.
> **Regla de oro**: No uses `alert()`, `confirm()`, `prompt()`, `toast` directamente sin utilizar la API de alertas.

---

## Principios Generales

Toda comunicación visual de estado al usuario DEBE pasar por el sistema de alertas. **No uses `alert()`, `confirm()`, `prompt()`, `toast` directamente** sin utilizar la API de alertas.

---

## API de Uso

```typescript
// Desde cualquier composable o componente:
const { showAlert, showConfirm, showLoading, hideLoading } = useAlert()

showAlert({
  type: AlertType.ERROR,
  title: 'Título',
  message: 'Descripción opcional',
  actionLabel: 'Reintentar',
  onAction: () => { ... },
  dismissible: true,
})
```

---

## Tipos de Alertas

### Error
| Atributo | Valor |
|----------|-------|
| Icono | `pi pi-exclamation-circle` |
| Color | `bg-error/10`, texto `text-error` |
| Duración | 6s o manual |
| Posición | Top-right |
| Acción | "Cerrar" o "Reintentar" |

**Usar cuando**: Error de red, servidor, credenciales inválidas, permiso denegado, validación fallida
**NO usar cuando**: Error de validación de formulario (usar inline en campo)

### Success
| Atributo | Valor |
|----------|-------|
| Icono | `pi pi-check-circle` |
| Color | `bg-success/10`, texto `text-success` |
| Duración | 4s o manual |
| Posición | Top-right |

**Usar cuando**: Login exitoso, registro completado, reserva creada, pago procesado

### Warning
| Atributo | Valor |
|----------|-------|
| Icono | `pi pi-exclamation-triangle` |
| Color | `bg-warning/10`, texto `text-warning` |
| Duración | 6s o manual |
| Posición | Top-right |

**Usar cuando**: Conexión inestable, sesión próxima a expirar, datos desactualizados

### Info
| Atributo | Valor |
|----------|-------|
| Icono | `pi pi-info-circle` |
| Color | `bg-info/10`, texto `text-info` |
| Duración | 5s o manual |
| Posición | Top-right |

**Usar cuando**: Nuevas funciones, tips, mantenimiento programado

### System
| Atributo | Valor |
|----------|-------|
| Icono | `pi pi-bell` |
| Color | `bg-primary/10`, texto `text-primary` |
| Duración | 5s o persistente |
| Posición | Top-right o Bottom-right |

**Usar cuando**: Notificación push, actualización disponible, cambio de estado de reserva

---

## Estados de Carga y Progreso

### Loading Overlay
- Fondo: `bg-black/30`
- Spinner: `ProgressSpinner` de PrimeVue con color `primary`
- Bloquea UI (full screen overlay)
- **Usar**: Login, registro, carga crítica, procesamiento de pago

### Skeleton Loading
- Color base: `bg-surface-container`
- Color highlight: `bg-outline-variant`
- Border radius igual al widget real
- Animación: shimmer izquierda a derecha, 1.5s
- **Usar**: Carga inicial de dashboard, listas, perfil

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

- Ancho: `min(360px, 90% del viewport)`
- Border radius: `rounded-shape-lg` (16px)
- Padding: `p-8` (32px)
- Cancelar: `AppButton` variant `ghost`
- Confirmar: `AppButton` variant `primary` (o `secondary` si destructivo)

**Usar cuando**: Cerrar sesión, cancelar reserva, eliminar cuenta, confirmar pago

---

## Errores de Formulario (Inline)

Los errores de validación de formularios **NO** usan el sistema de alertas Banner. Usan validación inline en los campos.

| Atributo | Valor |
|----------|-------|
| Color de borde | `border-error` |
| Color de texto de error | `text-error` |
| Texto de error | `text-sm`, debajo del campo |
| Espaciado | `mt-1` (4px) entre campo y mensaje |

**Reglas**:
- Mostrar error al perder foco (`@blur`) o al intentar submit
- Ocultar error al empezar a escribir (`@input`)
- No mostrar error en campo vacío hasta intentar submit

---

## Reglas de Oro para Alertas

1. Una alerta a la vez (nueva reemplaza anterior o encola)
2. No bloquear sin razón
3. Mensajes claros: título + descripción
4. Acción accionable: siempre ofrecer una salida
5. No spam: no mostrar la misma alerta >1 vez por minuto
6. Contexto correcto: usar tipo de alerta apropiado
7. Consistencia: todas las alertas se ven y comportan igual

---

## Implementación de useAlert Composable

```typescript
// /core/composables/useAlert.ts
import { ref, computed } from 'vue'

export enum AlertType {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  SYSTEM = 'system',
}

export interface AlertOptions {
  type: AlertType
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  dismissible?: boolean
  duration?: number
}

export interface Alert extends AlertOptions {
  id: string
  createdAt: Date
}

const alerts = ref<Alert[]>([])
const isLoading = ref(false)

export function useAlert() {
  const activeAlert = computed(() => alerts.value[0] || null)

  function showAlert(options: AlertOptions): void {
    const alert: Alert = {
      ...options,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      dismissible: options.dismissible ?? true,
    }
    alerts.value = [alert, ...alerts.value].slice(0, 3)
    if (options.duration) {
      setTimeout(() => dismissAlert(alert.id), options.duration)
    }
  }

  function dismissAlert(id: string): void {
    alerts.value = alerts.value.filter((a) => a.id !== id)
  }

  function dismissAll(): void {
    alerts.value = []
  }

  function showLoading(): void {
    isLoading.value = true
  }

  function hideLoading(): void {
    isLoading.value = false
  }

  function showConfirm(options: Omit<AlertOptions, 'type'> & { onConfirm: () => void }): void {
    showAlert({
      type: AlertType.WARNING,
      ...options,
      actionLabel: options.actionLabel || 'Confirmar',
      onAction: options.onConfirm,
    })
  }

  return {
    alerts: computed(() => alerts.value),
    activeAlert,
    isLoading: computed(() => isLoading.value),
    showAlert,
    dismissAlert,
    dismissAll,
    showLoading,
    hideLoading,
    showConfirm,
  }
}
```
