<template>
    <div class="flex flex-wrap gap-4 justify-center md:justify-start">
        <USlideover title="Search for podcasts">
            <UButton label="Search podcasts" color="warning" variant="solid" />
            <template #body>
                <div class="flex flex-col h-full">
                    <div class="w-full flex gap-1 mb-4 sticky top-0 z-10">
                        <UInput v-model="query" class="grow w-2/3" />
                        <USelect v-model="value" multiple :items="languages" class="w-1/3" />
                    </div>
                    <div class="flex-1 overflow-y-auto" v-if="feeds.length">
                        <PodcastSearchItem v-for="f in feeds" :key="f.id" :podcast="f" />
                    </div>
                    <div v-else class="text-center text-gray-500 mt-8">
                        No podcasts found. Try searching for something else.
                    </div>
                </div>
            </template>
        </USlideover>
    </div>
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