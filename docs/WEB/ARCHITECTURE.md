# 🏗️ ARCHITECTURE
## Arquitectura del Proyecto Portal Web

> **Consultar**: Antes de implementar cualquier feature nuevo o modificar la estructura.
> **Relacionado con**: GOLDEN_RULES.md, DEVELOPMENT_GUIDE.md

---

## 1. Stack Tecnológico

| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Framework | Vue.js 3 | ^3.4 | Composition API, reactivity system moderno |
| Build Tool | Vite | ^5.x | HMR ultrarrápido, tree-shaking optimizado |
| Lenguaje | TypeScript | ^5.x | Tipado estricto, DX superior |
| Estilos | Tailwind CSS | ^3.4 | Utility-first, consistente, mantenible |
| Componentes UI | PrimeVue | ^3.x | Componentes accesibles, tematización |
| Gestión de Estado | Pinia | ^2.x | Stores tipados, Composition API nativo |
| Router | Vue Router | ^4.x | Declarativo, deep linking, guards |
| HTTP Client | Axios | ^1.x | Interceptors, cancel tokens, tipado |
| Validación | Zod | ^3.x | Schema validation runtime + TypeScript |
| Real-time | Laravel Echo | ^1.x | WebSockets para chat y notificaciones |
| Gráficos | Chart.js | ^4.x | Visualización de métricas y reportes |
| Testing | Vitest + Vue Test Utils | ^1.x | Testing rápido, mocks nativos |
| Functional Programming | neverthrow | ^6.x | `Result<T, E>` para manejo de errores |

> **Regla de versiones**: Siempre última estable. Si hay conflicto, documentar en tabla con columna "Restricción" e intentar instalar la version que no genere conflicto siempre priorizando las librerias mas importantes.

---

## 2. Arquitectura: Feature-First + Composable Architecture

```
/src
├── main.ts
├── App.vue
├── /core
│   ├── /constants          # AppConstants, ApiConstants, RouteNames
│   ├── /network            # AxiosClient, NetworkInfo, ApiException
│   ├── /storage            # LocalStorage, IndexedDB config
│   ├── /errors             # AppError (clase base), ErrorHandler
│   ├── /utils              # Composables globales, Helpers, Validators
│   ├── /theme              # AppTheme, AppColors, AppTypography
│   └── /router             # AppRouter (configuración central de Vue Router)
├── /features
│   ├── /auth
│   │   ├── /composables
│   │   ├── /services
│   │   ├── /stores
│   │   ├── /types
│   │   ├── /views
│   │   └── /components
│   ├── /home
│   ├── /profile
│   ├── /reservations
│   ├── /payments
│   ├── /pqrs
│   ├── /notifications
│   ├── /chat
│   └── /admin
│
├── /shared
│   └── /components          # Componentes globales (AppButton, AppInput, etc.)
│
├── /assets/
│   ├── /css                 # main.css, theme.css
│   └── /fonts               # Hanken Grotesk, Inter (si self-hosted)
│
└── /test/                   # Tests globales, setup, mocks
```

### Principios
- Cada directorio en `/src/features` (excepto `core` y `shared`) = **funcionalidad de negocio completa**
- **Ningún feature importa de otro feature**. Comunicación solo a través de `core/` o estado global Pinia
- `core/` = todo lo transversal: networking, storage, errores, tema, router, utilidades
- `shared/` = componentes y composables reutilizables entre múltiples features

---

## 3. Reglas de Dependencia (SOLID estricto)

```
Views/Components -> Composables <- Services
     ^              ^
   Pinia Stores   Axios/Fetch
```

- **Views/Components** dependen de **Composables** (lógica de negocio)
- **Services** dependen de **Composables** (implementan interfaces)
- **Composables** NO dependen de nada externo en su lógica pura
- **NUNKA** una capa superior importa de una inferior
- **NUNKA** un feature importa de otro feature
- **NUNKA** `core/` importa de ningún feature

---

## 4. Manejo de Errores (Clase AppError Obligatoria)

