<template>
    <NuxtLink :to="`/feed/${podcast.id}`">
        <UCard class="hover:shadow-lg transition-shadow duration-200">
            <div class="flex gap-4">
                <!-- Podcast Artwork -->
                <div class="shrink-0">
                    <img :src="podcast.image || podcast.artwork" :alt="podcast.title"
                        class="w-16 h-16 rounded-lg object-cover bg-gray-200" />
                </div>

                <!-- Podcast Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight">
                            {{ podcast.title }}
                        </h3>
                        <UBadge v-if="podcast.explicit" color="warning" variant="soft" size="xs" class="ml-2 shrink-0">
                            Explicit
                        </UBadge>
                    </div>

                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        by {{ podcast.author || podcast.ownerName }}
                    </p>

                    <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {{ podcast.description }}
                    </p>

                    <!-- Metadata -->
                    <div class="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span class="flex items-center gap-1">
                            <Icon name="i-heroicons-microphone" class="w-3 h-3" />
                            {{ podcast.episodeCount }} episodes
                        </span>
                        <span v-if="podcast.language" class="flex items-center gap-1">
                            <Icon name="i-heroicons-language" class="w-3 h-3" />
                            {{ podcast.language.toUpperCase() }}
                        </span>
                        <span v-if="lastUpdated" class="flex items-center gap-1">
                            <Icon name="i-heroicons-clock" class="w-3 h-3" />
                            Updated {{ lastUpdated }}
                        </span>
                    </div>
                </div>
            </div>
        </UCard>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { PodcastFeed } from '../../types/podcasts';

interface Props {
    podcast: PodcastFeed
}

const props = defineProps<Props>()

const lastUpdated = computed(() => {
    if (!props.podcast.lastUpdateTime) return null

    const date = new Date(props.podcast.lastUpdateTime * 1000)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'today'
    if (diffInDays === 1) return 'yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>