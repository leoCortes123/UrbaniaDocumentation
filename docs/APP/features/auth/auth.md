# LoginScreen — Especificación de Diseño

## 1. Meta

* **Objetivo**: Permitir la autenticación segura del usuario mediante correo electrónico y contraseña.
* **Usuario objetivo**: Residentes, propietarios y administradores autorizados.
* **Contexto de uso**: Primera pantalla mostrada al abrir la aplicación cuando no existe una sesión activa.
* **Rol en el sistema**: Punto de entrada principal al ecosistema Urbania.

---

## 2. Jerarquía Visual

Orden de importancia visual:

1. Logo de Urbania.
2. Formulario de inicio de sesión.
3. Botón "Iniciar sesión".
4. Enlaces secundarios (Recuperar contraseña).

La atención visual debe dirigirse inmediatamente al formulario de autenticación.

---

## 3. Estilo Visual

### Principios

* Diseño moderno y profesional.
* Interfaz limpia y minimalista.
* Enfoque en simplicidad y rapidez de acceso.
* Alta legibilidad en todos los tamaños de pantalla.
* Consistencia con el Design System global.

### Prohibido

* Glassmorphism.
* Neumorphism.
* Sombras excesivas.
* Animaciones innecesarias.
* Fondos recargados.
* Gradientes agresivos.

### Fondo Decorativo

* Utilizar blob shapes orgánicas como elementos decorativos.
* Bordes sólidos y definidos.
* Ubicadas en esquinas superiores e inferiores.
* No deben interferir con la lectura del formulario.
* Sin blur ni efectos glow.

---

## 4. Estructura Visual

### Layout General

* Pantalla sin scroll vertical.
* SafeArea obligatoria.
* Todo el contenido debe permanecer visible en dispositivos móviles estándar.

### Distribución Vertical

| Sección              | Altura |
| -------------------- | ------ |
| Logo y branding      | 30%    |
| Formulario login     | 45%    |
| Acciones secundarias | 15%    |
| Espaciado flexible   | 10%    |

---

## 5. Componentes Reutilizables

### `AppLogo`

| Prop           | Tipo     | Descripción                     |
| -------------- | -------- | ------------------------------- |
| `size`         | `double` | Tamaño del logo                 |
| `showSubtitle` | `bool`   | Mostrar nombre de la aplicación |

**Estados:** default

---

### `EmailTextField`

| Prop         | Tipo                    | Descripción              |
| ------------ | ----------------------- | ------------------------ |
| `controller` | `TextEditingController` | Controlador del campo    |
| `enabled`    | `bool`                  | Habilitado/deshabilitado |
| `errorText`  | `String?`               | Mensaje de error         |

**Estados:** default, focused, error, disabled

---

### `PasswordTextField`

| Prop          | Tipo                    | Descripción                |
| ------------- | ----------------------- | -------------------------- |
| `controller`  | `TextEditingController` | Controlador del campo      |
| `obscureText` | `bool`                  | Mostrar/ocultar contraseña |
| `enabled`     | `bool`                  | Habilitado/deshabilitado   |
| `errorText`   | `String?`               | Mensaje de error           |

**Estados:** default, focused, error, disabled

---

### `LoginButton`

| Prop        | Tipo           | Descripción              |
| ----------- | -------------- | ------------------------ |
| `isLoading` | `bool`         | Estado de carga          |
| `enabled`   | `bool`         | Habilitado/deshabilitado |
| `onPressed` | `VoidCallback` | Acción principal         |

**Estados:** default, loading, disabled

---

### `ForgotPasswordLink`

| Prop    | Tipo           | Descripción         |
| ------- | -------------- | ------------------- |
| `onTap` | `VoidCallback` | Acción al presionar |

**Estados:** default, pressed

---

## 6. Formulario de Login

### Campos

#### Correo Electrónico

* Tipo email.
* Teclado optimizado para email.
* Autocorrección deshabilitada.
* Capitalización deshabilitada.

#### Contraseña

* Campo oculto por defecto.
* Permitir mostrar/ocultar contraseña.
* Longitud mínima validable por backend.
* No almacenar localmente.

### Validaciones

