<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
const loading = ref(false)
const error = ref('')

const emit = defineEmits<{ success: [] }>()

const form = reactive({
    email: '',
    password: ''
})

const validateForm = () => {
    if (!form.email || !form.password) {
        error.value = 'Email and password are required'
        return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
        error.value = 'Please enter a valid email address'
        return false
    }

    return true
}

const handleLogin = async () => {
    error.value = ''

    if (!validateForm()) {
        return
    }

    loading.value = true

    try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password
        })

        if (signInError) {
            error.value = signInError.message
        } else {
            // Reset form
            form.email = ''
            form.password = ''
            // Show success toast
            toast.add({
                title: 'Welcome back!',
                description: 'You have successfully logged in.',
                color: 'success',
                icon: 'i-heroicons-check-circle'
            })
            // User will be automatically set by useSupabaseUser()
            // Emit success to close the modal
            emit('success')
        }
    } catch (err: any) {
        error.value = err.message || 'An error occurred during login'
    } finally {
        loading.value = false
    }
}

const handleForgotPassword = async () => {
    if (!form.email) {
        error.value = 'Please enter your email address'
        return
    }

    loading.value = true
    error.value = ''

    try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(form.email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        })

        if (resetError) {
            error.value = resetError.message
        } else {
            error.value = 'Password reset email sent! Check your inbox.'
        }
    } catch (err: any) {
        error.value = err.message || 'An error occurred'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="space-y-4">
        <div v-if="error" class="p-4 border rounded-lg" :class="{
            'bg-red-50 border-red-200': !error.includes('reset email sent'),
            'bg-green-50 border-green-200': error.includes('reset email sent')
        }">
            <p class="text-sm" :class="{
                'text-red-800': !error.includes('reset email sent'),
                'text-green-800': error.includes('reset email sent')
            }">
                {{ error }}
            </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
                <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input id="login-email" v-model="form.email" type="email" placeholder="you@example.com" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :disabled="loading" />
            </div>

            <div>
                <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input id="login-password" v-model="form.password" type="password" placeholder="••••••••" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    :disabled="loading" />
            </div>

            <div class="flex items-center justify-between">
                <button type="button" @click="handleForgotPassword" :disabled="loading"
                    class="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50">
                    Forgot password?
                </button>
            </div>

            <button type="submit" :disabled="loading"
                class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <span v-if="loading">Signing in...</span>
                <span v-else>Sign In</span>
            </button>
        </form>
    </div>
</template>