import type { Database } from '~~/types/database'
import type { PodcastByFeedIdResponse, PodcastEpisodesResponse } from '~~/types/podcasts'

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row']

const SYNC_THROTTLE_MS = 60 * 60 * 1000 // 1 hour

/**
 * Background sync composable.
 * On app launch (when online), refreshes cached episodes for all subscribed feeds.
 * Throttled to run at most once per hour.
 */
export function useSubscriptionSync() {
    const cache = useOfflineCache()
    const { isOnline } = useNetworkStatus()
    const syncing = useState<boolean>('syncInProgress', () => false)

    async function syncSubscribedFeeds() {
        if (syncing.value || !isOnline.value) return

        // Throttle: skip if last sync was less than 1 hour ago
        const lastSync = await cache.getLastSyncTime()
        if (lastSync && Date.now() - lastSync < SYNC_THROTTLE_MS) return

        syncing.value = true

        try {
            // 1. Get subscriptions from cache (they were saved when fetched)
            const subscriptions = await cache.getSubscriptions()
            if (!subscriptions || subscriptions.length === 0) {
                await cache.setLastSyncTime()
                return
            }

            // 2. For each subscribed feed, refresh feed details + episodes
            const syncPromises = subscriptions.map(async (sub: SubscriptionRow) => {
                try {
                    // Fetch feed details
                    const feedRes = await $fetch<PodcastByFeedIdResponse>('/api/podcasts/getByFeedId', {
                        query: { id: sub.podcast_id },
                    })
                    if (feedRes?.feed) {
                        await cache.setFeed(sub.podcast_id, feedRes.feed)
                    }

                    // Fetch latest 20 episodes
                    const epRes = await $fetch<PodcastEpisodesResponse>('/api/podcasts/getEpisodesByFeedId', {
                        query: { id: sub.podcast_id, max: 20 },
                    })
                    if (epRes?.items) {
                        await cache.setEpisodes(sub.podcast_id, epRes.items)
                    }
                } catch (err) {
                    // Silently skip feeds that fail — don't break the whole sync
                    console.warn(`[sync] Failed to sync feed ${sub.podcast_id}:`, err)
                }
            })

            // Run up to 3 at a time to avoid hammering the API
            const batches = []
            for (let i = 0; i < syncPromises.length; i += 3) {
                batches.push(syncPromises.slice(i, i + 3))
            }
            for (const batch of batches) {
                await Promise.all(batch)
            }

            await cache.setLastSyncTime()
        } catch (err) {
            console.error('[sync] Background sync failed:', err)
        } finally {
            syncing.value = false
        }
    }

    return {
        syncing,
        syncSubscribedFeeds,
    }
}
