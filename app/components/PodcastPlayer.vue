<script setup lang="ts">
const playerStore = usePlayerStore();

const currentTime = ref(0);
const duration = ref(0);
const audioRef = ref<HTMLAudioElement | null>(null);

onMounted(() => {
    if (audioRef.value) {
        playerStore.audioElement = audioRef.value;
        audioRef.value.addEventListener('timeupdate', updateProgress);
        audioRef.value.addEventListener('loadedmetadata', updateDuration);
    }
});

onUnmounted(() => {
    if (audioRef.value) {
        audioRef.value.removeEventListener('timeupdate', updateProgress);
        audioRef.value.removeEventListener('loadedmetadata', updateDuration);
    }
});

const updateProgress = () => {
    if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime;
    }
};

const updateDuration = () => {
    if (audioRef.value) {
        duration.value = audioRef.value.duration;
    }
};

const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const progress = computed(() => {
    return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

const seek = (event: MouseEvent) => {
    if (!audioRef.value || !duration.value) return;

    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration.value;

    audioRef.value.currentTime = newTime;
};
</script>

<template>
    <!-- Hidden audio element -->
    <audio ref="audioRef" />

    <!-- Only show player when there's an episode -->
    <div v-if="playerStore.currentEpisode"
        class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50">
        <!-- Progress bar -->
        <div class="h-1 bg-gray-200 dark:bg-gray-700 cursor-pointer hover:h-2 transition-all" @click="seek">
            <div class="h-full bg-blue-600 transition-all" :style="{ width: `${progress}%` }"></div>
        </div>

        <!-- Player controls -->
        <div class="px-4 py-3">
            <div class="flex items-center gap-4">
                <!-- Episode artwork -->
                <img v-if="playerStore.currentEpisode.image || playerStore.currentEpisode.feedImage"
                    :src="playerStore.currentEpisode.image || playerStore.currentEpisode.feedImage"
                    :alt="playerStore.currentEpisode.title" class="w-14 h-14 rounded object-cover flex-shrink-0" />

                <!-- Episode info -->
                <div class="flex-1 min-w-0">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {{ playerStore.currentEpisode.title }}
                    </h3>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                    </p>
                </div>

                <!-- Play/Pause button -->
                <button @click="playerStore.togglePlayPause()"
                    class="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex-shrink-0">
                    <svg v-if="playerStore.isPlaying" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                    <svg v-else class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>