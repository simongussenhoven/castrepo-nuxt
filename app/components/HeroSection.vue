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
                <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div @click="getData"
                        class="px-8 py-4 bg-yellow-400 text-gray-800 rounded-lg text-lg font-medium hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-300">
                        Doe iets
                    </div>
                    <button
                        class="px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg text-lg font-medium hover:bg-white hover:text-indigo-500 transition-all duration-300">
                        Browse Podcasts
                    </button>
                </div>
            </div>
            <div class="flex justify-center items-center">
                <div class="text-8xl md:text-[12rem] opacity-80">
                    🎧
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const getData = async () => {
    const data = await $fetch('/api/podcasts/search')
    console.log(data)
}
</script>
