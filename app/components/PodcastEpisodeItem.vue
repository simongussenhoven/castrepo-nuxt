<script setup lang="ts">
import type { PodcastEpisode } from '~~/types/podcasts';

defineProps<{
    episode: PodcastEpisode;
}>();

// Helper function to format duration from seconds to HH:MM:SS or MM:SS
const formatDuration = (seconds: number): string => {
    if (!seconds || seconds === 0) return '';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};
</script>

<template>
    <UCard class="mb-4">
        <template #header>
            <div class="flex items-start space-x-4">
                <!-- Episode Image -->
                <div v-if="episode.image" class="flex-shrink-0">
                    <img :src="episode.image" :alt="episode.title" class="w-16 h-16 rounded-lg object-cover"
                        loading="lazy" />
                </div>

                <!-- Episode Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {{ episode.title }}
                        </h4>
                    </div>

                    <!-- Episode Metadata -->
                    <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <!-- Season/Episode Numbers -->
                        <span v-if="episode.season && episode.episode" class="flex items-center">
                            <UIcon name="i-heroicons-tv" class="w-4 h-4 mr-1" />
                            S{{ episode.season }}E{{ episode.episode }}
                        </span>
                        <span v-else-if="episode.episode" class="flex items-center">
                            <UIcon name="i-heroicons-play-circle" class="w-4 h-4 mr-1" />
                            Episode {{ episode.episode }}
                        </span>

                        <!-- Duration -->
                        <span v-if="episode.duration" class="flex items-center">
                            <UIcon name="i-heroicons-clock" class="w-4 h-4 mr-1" />
                            {{ formatDuration(episode.duration) }}
                        </span>

                        <!-- Publish Date -->
                        <span class="flex items-center">
                            <UIcon name="i-heroicons-calendar" class="w-4 h-4 mr-1" />
                            {{ episode.datePublishedPretty || new Date(episode.datePublished *
                                1000).toLocaleDateString() }}
                        </span>

                        <!-- File Size -->
                        <span v-if="episode.enclosureLength" class="flex items-center">
                            <UIcon name="i-heroicons-document" class="w-4 h-4 mr-1" />
                            {{ formatFileSize(episode.enclosureLength) }}
                        </span>

                        <!-- Explicit Content Warning -->
                        <UBadge v-if="episode.explicit" color="error" variant="soft" size="xs">
                            Explicit
                        </UBadge>
                    </div>
                </div>
            </div>
        </template>

        <!-- Episode Description -->
        <div class="prose prose-sm dark:prose-invert max-w-none mb-4">
            <div v-html="episode.description" class="line-clamp-3"></div>
        </div>
    </UCard>
</template>