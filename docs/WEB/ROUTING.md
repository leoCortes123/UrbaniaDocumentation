# 🧭 ROUTING
## Sistema de Navegación del Portal Web

> **Consultar**: Si la tarea involucra navegación, nuevas pantallas, o modificación de flujo de autenticación.
> **Relacionado con**: ARCHITECTURE.md, FEATURES_INDEX.md

---

## Configuración Vue Router

```typescript
// /core/router/app-router.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/stores/authStore'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  // Rutas Públicas
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/features/auth/views/RegisterView.vue'),
    meta: { public: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/features/auth/views/ForgotPasswordView.vue'),
    meta: { public: true },
  },

  // Rutas Protegidas
  {
    path: '/',
    name: 'Home',
    component: () => import('@/features/home/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/features/profile/views/ProfileView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('@/features/payments/views/PaymentsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/features/notifications/views/NotificationsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/ingresos',
    name: 'Ingresos',
    component: () => import('@/features/ingresos/views/IngresosView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: () => import('@/features/reservations/views/ReservationsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/pqrs',
    name: 'Pqrs',
    component: () => import('@/features/pqrs/views/PqrsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('@/features/chat/views/ChatView.vue'),
    meta: { requiresAuth: true },
  },

  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/core/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const isPublicRoute = to.meta.public === true

  if (!isAuthenticated && !isPublicRoute) {
    next('/login')
    return
  }

  if (isAuthenticated && isPublicRoute && to.path !== '/') {
    next('/')
    return
  }

  next()
})

export default router
```

> **⚠️ CRÍTICO - Patrón Vue Router + Pinia**:
> El `beforeEach` guard debe combinarse con un watcher en el store de auth:
> ```typescript
> // En authStore.ts
> watch(isAuthenticated, (newValue) => {
>   if (newValue && router.currentRoute.value.meta.public) {
>     router.push('/')
>   }
>   if (!newValue && !router.currentRoute.value.meta.public) {
>     router.push('/login')
>   }
> })
> ```

---

## Rutas Definidas

### Rutas Públicas

| Ruta | View | Descripción |
|------|------|-------------|
| `/login` | LoginView | Login email/password + botones sociales |
| `/register` | RegisterView | Registro de nuevo usuario |
| `/forgot-password` | ForgotPasswordView | Recuperación de contraseña |

### Rutas Protegidas

| Ruta | View | Feature | Descripción |
|------|------|---------|-------------|
| `/` | HomeView | Home | Dashboard principal |
| `/profile` | ProfileView | Profile | Perfil y configuración |
| `/payments` | PaymentsView | Payments | Pagos y administración |
| `/notifications` | NotificationsView | Notifications | Notificaciones |
| `/ingresos` | IngresosView | Ingresos | Control de ingresos/visitas |
| `/reservations` | ReservationsView | Reservations | Reservas de zonas comunes |
| `/pqrs` | PqrsView | PQRS | PQRS del residente |
| `/chat` | ChatView | Chat | Chat con administración |

### Sidebar Navigation

El Sidebar principal navega a:
- **Inicio** → `/`
- **Pagos** → `/payments`
- **Notificaciones** → `/notifications`
- **Ingresos** → `/ingresos`
- **Reservas** → `/reservations`
- **PQRS** → `/pqrs`
- **Chat** → `/chat`
- **Perfil** → `/profile`

---

## Navegación Programática

```typescript
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Navegar a ruta
router.push('/profile')

// Reemplazar history
router.replace('/profile')

// Navegar atrás
router.back()

// Con parámetros
router.push(`/reservations/${reservationId}`)

// Con query params
router.push({ path: '/reservations', query: { zone: 'salon-social' } })

// Leer query params
const zone = route.query.zone
```
