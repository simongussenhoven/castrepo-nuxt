import { Capacitor } from '@capacitor/core'
import { Network } from '@capacitor/network'

/**
 * Reactive network status composable.
 * Uses @capacitor/network on native and navigator.onLine on web.
 * Returns a shared `isOnline` ref so all consumers see the same value.
 */
export function useNetworkStatus() {
    const isOnline = useState<boolean>('networkOnline', () => true)
    const initialized = useState<boolean>('networkInitialized', () => false)

    if (import.meta.client && !initialized.value) {
        initialized.value = true

        if (Capacitor.isNativePlatform()) {
            // Native: use Capacitor Network plugin
            Network.getStatus().then(status => {
                isOnline.value = status.connected
            })
            Network.addListener('networkStatusChange', (status) => {
                isOnline.value = status.connected
            })
        } else {
            // Web: use browser APIs
            isOnline.value = navigator.onLine
            window.addEventListener('online', () => { isOnline.value = true })
            window.addEventListener('offline', () => { isOnline.value = false })
        }
    }

    return { isOnline }
}
