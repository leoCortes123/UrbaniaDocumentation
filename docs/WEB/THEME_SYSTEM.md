# 🎨 THEME_SYSTEM
## Sistema de Diseño del Portal Web

> **Consultar**: Si la tarea involucra UI, componentes, colores, tipografía o espaciado.

---

## Paleta de Colores (CSS Variables)

```css
:root {
  --surface: #F8F9FF;
  --surface-dim: #CBDBF5;
  --surface-bright: #F8F9FF;
  --surface-container-lowest: #FFFFFF;
  --surface-container-low: #EFF4FF;
  --surface-container: #E5EEFF;
  --surface-container-high: #DCE9FF;
  --surface-container-highest: #D3E4FE;
  --surface-variant: #D3E4FE;
  --surface-tint: #415F8F;

  --on-surface: #0B1C30;
  --on-surface-variant: #43474F;
  --inverse-surface: #213145;
  --inverse-on-surface: #EAF1FF;

  --outline: #747780;
  --outline-variant: #C4C6D0;

  --primary: #001430;
  --primary-container: #002855;
  --on-primary: #FFFFFF;
  --on-primary-container: #7490C3;
  --inverse-primary: #AAC7FD;

  --primary-fixed: #D6E3FF;
  --primary-fixed-dim: #AAC7FD;
  --on-primary-fixed: #001B3D;
  --on-primary-fixed-variant: #284775;

  --secondary: #006E1C;
  --secondary-container: #91F78E;
  --on-secondary: #FFFFFF;
  --on-secondary-container: #00731E;

  --secondary-fixed: #94F990;
  --secondary-fixed-dim: #78DC77;
  --on-secondary-fixed: #002204;
  --on-secondary-fixed-variant: #005313;

  --tertiary: #101517;
  --tertiary-container: #24292C;
  --on-tertiary: #FFFFFF;
  --on-tertiary-container: #8B9094;

  --tertiary-fixed: #DFE3E7;
  --tertiary-fixed-dim: #C3C7CB;
  --on-tertiary-fixed: #171C1F;
  --on-tertiary-fixed-variant: #43474B;

  --error: #BA1A1A;
  --error-container: #FFDAD6;
  --on-error: #FFFFFF;
  --on-error-container: #93000A;

  --background: #F8F9FF;
  --on-background: #0B1C30;

  /* Semantic */
  --success: #006E1C;
  --success-container: #91F78E;
  --on-success: #FFFFFF;
  --on-success-container: #00731E;

  --warning: #B8860B;
  --warning-container: #FFF8DC;
  --on-warning: #000000;
  --on-warning-container: #5C4033;

  --info: #002855;
  --info-container: #D6E3FF;
  --on-info: #7490C3;
  --on-info-container: #001B3D;
}
```

---

## Tipografía (Tailwind Config)

```javascript
fontFamily: {
  heading: ['Hanken Grotesk', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
},
fontSize: {
  'headline-xl': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
  'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
  'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '600' }],
  'title-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
  'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
  'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
  'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
}
```

---

## Espaciado

```javascript
spacing: {
  'stack-sm': '8px',
  'stack-md': '16px',
  'stack-lg': '32px',
  'container-margin': '20px',
  'gutter': '16px',
}
```

---

## Border Radius

```javascript
borderRadius: {
  'shape-sm': '4px',
  'shape-default': '8px',
  'shape-md': '12px',
  'shape-lg': '16px',
  'shape-xl': '24px',
  'shape-full': '9999px',
}
```

---

## Sombras

```javascript
boxShadow: {
  none: '0 0 0 0 rgba(0,0,0,0)',
  subtle: '0 1px 2px 0 rgba(0, 20, 48, 0.05)',
  ambient: '0 4px 6px -1px rgba(0, 20, 48, 0.1), 0 2px 4px -2px rgba(0, 20, 48, 0.1)',
  medium: '0 8px 16px -4px rgba(0, 20, 48, 0.12)',
  high: '0 16px 32px -8px rgba(0, 20, 48, 0.15)',
}
```

---

## Componentes Base

### AppButton (PrimeVue + Tailwind)

```vue
<template>
  <Button
    :label="label"
    :severity="severity"
    :loading="isLoading"
    :disabled="disabled"
    :class="buttonClasses"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'

interface Props {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  isLoading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  isLoading: false,
  disabled: false,
  fullWidth: true,
})

const emit = defineEmits<{ click: [] }>()

const severity = computed(() => {
  switch (props.variant) {
    case 'primary': return 'primary'
    case 'secondary': return 'success'
    case 'ghost': return 'secondary'
    case 'outline': return 'secondary'
    default: return 'primary'
  }
})

const buttonClasses = computed(() => ({
  'w-full': props.fullWidth,
  'h-14': true,
  'rounded-lg': true,
  'font-medium': true,
  'border-2': props.variant === 'outline',
  'bg-transparent': props.variant === 'ghost' || props.variant === 'outline',
}))

function handleClick(): void {
  if (!props.isLoading && !props.disabled) {
    emit('click')
  }
}
</script>
```

### AppInput

```vue
<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-label-md font-medium text-on-surface-variant">
      {{ label }}
    </label>
    <InputText
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      :invalid="!!error"
      :class="inputClasses"
      @blur="handleBlur"
      @update:model-value="handleInput"
    />
    <small v-if="error" class="text-error text-sm">{{ error }}</small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import InputText from 'primevue/inputtext'

interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), { type: 'text' })
const emit = defineEmits<{ 'update:modelValue': [value: string]; blur: [] }>()

const inputClasses = computed(() => ({
  'w-full': true, 'h-12': true, 'px-4': true, 'rounded-lg': true,
  'bg-slate-50': true, 'border-0': !props.error, 'border-2': !!props.error,
  'border-error': !!props.error, 'focus:ring-2': true,
  'focus:ring-secondary': true, 'focus:bg-white': true,
}))

function handleBlur(): void { emit('blur') }
function handleInput(value: string): void { emit('update:modelValue', value) }
</script>
```

