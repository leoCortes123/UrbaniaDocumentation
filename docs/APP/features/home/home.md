# HomeScreen — Especificación de Diseño

## 1. Meta

- **Objetivo**: Pantalla principal que muestra saludo al usuario, notificaciones rápidas, accesos directos a módulos principales y navegación inferior.
- **Usuario objetivo**: Residentes/propietarios de la unidad inmobiliaria.
- **Contexto de uso**: Punto de entrada default tras login. Acceso frecuente para consultar pagos, visitas, reservas y notificaciones.
- **Rol en el sistema**: Hub central estático (sin scroll).

---

## 2. Estructura Visual

### Layout General

- Sin scroll general — pantalla completamente estática.
- SafeArea obligatorio en todos los bordes.
- Sin bordes visibles entre secciones.
- Fondo con patrones orgánicos/irregulares (blob shapes) para separar visualmente las áreas.

### Distribución Vertical

| Sección | Altura | Descripción |
|---------|--------|-------------|
| Banner principal | 25% | Saludo + foto perfil |
| Carrusel notificaciones | 25% | Tarjetas horizontales |
| Navegación principal | 40% | Grid de accesos rápidos |
| Bottom navigation bar | 10% (Fija) | 4 vínculos a módulos |

### Responsive

- **Móvil**: Distribución por defecto (4 secciones verticales).

---

## 3. Design Tokens Aplicados

### Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `colorPrimary` | — | Texto de bienvenida, iconos activos |
| `colorOnPrimary` | — | Texto sobre color primario |
| `colorSurface` | — | Fondo general de pantalla |
| `colorSurfaceContainer` | — | Tarjetas del carrusel |
| `colorOnSurface` | — | Texto principal de notificaciones |
| `colorOnSurfaceVariant` | — | Texto secundario (fecha, tipo) |
| `colorOutline` | — | Bordes de tarjetas |
| `colorBackground` | — | Fondo general |

### Tipografía

| Token | Uso |
|-------|-----|
| `headlineLarge` | Saludo principal ("¡Hola, [Nombre]!") |
| `titleMedium` | Título de tarjeta de notificación |
| `bodyMedium` | Cuerpo de notificación |
| `bodySmall` | Tipo y fecha de notificación |
| `labelLarge` | Títulos de módulos en grid |

### Espaciados

| Token | Uso |
|-------|-----|
| `spacingSmall` | Entre elementos dentro de tarjetas |
| `spacingMedium` | Entre secciones internas |
| `spacingLarge` | Separación entre banner y carrusel |
| `paddingHorizontal` | Margen lateral seguro |

### Otros

| Token | Uso |
|-------|-----|
| `borderRadiusMedium` | Tarjetas del carrusel |
| `borderRadiusLarge` | Botones del grid |
| `elevationSmall` | Sombras sutiles en tarjetas |

---

## 4. Componentes Reutilizables Identificados

### `UserBanner`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `userName` | `String` | Nombre del usuario logueado |
| `profileImageUrl` | `String?` | URL de foto de perfil, null = placeholder |

**Estados**: default, loading (avatar con shimmer)

---

### `NotificationCard`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `title` | `String` | Título de la notificación |
| `body` | `String` | Texto de la notificación |
| `type` | `NotificationType` | Enum: info, warning, alert, event |
| `date` | `DateTime` | Fecha de la notificación |
| `isActive` | `bool` | Si está actualmente seleccionada |

**Estados**: default, semiTransparent (laterales del carrusel), active (centrada, opaca)

---

### `QuickAccessButton`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `icon` | `IconData` | Icono del módulo |
| `label` | `String` | Nombre del módulo |
| `onTap` | `VoidCallback` | Acción al presionar |

**Estados**: default, pressed (escala 0.95), disabled (opacity 0.5)

---

### `BottomNavBar`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `selectedIndex` | `int` | Índice del tab activo |
| `onItemSelected` | `Function(int)` | Callback al cambiar tab |

**Estados por item**: active (icono + label), inactive (solo icono)

**Items**:

1. Inicio (home icon)
2. Pagos (payment icon)
3. Notificaciones (bell icon)
4. Visitas (calendar icon)

---

## 5. Estados de Pantalla

### Loading

- Skeleton shimmer en:
  - Avatar (circular, 48x48)
  - Texto de saludo (2 líneas)
  - Tarjetas del carrusel (3 items visibles)
  - Grid de módulos (shimmer en grid 3x3)

### Error

- No aplica para pantalla home — es completamente estática.
- Errores de datos se manejan dentro de cada componente individual.

### Empty

- Carrusel vacío: mensaje "No tienes notificaciones recientes" centrado.
- Grid vacío: mostrar los 9 módulos siempre (no hay estado vacío).

### Default

- Todos los componentes renderizados con datos estáticos o mock.

---

## 6. Interacciones y Comportamiento

### Gestos

| Gesto | Componente | Comportamiento |
|-------|------------|----------------|
| Swipe horizontal | NotificationCard | Scroll interno del carrusel. La pantalla NO hace scroll. |
| Tap | QuickAccessButton | Navegar a la pantalla del módulo. Feedback visual con ScaleTransition (0.95). |
| Tap | BottomNavBar item | Cambiar tab activo con animación. |
| Tap | ProfileImage | Navegar a perfil de usuario (futuro). |

### Animaciones

| Animación | Duración | Curva |
|-----------|----------|-------|
| Scale en QuickAccessButton | 150ms | easeInOut |
| Opacity en tarjetas laterales del carrusel | 200ms | easeOut |
| Bottom nav indicator slide | 250ms | easeInOut |

