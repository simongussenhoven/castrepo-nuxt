<script lang="ts" setup>
import type { PodcastEpisodesResponse } from '~~/types/podcasts';

const props = defineProps<{
    id: number;
    feedImage?: string;
}>();

const episodes = await $fetch<PodcastEpisodesResponse>('/api/podcasts/getEpisodesByFeedId', {
    query: {
        id: props.id,
    },
});


</script>
<template>
    <div class="py-3">
        <PodcastEpisodeItem v-for="episode in episodes?.items" :episode="episode" :feedImage />
    </div>
</template>