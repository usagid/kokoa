# 🍫 Kokoa UI

A retro-pixel themed Vue 3 / Nuxt component library with light and dark mode support. Built around a cozy imageboard aesthetic with DotGothic16 pixel fonts, bevel shadows, and warm color palettes.

## Features

- 🎨 **Complete design system** — CSS custom properties for colors, shadows, typography
- 🌙 **Dark mode** — Full dark theme with `data-theme="dark"` attribute
- 🧩 **5 Vue 3 components** — Card, CopyLabel, Table, TagSelect, ThemeToggle
- 📦 **Nuxt Module** — Auto-registers components and injects styles
- 🎮 **Pixel-perfect** — Retro bevel shadows, pixel fonts, imageboard aesthetics
- 🛠️ **40+ CSS component classes** — Buttons, inputs, dialogs, tabs, toasts, and more

## Installation

### From local filesystem

```bash
npm install /path/to/kokoa/packages/kokoa-ui
```

### From GitHub

```bash
npm install github:your-username/kokoa#path:packages/kokoa-ui
```

## Usage

### Nuxt 3/4

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['kokoa-ui'],

  // Optional configuration
  kokoaUI: {
    // Include opinionated base/reset styles (html/body resets, pixel scrollbars)
    base: false,
    // Include Tailwind CSS @theme tokens (requires Tailwind v4+)
    tailwind: false,
  },
})
```

Components are auto-registered — just use them in your templates:

```vue
<template>
  <KokoaCard variant="elevated">
    <template #header>
      <h3 class="kokoa-card__title">Hello!</h3>
    </template>
    Welcome to Kokoa UI ε(´∀｀)з
  </KokoaCard>
</template>
```

### Plain Vue 3

```ts
import { KokoaCard, KokoaTable } from 'kokoa-ui/components'
import 'kokoa-ui/styles'
```

## Components

### `<KokoaCard>`

A flexible card component with slots for image, header, body, and footer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'bordered' \| 'ghost'` | `'default'` | Card style variant |

**Slots:** `image`, `header`, `default` (body), `footer`

### `<KokoaCopyLabel>`

An inline label that copies its value to clipboard on click, or allows inline editing.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | The text value |
| `mode` | `'click' \| 'editable'` | `'click'` | Click-to-copy or click-to-edit |

### `<KokoaTable>`

A feature-rich data table with sorting, filtering, and inline cell editing.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `TableColumn[]` | — | Column definitions |
| `rows` | `Record<string, any>[]` | — | Row data |
| `striped` | `boolean` | `true` | Striped rows |
| `compact` | `boolean` | `false` | Compact padding |
| `bordered` | `boolean` | `false` | Bordered style with colored header |

### `<KokoaTagSelect>`

A searchable multi-select tag picker with image support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string[]` | — | Selected tag IDs (v-model) |
| `options` | `TagOption[]` | — | Available tag options |
| `placeholder` | `string` | `'Search tags…'` | Input placeholder |
| `maxTags` | `number` | `0` | Max tags (0 = unlimited) |

### `<KokoaThemeToggle>`

A simple light/dark theme toggle button that persists preference to localStorage.

## CSS Classes

The library ships ~40 CSS component classes for use with reka-ui primitives or plain HTML:

- **Buttons:** `.kokoa-btn`, `.kokoa-btn--primary`, `.kokoa-btn--accent`, `.kokoa-btn--ghost`
- **Inputs:** `.kokoa-input`, `.kokoa-textarea`, `.kokoa-label`
- **Controls:** `.kokoa-checkbox`, `.kokoa-switch`, `.kokoa-radio`, `.kokoa-slider`
- **Select:** `.kokoa-select-trigger`, `.kokoa-select-content`, `.kokoa-select-item`
- **Dialog:** `.kokoa-dialog-overlay`, `.kokoa-dialog-content`, `.kokoa-dialog-titlebar`
- **Tabs:** `.kokoa-tabs-list`, `.kokoa-tabs-trigger`, `.kokoa-tabs-content`
- **Toast:** `.kokoa-toast`, `.kokoa-toast-viewport`, `.kokoa-toast-titlebar`
- **Layout:** `.kokoa-card`, `.kokoa-window`, `.kokoa-separator`, `.kokoa-marquee`
- **Data:** `.kokoa-badge`, `.kokoa-avatar`, `.kokoa-progress`
- **Calendar:** `.kokoa-calendar`, `.kokoa-date-field`, `.kokoa-date-picker-*`
- **Pagination:** `.kokoa-pagination`, `.kokoa-pagination-btn`

## Style Imports

| Import | Description |
|--------|-------------|
| `kokoa-ui/styles` | Variables + all component styles |
| `kokoa-ui/styles/base` | Opinionated base/reset (html, body, scrollbars) |
| `kokoa-ui/styles/variables` | CSS custom properties only |
| `kokoa-ui/styles/components` | Component classes only |
| `kokoa-ui/styles/tailwind` | Tailwind v4 `@theme` tokens |

## License

MIT
