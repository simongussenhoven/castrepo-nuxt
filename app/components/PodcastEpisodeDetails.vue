<script setup lang="ts">
import type { PodcastEpisode } from '~~/types/podcasts';

const props = defineProps<{
    episode: PodcastEpisode;
}>();

const formatDuration = (seconds: number) => {
    if (!seconds) return 'Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
};

const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatFileSize = (bytes: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;

    if (gb >= 1) {
        return `${gb.toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
};
</script>

<template>
    <div class="space-y-6">
        <!-- Episode Title with Background Image -->
        <div class="relative w-full h-64 rounded-lg overflow-hidden shadow-lg"
            :style="episode.image ? `background-image: url('${episode.image}'); background-size: cover; background-position: center;` : ''">
            <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
                <h2 class="text-2xl font-bold text-white">
                    {{ episode.title }}
                </h2>
                <p class="text-sm text-gray-200 mt-1">
                    {{ episode.datePublishedPretty }}
                </p>
            </div>
        </div>

        <!-- Episode Metadata -->
        <div class="grid grid-cols-2 gap-4">
            <div v-if="episode.duration" class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Duration</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatDuration(episode.duration) }}
                </span>
            </div>

            <div v-if="episode.datePublished" class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Published</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatDate(episode.datePublished) }}
                </span>
            </div>

            <div v-if="episode.season" class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Season</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ episode.season }}
                </span>
            </div>

            <div v-if="episode.episode" class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Episode</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ episode.episode }}
                </span>
            </div>

            <div v-if="episode.episodeType" class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">Type</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ episode.episodeType }}
                </span>
            </div>

            <div v-if="episode.enclosureLength" class="flex flex-col">
                <span class="text-xs text-gray-500 dark:text-gray-400 uppercase">File Size</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatFileSize(episode.enclosureLength) }}
                </span>
            </div>
        </div>

        <!-- Explicit Badge -->
        <div v-if="episode.explicit" class="inline-flex">
            <UBadge color="warning" variant="subtle">Explicit</UBadge>
        </div>

        <!-- Play Button -->
        <div v-if="episode.enclosureUrl" class="flex gap-2">
            <UButton icon="i-heroicons-play" size="lg" color="primary" label="Play Episode" />
        </div>

        <!-- Episode Description -->
        <div v-if="episode.description" class="prose dark:prose-invert max-w-none">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
            <div v-html="episode.description" class="text-sm text-gray-700 dark:text-gray-300"></div>
        </div>

        <!-- Additional Links -->
        <div class="space-y-2">
            <a v-if="episode.link" :href="episode.link" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="mr-1" />
                Episode Link
            </a>

            <a v-if="episode.transcriptUrl" :href="episode.transcriptUrl" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 ml-4">
                <UIcon name="i-heroicons-document-text" class="mr-1" />
                Transcript
            </a>

            <a v-if="episode.chaptersUrl" :href="episode.chaptersUrl" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 ml-4">
                <UIcon name="i-heroicons-list-bullet" class="mr-1" />
                Chapters
            </a>
        </div>

        <!-- Technical Details (Collapsible) -->
        <details class="text-xs text-gray-500 dark:text-gray-400">
            <summary class="cursor-pointer font-medium">Technical Details</summary>
            <div class="mt-2 space-y-1 pl-4">
                <p><strong>GUID:</strong> {{ episode.guid }}</p>
                <p v-if="episode.enclosureType"><strong>Enclosure Type:</strong> {{ episode.enclosureType }}</p>
                <p v-if="episode.feedLanguage"><strong>Language:</strong> {{ episode.feedLanguage }}</p>
                <p><strong>Episode ID:</strong> {{ episode.id }}</p>
                <p><strong>Feed ID:</strong> {{ episode.feedId }}</p>
                <p v-if="episode.feedItunesId"><strong>iTunes ID:</strong> {{ episode.feedItunesId }}</p>
            </div>
        </details>
    </div>
</template>