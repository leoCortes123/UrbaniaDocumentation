# 📁 ESTRUCTURA DE DIRECTORIOS DE DOCUMENTACIÓN

> **Este documento es la guía maestra de organización.**
> Todo agente de desarrollo DEBE seguir esta estructura estrictamente.
> Los documentos fuera de su ubicación correcta serán ignorados.

---

## Árbol Completo

```
/docs/
├── AGENTS_GUIDE.md              ← Mapa de navegación (SIEMPRE primero)
├── GOLDEN_RULES.md            ← Reglas inquebrantables
├── ARCHITECTURE.md            ← Stack, estructura, principios
├── THEME_SYSTEM.md            ← Colores, tipografía, componentes base
├── ALERT_SYSTEM.md            ← Alertas, notificaciones, estados
├── ROUTING.md                 ← Navegación, rutas, GoRouter
├── FEATURES_INDEX.md          ← Catálogo de features y estado
├── DEVELOPMENT_GUIDE.md     ← Setup, flujo de trabajo, convenciones
├── DEMO_SETUP.md              ← Modo offline, credenciales, mock data
├── API_CONTRACT.md            ← Referencia futura (backend)
├── IMPLEMENTATION_REPORT.md   ← Historial de iteraciones (solo lectura)
│
├── DIRECTORY_STRUCTURE.md   ← ESTE DOCUMENTO
│
└── /features/
    │
    ├── /auth/
    │   ├── auth.md              ← Spec completo del feature
    │   └── /recursos/           ← Recursos si son necesarios segun el spec del feature
    │
    ├── /home/
    │   ├── home.md              ← Spec completo del feature
    │   └── /recursos/			 ← Recursos si son necesarios segun el spec del feature
    │
    ├── /...
    
```

---

## Flujo de Trabajo por Tipo de Tarea (con rutas exactas)

### Implementar feature nuevo:
```
/docs/AGENTS_GUIDE.md
  → /docs/GOLDEN_RULES.md
  → /docs/ARCHITECTURE.md
  → /docs/THEME_SYSTEM.md
  → /docs/ALERT_SYSTEM.md
  → /docs/FEATURES_INDEX.md
  → /docs/DEVELOPMENT_GUIDE.md
  → /docs/DEMO_SETUP.md
  → /docs/features/[feature]/[feature].md

```

### Modificar feature existente:
```
/docs/AGENTS_GUIDE.md
  → /docs/GOLDEN_RULES.md
  → /docs/ARCHITECTURE.md
  → /docs/features/[feature]/[feature].md
  → /docs/DEVELOPMENT_GUIDE.md
  → /docs/ALERT_SYSTEM.md (si hay mensajes nuevos)
```

### Crear componente UI nuevo:
```
/docs/AGENTS_GUIDE.md
  → /docs/GOLDEN_RULES.md
  → /docs/ARCHITECTURE.md
  → /docs/THEME_SYSTEM.md
  → /docs/FEATURES_INDEX.md (recursos de diseño)
  → /docs/ALERT_SYSTEM.md
  → /docs/DEVELOPMENT_GUIDE.md
```

---