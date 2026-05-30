# 🔐 AUTH - Feature Specification
## Autenticación del Portal Web

> **Feature**: Autenticación
> **Prioridad**: P0
> **Estado**: Pendiente
> **Dependencias**: Ninguna

---

## Descripción

Sistema de autenticación para residentes y administradores del conjunto residencial.
Soporta login con email/password, registro, recuperación de contraseña y autenticación social.

---

## User Stories

### US-001: Login con Email/Password
**Como** residente o administrador
**Quiero** iniciar sesión con mi email y contraseña
**Para** acceder al portal

**Criterios de Aceptación**:
- [ ] Formulario con campos email y password
- [ ] Validación de campos obligatorios
- [ ] Validación de formato de email
- [ ] Mensaje de error para credenciales inválidas
- [ ] Redirección automática al dashboard tras login exitoso
- [ ] Persistencia de sesión en localStorage

### US-002: Registro de Nuevo Usuario
**Como** nuevo residente
**Quiero** registrarme en el portal
**Para** acceder a los servicios del conjunto

**Criterios de Aceptación**:
- [ ] Formulario con nombre, email, teléfono, unidad, password
- [ ] Validación de todos los campos con Zod
- [ ] Confirmación de password
- [ ] Términos y condiciones
- [ ] Mensaje de éxito tras registro

### US-003: Recuperación de Contraseña
**Como** usuario
**Quiero** recuperar mi contraseña
**Para** volver a acceder al portal

**Criterios de Aceptación**:
- [ ] Formulario con campo email
- [ ] Mensaje de confirmación (sin revelar si el email existe)

### US-004: Autenticación Social
**Como** usuario
**Quiero** iniciar sesión con Google o Facebook
**Para** acceder más rápidamente

**Criterios de Aceptación**:
- [ ] Botones de login social

---

## Diseño

### Login Page
- Layout centrado con fondo orgánico (blobs)
- Card blanca con border-radius 16px
- Logo del conjunto en la parte superior
- Formulario con email y password
- Botón "Iniciar Sesión" primary navy
- Botones sociales debajo
- Link "Olvidé mi contraseña"
- Link "Registrarme"

### Register Page
- Layout similar al login
- Formulario extendido con campos adicionales
- Checkbox de términos y condiciones
- Botón "Registrarme"
- Link "Ya tengo cuenta"

### Forgot Password Page
- Layout similar al login
- Solo campo email
- Botón "Enviar instrucciones"
- Link "Volver al login"

---

## Componentes

### LoginForm.vue
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useAuthStore } from '../stores/authStore'
import { useAlert } from '@/core/composables/useAlert'

const email = ref('')
const password = ref('')
const errors = ref<Record<string, string>>({})

const authStore = useAuthStore()
const { showAlert } = useAlert()

const isLoading = computed(() => authStore.isLoading)

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

async function handleSubmit(): Promise<void> {
  errors.value = {}
  const result = loginSchema.safeParse({ email: email.value, password: password.value })
  if (!result.success) {
    result.error.errors.forEach((err) => { errors.value[err.path[0]] = err.message })
    return
  }
  await authStore.login(email.value, password.value)
  if (authStore.error) {
    showAlert({ type: 'error', title: 'Error de autenticación', message: authStore.error.message })
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <AppInput v-model="email" label="Email" type="email" placeholder="tu@email.com" :error="errors.email" />
    <AppInput v-model="password" label="Contraseña" type="password" placeholder="•••••••�? :error="errors.password" />
    <AppButton type="submit" label="Iniciar Sesión" variant="primary" :is-loading="isLoading" full-width />
  </form>
</template>
```

---

## Endpoints (Futuros)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/login | Login con email/password |
| POST | /auth/register | Registro de nuevo usuario |
| POST | /auth/logout | Cerrar sesión |
| POST | /auth/forgot-password | Solicitar recuperación |
| POST | /auth/reset-password | Resetear contraseña |
| GET | /auth/me | Obtener usuario actual |
| POST | /auth/social/google | Login con Google |
| POST | /auth/social/facebook | Login con Facebook |

---


## Tests

- [ ] `authStore.spec.ts` - Login, logout, estado de autenticación
- [ ] `fakeAuthService.spec.ts` - Validación de credenciales, tokens
- [ ] `LoginForm.spec.ts` - Renderizado, validación, submit
- [ ] `RegisterForm.spec.ts` - Validación de campos, registro
- [ ] `login-flow.spec.ts` - Flujo completo login -> dashboard

---

## Checklist de Implementación

- [ ] Crear estructura de carpetas del feature
- [ ] Implementar tipos y schemas (Zod)
- [ ] Implementar FakeAuthService
- [ ] Implementar useAuth composable
- [ ] Implementar authStore (Pinia)
- [ ] Crear LoginView.vue
- [ ] Crear RegisterView.vue
- [ ] Crear ForgotPasswordView.vue
- [ ] Crear LoginForm.vue
- [ ] Crear RegisterForm.vue
- [ ] Agregar rutas en app-router.ts
- [ ] Implementar guards de autenticación
- [ ] Agregar datos mock
- [ ] Escribir tests
