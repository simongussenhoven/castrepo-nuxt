<script setup lang="ts">
import type { PodcastFeedData } from '~~/types/podcasts';

defineProps<{
    podcast: PodcastFeedData;
}>();
</script>

<template>
    <UCard>
        <template #header>
            <div class="flex items-center justify-items-start gap-3">
                <NuxtImg v-if="podcast.image" :src="podcast.image" alt="Podcast Cover Image"
                    class="w-24 h-24 rounded-lg object-cover mb-4" width="96" height="96" loading="lazy" />
                <h1 class="text-4xl font-bold">{{ podcast.title }}</h1>
            </div>
        </template>
        <p>{{ podcast.description }}</p>
    </UCard>
</template>