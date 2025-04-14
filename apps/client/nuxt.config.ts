// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-02-07',
  devtools: { enabled: true },
  css: ['@/assets/css/styles.css'],
  modules: [
    '@unocss/nuxt',
    '@pinia/nuxt',
  ],
})
