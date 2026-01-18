<template>
    <USlideover :close="{ onClick: () => emit('close', false) }" title="Search for podcasts">
        <template #body>
            <div class="flex flex-col h-full">
                <div class="w-full flex gap-1 mb-4 sticky top-0 z-10">
                    <UInput v-model="searchStore.query" class="grow w-2/3" placeholder="Search podcasts..."
                        @keyup.enter="handleEnter" />
                    <USelect v-model="searchStore.languages" multiple :items="languages" class="w-1/3" />
                </div>

                <div v-if="searchStore.loading" class="flex justify-center items-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>

                <div v-else-if="searchStore.feeds.length" class="flex-1 overflow-y-auto">
                    <div @click="emit('close', false)">
                        <PodcastSearchItem v-for="f in searchStore.feeds" :key="f.id" :podcast="f" />
                    </div>
                </div>

                <div v-else class="text-center text-gray-500 mt-8">
                    No podcasts found. Try searching for something else.
                </div>
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import { type PodcastSearchResponse } from '../../types/podcasts';
import _ from 'lodash';

const emit = defineEmits<{ close: [boolean] }>()

const searchStore = useSearchStore()
const languages = ref(['English', 'Spanish', 'French', 'German', 'Italian']);

const searchPodcasts = async (term: string) => {
    if (!term.length) {
        searchStore.setFeeds([])
        searchStore.setLoading(false)
        return
    }

    searchStore.setLoading(true)
    try {
        const data = await $fetch('/api/podcasts/search', {
            query: { q: term },
        }) as PodcastSearchResponse;
        searchStore.setFeeds(data.feeds)
    } finally {
        searchStore.setLoading(false)
    }
}

const debouncedSearch = _.debounce((term: string) => {
    searchPodcasts(term);
}, 1000);

const handleEnter = () => {
    if (searchStore.query.length) {
        searchPodcasts(searchStore.query);
    }
}

watch(() => searchStore.query, (newQuery) => {
    debouncedSearch(newQuery);
});
</script>