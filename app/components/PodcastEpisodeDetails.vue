<script setup lang="ts">
import { usePlayerStore } from '~/stores/playerStore';
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

const emit = defineEmits<{ close: [] }>()
const playerStore = usePlayerStore();
const onClickPlay = () => {
    playerStore.playEpisode(props.episode);
    emit('close');
}
</script>

<template>
    <div class="space-y-6">
        <!-- Episode Title with Image -->
        <div class="flex gap-4 items-center">
            <img v-if="episode.image" :src="episode.image" :alt="episode.title"
                class="w-24 h-24 rounded-lg object-cover shrink-0" />
            <div class="flex-1 min-w-0">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ episode.title }}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ episode.datePublishedPretty }}
                </p>

                <!-- Episode Metadata -->
                <div class="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span v-if="episode.duration" class="flex items-center gap-1">
                        <Icon name="i-heroicons-clock" class="w-3 h-3" />
                        {{ formatDuration(episode.duration) }}
                    </span>
                    <span v-if="episode.season" class="flex items-center gap-1">
                        <Icon name="i-heroicons-film" class="w-3 h-3" />
                        S{{ episode.season }}<template v-if="episode.episode">E{{ episode.episode }}</template>
                    </span>
                    <span v-else-if="episode.episode" class="flex items-center gap-1">
                        <Icon name="i-heroicons-hashtag" class="w-3 h-3" />
                        Ep. {{ episode.episode }}
                    </span>
                    <span v-if="episode.episodeType" class="flex items-center gap-1">
                        <Icon name="i-heroicons-microphone" class="w-3 h-3" />
                        {{ episode.episodeType }}
                    </span>
                    <span v-if="episode.enclosureLength" class="flex items-center gap-1">
                        <Icon name="i-heroicons-arrow-down-tray" class="w-3 h-3" />
                        {{ formatFileSize(episode.enclosureLength) }}
                    </span>
                </div>
            </div>

            <!-- Play Button -->
            <UButton v-if="episode.enclosureUrl" icon="i-heroicons-play" size="xl" color="primary"
                class="shrink-0 rounded-full" @click="onClickPlay" />
        </div>

        <!-- Explicit Badge -->
        <div v-if="episode.explicit" class="inline-flex">
            <UBadge color="warning" variant="subtle">Explicit</UBadge>
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