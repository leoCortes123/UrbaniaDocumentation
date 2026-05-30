# 📚 URBANIA APP - AGENTS_GUIDE
## Documento Principal de Referencia Rápida

> **Instrucción para el agente**: Lee este documento SIEMPRE al inicio de cada tarea. Es tu mapa de navegación. Extrae las reglas de oro. Luego consulta la fase específica según el tipo de tarea.

> ** Inicia un nuevo ssd para el proyecto en modo automatico y con persistencia en engram **

---

## 📁 Antes de Empezar

> **⚠️ OBLIGATORIO**: Consulta `DIRECTORY_STRUCTURE.md` ANTES de crear cualquier archivo nuevo.
> Este documento define dónde debe ir cada tipo de documento. Los archivos fuera de su ubicación correcta serán ignorados.

## Tu Rol
Ingeniero senior Flutter. Construir app para residentes de propiedades horizontales. Escalable, mantenible, modular.

---

## 🗺️ Mapa de Documentación

### Fases Esenciales (Leer siempre)

| Orden | Documento | Cuándo consultar |
|-------|-----------|------------------|
| 0 | **DIRECTORY_STRUCTURE** | Antes de crear cualquier archivo nuevo |
| 1 | **AGENTS_GUIDE** (este) | Siempre primero |
| 2 | **GOLDEN_RULES** | Antes de escribir cualquier código |
| 3 | **ARCHITECTURE** | Antes de implementar cualquier feature |

### Fases de Apoyo (Consultar según tarea)

| Orden | Documento | Cuándo consultar |
|-------|-----------|------------------|
| 4 | **THEME_SYSTEM** | Si la tarea involucra UI/componentes |
| 5 | **ALERT_SYSTEM** | Si la tarea muestra mensajes al usuario |
| 6 | **ROUTING** | Si la tarea involucra navegación |
| 7 | **FEATURES_INDEX** | Si es un feature nuevo o modificación |
| 8 | **DEVELOPMENT_GUIDE** | Antes de empezar a codear |

### Fases de Referencia (Solo consultar cuando aplique)

| Orden | Documento | Cuándo consultar |
|-------|-----------|------------------|
| 11 | **Feature Spec** | Específico del feature a implementar (ver carpeta `features/[feature]/`) |

---

## 🔀 Flujo de Trabajo por Tipo de Tarea

### Implementar feature nuevo:
```
AGENTS_GUIDE → DIRECTORY_STRUCTURE → GOLDEN_RULES → ARCHITECTURE → THEME_SYSTEM → ALERT_SYSTEM → FEATURES_INDEX →
DEVELOPMENT_GUIDE → /docs/features/[feature]/[feature].md
```

### Modificar feature existente:
```
AGENTS_GUIDE → DIRECTORY_STRUCTURE → GOLDEN_RULES → ARCHITECTURE → /docs/features/[feature]/[feature].md →
DEVELOPMENT_GUIDE → ALERT_SYSTEM (si hay mensajes nuevos)
```

### Crear componente UI nuevo:
```
AGENTS_GUIDE → DIRECTORY_STRUCTURE → GOLDEN_RULES → ARCHITECTURE → THEME_SYSTEM → FEATURES_INDEX (recursos de diseño) →
ALERT_SYSTEM → DEVELOPMENT_GUIDE
```

### Agregar/modificar ruta:
```
AGENTS_GUIDE → DIRECTORY_STRUCTURE → GOLDEN_RULES → ARCHITECTURE → ROUTING → DEVELOPMENT_GUIDE
```

### Setup inicial del proyecto:
```
AGENTS_GUIDE → DIRECTORY_STRUCTURE → GOLDEN_RULES → ARCHITECTURE → DEVELOPMENT_GUIDE
```

---

## ⚡ Reglas de Oro (Nunca violar)

1. **Arquitectura**: Feature-First + Clean Architecture simplificada. Cada feature aislado.
2. **Separación de capas**: `domain/` (lógica pura) → `data/` (API y modelos) → `presentation/` (UI + estado)
3. **Responsabilidad única**: Ninguna clase hace más de una cosa. Archivos >300 líneas → refactorizar
4. **No AI Slop**: Código debe responder a un caso de uso real, no genérico
5. **Estado predecible**: Exclusivamente Riverpod (`@riverpod`, `AsyncNotifier`). No `setState` para lógica de negocio
6. **Tipado estricto**: Evitar `dynamic`. Modelos bien definidos
7. **Errores controlados**: Clases tipadas (`Failure`). No excepciones sin control
8. **UI desacoplada**: Lógica de negocio en `domain` o `providers`, nunca en widgets
9. **Alertas estandarizadas**: Todo mensaje al usuario DEBE usar el sistema de alertas. No SnackBar/AlertDialog/Toast directos
10. **Documentación viva**: Completar secciones `** Pendiente **` con código real de tu implementación
12. **Migración-transparente**: MockRepository debe ser intercambiable por ApiRepository sin tocar domain/

