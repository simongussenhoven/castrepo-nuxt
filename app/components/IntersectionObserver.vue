<script lang="ts" setup>

import { onMounted, onBeforeUnmount, ref } from 'vue';

const observerElement = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

// observe element and emit load event
onMounted(() => {
    if (observerElement.value) {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Emit load event when the element is in view
                        emit('load');
                    }
                });
            },
            { threshold: 0.1 }
        );
        observer.observe(observerElement.value);
    }
});

onBeforeUnmount(() => {
    if (observer && observerElement.value) {
        observer.unobserve(observerElement.value);
    }
});

const emit = defineEmits<{
    (e: 'load'): void;
}>();
</script>


<template>
    <div ref="observerElement" class="intersection-observer w-full flex justify-center items-center p-8">
        <UIcon name="i-lucide-loader" class="w-6 h-6 mx-auto text-gray-400 animate-spin" />
    </div>
</template>