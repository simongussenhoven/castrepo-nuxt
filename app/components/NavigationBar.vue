<script setup lang="ts">
import { PodcastSearchBar } from '#components'

const user = useSupabaseUser()

// Search slideover control
const overlay = useOverlay()
let searchSlideover: any = null

const openSearch = async () => {
    if (!searchSlideover) {
        searchSlideover = overlay.create(PodcastSearchBar)
    }
    await searchSlideover.open()
}
</script>

<template>
    <nav class="fixed top-0 left-0 right-0 z-50 text-white shadow-md mx-auto bg-slate-800">
        <div class="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 max-[768px]:h-14 container mx-auto">
            <div class="max-[768px]:hidden">
                <NuxtLink to="/" class="text-xl font-bold text-white hover:text-gray-700">
                    🎧 CastRepo
                </NuxtLink>
            </div>

            <div
                class="hidden md:flex max-[768px]:flex max-[768px]:justify-around max-[768px]:w-full max-[768px]:space-x-0">
                <NuxtLink to="/"
                    class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-xs max-[768px]:py-1 flex items-center gap-2">
                    <UIcon name="i-heroicons-home" class="w-5 h-5" />
                    Home
                </NuxtLink>
                <button @click="openSearch"
                    class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-xs max-[768px]:py-1 flex items-center gap-2">
                    <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
                    Search
                </button>
                <NuxtLink v-if="user" to="/subscriptions"
                    class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-xs max-[768px]:py-1 flex items-center gap-2">
                    <UIcon name="i-heroicons-bookmark" class="w-5 h-5" />
                    Subscriptions
                </NuxtLink>
                <NavigationUser />
            </div>
        </div>
    </nav>
</template>
