import { createPodcastAPIHeaders } from '~~/server/utils/handler';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const searchTerm = (query.q as string) || '';

    const headers = createPodcastAPIHeaders(config);
    const response = await $fetch('https://api.podcastindex.org/api/1.0/search/byterm', {
        query: { q: searchTerm },
        headers,
    });

    return response;
});