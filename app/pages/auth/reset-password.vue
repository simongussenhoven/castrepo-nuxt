<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()
const route = useRoute()
const toast = useToast()
const loading = ref(false)
const error = ref('')
const success = ref(false)
const hasLinkError = ref(false)

// Check for errors in URL params
onMounted(() => {
    const errorParam = route.query.error
    const errorDescription = route.query.error_description

    if (errorParam || errorDescription) {
        hasLinkError.value = true
        if (errorDescription === 'Email link is invalid or has expired') {
            error.value = 'This password reset link has expired or is invalid. Please request a new one.'
        } else {
            error.value = (errorDescription as string) || 'An error occurred. Please try again.'
        }
    }
})

const form = reactive({
    password: '',
    confirmPassword: ''
})

const validateForm = () => {
    if (!form.password || !form.confirmPassword) {
        error.value = 'All fields are required'
        return false
    }

    if (form.password.length < 6) {
        error.value = 'Password must be at least 6 characters'
        return false
    }

    if (form.password !== form.confirmPassword) {
        error.value = 'Passwords do not match'
        return false
    }

    return true
}

const handleResetPassword = async () => {
    error.value = ''

    if (!validateForm()) {
        return
    }

    loading.value = true

    try {
        const { error: updateError } = await supabase.auth.updateUser({
            password: form.password
        })

        if (updateError) {
            error.value = updateError.message
        } else {
            success.value = true
            toast.add({
                title: 'Password updated',
                description: 'Your password has been successfully updated.',
                color: 'success',
                icon: 'i-heroicons-check-circle'
            })
            // Redirect to home after 2 seconds
            setTimeout(() => {
                router.push('/')
            }, 2000)
        }
    } catch (err: any) {
        error.value = err.message || 'An error occurred while resetting your password'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full">
            <div v-if="success" class="text-center">
                <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                    <svg class="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 class="text-2xl font-semibold text-gray-900 mb-2">Password Updated!</h2>
                    <p class="text-green-800">Your password has been successfully changed.</p>
                    <p class="text-gray-600 mt-2">Redirecting you to the homepage...</p>
                </div>
            </div>

            <div v-else class="bg-white shadow-md rounded-lg p-8">
                <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">Reset Your Password</h2>

                <div v-if="hasLinkError" class="text-center">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                        <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Link Expired</h3>
                        <p class="text-red-800 mb-4">{{ error }}</p>
                        <NuxtLink to="/"
                            class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            Go to Home
                        </NuxtLink>
                    </div>
                </div>

                <div v-else>
                    <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                        <p class="text-sm text-red-800">{{ error }}</p>
                    </div>

                    <form @submit.prevent="handleResetPassword" class="space-y-4">
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input id="password" v-model="form.password" type="password" placeholder="••••••••" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                :disabled="loading" />
                        </div>

                        <div>
                            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <input id="confirmPassword" v-model="form.confirmPassword" type="password"
                                placeholder="••••••••" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                :disabled="loading" />
                        </div>

                        <button type="submit" :disabled="loading"
                            class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <span v-if="loading">Updating password...</span>
                            <span v-else>Update Password</span>
                        </button>
                    </form>

                    <div class="mt-6 text-center">
                        <NuxtLink to="/" class="text-sm text-primary-600 hover:text-primary-700">
                            Back to Home
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
