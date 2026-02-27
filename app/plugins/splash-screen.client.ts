import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'

/**
 * Hides the native splash screen once the Vue app has fully mounted
 * and styles have been applied. This prevents the flash of unstyled
 * content (FOUC) on Android cold starts.
 */
export default defineNuxtPlugin((nuxtApp) => {
    if (!Capacitor.isNativePlatform()) return

    nuxtApp.hook('app:mounted', async () => {
        // Wait one extra frame to ensure CSS/Tailwind styles are painted
        await new Promise(resolve => requestAnimationFrame(() => {
            requestAnimationFrame(resolve)
        }))

        await SplashScreen.hide({ fadeOutDuration: 300 })
    })
})
