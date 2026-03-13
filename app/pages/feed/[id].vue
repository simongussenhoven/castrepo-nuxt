<script setup lang="ts">
import type { PodcastByFeedIdResponse, PodcastFeedData } from '../../../types/podcasts';

const route = useRoute();
const feedId = route.params.id as string;
const feedIdNum = Number(feedId);
const { isOnline } = useNetworkStatus();
const cache = useOfflineCache();
const isFromCache = ref(false);

const { data: podcastData, pending } = await useLazyAsyncData(
    `podcast-${feedId}`,
    async () => {
        // Try network first
        try {
            const res = await $fetch<PodcastByFeedIdResponse>(`/api/podcasts/getByFeedId`, {
                query: { id: feedId },
            });
            // Cache the feed data on success
            if (res?.feed) {
                await cache.setFeed(feedIdNum, res.feed);
            }
            isFromCache.value = false;
            return res;
        } catch (err) {
            // On failure, try cache
            const cachedFeed = await cache.getFeed(feedIdNum);
            if (cachedFeed) {
                isFromCache.value = true;
                return { status: 'true', feed: cachedFeed } as PodcastByFeedIdResponse;
            }
            throw err; // no cache, re-throw
        }
    }
);

useSeoMeta({
    title: `${podcastData.value?.feed?.title || 'Podcast'} - CastRepo`,
    description: podcastData.value?.feed?.description || 'Podcast feed information',
});

</script>

<template>
    <div class="md:mt-18 container mx-auto">
        <!-- Offline banner -->
        <div v-if="isFromCache"
            class="mx-4 mt-4 flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 px-4 py-3 text-amber-800 dark:text-amber-200 text-sm">
            <UIcon name="i-heroicons-signal-slash" class="h-5 w-5 shrink-0" />
            <span>You're offline — showing cached data.</span>
        </div>

        <!-- Loading state -->
        <div v-if="pending" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <!-- Content -->
        <template v-else>
            <PodcastFeedDetails v-if="podcastData?.feed" :podcast="podcastData?.feed" />
            <PodcastEpisodeList v-if="podcastData?.feed" :id="podcastData?.feed?.id"
                :max="podcastData.feed.episodeCount" :feedImage="podcastData?.feed?.image" :offlineMode="isFromCache" />
        </template>
    </div>
</template>
