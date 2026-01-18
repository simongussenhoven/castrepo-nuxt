<script setup lang="ts">
defineProps<{
    mode?: 'login' | 'register'
}>()

const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
    <UModal :close="{ onClick: () => emit('close', false) }">
        <template #header>
            <h3 class="text-base font-semibold">
                {{ mode === 'login' ? 'Login to Your Account' : 'Create a New Account' }}
            </h3>
        </template>

        <template #body>
            <UserModalLoginContent v-if="mode === 'login'" @success="emit('close', false)" />
            <UserModalRegisterContent v-else-if="mode === 'register'" />
        </template>

        <template #footer>
            <div class="flex gap-2">
                <UButton color="neutral" label="Cancel" @click="emit('close', false)" />
            </div>
        </template>
    </UModal>
</template>