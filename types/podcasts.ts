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

export interface PodcastFeedData {
    id: number;
    podcastGuid: string;
    title: string;
    url: string;
    originalUrl: string;
    link: string;
    description: string;
    author: string;
    ownerName: string;
    image: string;
    artwork: string;
    lastUpdateTime: number;
    lastCrawlTime: number;
    lastParseTime: number;
    lastGoodHttpStatusTime: number;
    lastHttpStatus: number;
    contentType: string;
    itunesId: number | null;
    itunesType?: string;
    generator: string;
    language: string;
    explicit: boolean;
    type: 0 | 1;
    medium: string;
    dead: number;
    chash: string;
    episodeCount: number;
    crawlErrors: number;
    parseErrors: number;
    categories: Record<string, string>;
    locked: 0 | 1;
    imageUrlHash: number;
    value?: any;
    funding?: any;
};


export interface PodcastByFeedIdResponse {
    status: 'true' | 'false';
    description: string;
    query: {
        id: string;
    };
    feed: PodcastFeedData;
}

export interface PodcastEpisode {
    id: number;
    title: string;
    link: string;
    description: string;
    guid: string;
    datePublished: number;
    datePublishedPretty: string;
    dateCrawled: number;
    enclosureUrl: string;
    enclosureType: string;
    enclosureLength: number;
    duration: number;
    explicit: number;
    episode: number;
    episodeType: string;
    season: number;
    image: string;
    feedItunesId: number;
    feedUrl: string;
    feedImage: string;
    feedId: number;
    podcastGuid: string;
    feedLanguage: string;
    feedDead: number;
    feedDuplicateOf: number | null;
    chaptersUrl: string | null;
    transcriptUrl: string | null;
}

export interface PodcastEpisodesResponse {
    status: 'true' | 'false';
    liveItems: Array<any>;
    items: Array<PodcastEpisode>;
}
