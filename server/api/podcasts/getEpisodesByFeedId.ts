import { createPodcastAPIHeaders } from '~~/server/utils/handler';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const id = (query.id as string) || '';
    const max = (query.max as string) || '20'; // Default to 20 episodes for better performance
    const since = (query.since as string) || ''; // Timestamp for pagination

    const headers = createPodcastAPIHeaders(config);
    
    let url = `https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${id}&max=${max}&pretty`;
    if (since) {
        url += `&since=${since}`;
    }
    
    const response = await $fetch(url, {
        headers,
    });

    return response;
});