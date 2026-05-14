// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['vue-sonner/nuxt'],
  css: [
    '~/assets/css/main.css'
  ],
  app: {
    head: {
      title: 'Nexus AI Chat (Nuxt)',
      meta: [
        { name: 'description', content: 'A premium, modern AI chat interface powered by OpenAI.' }
      ]
    }
  },
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  }
})
