<script setup lang="ts">
const supabase = useSupabaseClient()
const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
    email: '',
    password: '',
    confirmPassword: ''
})

const validateForm = () => {
    if (!form.email || !form.password || !form.confirmPassword) {
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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
        error.value = 'Please enter a valid email address'
        return false
    }

    return true
}

const handleRegister = async () => {
    error.value = ''
    success.value = false

    if (!validateForm()) {
        return
    }

    loading.value = true

    try {
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        })

        if (signUpError) {
            error.value = signUpError.message
        } else {
            // Check if user needs to confirm email
            if (data.user && !data.user.confirmed_at) {
                success.value = true
            } else {
                // User is auto-confirmed (email confirmation disabled)
                success.value = true
            }
            // Reset form
            form.email = ''
            form.password = ''
            form.confirmPassword = ''
        }
    } catch (err: any) {
        error.value = err.message || 'An error occurred during registration'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="space-y-4">
        <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800">
                Registration successful! Please check your email to verify your account.
            </p>
        </div>

        <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-800">{{ error }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input id="email" v-model="form.email" type="email" placeholder="you@example.com" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :disabled="loading" />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input id="password" v-model="form.password" type="password" placeholder="••••••••" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :disabled="loading" />
            </div>

            <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                </label>
                <input id="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="••••••••"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :disabled="loading" />
            </div>

            <button type="submit" :disabled="loading"
                class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span v-if="loading">Registering...</span>
                <span v-else>Create Account</span>
            </button>
        </form>
    </div>
</template>