<script lang="ts" setup>
import type { PodcastEpisode, PodcastEpisodesResponse } from '~~/types/podcasts';
import PodcastEpisodeSlideover from './PodcastEpisodeSlideover.vue';
const props = defineProps<{
    id: number;
    feedImage?: string;
    offlineMode?: boolean;
}>();

const cache = useOfflineCache()
const allEpisodes = ref<PodcastEpisode[]>([])
const loadingMore = ref(false)
const hasMore = ref(true)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const isFromCache = ref(false)

// If offline, load from cache instead of fetching
const { data: initialData, status, error: fetchError } = props.offlineMode
    ? { data: ref(null), status: ref('idle' as const), error: ref(null) }
    : useFetch<PodcastEpisodesResponse>(
        '/api/podcasts/getEpisodesByFeedId',
        {
            query: { id: props.id, max: 20 },
            key: `episodes-${props.id}`,
        }
    )

// Load cached episodes when in offline mode
if (props.offlineMode) {
    onMounted(async () => {
        const cached = await cache.getEpisodes(props.id)
        if (cached) {
            allEpisodes.value = cached
            isFromCache.value = true
            hasMore.value = false // can't load more offline
        }
    })
}

// Sync initial data into our mutable list (needed for infinite-scroll appending)
watch(initialData, async (data) => {
    if (data?.items) {
        allEpisodes.value = data.items
        hasMore.value = data.items.length >= 20

        // Cache episodes for offline use
        await cache.setEpisodes(props.id, data.items)
    }
}, { immediate: true })

const loading = computed(() => status.value === 'pending' || loadingMore.value)

// Load more episodes
async function loadMore() {
    if (loadingMore.value || !hasMore.value || allEpisodes.value.length === 0 || props.offlineMode) return

    loadingMore.value = true

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

            // Update cache with all loaded episodes
            await cache.setEpisodes(props.id, allEpisodes.value)
        } else {
            hasMore.value = false
        }
    } catch (error) {
        console.error('Failed to load more episodes:', error)
        hasMore.value = false
    } finally {
        loadingMore.value = false
    }
}

// Intersection Observer for infinite scroll
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
        <!-- Error state -->
        <div v-if="fetchError" class="text-center py-8">
            <p class="text-red-500">Failed to load episodes: {{ fetchError.message }}</p>
        </div>

        <!-- Initial loading -->
        <div v-else-if="status === 'pending' && allEpisodes.length === 0" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <template v-else>
            <PodcastEpisodeItem v-for="episode in allEpisodes" :key="episode.id" :episode="episode"
                :feedImage="feedImage" @select="open" />
        </template>

        <!-- Loading trigger -->
        <div ref="loadMoreTrigger" class="py-8">
            <div v-if="loadingMore" class="flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <div v-else-if="!hasMore && allEpisodes.length > 0" class="text-center text-gray-500 text-sm">
                No more episodes
            </div>
        </div>
    </div>

</template>