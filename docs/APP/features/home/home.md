## 1. Meta

* **Objetivo**: Pantalla principal que muestra saludo al usuario, notificaciones rápidas, accesos directos a módulos principales y navegación inferior.
* **Usuario objetivo**: Residentes/propietarios de la unidad inmobiliaria.
* **Contexto de uso**: Punto de entrada por defecto después del login.
* **Rol en el sistema**: Hub central estático sin scroll.

---

## 2. Jerarquía Visual

Orden de importancia visual:

1. Notificación activa del carrusel.
2. Saludo del usuario.
3. Accesos rápidos.
4. Bottom Navigation Bar.

La atención visual debe dirigirse primero al carrusel activo.

---

## 3. Estilo Visual

### Principios

* Diseño moderno tipo fintech.
* Apariencia limpia y profesional.
* Priorizar legibilidad sobre decoración.
* Uso moderado de elevaciones.
* Alto contraste entre contenido y fondo.

### Prohibido

* Glassmorphism.
* Neumorphism.
* Sombras excesivas.
* Gradientes agresivos.
* Efectos glow.
* Bordes difuminados.
* Elementos decorativos que reduzcan legibilidad.

### Fondo Decorativo

* Utilizar blob shapes orgánicas como elementos de fondo.
* Las formas deben ser asimétricas.
* Bordes sólidos y definidos.
* Sin blur.
* Sin transparencias extremas.
* Ubicadas detrás de las secciones principales para reforzar la separación visual.

---

## 4. Estructura Visual

### Layout General

* Pantalla completamente estática.
* Sin scroll vertical.
* SafeArea obligatorio.
* Sin separadores visibles entre secciones.

### Distribución Vertical

| Sección                    | Altura |
| -------------------------- | ------ |
| Banner principal           | 25%    |
| Carrusel de notificaciones | 25%    |
| Grid de navegación         | 40%    |
| Bottom Navigation Bar      | 10%    |

Estas proporciones son obligatorias.

---

## 5. Grid Principal

### Reglas

* 9 módulos fijos.
* Distribución obligatoria: 3 columnas × 3 filas.
* Todos los botones deben tener el mismo tamaño.
* No se permite scroll interno.
* Todos los módulos deben ser visibles simultáneamente.

### Orden

1. Estado
2. Pagos
3. Visitas
4. Parqueadero
5. Reservas
6. Comunidad
7. Eventos
8. Configuración
9. Contáctanos

---

## 6. NotificationCarousel

### Comportamiento Obligatorio

* Swipe horizontal habilitado.
* Implementado mediante PageView.
* La pantalla principal no debe desplazarse.
* La tarjeta activa siempre ocupa el centro.
* Deben verse parcialmente las tarjetas laterales.
* Las tarjetas laterales usan estado semiTransparent.
* La tarjeta central usa estado active.

### Estados Visuales

| Estado          | Escala | Opacidad |
| --------------- | ------ | -------- |
| active          | 1.0    | 1.0      |
| semiTransparent | 0.92   | 0.7      |
| empty           | N/A    | N/A      |

### Reglas

* Animación de escala suave al cambiar página.
* Animación de opacidad suave.
* Compatible con cualquier cantidad de notificaciones.
* Mantener legibilidad en todos los tamaños de pantalla.

---

## 7. Arquitectura Obligatoria

### Capas

* Presentation
* ViewModel
* Domain
* Data

### Restricciones

* La UI nunca consume repositorios directamente.
* La UI nunca contiene lógica de negocio.
* Los widgets solo consumen ViewModels.
* Los ViewModels gestionan estado y orquestación.

---

## 8. Decisiones Prohibidas

El agente NO debe:

* Modificar la estructura de carpetas definida.
* Cambiar nombres de componentes.
* Crear widgets inline que sustituyan componentes reutilizables.
* Hardcodear colores.
* Hardcodear tipografías.
* Hardcodear espaciados.
* Agregar dependencias sin justificación.
* Introducir patrones arquitectónicos distintos a los especificados.
* Agregar scroll vertical.
* Modificar las proporciones de layout.

---

## 9. Acceptance Criteria

La implementación será válida únicamente si:

* Toda la pantalla es visible sin scroll.
* Los 9 módulos son visibles simultáneamente.
* El carrusel permite swipe horizontal.
* El Bottom Navigation Bar permanece fijo.
* No existen RenderFlex Overflow.
* No existen colores hardcodeados.
* No existen textos hardcodeados fuera de mocks.
* Todos los componentes definidos son reutilizables.
* Todos los estilos provienen del Theme.
* Todos los espaciados provienen del Design System.
* La UI puede conectarse a ViewModels sin modificaciones estructurales.

---

## 10. Checklist Corregido

### Layout

* [ ] SafeArea envuelve toda la pantalla.
* [ ] Column con Banner, Carrusel, Grid y BottomNavigationBar.
* [ ] Ratios aplicados: 25% / 25% / 40% / 10%.
* [ ] Sin scroll vertical.

### Carrusel

* [ ] PageView con scroll horizontal habilitado.
* [ ] Tarjeta activa centrada.
* [ ] Tarjetas laterales parcialmente visibles.
* [ ] Escala y opacidad animadas.
* [ ] Estado vacío soportado.

### Grid

* [ ] 3 columnas.
* [ ] 3 filas.
* [ ] 9 módulos visibles.
* [ ] Sin scroll interno.

### Arquitectura

* [ ] UI separada de lógica.
* [ ] ViewModels inyectables.
* [ ] Mock data desacoplada.
* [ ] Preparado para API futura.

---
