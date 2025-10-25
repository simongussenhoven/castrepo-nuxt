<template>
    <section class="min-h-[80vh] flex items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-8">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div class="text-center md:text-left">
                <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    Welcome to <span class="text-yellow-400">CastRepo</span>
                </h1>
                <p class="text-xl md:text-2xl mb-6 opacity-90">
                    Discover, organize, and enjoy your favorite podcasts all in one place
                </p>
                <p class="text-base md:text-lg mb-8 opacity-80 leading-relaxed">
                    CastRepo is your ultimate podcast companion. Browse thousands of shows,
                    create custom playlists, and never miss an episode with our smart recommendations.
                </p>
                <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                    <USlideover title="Search for podcasts">
                        <UButton label="Search podcasts" color="warning" variant="solid" />
                        <template #body>
                            <div class="flex flex-col h-full">
                                <div class="w-full flex gap-1 mb-4 sticky top-0 z-10">
                                    <UInput v-model="query" class="grow w-2/3" />
                                    <USelect v-model="value" multiple :items="languages" class="w-1/3" />
                                </div>
                                <div class="flex-1 overflow-y-auto">
                                    <PodcastSearchItem v-for="f in feeds" :key="f.id" :podcast="f" />
                                </div>
                            </div>
                        </template>
                    </USlideover>
                </div>
            </div>
            <div class="flex justify-center items-center">
                <div class="text-8xl md:text-[12rem] opacity-80">
                    🎧
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { type PodcastFeed, type PodcastSearchResponse } from '../../types/podcasts';

const query = ref<string>('');
const languages = ref(['English', 'Spanish', 'French', 'German', 'Italian']);
const value = ref(['English']);
import _ from 'lodash';

const emit = defineEmits(['close']);
const feeds = ref<Array<PodcastFeed>>([]);

const debouncedSearch = _.debounce((term: string) => {
    if (!term.length) return;
    searchPodcasts(term);
}, 1000);

watch(query, (newQuery) => {
    debouncedSearch(newQuery);
});

const searchPodcasts = async (term: string) => {
    const data = await $fetch('/api/podcasts/search', {
        query: { q: term },
    }) as PodcastSearchResponse;
    feeds.value = data.feeds
}
</script>
