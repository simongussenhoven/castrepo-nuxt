import type { Database } from '~~/types/database';

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
    const loading = ref(false)
    const isSubscribed = ref(false)

    // Check if user is subscribed
    async function checkSubscription() {
        if (!user.value) {
            isSubscribed.value = false
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
            } else {
                // Subscribe
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
