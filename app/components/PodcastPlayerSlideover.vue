<script setup lang="ts">
import type { PodcastEpisode } from '~~/types/podcasts';

const playerStore = usePlayerStore();


const props = defineProps<{
    episode: PodcastEpisode | null;
}>();

const handleClose = () => {
    const slideover = useOverlay()
    slideover.closeAll();
}

const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
</script>

<template>
    <USlideover :close="{ onClick: handleClose }" :description="episode?.title" side="bottom">
        <template #body>
            <div class="flex flex-col items-center gap-6 p-6">
                <!-- Episode Image -->
                <div v-if="episode?.image" class="w-48 h-48 rounded-lg overflow-hidden shadow-lg">
                    <img :src="episode.image" :alt="episode.title" class="w-full h-full object-cover" />
                </div>

                <!-- Episode Title -->
                <h3 v-if="episode?.title" class="text-xl font-semibold text-center px-4">
                    {{ episode.title }}
                </h3>

                <!-- Player Controls -->
                <div class="w-full max-w-2xl space-y-4">
                    <!-- Progress Slider -->
                    <div class="w-full">
                        <input type="range" min="0" :max="playerStore.duration || 100"
                            :value="playerStore.currentTime || 0" @input="playerStore.seek($event.target.value)"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                        <div class="flex justify-between text-sm text-gray-500 mt-1">
                            <span>{{ formatTime(playerStore.currentTime) }}</span>
                            <span>{{ formatTime(playerStore.duration) }}</span>
                        </div>
                    </div>

                    <!-- Control Buttons -->
                    <div class="flex items-center justify-center gap-4">
                        <!-- -10 seconds button -->
                        <UButton icon="i-heroicons-backward" size="lg" color="gray" variant="ghost"
                            @click="playerStore.skip(-10)">
                            -10
                        </UButton>

                        <!-- Play/Pause button -->
                        <UButton :icon="playerStore.isPlaying ? 'i-heroicons-pause-circle' : 'i-heroicons-play-circle'"
                            size="xl" color="primary" @click="playerStore.togglePlayPause()" />

                        <!-- +30 seconds button -->
                        <UButton icon="i-heroicons-forward" size="lg" color="gray" variant="ghost"
                            @click="playerStore.skip(30)">
                            +30
                        </UButton>
                    </div>
                </div>
            </div>
        </template>

    </USlideover>
</template>