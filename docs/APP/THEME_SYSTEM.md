# 🎨 THEME_SYSTEM
## Sistema de Diseño de Urbania

> **Consultar**: Si la tarea involucra UI, componentes, colores, tipografía o espaciado.

---

## Fuente de Verdad

Este documento define los tokens base del sistema de diseño. Sin embargo, **cada feature debe tener especificaciones particulares** documentadas en sus propios recursos de diseño. 

1. **Este documento** - Tokens base y sistema general
2. **GOLDEN_RULES.md** - Principios de implementación (no hardcodear valores)

---

## Paleta de Colores

### Sistema de Superficies (Tonal Surface System)

```dart
// /core/theme/app_colors.dart
class AppColors {
  // Surface Tints - Sistema de tonalidades basadas en primary
  static const Color surface = Color(0xFFF8F9FF);
  static const Color surfaceDim = Color(0xFFCBDBF5);
  static const Color surfaceBright = Color(0xFFF8F9FF);
  static const Color surfaceContainerLowest = Color(0xFFFFFFFF);
  static const Color surfaceContainerLow = Color(0xFFEFF4FF);
  static const Color surfaceContainer = Color(0xFFE5EEFF);
  static const Color surfaceContainerHigh = Color(0xFFDCE9FF);
  static const Color surfaceContainerHighest = Color(0xFFD3E4FE);
  static const Color surfaceVariant = Color(0xFFD3E4FE);
  static const Color surfaceTint = Color(0xFF415F8F);

  // On Surface
  static const Color onSurface = Color(0xFF0B1C30);
  static const Color onSurfaceVariant = Color(0xFF43474F);
  static const Color inverseSurface = Color(0xFF213145);
  static const Color inverseOnSurface = Color(0xFFEAF1FF);

  // Outline
  static const Color outline = Color(0xFF747780);
  static const Color outlineVariant = Color(0xFFC4C6D0);

  // Primary - Deep Navy (#002855)
  static const Color primary = Color(0xFF001430);          // Base navy (casi negro azulado)
  static const Color primaryContainer = Color(0xFF002855);  // Deep Navy - para elementos de énfasis
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onPrimaryContainer = Color(0xFF7490C3);
  static const Color inversePrimary = Color(0xFFAAC7FD);

  // Primary Fixed - Para elementos fijos
  static const Color primaryFixed = Color(0xFFD6E3FF);
  static const Color primaryFixedDim = Color(0xFFAAC7FD);
  static const Color onPrimaryFixed = Color(0xFF001B3D);
  static const Color onPrimaryFixedVariant = Color(0xFF284775);

  // Secondary - Vibrant Green (#4CAF50)
  static const Color secondary = Color(0xFF006E1C);         // Verde principal
  static const Color secondaryContainer = Color(0xFF91F78E); // Verde claro
  static const Color onSecondary = Color(0xFFFFFFFF);
  static const Color onSecondaryContainer = Color(0xFF00731E);

  // Secondary Fixed
  static const Color secondaryFixed = Color(0xFF94F990);
  static const Color secondaryFixedDim = Color(0xFF78DC77);
  static const Color onSecondaryFixed = Color(0xFF002204);
  static const Color onSecondaryFixedVariant = Color(0xFF005313);

  // Tertiary
  static const Color tertiary = Color(0xFF101517);
  static const Color tertiaryContainer = Color(0xFF24292C);
  static const Color onTertiary = Color(0xFFFFFFFF);
  static const Color onTertiaryContainer = Color(0xFF8B9094);

  // Tertiary Fixed
  static const Color tertiaryFixed = Color(0xFFDFE3E7);
  static const Color tertiaryFixedDim = Color(0xFFC3C7CB);
  static const Color onTertiaryFixed = Color(0xFF171C1F);
  static const Color onTertiaryFixedVariant = Color(0xFF43474B);

  // Error
  static const Color error = Color(0xFFBA1A1A);
  static const Color errorContainer = Color(0xFFFFDAD6);
  static const Color onError = Color(0xFFFFFFFF);
  static const Color onErrorContainer = Color(0xFF93000A);

  // Background
  static const Color background = Color(0xFFF8F9FF);
  static const Color onBackground = Color(0xFF0B1C30);

  // Alias para compatibilidad (deprecated - usar los nuevos nombres)
  @Deprecated('Usar surfaceContainerLowest en su lugar')
  static const Color surfaceWhite = surfaceContainerLowest;
  @Deprecated('Usar surfaceContainerLow en su lugar')
  static const Color surfaceLight = surfaceContainerLow;
}
```