**TODAS** las funciones que pueden fallar retornan `Result<T, AppError>` (neverthrow)
- Usar `neverthrow` para el tipo `Result`
- **NUNKA** lanzar excepciones crudas (`throw new Error()`)
- **NUNKA** usar `try/catch` sin mapear a `AppError`

```typescript
// /core/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NetworkError extends AppError {
  constructor() {
    super(ErrorCode.NETWORK_ERROR, 'Verifica tu conexión a internet')
  }
}

export class ServerError extends AppError {
  constructor() {
    super(ErrorCode.SERVER_ERROR, 'Error del servidor. Inténtalo más tarde')
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(ErrorCode.UNAUTHORIZED, 'Sesión expirada. Inicia sesión de nuevo')
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(ErrorCode.VALIDATION_ERROR, message, details)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(ErrorCode.CONFLICT, message)
  }
}

export class NotFoundError extends AppError {
  constructor() {
    super(ErrorCode.NOT_FOUND, 'Recurso no encontrado')
  }
}

export class BusinessLogicError extends AppError {
  constructor(message: string) {
    super(ErrorCode.BUSINESS_LOGIC, message)
  }
}

```

---

## 5. Estado de UI con Pinia (Patrón Store + Composable)

> **IMPORTANTE**: Usar exclusivamente `defineStore` con Composition API. NO usar Options API.

```typescript
// /features/auth/stores/authStore.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuth } from '../composables/useAuth'
import type { Resident } from '../types/resident'
import { AppError } from '@/core/errors/app-error'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<Resident | null>(null)
  const isLoading = ref(false)
  const error = ref<AppError | null>(null)

  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Actions
  const { login: loginComposable } = useAuth()

  async function login(email: string, password: string): Promise<void> {
    isLoading.value = true
    error.value = null

    const result = await loginComposable(email, password)

    result.match(
      (resident) => {
        user.value = resident
      },
      (err) => {
        error.value = err
      }
    )

    isLoading.value = false
  }

  function logout(): void {
    user.value = null
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  }
})
```

---

## 6. Configuración de Axios (Singleton)

```typescript
// /core/network/axios-client.ts
import axios, { type AxiosInstance, type AxiosError } from 'axios'

class AxiosClient {
  private static instance: AxiosInstance | null = null

  static getInstance(): AxiosInstance {
    if (!this.instance) {
      this.instance = this.createAxios()
    }
    return this.instance
  }



  private static createAxios(): AxiosInstance {
    const client = axios.create({
      baseURL: 'https://urbaniaapi.tuapp.com/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('jwt_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('jwt_token')
        }
        return Promise.reject(error)
      }
    )

    return client
  }
}

export const axiosClient = AxiosClient.getInstance()
```

---

## 7. Configuración de Persistencia Local

### localStorage (Key-Value)
```typescript
// /core/storage/local-storage.ts
export class LocalStorage {
  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }

  static setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key)
  }

  static clear(): void {
    localStorage.clear()
  }
}
```

### IndexedDB (Estructurado)
```typescript
// /core/storage/indexed-db.ts
export class AppDatabase {
  private db: IDBDatabase | null = null
  private readonly dbName = 'urbania_portal'
  private readonly version = 1

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const stores = ['residents', 'reservations', 'payments', 'pqrs', 'notifications', 'chatMessages']
        stores.forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' })
          }
        })
      }
    })
  }

  // Métodos CRUD genéricos...
}
```

---

## 8. Testing Obligatorio

Cada feature DEBE incluir:
- Unit tests para composables (Vitest)
- Unit tests para services (mock axios)
- Component tests para vistas principales (Vue Test Utils)

---

## 9. Breakpoints de Diseño

| Nombre | Ancho | Uso |
|--------|-------|-----|
| Mobile | < 640px | Layout por defecto (sm) |
| Tablet | 640-1024px | 2 columnas en grids (md/lg) |
| Desktop | > 1024px | 3 columnas, sidebar permanente (xl/2xl) |
| Wide | > 1536px | Layout expandido (2xl) |

> Usar breakpoints de Tailwind: `sm`, `md`, `lg`, `xl`, `2xl`
