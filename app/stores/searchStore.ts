import { defineStore } from 'pinia'
import type { PodcastFeed } from '~~/types/podcasts'

export const useSearchStore = defineStore('search', {
    state: () => ({
        query: '',
        languages: ['English'],
        feeds: [] as PodcastFeed[],
        loading: false
    }),
    actions: {
        setQuery(query: string) {
            this.query = query
        },
        setLanguages(languages: string[]) {
            this.languages = languages
        },
        setFeeds(feeds: PodcastFeed[]) {
            this.feeds = feeds
        },
        setLoading(loading: boolean) {
            this.loading = loading
        },
        clearSearch() {
            this.query = ''
            this.feeds = []
            this.loading = false
        }
    }
})
