<script setup lang="ts">
import type { Database } from '~~/types/database'

const { isOnline } = useNetworkStatus()
const { syncSubscribedFeeds } = useSubscriptionSync()
const cache = useOfflineCache()
const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

// Replay queued offline mutations when coming back online
async function replayMutationQueue() {
    if (!user.value) return

    const queue = await cache.getMutationQueue()
    if (queue.length === 0) return

    for (const mutation of queue) {
        try {
            if (mutation.type === 'subscribe') {
                await supabase.from('subscriptions').upsert({
                    user_id: mutation.payload.userId,
                    podcast_id: mutation.payload.podcastId,
                    podcast_title: mutation.payload.podcastTitle!,
                    podcast_image: mutation.payload.podcastImage,
                    podcast_url: mutation.payload.podcastUrl,
                    podcast_guid: mutation.payload.podcastGuid,
                }, { onConflict: 'user_id,podcast_id' })
            } else if (mutation.type === 'unsubscribe') {
                await supabase.from('subscriptions').delete()
                    .eq('user_id', mutation.payload.userId)
                    .eq('podcast_id', mutation.payload.podcastId)
            }
            await cache.removeMutation(mutation.id)
        } catch (err) {
            console.warn('[sync] Failed to replay mutation:', mutation.id, err)
        }
    }
}

// On app start: sync + replay
onMounted(async () => {
    if (isOnline.value) {
        await replayMutationQueue()
        syncSubscribedFeeds()
    }
})

// When coming back online: replay + sync
watch(isOnline, async (online) => {
    if (online) {
        await replayMutationQueue()
        syncSubscribedFeeds()
    }
})
</script>

<template>
    <div class="app dark:bg-slate-900">
        <UApp>
            <!-- Global offline banner -->
            <div v-if="!isOnline"
                class="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-white text-sm font-medium">
                <UIcon name="i-heroicons-signal-slash" class="h-4 w-4" />
                You're offline
            </div>
            <NuxtLayout name="default">
                <NuxtPage />
            </NuxtLayout>
        </UApp>
    </div>
</template>