### Transiciones

- Al navegar a otro módulo: SlideTransition horizontal (push).
- No hay shared element transitions por ahora.

---

## 7. Navegación

### Inputs (Params)

| Origen | Params | Descripción |
|--------|--------|-------------|
| LoginScreen | `userName`, `profileImageUrl` | Datos del usuario logueado |

### Outputs

| Acción | Destino |
|--------|---------|
| Tap "Pagos" (grid) | PagosScreen |
| Tap "Visitas" (grid) | VisitasScreen |
| Tap "Estado" (grid) | EstadoScreen |
| Tap "Parqueadero" (grid) | ParqueaderoScreen |
| Tap "Reservas" (grid) | ReservasScreen |
| Tap "Comunidad" (grid) | ComunidadScreen |
| Tap "Eventos" (grid) | EventosScreen |
| Tap "Configuración" (grid) | ConfiguracionScreen |
| Tap "Contáctanos" (grid) | ContactanosScreen |
| Tap BottomNav "Inicio" | HomeScreen (re-render) |
| Tap BottomNav "Pagos" | PagosScreen |
| Tap BottomNav "Notificaciones" | NotificacionesScreen |
| Tap BottomNav "Visitas" | VisitasScreen |
| Tap ProfileImage | PerfilScreen (futuro) |

### Deep Links

```
urbania://home
urbania://inicio
```

---

## 8. Restricciones Técnicas

### Prohibido

- ❌ `SingleChildScrollView` en el nivel principal.
- ❌ `ListView` o `GridView` como scroll principal de pantalla.
- ❌ `CustomScrollView` con `SliverList` o `SliverGrid`.
- ❌ Scrollbars visibles.
- ❌ Hardcoded de colores fuera del theme.

### Obligatorio

- ✅ Todos los estilos desde `Theme.of(context)`.
- ✅ Componentes reutilizables listados en sección 4.
- ✅ Separación UI/Lógica (preparado para Provider/ViewModel).
- ✅ SafeArea en todos los bordes de pantalla.
- ✅ Constantes de dimensiones en archivo separado (`home_dimensions.dart`).

### Preparado Para

- Integración con `ChangeNotifier` (UserViewModel, NotificationsViewModel).
- mock data substituir por llamadas a API sin cambiar estructura.
- Tests unitarios en ViewModels independientes.

---

## 9. Checklist de Implementación

### Estructura

- [ ] SafeArea envuelve toda la pantalla.
- [ ] Column con 3 secciones + BottomNavigationBar.
- [ ] Ratios de altura aplicados (30%, 30%, 40%).

### Banner Principal

- [ ] Layout row: texto izquierda, avatar derecha.
- [ ] Texto "¡Hola, [Nombre]!" con `headlineLarge`.
- [ ] Avatar circular con fallback a placeholder.
- [ ] Sin fondo (transparent).

### Carrusel de Notificaciones

- [ ] PageView con `physics: NeverScrollableScrollPhysics()`.
- [ ] 3 NotificationCards visibles (central + partes laterales).
- [ ] Tarjetas laterales semi-transparentes (opacity 0.6).
- [ ] Indicadores de página (dots) opcionales.

### Grid de Navegación

- [ ] 3 columnas, grid de 3x3 (9 items).
- [ ] QuickAccessButton cuadrado con borderRadiusLarge.
- [ ] Icono centrado arriba, label debajo.
- [ ] 9 módulos: Estado, Pagos, Visitas, Parqueadero, Reservas, Comunidad, Eventos, Configuración, Contáctanos.

### Bottom Navigation Bar

- [ ] 4 items: Inicio, Pagos, Notificaciones, Visitas.
- [ ] Índice activo marcado visualmente.
- [ ] Sin elevación, fondo de superficie.

### Tema y Estilos

- [ ] Todos los colores desde `theme.colorScheme`.
- [ ] Tipografía desde `theme.textTheme`.
- [ ] Espaciados desde constantes del design system.

### Preparación ViewModel

- [ ] HomeScreen acepta `UserViewModel` y `NotificationsViewModel` (opcional).
- [ ] Datos mock reemplazables sin cambiar widget tree.
- [ ] Constantes de layout en `home_dimensions.dart`.

---

## 10. Archivos Esperados

```
lib/
├── features/
│   └── home/
│       ├── presentation/
│       │   ├── screens/
│       │   │   └── home_screen.dart
│       │   └── widgets/
│       │       ├── user_banner.dart
│       │       ├── notification_card.dart
│       │       ├── notification_carousel.dart
│       │       ├── quick_access_button.dart
│       │       ├── quick_access_grid.dart
│       │       └── bottom_nav_bar.dart
│       └── home_dimensions.dart
```

---

## 11. Notas de Implementación

1. **Carrusel**: Usar `PageView` con `controller` para manejar scroll interno sin afectar el layout principal. El scroll horizontal del PageView NOpropaga scroll al padre.

2. **Blob shapes**: Los patrones orgánicos del fondo pueden implementarse con `CustomPaint` o usando un paquete como `flutter_simple_cblob` o assets SVG.

3. **Responsive tablet**: El grid de navegación puede expandir a 4 columnas en tablets usando `LayoutBuilder` y cambiando el crossAxisCount del `GridView`.

4. **Mock data**: Crear `home_mock_data.dart` con constantes para testing. No hardcodear dentro del screen.