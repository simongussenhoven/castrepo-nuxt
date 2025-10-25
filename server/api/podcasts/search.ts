import { createHash } from 'crypto';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const apiKey = config.pciApiKey;
    const apiSecret = config.pciApiSecret;
    const apiHeaderTime = Math.floor(Date.now() / 1000);

    // Create the authorization hash
    const hash = createHash('sha1')
        .update(apiKey + apiSecret + apiHeaderTime)
        .digest('hex');

    // Set headers
    const headers = {
        'User-Agent': 'CastRepo/1.0',
        'X-Auth-Key': apiKey,
        'X-Auth-Date': apiHeaderTime.toString(),
        'Authorization': hash,
    };

    // Make the API request
    const response = await $fetch('https://api.podcastindex.org/api/1.0/search/byterm', {
        query: { q: 'bastiat' },
        headers,
    });

    return response;
});