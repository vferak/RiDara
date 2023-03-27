<script setup lang='ts'>

import { ErrorTemplate } from '~/composables/types';

const props = defineProps<{
    errorTemplate: ErrorTemplate[]
}>();

const objectSize = Object.keys(props.errorTemplate).length;
</script>

<template>
    <div>
        <div class=''
             v-if='objectSize === 0'>
            <AlertSuccess>Template is valid based on UPMM</AlertSuccess>
        </div>
        <div class='mt-4' v-else>
            <div class='alert alert-warning shadow-lg'>
                <div>
                    <svg xmlns='http://www.w3.org/2000/svg' class='stroke-current flex-shrink-0 h-6 w-6' fill='none'
                         viewBox='0 0 24 24'>
                        <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                    </svg>
                    <span>Current template has some problems:</span>
                </div>
            </div>

            <div v-if='objectSize !== 0'>
                <h1 class='text-2xl font-bold mt-3 text-center mb-2'>Overextends relations:</h1>
                <div v-for='(items, indexTemplate) in props.errorTemplate' :key='indexTemplate'>
<!--                    <p v-if='items.overExtends?.length === 0' class='text-lg text-center mt-2'>No overExtends items!</p>-->
                    <div v-for='(itemOverExtends, index) in items.overExtends' :key='index'>

                        <p class='text-lg text-center mt-2'><b>{{ items.upmmUuid }}</b> connected to
                            <b>{{ itemOverExtends }}</b> is not possible in UPMM</p>
                    </div>
                </div>

                <h1 class='text-2xl font-bold mt-3 text-center mb-2'>Missing relations:</h1>
                <div v-for='(items, indexTemplate) in props.errorTemplate' :key='indexTemplate'>
<!--                    <p v-if='items.missing?.length === 0' class='text-lg text-center mt-2'>No missing items!</p>-->
                    <div v-for='(itemMissing, indexMissing) in items.missing' :key='indexMissing'>

                        <p class='text-lg text-center mt-2'>There is missing connection: <b>{{ items.upmmUuid }}</b>
                            connected to <b>{{ itemMissing }}</b></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
