<script setup lang="ts">
import type { PodcastByFeedIdResponse } from '../../../types/podcasts';

const route = useRoute();
const feedId = route.params.id as string;

const { data: podcastData, pending } = await useLazyAsyncData(
    `podcast-${feedId}`,
    () => $fetch<PodcastByFeedIdResponse>(`/api/podcasts/getByFeedId`, {
        query: { id: feedId },
    })
);

useSeoMeta({
    title: `${podcastData.value?.feed?.title || 'Podcast'} - CastRepo`,
    description: podcastData.value?.feed?.description || 'Podcast feed information',
});

</script>

<template>
    <div class="md:mt-18 container mx-auto">
        <!-- Loading state -->
        <div v-if="pending" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

        <!-- Content -->
        <template v-else>
            <PodcastFeedDetails v-if="podcastData?.feed" :podcast="podcastData?.feed" />
            <PodcastEpisodeList v-if="podcastData?.feed" :id="podcastData?.feed?.id" :max="podcastData.feed.episodeCount"
                :feedImage="podcastData?.feed?.image" />
        </template>
    </div>
</template>
