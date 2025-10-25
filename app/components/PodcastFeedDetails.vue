<script setup lang="ts">
import type { PodcastFeedData } from '~~/types/podcasts';

defineProps<{
    podcast: PodcastFeedData;
}>();
</script>

<template>
    <UCard>
        <template #header>
            <h2 class="text-2xl font-bold">{{ podcast.title }}</h2>
        </template>
        <p>{{ podcast.description }}</p>
    </UCard>
</template>