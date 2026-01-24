<script setup lang="ts">
import SubscriptionDeleteModal from '~/components/SubscriptionDeleteModal.vue';
import type { Database } from '~~/types/database';

definePageMeta({
    middleware: 'auth'
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const toast = useToast()
const overlay = useOverlay()

const subscriptions = ref<Database['public']['Tables']['subscriptions']['Row'][]>([])
const loading = ref(true)
const unsubscribing = ref<string | null>(null)

// Fetch user's subscriptions
async function fetchSubscriptions() {
    if (!user.value?.sub) {
        loading.value = false
        return
    }

    loading.value = true

    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.value.sub)
            .order('created_at', { ascending: false })

        if (error) throw error

        subscriptions.value = data || []
    } catch (error: any) {
        toast.add({
            title: 'Error',
            description: error.message || 'Failed to load subscriptions',
            color: 'error',
            icon: 'i-heroicons-x-circle'
        })
    } finally {
        loading.value = false
    }
}

// Show confirmation modal before unsubscribing
function confirmUnsubscribe(subscriptionId: string, podcastTitle: string) {
    unsubscribing.value = subscriptionId
    overlay.create(SubscriptionDeleteModal, {
        defaultOpen: true,
        props: {
            feed: {
                id: subscriptionId,
                title: podcastTitle,

            },
            onConfirm: (id) => {
                subscriptions.value = subscriptions.value.filter(s => s.id !== id)
            }
        }
    })
}

// Navigate to podcast feed
function goToPodcast(podcastId: number) {
    navigateTo(`/feed/${podcastId}`)
}

// Load subscriptions on mount
onMounted(() => {
    fetchSubscriptions()
})

// Reload when user changes
watch(user, () => {
    fetchSubscriptions()
})
</script>

<template>
    <div class="container mx-auto px-4 py-8 pt-24">
        <div class="mb-8">
            <h1 class="text-4xl font-bold mb-2">My Subscriptions</h1>
            <p class="text-gray-600 dark:text-gray-400">
                {{ subscriptions.length }} {{ subscriptions.length === 1 ? 'podcast' : 'podcasts' }}
            </p>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <!-- Empty state -->
        <div v-else-if="subscriptions.length === 0" class="text-center py-12">
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No subscriptions yet</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                    Start exploring podcasts and subscribe to your favorites!
                </p>
                <NuxtLink to="/discover">
                    <UButton label="Discover Podcasts" icon="i-heroicons-magnifying-glass" size="lg" />
                </NuxtLink>
            </div>
        </div>

        <!-- Subscriptions grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UCard v-for="subscription in subscriptions" :key="subscription.id"
                class="hover:shadow-lg transition-shadow cursor-pointer" @click="goToPodcast(subscription.podcast_id)">
                <div class="flex items-start gap-4">
                    <NuxtImg v-if="subscription.podcast_image" :src="subscription.podcast_image"
                        :alt="subscription.podcast_title" class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        width="80" height="80" loading="lazy" />
                    <div class="flex-1 min-w-0 flex flex-col gap-1">
                        <div class="flex items-start gap-2">
                            <h3
                                class="font-semibold text-lg line-clamp-2 hover:text-primary-600 transition-colors flex-1">
                                {{ subscription.podcast_title }}
                            </h3>
                            <UButton icon="i-heroicons-trash" color="neutral" variant="ghost" size="sm"
                                :loading="unsubscribing === subscription.id"
                                @click.stop="confirmUnsubscribe(subscription.id, subscription.podcast_title)" />
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Subscribed {{ new Date(subscription.created_at).toLocaleDateString() }}
                        </p>
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>