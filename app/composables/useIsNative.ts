import { Capacitor } from '@capacitor/core'

export const useIsNative = () => {
    const isNative = useState<boolean | null>('isNative', () => null)

    if (import.meta.client && isNative.value === null) {
        isNative.value = Capacitor.isNativePlatform()
    }

    return isNative
}
