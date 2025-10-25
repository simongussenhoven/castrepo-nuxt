import { createHash } from "crypto";

export function createPodcastAPIHeaders(config: any) {
    const apiKey = config.pciApiKey;
    const apiSecret = config.pciApiSecret;
    const apiHeaderTime = Math.floor(Date.now() / 1000);

    // Create the authorization hash
    const hash = createHash('sha1')
        .update(apiKey + apiSecret + apiHeaderTime)
        .digest('hex');

    return {
        'User-Agent': 'CastRepo/1.0',
        'X-Auth-Key': apiKey,
        'X-Auth-Date': apiHeaderTime.toString(),
        'Authorization': hash,
    };
}
