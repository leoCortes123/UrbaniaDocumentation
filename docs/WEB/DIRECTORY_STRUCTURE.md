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
├── ROUTING.md                 ← Navegación, rutas, Vue Router
├── FEATURES_INDEX.md          ← Catálogo de features y estado
├── DEVELOPMENT_GUIDE.md     ← Setup, flujo de trabajo, convenciones
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
    │   └── /recursos/           ← Recursos si son necesarios segun el spec del feature
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

## Estructura de Código del Proyecto

```
/src/
├── main.ts                          ← Entry point
├── App.vue                          ← Root component
├── /core/
│   ├── /constants                   ← AppConstants, ApiConstants, RouteNames
│   ├── /network                     ← AxiosClient, NetworkInfo, ApiException
│   ├── /storage                     ← LocalStorage, IndexedDB config
│   ├── /errors                      ← AppError (clase base), ErrorHandler
│   ├── /utils                       ← Composables globales, Helpers, Validators
│   ├── /theme                       ← AppTheme, AppColors, AppTypography
│   ├── /router                      ← AppRouter (configuración central de Vue Router)
│   └── /composables                 ← Composables globales reutilizables
│
├── /features/
│   ├── /auth/
│   │   ├── /composables             ← useAuth.ts
│   │   ├── /services                ← authService.ts, fakeAuthService.ts
│   │   ├── /stores                  ← authStore.ts
│   │   ├── /types                   ← resident.ts, auth-state.ts
│   │   ├── /views                   ← LoginView.vue, RegisterView.vue
│   │   └── /components              ← LoginForm.vue, SocialButtons.vue
│   │
│   ├── /home/
│   │   ├── /composables             ← useDashboard.ts
│   │   ├── /services                ← homeService.ts
│   │   ├── /stores                  ← homeStore.ts
│   │   ├── /types                   ← dashboard.ts
│   │   ├── /views                   ← HomeView.vue
│   │   └── /components              ← DashboardCards.vue, MetricsChart.vue
│   │
│   ├── /profile/
│   ├── /reservations/
│   ├── /payments/
│   ├── /pqrs/
│   ├── /notifications/
│   ├── /chat/
│   └── /admin/
│
├── /shared/
│   └── /components                    ← AppButton.vue, AppInput.vue, AppCard.vue, StatusChip.vue
│
├── /assets/
│   ├── /css                         ← main.css, theme.css
│   └── /fonts                       ← Hanken Grotesk, Inter (si self-hosted)
│
└── /test/                           ← Tests globales, setup, mocks
```

---

## Reglas de Ubicación

| Tipo de archivo | Ubicación correcta | Ubicación incorrecta |
|-----------------|---------------------|----------------------|
| Composable de feature | `/features/[feature]/composables/` | `/src/composables/` |
| Service de feature | `/features/[feature]/services/` | `/src/services/` |
| Store de feature | `/features/[feature]/stores/` | `/src/stores/` |
| Componente reutilizable | `/shared/components/` | `/features/[feature]/components/` |
| Composable global | `/core/composables/` | `/shared/composables/` |
| Utilidad global | `/core/utils/` | `/src/utils/` |
| Constante global | `/core/constants/` | `/src/constants/` |
| Theme/Tokens | `/core/theme/` | `/src/theme/` |
| Error classes | `/core/errors/` | `/src/errors/` |
| Router config | `/core/router/` | `/src/router/` |
| Tests de feature | `/test/features/[feature]/` | `/features/[feature]/test/` |
