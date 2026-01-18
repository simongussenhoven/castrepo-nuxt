<template>
    <nav class="fixed top-0 left-0 right-0 z-50 text-white shadow-md mx-auto bg-slate-800">
        <div class="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 max-[768px]:h-14 container mx-auto">
            <div class="max-[768px]:hidden">
                <NuxtLink to="/" class="text-xl font-bold text-white hover:text-gray-700">
                    CastRepo
                </NuxtLink>
            </div>

            <div
                class="hidden md:flex max-[768px]:flex max-[768px]:justify-around max-[768px]:w-full max-[768px]:space-x-0">
                <NuxtLink to="/"
                    class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-xs max-[768px]:py-1">
                    Home
                </NuxtLink>
                <NuxtLink to="/discover"
                    class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center max-[768px]:text-xs max-[768px]:py-1">
                    Discover
                </NuxtLink>
                <NavigationUser />
            </div>
        </div>
    </nav>
</template>
