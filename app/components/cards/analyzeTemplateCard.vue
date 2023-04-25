<script setup lang='ts'>

import { ErrorTemplate } from '~/composables/types';

const props = defineProps<{
    errorTemplate: ErrorTemplate[]
}>();

const objectSize = Object.keys(props.errorTemplate).length;
const duplicities = useState<boolean>();

duplicities.value = objectSize > 0 && props.errorTemplate[0].upmmUuid === '/12/12/12';
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
                <div v-if='duplicities'>
                    <h1 class='text-xl font-bold mt-3 text-center mb-2'>There are duplicate elements with same Element Id in properties panel:</h1>
                    <div v-for='(items, indexTemplate) in props.errorTemplate[0].overExtends' :key='indexTemplate'>
                        <p class='text-lg text-center mt-2'>{{ items }}</p>

                    </div>
                </div>

                <div v-else>
                    <h1 class='text-2xl font-bold mt-3 text-center mb-2'>Not possible relations in UPMM:</h1>
                    <div v-for='(items, indexTemplate) in props.errorTemplate' :key='indexTemplate'>
                            <div v-for='(notPossibleItem, index) in items.notPossible' :key='index'>

                            <p class='text-lg text-center mt-2'><b>{{ items.upmmUuid }}</b> ({{items.id}}) connected to
                                <b>{{ notPossibleItem }}</b> </p>
                        </div>
                    </div>

                    <h1 class='text-2xl font-bold mt-3 text-center mb-2'>Extra relations:</h1>
                    <div v-for='(items, indexTemplate) in props.errorTemplate' :key='indexTemplate'>
                        <div v-for='(extraItem, extraIndex) in items.overExtends' :key='extraIndex'>

                            <p class='text-lg text-center mt-2'><b>{{ items.upmmUuid }}</b> ({{items.id}})
                                connected to <b>{{ extraItem }}</b></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
