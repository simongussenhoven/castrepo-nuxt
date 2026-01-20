// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    fonts: {
        families: [
            { name: 'Inter', provider: 'google' }, // example
            { name: 'Roboto', provider: 'google', weights: [400, 700] },
        ],
        defaults: {
            weights: [400],
            styles: ['normal']
        }
    },
    runtimeConfig: {
        pciApiKey: process.env.NUXT_PCI_API_KEY,
        pciApiSecret: process.env.NUXT_PCI_API_SECRET,
        public: {
            supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
            supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
        },
    },
    devtools: { enabled: true },
    modules: [
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/ui',
        '@nuxt/test-utils',
        '@pinia/nuxt',
        '@nuxtjs/supabase',
        '@vueuse/nuxt'
    ],
    supabase: {
        redirect: false,
        types: './types/database.ts'
    },
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss(),
        ]
    }
})