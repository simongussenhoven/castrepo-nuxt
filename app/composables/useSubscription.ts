import type { Database } from '~~/types/database';
import type { OfflineMutation } from './useOfflineCache';

interface PodcastData {
    id: number;
    title: string;
    image?: string;
    url?: string;
    podcastGuid?: string;
}

export const useSubscription = (podcast: Ref<PodcastData> | ComputedRef<PodcastData>) => {
    const supabase = useSupabaseClient<Database>()
    const user = useSupabaseUser()
    const toast = useToast()
    const { isOnline } = useNetworkStatus()
    const cache = useOfflineCache()
    const loading = ref(false)
    const isSubscribed = ref(false)

    // Check if user is subscribed
    async function checkSubscription() {
        if (!user.value) {
            isSubscribed.value = false
            return
        }

        if (!isOnline.value) {
            // Offline: check from cached subscriptions
            const cached = await cache.getSubscriptions()
            if (cached) {
                isSubscribed.value = cached.some(s => s.podcast_id === unref(podcast).id)
            }
            return
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .select('id')
            .eq('user_id', user.value.sub)
            .eq('podcast_id', unref(podcast).id)
            .maybeSingle()

        if (!error && data) {
            isSubscribed.value = true
        } else {
            isSubscribed.value = false
        }
    }

    // Toggle subscription
    async function toggleSubscription() {
        if (!user.value) {
            toast.add({
                title: 'Login required',
                description: 'Please log in to subscribe to podcasts.',
                color: 'warning',
                icon: 'i-heroicons-exclamation-triangle'
            })
            return
        }

        loading.value = true

        try {
            const podcastData = unref(podcast)

            if (isSubscribed.value) {
                // Unsubscribe
                if (!isOnline.value) {
                    // Queue for later sync
                    const mutation: OfflineMutation = {
                        id: `unsub-${podcastData.id}-${Date.now()}`,
                        type: 'unsubscribe',
                        payload: {
                            userId: user.value.sub,
                            podcastId: podcastData.id,
                        },
                        createdAt: Date.now(),
                    }
                    await cache.addMutation(mutation)

                    // Update cached subscriptions optimistically
                    const cached = await cache.getSubscriptions()
                    if (cached) {
                        await cache.setSubscriptions(cached.filter(s => s.podcast_id !== podcastData.id))
                    }

                    isSubscribed.value = false
                    toast.add({
                        title: 'Unsubscribed (offline)',
                        description: `Will sync when you're back online.`,
                        color: 'warning',
                        icon: 'i-heroicons-signal-slash'
                    })
                } else {
                    const { error } = await supabase
                        .from('subscriptions')
                        .delete()
                        .eq('user_id', user.value.sub)
                        .eq('podcast_id', podcastData.id)

                    if (error) throw error

                    isSubscribed.value = false
                    toast.add({
                        title: 'Unsubscribed',
                        description: `You have unsubscribed from ${podcastData.title}.`,
                        color: 'success',
                        icon: 'i-heroicons-check-circle'
                    })
                }
            } else {
                // Subscribe
                if (!isOnline.value) {
                    // Queue for later sync
                    const mutation: OfflineMutation = {
                        id: `sub-${podcastData.id}-${Date.now()}`,
                        type: 'subscribe',
                        payload: {
                            userId: user.value.sub,
                            podcastId: podcastData.id,
                            podcastTitle: podcastData.title,
                            podcastImage: podcastData.image,
                            podcastUrl: podcastData.url,
                            podcastGuid: podcastData.podcastGuid,
                        },
                        createdAt: Date.now(),
                    }
                    await cache.addMutation(mutation)

                    // Update cached subscriptions optimistically
                    const cached = await cache.getSubscriptions() ?? []
                    cached.unshift({
                        id: mutation.id,    // temporary id
                        user_id: user.value.sub,
                        podcast_id: podcastData.id,
                        podcast_title: podcastData.title,
                        podcast_image: podcastData.image ?? null,
                        podcast_url: podcastData.url ?? null,
                        podcast_guid: podcastData.podcastGuid ?? null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                    await cache.setSubscriptions(cached)

                    isSubscribed.value = true
                    toast.add({
                        title: 'Subscribed (offline)',
                        description: `Will sync when you're back online.`,
                        color: 'warning',
                        icon: 'i-heroicons-signal-slash'
                    })
                } else {
                    const { error } = await supabase
                        .from('subscriptions')
                        .insert({
                            user_id: user.value.sub,
                            podcast_id: podcastData.id,
                            podcast_title: podcastData.title,
                            podcast_image: podcastData.image,
                            podcast_url: podcastData.url,
                            podcast_guid: podcastData.podcastGuid
                        })

                    if (error) throw error

                    isSubscribed.value = true
                    toast.add({
                        title: 'Subscribed',
                        description: `You are now subscribed to ${podcastData.title}.`,
                        color: 'success',
                        icon: 'i-heroicons-check-circle'
                    })
                }
            }
        } catch (error: any) {
            toast.add({
                title: 'Error',
                description: error.message || 'An error occurred',
                color: 'error',
                icon: 'i-heroicons-x-circle'
            })
        } finally {
            loading.value = false
        }
    }

    // Watch for user changes and check subscription
    watch(user, () => {
        checkSubscription()
    }, { immediate: true })

    return {
        isSubscribed,
        loading,
        toggleSubscription,
        checkSubscription
    }
}
