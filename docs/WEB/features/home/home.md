# 🏠 HOME - Feature Specification
## Dashboard Principal del Portal Web

> **Feature**: Home / Dashboard
> **Prioridad**: P0
> **Estado**: Pendiente
> **Dependencias**: Auth

---

## Descripción

Dashboard principal que muestra métricas, resumen de actividades, accesos rápidos y notificaciones recientes para el residente.

---

## User Stories

### US-001: Ver Resumen del Dashboard
**Como** residente autenticado
**Quiero** ver un resumen de mi actividad reciente
**Para** tener una visión general de mi estado en el conjunto

**Criterios de Aceptación**:
- [ ] Tarjetas de métricas principales (pagos pendientes, reservas activas, notificaciones sin leer, PQRS abiertas)
- [ ] Gráfico de pagos mensuales (Chart.js)
- [ ] Lista de actividad reciente
- [ ] Accesos rápidos a features principales

### US-002: Ver Notificaciones Recientes
**Como** residente
**Quiero** ver mis notificaciones más recientes en el dashboard
**Para** estar al tanto de las novedades

**Criterios de Aceptación**:
- [ ] Lista de últimas 5 notificaciones
- [ ] Indicador de no leídas
- [ ] Link "Ver todas" que navega a /notifications

### US-003: Accesos Rápidos
**Como** residente
**Quiero** tener accesos directos a las funciones más usadas
**Para** navegar más rápidamente

**Criterios de Aceptación**:
- [ ] Grid de accesos rápidos (Reservas, Pagos, PQRS, Chat)
- [ ] Iconos representativos
- [ ] Navegación al hacer click

---

## Diseño

### Layout
- Sidebar de navegación fija (desktop) / drawer (mobile)
- Header con título y perfil de usuario
- Grid de métricas en la parte superior
- Gráfico de pagos en la mitad
- Lista de actividad reciente abajo
- Accesos rápidos en sidebar o grid inferior

### Métricas Cards
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Pagos      │ │  Reservas   │ │  Notif.     │ │  PQRS       │
│             │ │             │ │             │ │             │
│   $450.000  │ │     2       │ │     3       │ │     1       │
│  Pendientes │ │   Activas   │ │ Sin leer    │ │  Abiertas   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Componentes

### DashboardView.vue
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useDashboard } from '../composables/useDashboard'
import MetricsCards from '../components/MetricsCards.vue'
import PaymentsChart from '../components/PaymentsChart.vue'
import RecentActivity from '../components/RecentActivity.vue'
import QuickAccess from '../components/QuickAccess.vue'

const authStore = useAuthStore()
const { metrics, recentActivity, isLoading, error } = useDashboard()

const userName = computed(() => authStore.user?.name || 'Usuario')
</script>

<template>
  <div class="flex flex-col gap-stack-lg">
    <header>
      <h1 class="font-heading text-headline-lg-mobile md:text-headline-lg text-on-surface">
        ¡Hola, {{ userName }}!
      </h1>
      <p class="text-body-md text-on-surface-variant">
        Aquí está el resumen de tu conjunto residencial
      </p>
    </header>

    <MetricsCards :metrics="metrics" :loading="isLoading" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-stack-md">
      <PaymentsChart :data="metrics.payments" />
      <RecentActivity :activities="recentActivity" />
    </div>

    <QuickAccess />
  </div>
</template>
```

### MetricsCards.vue
```vue
<script setup lang="ts">
import AppCard from '@/shared/components/AppCard.vue'
import type { DashboardMetric } from '../types/dashboard'

interface Props {
  metrics: DashboardMetric[]
  loading?: boolean
}

withDefaults(defineProps<Props>(), { loading: false })
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-stack-md">
    <AppCard v-for="metric in metrics" :key="metric.id" clickable class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl">{{ metric.icon }}</span>
        <span class="text-label-sm uppercase text-on-surface-variant">{{ metric.label }}</span>
      </div>
      <span class="font-heading text-title-md text-on-surface">{{ metric.value }}</span>
      <span class="text-sm text-on-surface-variant">{{ metric.description }}</span>
    </AppCard>
  </div>
</template>
```

### PaymentsChart.vue
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import type { PaymentHistory } from '../types/dashboard'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props { data: PaymentHistory[] }
const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.data.map((d) => d.month),
  datasets: [{
    label: 'Pagos',
    data: props.data.map((d) => d.amount),
    borderColor: '#002855',
    backgroundColor: 'rgba(0, 40, 85, 0.1)',
    fill: true,
    tension: 0.4,
  }],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
    x: { grid: { display: false } },
  },
}
</script>

<template>
  <AppCard class="h-80">
    <h3 class="font-heading text-title-md text-on-surface mb-4">Historial de Pagos</h3>
    <Line :data="chartData" :options="chartOptions" class="h-64" />
  </AppCard>
</template>
```

---

## Endpoints (Futuros)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /dashboard/metrics | Métricas del dashboard |
| GET | /dashboard/activity | Actividad reciente |
| GET | /dashboard/payments-chart | Datos para gráfico de pagos |

---

---

## Tests

- [ ] `useDashboard.spec.ts` - Carga de métricas, cálculos
- [ ] `DashboardView.spec.ts` - Renderizado, estados de carga
- [ ] `MetricsCards.spec.ts` - Renderizado de métricas
- [ ] `PaymentsChart.spec.ts` - Renderizado del gráfico
- [ ] `dashboard-flow.spec.ts` - Flujo completo

---

## Checklist de Implementación

- [ ] Crear estructura de carpetas del feature
- [ ] Implementar tipos y schemas (Zod)
- [ ] Implementar FakeHomeService
- [ ] Implementar useDashboard composable
- [ ] Implementar homeStore (Pinia)
- [ ] Crear HomeView.vue (Dashboard)
- [ ] Crear MetricsCards.vue
- [ ] Crear PaymentsChart.vue
- [ ] Crear RecentActivity.vue
- [ ] Crear QuickAccess.vue
- [ ] Agregar ruta en app-router.ts
- [ ] Implementar layout con sidebar
- [ ] Agregar datos mock
- [ ] Escribir tests
