# 🛠️ DEVELOPMENT_GUIDE
## Guía de Desarrollo del Proyecto Portal Web

> **Consultar**: Antes de empezar a codear cualquier tarea.

---

## Setup Inicial del Proyecto

### 1. Crear proyecto Vite + Vue 3
```bash
PNPM create vite@latest urbania-portal -- --template vue-ts
cd urbania-portal
```

### 2. Instalar dependencias
```bash
# Core
PNPM install vue@^3.4 vue-router@^4 pinia@^2

# Build & Dev
PNPM install -D vite@^5 @vitejs/plugin-vue@^5 typescript@^5 vue-tsc@^1

# Estilos
PNPM install -D tailwindcss@^3.4 postcss autoprefixer
PNPM install -D tailwindcss-primeui
npx tailwindcss init -p

# Componentes UI
PNPM install primevue@^3 primeicons

# HTTP & Validación
PNPM install axios@^1 zod@^3

# Functional Programming
PNPM install neverthrow@^6

# Real-time
PNPM install laravel-echo pusher-js

# Gráficos
PNPM install chart.js@^4 vue-chartjs@^5

# Utils
PNPM install date-fns

# Testing
PNPM install -D vitest@^1 @vue/test-utils@^2 jsdom@^24
PNPM install -D @testing-library/vue @testing-library/jest-dom

# Linting
PNPM install -D eslint@^8 @vue/eslint-config-typescript@^12 prettier@^3 eslint-plugin-vue@^9
```

### 3. Configurar TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 4. Configurar Vite
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

### 5. Configurar Tailwind CSS
```javascript
// tailwind.config.js - Ver THEME_SYSTEM.md para tokens completos
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: { extend: { /* tokens */ } },
  plugins: [require('tailwindcss-primeui')],
}
```

```css
/* src/assets/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
@import './theme.css';
@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
```

### 6. Configurar main.ts
```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'

import App from './App.vue'
import router from './core/router/app-router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true, theme: 'none' })
app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)

app.mount('#app')
```

---

## Comandos Útiles

```bash
# Instalar dependencias
PNPM install

# Desarrollo
PNPM run dev

# Build producción
PNPM run build

# Preview build
PNPM run preview

# Tests
PNPM run test

# Tests con coverage
PNPM run test:coverage

# Tests watch mode
PNPM run test:watch

# Lint
PNPM run lint

# Type check
PNPM run type-check


# Build prod
PNPM run build -- --mode production
```

---

## Convenciones de Código

### Imports ordenados
```typescript
// 1. Vue core
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

### Estructura de archivo Vue SFC
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

---

## ✅ Checklist de Verificación Post-Implementación

Antes de considerar una tarea completada, verificar:

```bash
# 1. Type check (debe retornar 0 errores)
PNPM run type-check

# 2. Lint (debe retornar 0 errores)
PNPM run lint

# 3. Tests (deben pasar todos)
PNPM run test

# 4. Verificar que no hay imports entre features
# Buscar: import '../[otro_feature]/' o import '@/features/[otro_feature]/'

# 5. Verificar que no se usa any
# Buscar: ': any' o 'as any' en archivos de src/

# 6. Verificar que no hay archivos > 300 líneas
find src -name '*.vue' -o -name '*.ts' | xargs wc -l | sort -n | tail -10

# 7. Verificar que todos los mensajes al usuario usan useAlert
# Buscar: alert(, confirm(, prompt(, toast(

# 8. Verificar que todas las funciones que pueden fallar retornan Result
# Buscar: 'throw new Error' o 'throw' sin mapear a AppError
```

> **Regla de oro**: Si `PNPM run type-check` retorna errores, la tarea NO está completa.
