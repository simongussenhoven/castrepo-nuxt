<template>
    <section class="min-h-[80vh] flex items-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-8">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div class="text-center md:text-left">
                <h1 class="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    Welcome to <span class="text-yellow-400">CastRepo</span>
                </h1>
                <p class="text-xl md:text-2xl mb-6 opacity-90">
                    Discover, organize, and enjoy your favorite podcasts all in one place
                </p>
                <p class="text-base md:text-lg mb-8 opacity-80 leading-relaxed">
                    CastRepo is your ultimate podcast companion. Browse thousands of shows,
                    create custom playlists, and never miss an episode with our smart recommendations.
                </p>
                <PodcastSearchBar />
            </div>
            <div class="flex justify-center items-center">
                <div class="text-8xl md:text-[12rem] opacity-80">
                    🎧
                </div>
            </div>
        </div>
    </section>
</template>