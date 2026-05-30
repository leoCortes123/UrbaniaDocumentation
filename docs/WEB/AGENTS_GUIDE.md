# 📚 PORTAL WEB - AGENTS_GUIDE
## Documento Principal de Referencia Rápida

> **Instrucción para el agente**: Lee este documento SIEMPRE al inicio de cada tarea.

> ** Inicia un nuevo ssd para el proyecto en modo automatico y con persistencia en engram **

---

## 📁 Antes de Empezar

> **⚠️ OBLIGATORIO**: Consulta `DIRECTORY_STRUCTURE.md` ANTES de crear cualquier archivo nuevo.

## Tu Rol
Ingeniero senior Frontend. Construir portal web para residentes de propiedades horizontales. Escalable, mantenible, modular.

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
| 10 | **API_CONTRACT** | Solo para referencia cuando sea necesario |
| 11 | **Feature Spec** | Específico del feature a implementar |

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

1. **Arquitectura**: Feature-First + Composable Architecture. Cada feature aislado.
2. **Separación de capas**: `composables/` (lógica pura) → `services/` (API y modelos) → `views/` + `components/` (UI + estado)
3. **Responsabilidad única**: Ningún componente hace más de una cosa. Archivos >300 líneas → refactorizar
4. **No AI Slop**: Código debe responder a un caso de uso real, no genérico
5. **Estado predecible**: Exclusivamente Pinia (`defineStore`, Composition API). No variables reactivas sueltas
6. **Tipado estricto**: TypeScript `strict: true`. Interfaces bien definidas con Zod
7. **Errores controlados**: Clases tipadas (`AppError`). No excepciones sin control
8. **UI desacoplada**: Lógica de negocio en `composables`, nunca en templates
9. **Alertas estandarizadas**: Todo mensaje al usuario DEBE usar el sistema de alertas. No `alert()`, `confirm()`, `toast` directos
10. **Documentación viva**: Completar secciones `** Pendiente **` con código real de tu implementación
12. **Migración-transparente**: FakeService debe ser intercambiable por ApiService sin tocar composables/

---

## ✅ Checklist Final antes de entregar

- [ ] Leí AGENTS_GUIDE antes de empezar
- [ ] Leí GOLDEN_RULES antes de codear
- [ ] Leí todos los documentos relevantes para la tarea
- [ ] No violé ninguna Regla de Oro
- [ ] Usé el sistema de alertas para TODOS los mensajes al usuario
- [ ] Manejé todos los errores con `Result<T, AppError>`
- [ ] No usé `any` en ningún lugar
- [ ] No importé entre features
- [ ] No excedí 300 líneas por archivo
- [ ] Escribí tests para composables, services y componentes principales
- [ ] Completé las secciones `** Pendiente **` en los docs correspondientes
- [ ] Actualicé FEATURES_INDEX si fue necesario

---

## 📁 Estructura de Documentos

```
/docs/
├── AGENTS_GUIDE.md          ← Este documento (siempre primero)
├── GOLDEN_RULES.md          ← Reglas inquebrantables
├── ARCHITECTURE.md          ← Stack, estructura, principios
├── THEME_SYSTEM.md          ← Colores, tipografía, componentes base
├── ALERT_SYSTEM.md          ← Alertas, notificaciones, estados
├── ROUTING.md               ← Navegación, rutas, Vue Router
├── FEATURES_INDEX.md        ← Catálogo de features y estado
├── DEVELOPMENT_GUIDE.md     ← Setup, flujo de trabajo, convenciones
├── API_CONTRACT.md          ← Referencia futura (backend)
├── DIRECTORY_STRUCTURE.md   ← Guía de organización de carpetas
└── /features/
    ├── /auth/
    │   ├── auth.md            ← Spec completo del feature
    │   └── /recursos/         ← Recursos adicionales de diseño
    ├── /home/
    │   ├── home.md            ← Spec completo del feature
    │   └── /recursos/         ← Recursos adicionales de diseño
    ├── /profile/              ← (Pendiente)
    ├── /reservations/         ← (Pendiente)
    ├── /payments/             ← (Pendiente)
    ├── /pqrs/                 ← (Pendiente)
    ├── /notifications/        ← (Pendiente)
    ├── /chat/                 ← (Pendiente)
    └── /admin/                ← (Pendiente)
```

> **Recuerda**: Esta documentación contiene TODA la información que necesitas. No consultes documentos externos durante la implementación.
