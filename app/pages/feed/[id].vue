<script setup lang="ts">
import type { PodcastByFeedIdResponse } from '../../../types/podcasts';

const route = useRoute();
const feedId = route.params.id as string;

let podcastData = await $fetch<PodcastByFeedIdResponse>(`/api/podcasts/getByFeedId`, {
    query: { id: feedId },
});

useSeoMeta({
    title: `${podcastData?.feed?.title || 'Podcast'} - CastRepo`,
    description: podcastData?.feed?.description || 'Podcast feed information',
});

</script>

<template>
    hello!
    <div class="md:mt-18 container mx-auto">
        <PodcastFeedDetails v-if="podcastData?.feed" :podcast="podcastData?.feed" />
        <PodcastEpisodeList v-if="podcastData?.feed" :id="podcastData?.feed?.id" :max="podcastData.feed.episodeCount"
            :feedImage="podcastData?.feed?.image" />
    </div>
</template>
