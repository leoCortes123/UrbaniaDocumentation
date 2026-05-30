# ⚡ GOLDEN_RULES
## Reglas Inquebrantables del Proyecto Portal Web

> **Consultar**: Antes de escribir cualquier línea de código.

---

## 1. Arquitectura Feature-First + Composable Architecture
- Cada feature es un módulo aislado en `/src/features/[feature]/`
- Estructura interna: `composables/` → `services/` → `views/` + `components/`
- **NUNCA** un feature importa de otro feature. Comunicación solo vía `core/` o estado global Pinia

## 2. Separación Estricta de Capas
```
Views/Components -> Composables <- Services
     ^              ^
   Pinia Stores   Axios/Fetch
```
- **Views/Components** dependen de **Composables** (lógica de negocio)
- **Services** dependen de **Composables** (implementan interfaces)
- **Composables** NO dependen de nada externo en su lógica pura
- **NUNCA** una capa superior importa de una inferior
- **NUNCA** un feature importa de otro feature
- **NUNKA** `core/` importa de ningún feature

## 3. Responsabilidad Única
- Ningún componente hace más de una cosa
- Archivos >300 líneas → refactorizar inmediatamente
- Un componente/composable = un propósito claro y documentado

## 4. No AI Slop
- Código debe responder a un caso de uso real del negocio
- No código genérico, boilerplate innecesario, o "por si acaso"
- Cada línea justificada por un requerimiento funcional

## 5. Estado Predecible con Pinia
- Exclusivamente Pinia con Composition API (`defineStore`)
- No `reactive()` suelto, no `ref()` globales, no Vuex
- Estado global via stores, estado local via `ref()`/`computed()` en componentes

## 6. Tipado Estricto
- TypeScript `strict: true` obligatorio
- Interfaces bien definidas con Zod para validación runtime
- Parámetros de funciones tipados, no posicionales genéricos
- **NUNKA** usar `any`. Usar `unknown` + type narrowing si es necesario

## 7. Errores Controlados con Result Type
- **TODAS** las funciones que pueden fallar retornan `Result<T, AppError>`
- **NUNKA** lanzar excepciones crudas (`throw new Error()`)
- **NUNKA** usar `try/catch` sin mapear a `AppError`
- Usar clase `AppError` con subclases específicas

## 8. UI Desacoplada
- Lógica de negocio en `composables/`, **nunca** en templates
- Componentes reciben props y emits, no toman decisiones de negocio
- Presentación pura, sin `v-if` de lógica compleja

## 9. Alertas Estandarizadas
- Todo mensaje al usuario DEBE usar el sistema de alertas (`useAlert` composable)
- **Prohibido** usar `alert()`, `confirm()`, `prompt()`, `toast` directamente
- Ver documento ALERT_SYSTEM.md para tipos y usos correctos

## 10. Documentación Viva
- Completar secciones `** Pendiente **` con código real de implementación
- Actualizar FEATURES_INDEX cuando se agrega/modifica un feature
- Documentar decisiones técnicas no obvias en comentarios de código

## 11. Migración-Transparente
- `FakeService` debe ser intercambiable por `ApiService` sin tocar `composables/`
- Interfaces de service definidas en `composables/`, implementaciones en `services/`
- Preparar `ApiService` con mismas interfaces que `FakeService`

## 12. Flujo de Inicio de la Aplicación
- La app **siempre inicia en `/login`** (no en `/splash`)
- **CRÍTICO**: El redirect de Vue Router debe usar `beforeEach` guard con un watcher del auth store. Ver ROUTING.md para el patrón correcto.
- No hay splash screen separada; el loading se maneja en la pantalla de login
- Si hay sesión guardada, redirigir automáticamente a `/` desde el login

## 13. Prohibiciones Absolutas
- ❌ No usar `reactive()` para estado global
- ❌ No usar `any` en ningún contexto
- ❌ No usar Vuex, Redux, ni gestores de estado externos (usar Pinia)
- ❌ No usar `console.log()`, usar `console.warn()` o `console.error()` de forma controlada
- ❌ No crear archivos > 300 líneas
- ❌ No importar entre features (usar `core/` o `shared/`)
- ❌ No dejar código comentado o TODOs sin resolver
- ❌ No usar `document`/`window` fuera de la capa de composables/utilidades
- ❌ No hardcodear strings (usar `AppConstants` o i18n)
- ❌ No hardcodear colores fuera de `AppColors`
- ❌ No dejar datos mock en producción (usar `import.meta.env.MODE === 'development'`)

---

## Convenciones de Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Componentes | PascalCase | `LoginForm.vue`, `ResidentCard.vue` |
| Composables | camelCase + use | `useAuth.ts`, `useReservations.ts` |
| Stores | camelCase + Store | `authStore.ts`, `paymentStore.ts` |
| Services | camelCase + Service | `authService.ts`, `paymentService.ts` |
| Interfaces/Types | PascalCase | `Resident`, `Payment`, `ApiResponse` |
| Constantes | SCREAMING_SNAKE_CASE | `API_BASE_URL`, `MAX_RETRY_ATTEMPTS` |
| Archivos de feature | kebab-case | `login-form.vue`, `resident-card.vue` |
| Fake classes | Fake + nombre | `FakeAuthService`, `FakeReservationService` |

---

## Convenciones de Imports Ordenados

```typescript
// 1. Vue/Nuxt core
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 2. Paquetes externos
import { defineStore } from 'pinia'
import axios from 'axios'
import { z } from 'zod'

// 3. Core (absolutos)
import { AppError } from '@/core/errors/app-error'
import { AppColors } from '@/core/theme/app-colors'

// 4. Features (absolutos)
import type { Resident } from '@/features/auth/types/resident'

// 5. Relativos (mismo feature)
import { useAuth } from '../composables/useAuth'
import LoginForm from './LoginForm.vue'
```

---

## Estructura de Archivo Vue SFC

```vue
<script setup lang="ts">
// 1. Imports
// 2. Props y emits
// 3. Composables
// 4. Lógica local
// 5. Computed
// 6. Methods
// 7. Watchers
// 8. Lifecycle hooks
</script>

<template>
  <!-- Markup semántico -->
</template>

<style scoped>
/* Solo para casos que Tailwind no cubre */
</style>
```
