<script lang="ts" setup>
import type { PodcastEpisode, PodcastEpisodesResponse } from '~~/types/podcasts';
import PodcastEpisodeSlideover from './PodcastEpisodeSlideover.vue';
const props = defineProps<{
    id: number;
    feedImage?: string;
}>();

const allEpisodes = ref<PodcastEpisode[]>([])
const loading = ref(false)
const hasMore = ref(true)
const loadMoreTrigger = ref<HTMLElement | null>(null)

// Fetch initial episodes
const initialData = await $fetch<PodcastEpisodesResponse>('/api/podcasts/getEpisodesByFeedId', {
    query: {
        id: props.id,
        max: 20,
    },
});

allEpisodes.value = initialData?.items || []
hasMore.value = (initialData?.items?.length || 0) >= 20

// Load more episodes
async function loadMore() {
    if (loading.value || !hasMore.value || allEpisodes.value.length === 0) return

    loading.value = true

    try {
        const oldestEpisode = allEpisodes.value[allEpisodes.value.length - 1]
        if (!oldestEpisode) return

        const since = oldestEpisode.datePublished - 1 // Subtract 1 to exclude the last loaded episode

        const response = await $fetch<PodcastEpisodesResponse>('/api/podcasts/getEpisodesByFeedId', {
            query: {
                id: props.id,
                max: 20,
                since: since.toString(),
            },
        })

        if (response?.items && response.items.length > 0) {
            allEpisodes.value.push(...response.items)
            hasMore.value = response.items.length >= 20
        } else {
            hasMore.value = false
        }
    } catch (error) {
        console.error('Failed to load more episodes:', error)
        hasMore.value = false
    } finally {
        loading.value = false
    }
}

// Intersection Observer
onMounted(() => {
    if (!loadMoreTrigger.value) return

    const observer = new IntersectionObserver(
        (entries) => {
            if (entries[0]?.isIntersecting && hasMore.value && !loading.value) {
                loadMore()
            }
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px 200px 0px' // Trigger 200px before the element comes into view
        }
    )

    observer.observe(loadMoreTrigger.value)

    onUnmounted(() => {
        observer.disconnect()
    })
})

const selectedEpisode = ref<PodcastEpisode | null>(null);
const overlay = useOverlay();
let currentSlideover: any = null;

const open = async (episode: PodcastEpisode) => {
    selectedEpisode.value = episode;
    currentSlideover = overlay.create(PodcastEpisodeSlideover, {
        props: {
            episode: episode,
        }
    });
    await currentSlideover.open();
};
</script>
<template>
    <div class="py-3 pb-32">
        <PodcastEpisodeItem v-for="episode in allEpisodes" :key="episode.id" :episode="episode" :feedImage="feedImage"
            @select="open" />

        <!-- Loading trigger -->
        <div ref="loadMoreTrigger" class="py-8">
            <div v-if="loading" class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <div v-else-if="!hasMore && allEpisodes.length > 0" class="text-center text-gray-500 text-sm">
                No more episodes
            </div>
        </div>
    </div>

</template>