### AppCard

```vue
<template>
  <div
    :class="['bg-surface-container-lowest rounded-2xl p-5',
      { 'cursor-pointer hover:bg-surface-container-low': clickable }]"
    @click="handleClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props { clickable?: boolean }
const props = withDefaults(defineProps<Props>(), { clickable: false })
const emit = defineEmits<{ click: [] }>()
function handleClick(): void { if (props.clickable) emit('click') }
</script>
```

### StatusChip

```vue
<template>
  <Tag :value="label" :severity="severity" class="rounded-full px-3 py-1 text-sm font-medium" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Tag from 'primevue/tag'

type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral'
interface Props { label: string; variant: StatusVariant }
const props = defineProps<Props>()

const severity = computed(() => {
  switch (props.variant) {
    case 'success': return 'success'
    case 'warning': return 'warning'
    case 'error': return 'danger'
    case 'info': return 'info'
    case 'neutral': return 'secondary'
    default: return 'secondary'
  }
})
</script>
```

---

## Tailwind Config Completo

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        'surface-dim': 'var(--surface-dim)',
        'surface-bright': 'var(--surface-bright)',
        'surface-container-lowest': 'var(--surface-container-lowest)',
        'surface-container-low': 'var(--surface-container-low)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        'surface-variant': 'var(--surface-variant)',
        'surface-tint': 'var(--surface-tint)',
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'inverse-surface': 'var(--inverse-surface)',
        'inverse-on-surface': 'var(--inverse-on-surface)',
        outline: 'var(--outline)',
        'outline-variant': 'var(--outline-variant)',
        primary: 'var(--primary)',
        'primary-container': 'var(--primary-container)',
        'on-primary': 'var(--on-primary)',
        'on-primary-container': 'var(--on-primary-container)',
        'inverse-primary': 'var(--inverse-primary)',
        'primary-fixed': 'var(--primary-fixed)',
        'primary-fixed-dim': 'var(--primary-fixed-dim)',
        'on-primary-fixed': 'var(--on-primary-fixed)',
        'on-primary-fixed-variant': 'var(--on-primary-fixed-variant)',
        secondary: 'var(--secondary)',
        'secondary-container': 'var(--secondary-container)',
        'on-secondary': 'var(--on-secondary)',
        'on-secondary-container': 'var(--on-secondary-container)',
        'secondary-fixed': 'var(--secondary-fixed)',
        'secondary-fixed-dim': 'var(--secondary-fixed-dim)',
        'on-secondary-fixed': 'var(--on-secondary-fixed)',
        'on-secondary-fixed-variant': 'var(--on-secondary-fixed-variant)',
        tertiary: 'var(--tertiary)',
        'tertiary-container': 'var(--tertiary-container)',
        'on-tertiary': 'var(--on-tertiary)',
        'on-tertiary-container': 'var(--on-tertiary-container)',
        'tertiary-fixed': 'var(--tertiary-fixed)',
        'tertiary-fixed-dim': 'var(--tertiary-fixed-dim)',
        'on-tertiary-fixed': 'var(--on-tertiary-fixed)',
        'on-tertiary-fixed-variant': 'var(--on-tertiary-fixed-variant)',
        error: 'var(--error)',
        'error-container': 'var(--error-container)',
        'on-error': 'var(--on-error)',
        'on-error-container': 'var(--on-error-container)',
        background: 'var(--background)',
        'on-background': 'var(--on-background)',
        success: 'var(--success)',
        'success-container': 'var(--success-container)',
        'on-success': 'var(--on-success)',
        'on-success-container': 'var(--on-success-container)',
        warning: 'var(--warning)',
        'warning-container': 'var(--warning-container)',
        'on-warning': 'var(--on-warning)',
        'on-warning-container': 'var(--on-warning-container)',
        info: 'var(--info)',
        'info-container': 'var(--info-container)',
        'on-info': 'var(--on-info)',
        'on-info-container': 'var(--on-info-container)',
      },
      fontFamily: {
        heading: ['Hanken Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'title-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', letterSpacing: '0.01em', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
      },
      spacing: {
        'stack-sm': '8px',
        'stack-md': '16px',
        'stack-lg': '32px',
        'container-margin': '20px',
        gutter: '16px',
      },
      borderRadius: {
        'shape-sm': '4px',
        'shape-default': '8px',
        'shape-md': '12px',
        'shape-lg': '16px',
        'shape-xl': '24px',
        'shape-full': '9999px',
      },
      boxShadow: {
        none: '0 0 0 0 rgba(0,0,0,0)',
        subtle: '0 1px 2px 0 rgba(0, 20, 48, 0.05)',
        ambient: '0 4px 6px -1px rgba(0, 20, 48, 0.1), 0 2px 4px -2px rgba(0, 20, 48, 0.1)',
        medium: '0 8px 16px -4px rgba(0, 20, 48, 0.12)',
        high: '0 16px 32px -8px rgba(0, 20, 48, 0.15)',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        300: '300ms',
        400: '400ms',
      },
      transitionTimingFunction: {
        'ease-out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
}
```

> **Nota**: Instalar `tailwindcss-primeui` para compatibilidad completa con PrimeVue.
