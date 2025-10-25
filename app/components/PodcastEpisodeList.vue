<script lang="ts" setup>
import type { PodcastEpisodesResponse } from '~~/types/podcasts';

const props = defineProps<{
    id: number;
}>();

const episodes = await $fetch<PodcastEpisodesResponse>('/api/podcasts/getEpisodesByFeedId', {
    query: {
        id: props.id,
    },
});


</script>
<template>
    <div class="py-3">
        <PodcastEpisodeItem v-for="episode in episodes?.items" :episode="episode" />
    </div>
</template>