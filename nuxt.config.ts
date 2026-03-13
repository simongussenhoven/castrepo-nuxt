// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    fonts: {
        // families: [
        //     { name: 'Inter', provider: 'google' },
        //     { name: 'Roboto', provider: 'google', weights: [400, 700] },
        // ],
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
    devtools: { enabled: !process.env.CAPACITOR },
    devServer: {
        host: '0.0.0.0',
        port: 3000,
    },
    modules: [
        '@nuxt/eslint',
        '@nuxt/image',
        '@nuxt/ui',
        '@nuxt/test-utils',
        '@pinia/nuxt',
        '@nuxtjs/supabase',
        '@vueuse/nuxt'
    ],
    pinia: {
        storesDirs: ['./app/stores/**'],
    },
    colorMode: {
        preference: 'dark',
    },
    supabase: {
        redirect: false,
        types: 'types/database.ts',
        cookieOptions: {
            // Must be false: Capacitor dev loads the WebView over HTTP
            // (http://10.0.2.2:3000), and Secure cookies are silently
            // ignored on non-HTTPS origins — breaking auth session storage.
            secure: false,
        },
    },
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss(),
        ]
    }
})