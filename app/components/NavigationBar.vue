<script setup lang="ts">
import { PodcastSearchBar } from '#components'

const user = useSupabaseUser()
const isNative = useIsNative()

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
    <!-- Desktop: top navbar -->
    <nav v-if="isNative === false" class="fixed top-0 left-0 right-0 z-50 text-white shadow-md mx-auto bg-slate-800">
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

    <!-- Native: bottom tab bar -->
    <nav v-else-if="isNative === true"
        class="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 border-t border-slate-700 pb-[env(safe-area-inset-bottom)]">
        <div class="flex items-center h-14">
            <NuxtLink to="/"
                class="flex-1 flex flex-col items-center justify-center text-gray-400 hover:text-white py-1 text-xs font-medium">
                <UIcon name="i-heroicons-home" class="w-6 h-6" />
                <span class="mt-0.5 truncate">Home</span>
            </NuxtLink>
            <button @click="openSearch"
                class="flex-1 flex flex-col items-center justify-center text-gray-400 hover:text-white py-1 text-xs font-medium">
                <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6" />
                <span class="mt-0.5 truncate">Search</span>
            </button>
            <NuxtLink v-if="user" to="/subscriptions"
                class="flex-1 flex flex-col items-center justify-center text-gray-400 hover:text-white py-1 text-xs font-medium">
                <UIcon name="i-heroicons-bookmark" class="w-6 h-6" />
                <span class="mt-0.5 truncate">Library</span>
            </NuxtLink>
            <NavigationUser :native="true" />
        </div>
    </nav>
</template>
