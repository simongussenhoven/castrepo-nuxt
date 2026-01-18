<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()
const error = ref('')
const loading = ref(true)

onMounted(async () => {
    try {
        // Get the code from the URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
            error.value = sessionError.message
            loading.value = false
            return
        }

        if (session) {
            // Successfully authenticated, redirect to home
            setTimeout(() => {
                router.push('/')
            }, 2000)
        } else {
            error.value = 'No session found. The link may have expired.'
            loading.value = false
        }
    } catch (err: any) {
        error.value = err.message || 'An error occurred during authentication'
        loading.value = false
    }
})
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full">
            <div v-if="loading" class="text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <h2 class="text-2xl font-semibold text-gray-900 mb-2">Verifying your email...</h2>
                <p class="text-gray-600">Please wait while we confirm your account.</p>
            </div>

            <div v-else-if="error" class="text-center">
                <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                    <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
                    <p class="text-red-800">{{ error }}</p>
                </div>
                <NuxtLink to="/"
                    class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Go to Home
                </NuxtLink>
            </div>

            <div v-else class="text-center">
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                    <svg class="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
                    <p class="text-green-800">Your account has been successfully verified.</p>
                    <p class="text-gray-600 mt-2">Redirecting you to the homepage...</p>
                </div>
            </div>
        </div>
    </div>
</template>
