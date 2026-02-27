import { Capacitor } from '@capacitor/core'

/**
 * On native platforms (Capacitor), the @nuxtjs/supabase module's auth state
 * listener calls getClaims() which can fail in the WebView's cookie-based
 * session context, causing user.value to be reset to null.
 *
 * The module's onAuthStateChange handler and page:start hook both call
 * getClaims() asynchronously. When getClaims returns null claims on native,
 * the module sets user.value = null — overriding any correct value we set.
 *
 * This plugin:
 * 1. Decodes the JWT access_token ourselves (bypassing getClaims)
 * 2. Tracks the active claims as the source of truth
 * 3. Watches for external nullification of user (by the module's getClaims)
 *    and restores the correct value
 */

function decodeJwtClaims(accessToken: string) {
    try {
        const [, payload] = accessToken.split('.')
        if (!payload) return null
        return JSON.parse(atob(payload)) as ReturnType<typeof useSupabaseUser>['value']
    } catch {
        return null
    }
}

export default defineNuxtPlugin(() => {
    if (!Capacitor.isNativePlatform()) return

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    // Track the active claims as our source of truth on native
    let activeClaims: ReturnType<typeof useSupabaseUser>['value'] = null

    function setUserFromSession(session: { access_token: string } | null) {
        if (session?.access_token) {
            activeClaims = decodeJwtClaims(session.access_token)
        } else {
            activeClaims = null
        }
        user.value = activeClaims
    }

    // Sync the current session on app start
    supabase.auth.getSession().then(({ data: { session } }) => {
        setUserFromSession(session)
    })

    // Listen for all auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
        setUserFromSession(session)
    })

    // Guard against the module's getClaims() nullifying the user.
    // When getClaims fails on native, the module sets user to null even though
    // we have a valid session. This watcher detects that and restores the user.
    watch(user, (newVal) => {
        if (newVal === null && activeClaims) {
            nextTick(() => {
                user.value = activeClaims
            })
        }
    })
})
