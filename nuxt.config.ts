// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    // get env variables from .env file for the server
    runtimeConfig: {
        pciApiKey: process.env.NUXT_PCI_API_KEY,
        pciApiSecret: process.env.NUXT_PCI_API_SECRET,
    },
    devtools: { enabled: true },
    modules: [
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/ui',
        '@nuxt/test-utils'
    ],
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss(),
        ]
    }
})