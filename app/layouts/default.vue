<script setup lang="ts">
import PodcastPlayer from '~/components/PodcastPlayer.vue';

</script>

<template>
    <NavigationBar />
    <div class="default">
        <slot />
    </div>
    <PodcastPlayer />
</template>