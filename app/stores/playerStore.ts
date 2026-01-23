import { defineStore } from 'pinia'
import type { PodcastEpisode } from "~~/types/podcasts";

export const usePlayerStore = defineStore('player', () => {
    const currentEpisode = ref<PodcastEpisode | null>(null);
    const isPlaying = ref(false);
    const audioElement = ref<HTMLAudioElement | null>(null);
    const currentTime = ref(0);
    const duration = ref(0);

    const playEpisode = (episode: PodcastEpisode) => {
        if (currentEpisode.value?.id !== episode.id) {
            currentEpisode.value = episode;
            if (audioElement.value) {
                audioElement.value.src = episode.enclosureUrl || '';
            }
        }
        isPlaying.value = true;
        audioElement.value?.play();
    };
    const pause = () => {
        isPlaying.value = false;
        audioElement.value?.pause();
    };
    const togglePlayPause = () => {
        if (isPlaying.value) {
            pause();
        } else if (currentEpisode.value) {
            playEpisode(currentEpisode.value);
        }
    };

    const seek = (time: number) => {
        if (audioElement.value) {
            audioElement.value.currentTime = Number(time);
        }
    };

    const skip = (seconds: number) => {
        if (audioElement.value) {
            audioElement.value.currentTime += seconds;
        }
    };

    return {
        currentEpisode,
        isPlaying,
        audioElement,
        currentTime,
        duration,
        playEpisode,
        pause,
        togglePlayPause,
        seek,
        skip,
    };
})