### Colores Semánticos (Para Alertas y Estados)

```dart
// Extensiones semánticas para alertas y estados
// Usar estos en lugar de crear colores arbitrarios

class AppSemanticColors {
  // Success - Mapea a secondary (verde)
  static const Color success = AppColors.secondary;
  static const Color successContainer = AppColors.secondaryContainer;
  static const Color onSuccess = AppColors.onSecondary;
  static const Color onSuccessContainer = AppColors.onSecondaryContainer;

  // Warning - Usar tertiary como warning (ámbar oscuro)
  static const Color warning = Color(0xFFB8860B);  // Dark goldenrod
  static const Color warningContainer = Color(0xFFFFF8DC);
  static const Color onWarning = Color(0xFF000000);
  static const Color onWarningContainer = Color(0xFF5C4033);

  // Info - Usar primaryContainer como info
  static const Color info = AppColors.primaryContainer;
  static const Color infoContainer = AppColors.primaryFixed;
  static const Color onInfo = AppColors.onPrimaryContainer;
  static const Color onInfoContainer = AppColors.onPrimaryFixed;

  // Error Background - Para fondos de error en UI
  static const Color errorBackground = AppColors.errorContainer;
}
```

### Guía de Uso de Colores

| Propósito | Color | Uso |
|-----------|-------|-----|
| **Primary Action** | `primaryContainer` (#002855) | Botones principales, elementos de énfasis |
| **Success/Action secundario** | `secondary` (#006E1C) | Acciones de éxito, pagos, estados positive |
| **Warning** | `AppSemanticColors.warning` | Alertas de advertencia, modo offline |
| **Error** | `error` (#BA1A1A) | Errores, validaciones fallidas |
| **Info** | `AppSemanticColors.info` | Información, tips, notificaciones |
| **Textos principales** | `onSurface` (#0B1C30) | Títulos, texto importante |
| **Textos secundarios** | `onSurfaceVariant` (#43474F) | Texto helper, labels |
| **Fondo principal** | `background` (#F8F9FF) | Canvas de la app |
| **Tarjetas/Contenedores** | `surfaceContainerLowest` (#FFFFFF) | Cards, elementos elevados |
| **Campos de entrada (default)** | `#F1F5F9` | Inputs en estado normal |
| **Focus Input** | `secondary` stroke | Campos con foco (2px green) |

---

## Tipografía

### Sistema Dual-Sans

**Hanken Grotesk** para títulos → Estilo arquitectónico, contemporáneo
**Inter** para cuerpo → Máxima legibilidad en datos y textos funcionales

```dart
// /core/theme/app_typography.dart
class AppTypography {
  // ═══════════════════════════════════════════════════════════════════
  // HEADINGS - Hanken Grotesk
  // ═══════════════════════════════════════════════════════════════════

  /// Hero / Display - Títulos principales
  /// 40px / 700 / lineHeight: 48px / letterSpacing: -0.02em
  static const TextStyle headlineXL = TextStyle(
    fontFamily: 'Hanken Grotesk',
    fontSize: 40,
    fontWeight: FontWeight.w700,
    height: 48 / 40,  // 1.2
    letterSpacing: -0.02,
  );

  /// Section Title - Títulos de sección
  /// 32px / 600 / lineHeight: 40px / letterSpacing: -0.01em
  static const TextStyle headlineLG = TextStyle(
    fontFamily: 'Hanken Grotesk',
    fontSize: 32,
    fontWeight: FontWeight.w600,
    height: 40 / 32,  // 1.25
    letterSpacing: -0.01,
  );

  /// Mobile Heading - Títulos para móvil
  /// 24px / 600 / lineHeight: 32px
  static const TextStyle headlineLGMobile = TextStyle(
    fontFamily: 'Hanken Grotesk',
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 32 / 24,  // 1.33
  );

  /// Card/Major Title
  /// 20px / 600 / lineHeight: 28px
  static const TextStyle titleMD = TextStyle(
    fontFamily: 'Hanken Grotesk',
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 28 / 20,  // 1.4
  );

  // ═══════════════════════════════════════════════════════════════════
  // BODY - Inter
  // ═══════════════════════════════════════════════════════════════════

  /// Body Large - Textos destacados
  /// 18px / 400 / lineHeight: 28px
  static const TextStyle bodyLG = TextStyle(
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: FontWeight.w400,
    height: 28 / 18,  // 1.56
  );

  /// Body Default - Texto principal
  /// 16px / 400 / lineHeight: 24px
  static const TextStyle bodyMD = TextStyle(
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 24 / 16,  // 1.5
  );

  /// Labels
  /// 14px / 500 / lineHeight: 20px / letterSpacing: 0.01em
  static const TextStyle labelMD = TextStyle(
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 20 / 14,  // 1.43
    letterSpacing: 0.01,
  );

  /// Small Labels / Section Headers
  /// 12px / 600 / lineHeight: 16px / letterSpacing: 0.05em / UPPERCASE
  static const TextStyle labelSM = TextStyle(
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: FontWeight.w600,
    height: 16 / 12,  // 1.33
    letterSpacing: 0.05,
  );
}
```

### Tabla de Estilos Completa

| Estilo | Font | Size | Weight | Line Height | Letter Spacing | Uso |
|--------|------|------|--------|-------------|----------------|-----|
| `headlineXL` | Hanken Grotesk | 40px | 700 | 48px | -0.02em | Hero titles |
| `headlineLG` | Hanken Grotesk | 32px | 600 | 40px | -0.01em | Section titles |
| `headlineLGMobile` | Hanken Grotesk | 24px | 600 | 32px | — | Headings móvil |
| `titleMD` | Hanken Grotesk | 20px | 600 | 28px | — | Card titles |
| `bodyLG` | Inter | 18px | 400 | 28px | — | Textos destacados |
| `bodyMD` | Inter | 16px | 400 | 24px | — | Texto principal |
| `labelMD` | Inter | 14px | 500 | 20px | 0.01em | Labels |
| `labelSM` | Inter | 12px | 600 | 16px | 0.05em | Section headers (UPPERCASE) |

> **Nota**: Los labels-SM (`labelSM`) deben usarse en **UPPERCASE** para headers de sección. Esto establece una jerarquía estructural clara contra el texto de cuerpo más suave.

---

## Espaciado (8px Grid + Sistema Stack)

```dart
// /core/theme/app_spacing.dart
class AppSpacing {
  // ═══════════════════════════════════════════════════════════════════
  // SISTEMA DE STACK (espaciado vertical entre elementos)
  // ═══════════════════════════════════════════════════════════════════

  /// Espaciado pequeño entre elementos relacionados
  /// 8px
  static const double stackSm = 8;

  /// Espaciado default entre elementos
  /// 16px
  static const double stackMd = 16;

  /// Espaciado grande entre secciones
  /// 32px
  static const double stackLg = 32;

  // ═══════════════════════════════════════════════════════════════════
  // GUTTER Y MARGINES
  // ═══════════════════════════════════════════════════════════════════

  /// Padding interno de contenedores
  /// 20px
  static const double containerMargin = 20;

  /// Padding horizontal de pantallas (Safe Area)
  /// 16px
  static const double gutter = 16;

  // ═══════════════════════════════════════════════════════════════════
  // SISTEMA LEGACY (mantener por compatibilidad)
  // ═══════════════════════════════════════════════════════════════════

  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
  static const double xl = 32;
  static const double xxl = 48;

  // Equivalencias:
  // stackSm ≈ sm
  // stackMd ≈ md
  // stackLg ≈ xl
  // containerMargin ≈ lg + xs
  // gutter ≈ md
  // sectionGap = stackLg + lg ≈ xxl
}
```

### Tabla de Espaciado

| Token | Valor | Uso |
|-------|-------|-----|
| `stackSm` | 8px | Elementos muy relacionados (icono + texto en mismo grupo) |
| `stackMd` | 16px | Espaciado default entre elementos |
| `stackLg` | 32px | Separación entre secciones |
| `gutter` | 16px | Márgenes horizontales de pantallas |
| `containerMargin` | 20px | Padding interno de cards y contenedores |

---

## Sistema de Formas (Border Radius)

```dart
// /core/theme/app_shapes.dart
class AppShapes {
  /// Corner radius pequeño - Inputs, botones pequeños
  /// 4px
  static const double sm = 4;

  /// Corner radius default - Botones estándar, chips
  /// 8px
  static const double DEFAULT = 8;

  /// Corner radius medio - Cards, modales
  /// 12px
  static const double md = 12;

  /// Corner radius grande - Containers principales, bottom sheets
  /// 16px
  static const double lg = 16;

  /// Corner radius extra large - Elementos destacados
  /// 24px
  static const double xl = 24;

  /// Pill/Cápsula - Badges, chips de status
  static const double full = 9999;
}
```

### Guía de Uso

| Elemento | Radius | Token | Ejemplo |
|----------|--------|-------|---------|
| Input fields | 8px | `AppShapes.DEFAULT` | `BorderRadius.circular(AppShapes.DEFAULT)` |
| Botones primarios | 8px | `AppShapes.DEFAULT` | `BorderRadius.circular(AppShapes.DEFAULT)` |
| Cards | 16px | `AppShapes.lg` | `BorderRadius.circular(AppShapes.lg)` |
| Bottom sheets | 24px | `AppShapes.xl` | `BorderRadius.circular(AppShapes.xl)` |
| Chips/Badges | 9999px | `AppShapes.full` | Forma de píldora |
| Iconos de status | 9999px | `AppShapes.full` | Contenedores circulares |

> **IMPORTANTE**: `AppShapes` usa valores en **px** (double). No confundir con `AppSpacing` que también usa px pero es para distancia, no para border radius.

---

## Sistema de Sombras (Elevation)

> **Principio**: Depth a través de capas tonales, no sombras pesadas.

```dart
// /core/theme/app_elevation.dart
class AppElevation {
  /// Sin sombra - Elementos en el mismo plano
  /// Default para cards y contenedores
  static const double none = 0;

  /// Sombra sutil - Elementos ligeramente elevados
  /// Para inputs con foco
  static const double subtle = 1;

  /// Ambient Shadow - Elementos flotantes (FAB, cards elevadas)
  /// Usar shadows difusas tintadas con primary
  static const double ambient = 4;

  /// Sombra media - Modales, dropdowns
  static const double medium = 8;

  /// Sombra alta - Elementos sobrepuestos
  static const double high = 16;
}
```

### Guía de Sombras

| Situación | Tratamiento |
|-----------|-------------|
| Cards default | Sin sombra. Distinguir por cambio de color de surface |
| Inputs con foco | 2px outer glow con `secondary` (#006E1C) |
| Elementos flotantes (FAB) | Ambient shadow difusa tintada con primary (#002855) al 12% opacity |
| Modales/Dropdowns | Box shadow sutil con offset vertical |

> **NO usar**: Sombras negras duras. Usar sombras tintadas con el color primary.

---

## Componentes Base

### AppButton

```dart
class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant; // primary, secondary, ghost, outline
  final bool isLoading;
  final bool isFullWidth;

  // Primary: Navy fill (#002855) + white text
  // Secondary: Green fill (#006E1C) + white text (success actions)
  // Ghost: Navy outline + text, sin fondo hasta hover
  // Outline: Navy border + text, fondo transparente

  // Dimensiones: height 56px (mobile: 48px), border-radius AppShapes.DEFAULT (8px)
  // Loading: reemplaza texto con CircularProgressIndicator (blanco)
  // Disabled: opacidad 0.5
}

enum AppButtonVariant { primary, secondary, ghost, outline }
```

### AppTextField

```dart
class AppTextField extends StatelessWidget {
  final String label;
  final String? hint;
  final TextInputType keyboardType;
  final bool obscureText;
  final String? errorText;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;

  // Default: bg #F1F5F9, sin borde, border-radius AppShapes.DEFAULT (8px)
  // Focus: bg white, 2px stroke secondary (#006E1C)
  // Error: stroke error color
  // Dimensiones: height 48px, padding horizontal 16px
}
```

### AppCard

```dart
class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;

  // Sin borde, bg surfaceContainerLowest (#FFFFFF)
  // border-radius AppShapes.lg (16px)
  // Padding interno: AppSpacing.containerMargin (20px)
  // Sin sombra por default (distinguir por color de fondo)
}
```

### StatusChip

```dart
class StatusChip extends StatelessWidget {
  final String label;
  final StatusChipVariant variant; // success, warning, error, info, neutral

  // Pill-shaped (border-radius: AppShapes.full)
  // Texto en color primario con 10% opacity background
  // Usar para: Occupied, Maintenance, Pending, etc.
}
```

---

## Transiciones y Animaciones

| Tipo | Animación | Duración |
|------|-----------|----------|
| Default | Material page transition | 300ms |
| Modal | Slide from bottom | 400ms, curve: easeOutCubic |
| Dialog | Fade + scale | 200ms |
| Hover/Focus | Color transition | 150ms ease |
| Press (active) | Scale 0.98 | 150ms |

---

## Background Orgánico (Decorative Blobs)

Para crear el atmosphere "Tonal Minimalism" sin bordes físicos:

```dart
// Usar en backgrounds de screens principales
Widget build(BuildContext context) {
  return Stack(
    children: [
      // Organic Blob 1 - Green
      Positioned(
        top: -100,
        left: -150,
        child: Container(
          width: 400,
          height: 400,
          decoration: BoxDecoration(
            color: AppColors.secondary.withOpacity(0.04), // 4% opacity
            borderRadius: BorderRadius.circular(50),
            boxShadow: [
              BoxShadow(
                color: AppColors.secondary.withOpacity(0.04),
                blurRadius: 80,
                spreadRadius: 0,
              ),
            ],
          ),
        ),
      ),
      // Organic Blob 2 - Navy
      Positioned(
        bottom: -50,
        right: -100,
        child: Container(
          width: 350,
          height: 350,
          decoration: BoxDecoration(
            color: AppColors.primaryContainer.withOpacity(0.04),
            borderRadius: BorderRadius.circular(50),
            boxShadow: [
              BoxShadow(
                color: AppColors.primaryContainer.withOpacity(0.04),
                blurRadius: 80,
                spreadRadius: 0,
              ),
            ],
          ),
        ),
      ),
      // Content
      child,
    ],
  );
}
```

---

## Patrones de Diseño

### Cards sin Bordes

```dart
// Correcto: Card con surface tint diferente, sin borde
Container(
  decoration: BoxDecoration(
    color: AppColors.surfaceContainerLowest,
    borderRadius: BorderRadius.circular(AppShapes.lg),
  ),
  padding: const EdgeInsets.all(AppSpacing.containerMargin),
  child: content,
);

// Incorrecto: Card con borde
Container(
  decoration: BoxDecoration(
    border: Border.all(color: AppColors.outline),
  ),
  child: content,
);
```

### Inputs sin Borde Default

```dart
// Correcto: Input sin borde, fondo gris claro
TextField(
  decoration: InputDecoration(
    filled: true,
    fillColor: Color(0xFFF1F5F9),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppShapes.DEFAULT),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(AppShapes.DEFAULT),
      borderSide: BorderSide(color: AppColors.secondary, width: 2),
    ),
  ),
);
```

### Listas sin Divisores

```dart
// Correcto: Lista sin dividers, usar spacing vertical
Column(
  children: [
    _ListItem(),
    SizedBox(height: AppSpacing.stackMd),
    _ListItem(),
    SizedBox(height: AppSpacing.stackMd),
    _ListItem(),
  ],
);

// Incorrecto: Lista con Divider widgets
Column(
  children: [
    _ListItem(),
    Divider(),
    _ListItem(),
    Divider(),
    _ListItem(),
  ],
);
```

---

## AppTheme (ThemeData)

```dart
// /core/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'app_colors.dart';
import 'app_typography.dart';

class AppTheme {
  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryContainer,
        onPrimary: AppColors.onPrimary,
        secondary: AppColors.secondary,
        onSecondary: AppColors.onSecondary,
        surface: AppColors.surface,
        onSurface: AppColors.onSurface,
        error: AppColors.error,
        onError: AppColors.onError,
        outline: AppColors.outline,
      ),
      scaffoldBackgroundColor: AppColors.background,
      textTheme: const TextTheme(
        displayLarge: AppTypography.headlineXL,
        displayMedium: AppTypography.headlineLG,
        headlineMedium: AppTypography.titleMD,
        bodyLarge: AppTypography.bodyLG,
        bodyMedium: AppTypography.bodyMD,
        labelLarge: AppTypography.labelMD,
        labelSmall: AppTypography.labelSM,
      ),
      fontFamily: 'Inter',
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.onSurface,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardTheme(
        color: AppColors.surfaceContainerLowest,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppShapes.lg),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFF1F5F9),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppShapes.DEFAULT),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppShapes.DEFAULT),
          borderSide: const BorderSide(color: AppColors.secondary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppShapes.DEFAULT),
          borderSide: const BorderSide(color: AppColors.error, width: 1),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryContainer,
          foregroundColor: AppColors.onPrimary,
          minimumSize: const Size(double.infinity, 56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppShapes.DEFAULT),
          ),
          textStyle: AppTypography.labelMD,
        ),
      ),
    );
  }

  static ThemeData get dark => light; // TODO: Implementar tema oscuro
}
```
