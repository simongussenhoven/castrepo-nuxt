<script setup lang="ts">
import PodcastPlayer from '~/components/PodcastPlayer.vue';

const isNative = useIsNative()
</script>

<template>
    <NavigationBar />
    <div class="default" :class="{ 'pb-16': isNative === true, 'pt-16': isNative === false }">
        <slot />
    </div>
    <PodcastPlayer />
</template>