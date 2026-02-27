<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const props = withDefaults(defineProps<{
    native?: boolean
}>(), {
    native: false
})

// user stuff
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()
async function handleLogout() {
    await supabase.auth.signOut()
    toast.add({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
        color: 'success',
        icon: 'i-heroicons-arrow-right-on-rectangle'
    })
}

import { UserModal } from '#components'


const overlay = useOverlay()
const modal = overlay.create(UserModal)

async function open(mode: 'login' | 'register') {
    modal.open({ mode })
}

const items = computed<DropdownMenuItem[]>(() => {
    if (user.value) {
        return [
            {
                label: 'Logout',
                icon: 'i-lucide-log-out',
                onSelect: handleLogout
            }
        ]
    } else {
        return [
            {
                label: 'Register',
                icon: 'i-lucide-user-plus',
                onSelect: () => open('register')
            },
            {
                label: 'Login',
                icon: 'i-lucide-key',
                onSelect: () => open('login')
            }
        ]
    }
})
</script>

<template>
    <div :class="native ? 'flex-1' : ''">
        <UDropdownMenu :items="items" :content="{
            align: native ? 'end' : 'start',
            side: native ? 'top' : 'bottom',
            sideOffset: 8
        }" :ui="{
            content: 'w-48'
        }">
            <!-- Native tab style -->
            <button v-if="native"
                class="w-full flex flex-col items-center justify-center text-gray-400 hover:text-white py-1 text-xs font-medium">
                <UIcon :name="user ? 'i-heroicons-user-circle' : 'i-heroicons-key'" class="w-6 h-6" />
                <span class="mt-0.5 truncate">{{ user ? 'Account' : 'Login' }}</span>
            </button>
            <!-- Desktop style -->
            <UButton v-else :icon="user ? 'i-lucide-user' : 'i-lucide-key'" color="neutral" variant="outline"
                size="lg" />
        </UDropdownMenu>
    </div>
</template>