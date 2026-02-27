import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

/**
 * On native platforms (Capacitor), the @nuxtjs/supabase module uses
 * createBrowserClient (@supabase/ssr) which stores auth tokens in cookies.
 * In Capacitor's WebView, these cookies may be treated as session cookies
 * and cleared when the app is killed — causing the user to be logged out.
 *
 * Additionally, the module's getClaims() calls can fail in the WebView,
 * causing user.value to be reset to null even during an active session.
 *
 * This plugin:
 * 1. Persists the session to Capacitor Preferences on every auth state change
 * 2. Restores the session from Preferences on app start (via setSession)
 * 3. Decodes JWT claims ourselves (bypassing getClaims)
 * 4. Guards against the module nullifying user.value via a watcher
 */

const STORAGE_KEY = 'sb-native-session'

function decodeJwtClaims(accessToken: string) {
    try {
        const [, payload] = accessToken.split('.')
        if (!payload) return null
        return JSON.parse(atob(payload)) as ReturnType<typeof useSupabaseUser>['value']
    } catch {
        return null
    }
}

export default defineNuxtPlugin(async () => {
    if (!Capacitor.isNativePlatform()) return

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    // Track the active claims as our source of truth on native
    let activeClaims: ReturnType<typeof useSupabaseUser>['value'] = null

    async function persistSession(session: { access_token: string; refresh_token: string } | null) {
        if (session?.access_token) {
            activeClaims = decodeJwtClaims(session.access_token)
            await Preferences.set({
                key: STORAGE_KEY,
                value: JSON.stringify({
                    access_token: session.access_token,
                    refresh_token: session.refresh_token
                })
            })
        } else {
            activeClaims = null
            await Preferences.remove({ key: STORAGE_KEY })
        }
        user.value = activeClaims
    }

    // ── 1. Set up guards FIRST (synchronous, before any async work) ──

    // Listen for all auth state changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
        persistSession(session)
    })

    // Guard against the module's getClaims() nullifying the user.
    // When getClaims fails on native, the module sets user to null even though
    // we have a valid session. This watcher detects that and restores it,
    // re-establishing the Supabase client session so queries include the auth token.
    watch(user, async (newVal) => {
        if (newVal === null && activeClaims) {
            // Restore user.value immediately so the UI stays consistent
            user.value = activeClaims

            // Re-establish the Supabase client session from Preferences
            // so that getSession() returns the session and queries are authenticated
            const { value: stored } = await Preferences.get({ key: STORAGE_KEY })
            if (stored) {
                try {
                    const { access_token, refresh_token } = JSON.parse(stored)
                    await supabase.auth.setSession({ access_token, refresh_token })
                } catch {
                    // ignore — session will be refreshed on next auth state change
                }
            }
        }
    })

    // ── 2. Now restore the session (async) ──

    const { value: stored } = await Preferences.get({ key: STORAGE_KEY })
    if (stored) {
        try {
            const { access_token, refresh_token } = JSON.parse(stored)
            const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
            if (error || !data.session) {
                // Tokens expired or invalid — clear storage
                await Preferences.remove({ key: STORAGE_KEY })
                activeClaims = null
                user.value = null
            } else {
                // setSession succeeded — set user immediately
                // (onAuthStateChange also fires, but the module's getClaims may null it)
                activeClaims = decodeJwtClaims(data.session.access_token)
                user.value = activeClaims
            }
        } catch {
            await Preferences.remove({ key: STORAGE_KEY })
        }
    } else {
        // No stored session; check if supabase has one (e.g. cookies persisted)
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            await persistSession(session)
        }
    }
})
