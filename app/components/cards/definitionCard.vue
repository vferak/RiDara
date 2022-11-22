<script setup lang='ts'>
const { elements } = defineProps(['elements']);
</script>

<template>
    <div>
        <!-- <NuxtLink :to="{ name: 'elements-id', params: { id: elements.id }}"> !-->
        <label for='edit-element' class='cursor-pointer'>
            <div class='card card-side bg-base-100 shadow-xl outline outline-1'>
                <div class='card-body'>
                    <h2 class='card-title'>{{ elements.name }}</h2>
                    <p>UPMM emlement name</p>
                    <div class='card-actions justify-end'>
                        <button class='btn btn-primary'>Watch</button>
                    </div>
                </div>
                <figure><img src='https://placeimg.com/200/280/arch' alt='Movie' /></figure>
            </div>
        </label>
    </div>
</template>
