import { defineNuxtModule, addComponentsDir, createResolver } from '@nuxt/kit'
import { fileURLToPath } from 'node:url'

export interface KokoaUIOptions {
  /**
   * Whether to include the opinionated base/reset styles
   * (html/body resets, pixel-font scrollbars, link colors, etc.)
   * @default false
   */
  base?: boolean

  /**
   * Whether to include Tailwind CSS @theme tokens.
   * Only useful if the consuming app uses Tailwind CSS v4+.
   * @default false
   */
  tailwind?: boolean
}

export default defineNuxtModule<KokoaUIOptions>({
  meta: {
    name: 'kokoa-ui',
    configKey: 'kokoaUI',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    base: false,
    tailwind: false,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Auto-register all Kokoa components
    await addComponentsDir({
      path: resolve('./runtime/components'),
      prefix: '',
      global: true,
    })

    // Always inject the core styles (variables + component styles)
    nuxt.options.css.unshift(resolve('./runtime/styles/kokoa.scss'))

    // Optionally inject base/reset styles
    if (options.base) {
      nuxt.options.css.unshift(resolve('./runtime/styles/base.scss'))
    }

    // Optionally inject Tailwind theme tokens
    if (options.tailwind) {
      nuxt.options.css.unshift(resolve('./runtime/styles/main.css'))
    }
  },
})
