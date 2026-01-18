<script lang="ts" setup>
import type { PodcastEpisode, PodcastEpisodesResponse } from '~~/types/podcasts';
import PodcastEpisodeSlideover from './PodcastEpisodeSlideover.vue';
const props = defineProps<{
    id: number;
    feedImage?: string;
}>();

const episodes = await $fetch<PodcastEpisodesResponse>('/api/podcasts/getEpisodesByFeedId', {
    query: {
        id: props.id,
    },
});

const selectedEpisode = ref<PodcastEpisode | null>(null);
const overlay = useOverlay();
const open = async (episode: PodcastEpisode) => {
    selectedEpisode.value = episode;
    const slideover = overlay.create(PodcastEpisodeSlideover, {
        props: {
            episode: episode
        }
    });
    await slideover.open();
};
</script>
<template>
    <div class="py-3">
        <PodcastEpisodeItem v-for="episode in episodes?.items" :episode="episode" :feedImage @select="open" />
    </div>

</template>