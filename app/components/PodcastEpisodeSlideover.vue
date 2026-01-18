<script setup lang="ts">
import type { PodcastEpisode } from '~~/types/podcasts';
import PodcastEpisodeDetails from './PodcastEpisodeDetails.vue';

const props = defineProps<{
    episode: PodcastEpisode | null;
}>();

const handleClose = () => {
    const slideover = useOverlay()
    slideover.closeAll();
}
</script>

<template>
    <USlideover :close="{ onClick: handleClose }" :description="episode?.title" side="bottom">
        <template #body>
            <PodcastEpisodeDetails v-if="episode" :episode="episode" @close="handleClose" />
        </template>

        <!-- <template #footer>
            <div class="flex gap-2">
                <UButton color="neutral" label="Dismiss" @click="emit('close', false)" />
                <UButton label="Success" @click="emit('close', true)" />
            </div>
        </template> -->
    </USlideover>
</template>