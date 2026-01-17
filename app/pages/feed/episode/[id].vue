<template>
    Hello! {{ feedId }}
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const feedId = route.params.id as string;
</script>