<template>
    <div class="flex flex-col h-screen">
        <div class="navbar bg-base-200">
            <a class="btn btn-ghost normal-case text-xl">RiDara</a>
        </div>

        <div class="bg-base-100 h-full">
            <slot />
        </div>

        <LayoutFooter/>
    </div>
</template>
