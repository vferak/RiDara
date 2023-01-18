<template>
    <div class="flex flex-col h-screen">
        <div class="navbar bg-base-200">
            <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">RiDara</NuxtLink>
            <ThemeToggle/>
        </div>

        <div class="bg-base-100 h-full">
            <slot />
        </div>

        <LayoutFooter/>
    </div>
</template>
