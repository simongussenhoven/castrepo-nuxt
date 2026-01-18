<script setup lang="ts">
import type { PodcastEpisode } from '~~/types/podcasts';
import PodcastEpisodeDetails from './PodcastEpisodeDetails.vue';

const emit = defineEmits<{ close: [boolean] }>()
defineProps<{
    episode: PodcastEpisode | null;
}>();
</script>

<template>
    <USlideover :close="{ onClick: () => emit('close', false) }" :description="episode?.title" side="bottom">
        <template #body>
            <PodcastEpisodeDetails v-if="episode" :episode="episode" />
        </template>

        <!-- <template #footer>
            <div class="flex gap-2">
                <UButton color="neutral" label="Dismiss" @click="emit('close', false)" />
                <UButton label="Success" @click="emit('close', true)" />
            </div>
        </template> -->
    </USlideover>
</template>