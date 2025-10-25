import { createPodcastAPIHeaders } from '~~/server/utils/handler';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    const id = (query.id as string) || '';

    const headers = createPodcastAPIHeaders(config);
    const response = await $fetch(`https://api.podcastindex.org/api/1.0/episodes/byfeedid?id=${id}&pretty&max=1000`, {
        headers,
    });

    return response;
});