#### Email

* Obligatorio.
* Formato de email válido.

#### Contraseña

* Obligatoria.
* No permitir cadena vacía.

### Botón Login

* Habilitado únicamente cuando ambos campos contienen datos válidos.
* Mostrar indicador de carga durante autenticación.
* Deshabilitar múltiples solicitudes simultáneas.

---

## 7. Estados de Pantalla

### Default

* Logo visible.
* Campos vacíos.
* Botón deshabilitado.

### Loading

* Campos bloqueados.
* Botón reemplazado por indicador de progreso.
* Sin interacción del usuario.

### Error

* Mensaje de error debajo del formulario.
* Mantener valores ingresados.
* No limpiar campos automáticamente.

### Success

* Navegación automática hacia HomeScreen.

---

## 8. Interacciones y Comportamiento

### Gestos

| Gesto | Componente                 | Resultado              |
| ----- | -------------------------- | ---------------------- |
| Tap   | Campo Email                | Obtener foco           |
| Tap   | Campo Password             | Obtener foco           |
| Tap   | Mostrar/Ocultar contraseña | Cambiar visibilidad    |
| Tap   | LoginButton                | Iniciar autenticación  |
| Tap   | Recuperar contraseña       | Navegar a recuperación |

### Animaciones

| Animación                     | Duración |
| ----------------------------- | -------- |
| Aparición error               | 200ms    |
| Loading button                | 150ms    |
| Cambio visibilidad contraseña | 150ms    |

---

## 9. Navegación

### Inputs

Ninguno.

### Outputs

| Acción               | Destino              |
| -------------------- | -------------------- |
| Login exitoso        | HomeScreen           |
| Recuperar contraseña | ForgotPasswordScreen |

### Deep Links

```text
urbania://login
```

---

## 10. Arquitectura Obligatoria

### Capas

* Presentation
* ViewModel
* Domain
* Data

### Restricciones

* La UI nunca consume repositorios directamente.
* La UI nunca contiene lógica de autenticación.
* Toda autenticación debe pasar por AuthViewModel.
* Validaciones centralizadas.

---

## 11. Decisiones Prohibidas

El agente NO debe:

* Hardcodear credenciales.
* Hardcodear colores.
* Hardcodear estilos.
* Mezclar UI y lógica.
* Consumir APIs directamente desde widgets.
* Guardar contraseñas en texto plano.
* Implementar navegación dentro de widgets reutilizables.
* Modificar la arquitectura definida.

---

## 12. Acceptance Criteria

La implementación será válida únicamente si:

* Todos los elementos son visibles sin scroll.
* El formulario está centrado visualmente.
* El botón login muestra loading durante autenticación.
* Los errores se muestran sin perder los datos ingresados.
* No existen RenderFlex Overflow.
* No existen colores hardcodeados.
* No existen estilos hardcodeados.
* Toda la UI consume Theme.
* Toda la lógica depende de AuthViewModel.
* El login puede conectarse a una API real sin modificar la estructura de widgets.

---

## 13. Archivos Esperados

```text
lib/
├── features/
│   └── auth/
│       ├── presentation/
│       │   ├── screens/
│       │   │   └── login_screen.dart
│       │   └── widgets/
│       │       ├── app_logo.dart
│       │       ├── email_text_field.dart
│       │       ├── password_text_field.dart
│       │       ├── login_button.dart
│       │       └── forgot_password_link.dart
│       ├── viewmodels/
│       │   └── auth_view_model.dart
│       └── auth_dimensions.dart
```

---

## 14. Checklist de Implementación

### Layout

* [ ] SafeArea aplicada.
* [ ] Sin scroll vertical.
* [ ] Logo visible.
* [ ] Formulario centrado.

### Formulario

* [ ] Campo email implementado.
* [ ] Campo contraseña implementado.
* [ ] Mostrar/Ocultar contraseña.
* [ ] Validaciones locales.

### Login

* [ ] Estado loading.
* [ ] Estado error.
* [ ] Estado success.

### Arquitectura

* [ ] AuthViewModel desacoplado.
* [ ] Mock data reemplazable.
* [ ] Preparado para API futura.

---
