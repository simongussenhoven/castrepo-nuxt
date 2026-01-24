<script setup lang="ts">
import type { Database } from '~~/types/database';

const supabase = useSupabaseClient<Database>()
const toast = useToast()
const emit = defineEmits<{
    close: [];
    confirm: [];
}>();

const props = defineProps<{
    feed: {
        id: string;
        title: string;
    },
    onConfirm: (id: string) => void;
}>();

async function unsubscribe(subscriptionId: string, podcastTitle: string) {


    try {
        const { error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', subscriptionId)

        if (error) throw error

        // Remove from local array
        emit('confirm');

        toast.add({
            title: 'Unsubscribed',
            description: `You have unsubscribed from ${podcastTitle}.`,
            color: 'success',
            icon: 'i-heroicons-check-circle'
        })
    } catch (error: any) {
        toast.add({
            title: 'Error',
            description: error.message || 'Failed to unsubscribe',
            color: 'error',
            icon: 'i-heroicons-x-circle'
        })
    }
}

const onUnsubscribe = () => {
    try {
        unsubscribe(props.feed.id, props.feed.title);
        props.onConfirm(props.feed.id)

    } catch (error) {
        console.error('Unsubscribe failed:', error);
        toast.add({
            title: 'Error',
            description: 'Failed to unsubscribe',
            color: 'error',
            icon: 'i-heroicons-x-circle'
        });
    }
    finally {
        emit('close');
    }

};
</script>
<template>
    <UModal>
        <template #title>Confirm Unsubscribe</template>
        <template #body>
            <p>Are you sure you want to unsubscribe from {{ feed.title }}?</p>
        </template>
        <template #footer>
            <UButton label="Cancel" variant="outline" @click="$emit('close')" />
            <UButton label="Unsubscribe" color="error" @click="onUnsubscribe" />
        </template>
    </UModal>

</template>