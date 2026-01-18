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
    lodash: {
        prefix: "_",
        prefixSkip: ["string"],
        upperAfterPrefix: false,
        exclude: ["map"],
        alias: [
            ["camelCase", "stringToCamelCase"], // => stringToCamelCase
            ["kebabCase", "stringToKebab"], // => stringToKebab
            ["isDate", "isLodashDate"], // => _isLodashDate
        ],
    },
    runtimeConfig: {
        pciApiKey: process.env.NUXT_PCI_API_KEY,
        pciApiSecret: process.env.NUXT_PCI_API_SECRET,
    },
    devtools: { enabled: true },
    modules: [
      '@nuxt/eslint',
      '@nuxt/image',
      '@nuxt/ui',
      '@nuxt/test-utils',
      'nuxt-lodash',
      '@pinia/nuxt'
    ],
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss(),
        ]
    }
})