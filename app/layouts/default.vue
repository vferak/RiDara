<template>
    <div class="flex flex-col h-screen">
        <div class="navbar bg-base-200">
            <div class='flex-1'>
                <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">RiDara</NuxtLink>
            </div>
            <div class='flex-none'>
                <ThemeToggle/>
            </div>
        </div>

        <div class="bg-base-100 h-full">
            <slot />
        </div>

        <LayoutFooter/>
    </div>
</template>
