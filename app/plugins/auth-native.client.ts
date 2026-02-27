import { Capacitor } from '@capacitor/core'

/**
 * On native platforms (Capacitor), the @nuxtjs/supabase module's auth state
 * listener may not reliably update useSupabaseUser() because getClaims()
 * can fail in the WebView's cookie-based session context.
 *
 * This plugin directly listens for auth state changes and sets the user
 * from the session, bypassing getClaims().
 */
export default defineNuxtPlugin(() => {
    if (!Capacitor.isNativePlatform()) return

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    // Sync the current session on app start
    supabase.auth.getSession().then(({ data: { session } }) => {
        user.value = session?.user ?? null
    })

    // Listen for all auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
    })
})