---

## ✅ Checklist Final antes de entregar

- [ ] Leí AGENTS_GUIDE antes de empezar
- [ ] Leí GOLDEN_RULES antes de codear
- [ ] Leí todos los documentos relevantes para la tarea
- [ ] No violé ninguna Regla de Oro
- [ ] Usé el sistema de alertas para TODOS los mensajes al usuario
- [ ] Manejé todos los errores con `Either<Failure, T>`
- [ ] No usé `dynamic` en ningún lugar
- [ ] No importé entre features
- [ ] No excedí 300 líneas por archivo
- [ ] Escribí tests para use cases, repositories y widgets principales
- [ ] Completé las secciones `** Pendiente **` en los docs correspondientes
- [ ] Actualicé FEATURES_INDEX si fue necesario


---

## 🧪 Modo Mock

El proyecto incluye un **Modo Mock** para desarrollo y pruebas locales sin necesidad de conectar a la base de datos o API.

### Configuración

Crear un archivo `.env` en la raíz del proyecto:

```
USE_MOCK=true
```

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `USE_MOCK` | `true` | Activa el modo mock. Usa datos locales simulados. |
| `USE_MOCK` | `false` | Desactiva el modo mock. Usa la API real configurada. |

### Comportamiento

- **Modo Mock activo (`USE_MOCK=true`)**: Todos los repositorios inyectan `MockDatasource` en lugar de `ApiDatasource`. Los datos son locales, deterministas y no requieren conexión de red.
- **Modo Mock desactivo (`USE_MOCK=false`)**: Los repositorios inyectan `ApiDatasource` y se conectan al backend real.

### Implementación

En `main.dart`:

```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');

  final useMock = dotenv.env['USE_MOCK']?.toLowerCase() == 'true';

  // ... resto de inicialización

  runApp(
    ProviderScope(
      overrides: [
        if (useMock) ...[
          authDatasourceProvider.overrideWithValue(MockAuthDatasource()),
          // Overrides para otros datasources mock
        ],
      ],
      child: const UrbaniaApp(),
    ),
  );
}
```

### Reglas de Oro para Modo Mock

1. **MockDatasource** debe implementar la **misma interfaz** que **ApiDatasource**
2. **Zero cambios** en `domain/`, `presentation/` ni widgets al cambiar el modo
3. Los datos mock deben ser **realistas** y cubrir los casos de uso principales
4. El modo mock debe poder activarse/desactivarse **sin recompilar** (solo cambiando `.env`)

---

---

### Migración Futura a API Real
1. Crear `ApiDatasource` que implemente las mismas interfaces que `MockDatasource`
2. Reemplazar inyección en `ProviderScope` overrides
3. Agregar `NetworkInfo` para decidir entre local/remote
4. **Zero cambios** en domain/, presentation/, ni widgets

---

## 📁 Estructura de Documentos

```
/docs/
├── AGENTS_GUIDE.md          ← Este documento (siempre primero)
├── GOLDEN_RULES.md          ← Reglas inquebrantables
├── ARCHITECTURE.md          ← Stack, estructura, principios
├── THEME_SYSTEM.md          ← Colores, tipografía, componentes base
├── ALERT_SYSTEM.md          ← Alertas, notificaciones, estados
├── ROUTING.md               ← Navegación, rutas, GoRouter
├── FEATURES_INDEX.md        ← Catálogo de features y estado
├── DEVELOPMENT_GUIDE.md     ← Setup, flujo de trabajo, convenciones
├── API_CONTRACT.md          ← Referencia futura (backend)
├── DIRECTORY_STRUCTURE.md   ← Guía de organización de carpetas
└── /features/
    ├── /auth/
    │   ├── auth.md            ← Spec completo del feature
    │   └── /recursos/         ← Recursos adicionales de diseño si son necesarios
    ├── /home/
    │   ├── home.md            ← Spec completo del feature
    │   └── /recursos/         ← Recursos adicionales de diseño si son necesarios
    ├── /profile/              ← (Pendiente)
    ├── /reservations/         ← (Pendiente)
    ├── /payments/             ← (Pendiente)
    ├── /pqrs/                 ← (Pendiente)
    ├── /notifications/        ← (Pendiente)
    ├── /chat/                 ← (Pendiente)
    └── /admin/                ← (Pendiente)
```

> **Siempre consulta estos archivos antes de implementar UI.**

> **Nota**: Los documentos marcados con ← son los de referencia rápida. Los demás se consultan bajo demanda según el tipo de tarea.

---

> **Recuerda**: Esta documentación contiene TODA la información que necesitas. No consultes documentos externos durante la implementación. Si tienes una duda específica sobre un endpoint o un color exacto, busca en la fase correspondiente, pero vuelve inmediatamente a ejecutar.
