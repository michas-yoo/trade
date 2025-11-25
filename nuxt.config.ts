// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  runtimeConfig: {
    tBankToken: import.meta.env.TBANK_TOKEN,
    tBankApiURL: 'https://sandbox-invest-public-api.tbank.ru/rest/tinkoff.public.invest.api.contract.v1',
    tgChatId: import.meta.env.TG_CHAT_ID,
    tgBotToken: import.meta.env.TG_BOT_TOKEN,
  },

  app: {
    head: {
      title: 'Trading app',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],
    },
  },

  css: ['~/assets/css/style.css'],
  modules: ['@nuxtjs/tailwindcss'],
});
