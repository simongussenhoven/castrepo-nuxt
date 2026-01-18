git mer
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

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
    <div>
        <UDropdownMenu :items="items" :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8
        }" :ui="{
            content: 'w-48'
        }">
            <UButton :icon="user ? 'i-lucide-user' : 'i-lucide-key'" color="neutral" variant="outline" size="lg" />
        </UDropdownMenu>
    </div>
</template>