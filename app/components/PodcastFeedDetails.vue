<script setup lang="ts">
import type { PodcastFeedData } from '~~/types/podcasts';

const props = defineProps<{
    podcast: PodcastFeedData;
}>();

const podcastData = computed(() => ({
    id: props.podcast.id,
    title: props.podcast.title,
    image: props.podcast.image,
    url: props.podcast.url,
    podcastGuid: props.podcast.podcastGuid
}))

const { isSubscribed, loading, toggleSubscription } = useSubscription(podcastData)
</script>

<template>
    <div
        class="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 p-8 mb-8 shadow-lg">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <NuxtImg v-if="podcast.image" :src="podcast.image" alt="Podcast Cover Image"
                class="w-40 h-40 md:w-48 md:h-48 rounded-xl object-cover shadow-xl ring-4 ring-white/50 dark:ring-gray-800/50"
                width="192" height="192" loading="lazy" />
            <div class="flex-1 space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">{{ podcast.title }}</h1>
                    <UButton :label="isSubscribed ? 'Unsubscribe' : 'Subscribe'"
                        :icon="isSubscribed ? 'i-heroicons-check' : 'i-heroicons-plus'"
                        :color="isSubscribed ? 'neutral' : 'primary'" :variant="isSubscribed ? 'outline' : 'solid'"
                        size="lg" :loading="loading" @click="toggleSubscription" class="shrink-0" />
                </div>
                <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{{ podcast.description }}</p>
            </div>
        </div>
    </div>
</template>