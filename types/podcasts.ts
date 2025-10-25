export interface PodcastFeed {
    artwork: string;
    author: string;
    categories: Record<string, string>;
    contentType: string;
    crawlErrors: number;
    dead: number;
    description: string;
    episodeCount: number;
    explicit: boolean;
    generator: string;
    id: number;
    image: string;
    imageUrlHash: number;
    inPollingQueue: number;
    itunesId: number | null;
    language: string;
    lastCrawlTime: number;
    lastGoodHttpStatusTime: number;
    lastHttpStatus: number;
    lastParseTime: number;
    lastUpdateTime: number;
    link: string;
    locked: number;
    medium: string;
    newestItemPubdate: number;
    originalUrl: string;
    ownerName: string;
    parseErrors: number;
    podcastGuid: string;
    priority: number;
    title: string;
    type: number;
    url: string;
}


export interface PodcastSearchResponse {
    count: number;
    description: string;
    feeds: Array<PodcastFeed>;
    status: string;
    query: string;
}
