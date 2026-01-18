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
    <UCard>
        <template #header>
            <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                    <NuxtImg v-if="podcast.image" :src="podcast.image" alt="Podcast Cover Image"
                        class="w-24 h-24 rounded-lg object-cover mb-4" width="96" height="96" loading="lazy" />
                    <h1 class="text-4xl font-bold">{{ podcast.title }}</h1>
                </div>
                <UButton :label="isSubscribed ? 'Unsubscribe' : 'Subscribe'"
                    :icon="isSubscribed ? 'i-heroicons-check' : 'i-heroicons-plus'"
                    :color="isSubscribed ? 'neutral' : 'primary'" :variant="isSubscribed ? 'outline' : 'solid'"
                    size="lg" :loading="loading" @click="toggleSubscription" />
            </div>
        </template>
        <p>{{ podcast.description }}</p>
    </UCard>
</template>