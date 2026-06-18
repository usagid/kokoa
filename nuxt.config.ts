import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'reka-ui/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/scss/global.scss',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: true
    },
    css: {
      preprocessorOptions: {
        scss: {
        },
      },
    },
  },

  fonts: {
    families: [
      {
        name: 'DotGothic16',
        provider: 'google',
      },
    ],
  },
})