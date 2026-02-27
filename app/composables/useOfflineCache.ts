import { Preferences } from '@capacitor/preferences'
import type { Database } from '~~/types/database'
import type { PodcastFeedData, PodcastEpisode } from '~~/types/podcasts'

// ── Types ───────────────────────────────────────────────────────────

export interface CachedData<T> {
    data: T
    timestamp: number          // Date.now() when cached
}

type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row']

export interface OfflineMutation {
    id: string
    type: 'subscribe' | 'unsubscribe'
    payload: {
        userId: string
        podcastId: number
        podcastTitle?: string
        podcastImage?: string | null
        podcastUrl?: string | null
        podcastGuid?: string | null
        subscriptionId?: string   // for unsubscribe
    }
    createdAt: number
}

// ── Constants ───────────────────────────────────────────────────────

const TTL_24H = 24 * 60 * 60 * 1000

// ── Low-level helpers ───────────────────────────────────────────────

async function setItem(key: string, value: unknown): Promise<void> {
    await Preferences.set({ key, value: JSON.stringify(value) })
}

async function getItem<T>(key: string): Promise<T | null> {
    const { value } = await Preferences.get({ key })
    if (value === null) return null
    try {
        return JSON.parse(value) as T
    } catch {
        return null
    }
}

async function removeItem(key: string): Promise<void> {
    await Preferences.remove({ key })
}

// ── Cache read with TTL check ───────────────────────────────────────

async function getCached<T>(key: string, ttl: number = TTL_24H): Promise<T | null> {
    const cached = await getItem<CachedData<T>>(key)
    if (!cached) return null
    if (Date.now() - cached.timestamp > ttl) return null
    return cached.data
}

async function setCached<T>(key: string, data: T): Promise<void> {
    const entry: CachedData<T> = { data, timestamp: Date.now() }
    await setItem(key, entry)
}

// ── Public API ──────────────────────────────────────────────────────

export function useOfflineCache() {

    // ── Subscriptions ─────────────────────────────────────────────

    async function getSubscriptions(): Promise<SubscriptionRow[] | null> {
        return getCached<SubscriptionRow[]>('subscriptions', Infinity) // never expire, always overwritten on fetch
    }

    async function setSubscriptions(rows: SubscriptionRow[]): Promise<void> {
        await setCached('subscriptions', rows)
    }

    async function clearSubscriptions(): Promise<void> {
        await removeItem('subscriptions')
    }

    // ── Feed details ──────────────────────────────────────────────

    async function getFeed(feedId: number): Promise<PodcastFeedData | null> {
        return getCached<PodcastFeedData>(`feed:${feedId}`, TTL_24H)
    }

    async function setFeed(feedId: number, feed: PodcastFeedData): Promise<void> {
        await setCached(`feed:${feedId}`, feed)
    }

    // ── Episodes ──────────────────────────────────────────────────

    async function getEpisodes(feedId: number): Promise<PodcastEpisode[] | null> {
        return getCached<PodcastEpisode[]>(`episodes:${feedId}`, TTL_24H)
    }

    async function setEpisodes(feedId: number, episodes: PodcastEpisode[]): Promise<void> {
        await setCached(`episodes:${feedId}`, episodes)
    }

    // ── Offline mutation queue ────────────────────────────────────

    async function getMutationQueue(): Promise<OfflineMutation[]> {
        return (await getItem<OfflineMutation[]>('mutation_queue')) ?? []
    }

    async function addMutation(mutation: OfflineMutation): Promise<void> {
        const queue = await getMutationQueue()
        queue.push(mutation)
        await setItem('mutation_queue', queue)
    }

    async function clearMutationQueue(): Promise<void> {
        await removeItem('mutation_queue')
    }

    async function removeMutation(id: string): Promise<void> {
        const queue = await getMutationQueue()
        await setItem('mutation_queue', queue.filter(m => m.id !== id))
    }

    // ── Sync timestamp ────────────────────────────────────────────

    async function getLastSyncTime(): Promise<number | null> {
        return getItem<number>('last_sync_time')
    }

    async function setLastSyncTime(time: number = Date.now()): Promise<void> {
        await setItem('last_sync_time', time)
    }

    return {
        // subscriptions
        getSubscriptions,
        setSubscriptions,
        clearSubscriptions,
        // feeds
        getFeed,
        setFeed,
        // episodes
        getEpisodes,
        setEpisodes,
        // mutation queue
        getMutationQueue,
        addMutation,
        clearMutationQueue,
        removeMutation,
        // sync
        getLastSyncTime,
        setLastSyncTime,
    }
}
