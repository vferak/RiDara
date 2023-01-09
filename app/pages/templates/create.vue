<script setup lang='ts'>
import { ref } from 'vue';

const router = useRouter();
const addToTemplate = () => {
    router.push('templates/add');
};

const selected = ref('');
const selectedFile = ref('');
console.log(selectedFile);

const emlements = [
    { id: 1, name: 'První element', description: 'První pospis element' },
    { id: 2, name: 'Druhy element', description: 'Druhy pospis element' },
    { id: 3, name: 'Treti element', description: 'Treti pospis element' },
    { id: 4, name: 'Ctvrty element', description: 'Ctvrty pospis element' },
];

const el1 = { id: 1, name: 'První element', description: 'První pospis element' };
const el2 = { id: 2, name: 'Druhy element', description: 'Druhy pospis element' };
</script>

<template>
    <div class='card bg-base-100 shadow-xl w-11/12 mx-auto mt-4'>
        <div class='card-body w-full'>
            <div class='flex items-center justify-between'>
                <h1 class='card-title text-3xl'>Name of template from form</h1>
                <div class='grid grid-cols-3 gap-4'>
                    <button class='btn sm:btn-sm md:btn-md lg:btn-lg'>Active/Disable</button>
                    <button class='btn sm:btn-sm md:btn-md lg:btn-lg'>Create copy</button>
                    <button class='btn sm:btn-sm md:btn-md lg:btn-lg'>Save</button>
                </div>
            </div>
            <div class='relative flex py-5 items-center'>
                <div class='flex-grow border-t border-gray-400'></div>
                <div class='flex-grow border-t border-gray-400'></div>
            </div>

            <label for='new-element' class='btn btn-sm md:btn-md lg:btn-lg mt-4 w-1/2 mx-auto'>Add Element</label>
            <div class='w-8/12 mx-auto bt-4'>
                <div class='grid grid-cols-1 gap-4 mt-4'>
                    <CardsDefinitionCard v-for='element in emlements' :key='element.id' :elements='element' />
                </div>
            </div>
        </div>

        <input type='checkbox' id='new-element' class='modal-toggle' />
        <label for='new-element' class='modal cursor-pointer'>
            <label class='modal-box relative  max-w-5xl' for=''>
                <h3 class='text-2xl font-bold mb-4'>Create new element</h3>
                <form @submit.prevent='addToTemplate()' action='#' method='POST'>
                    <label class='block'>Element name</label>
                    <input type='text' placeholder='Name of element'
                           class='input input-bordered w-full m-2' />
                    <label class='block'>Choose OWL file</label>
                    <!-- na ONCHANGE dotaz do databáze abych si z ovl vytahl ty elementy a dal je do UPMM elemtn selectu !-->
                    <select class='select select-bordered w-full m-2' v-model='selectedFile'>
                        <option disabled selected>-</option>
                        <option value='file1'>file1</option>
                        <option value='file2'>file2</option>
                    </select>
                    <label class='block'>UPMM element</label>
                    <input type='text' placeholder='UPMM element'
                           class='input input-bordered w-full m-2' />
                    <label class='block'>Shape</label>
                    <select class='select select-bordered w-full m-2'>
                        <option disabled selected>-</option>
                        <option>Rectangle</option>
                        <option>Triangle</option>
                        <option>Circle</option>
                        <option>Square</option>
                    </select>
                    <h3 class='text-lg font-bold mt-2 mb-4'>Attributes of element</h3>
                    <div class='flex'>
                        <div class='w-1/3'>
                            <label class='block'>Type</label>
                            <select class='select select-bordered m-2 w-11/12' v-model='selected'>
                                <option disabled selected>-</option>
                                <option value='transparent'>Transparent</option>
                                <option value='fill'>Fill</option>
                            </select>
                        </div>

                        <div class='w-1/3' v-if="selected=='fill'">
                            <label class='block m-2'>Color inside</label>
                            <input type='color' class='m-2 w-11/12' value='#000000'>
                        </div>
                        <div class='w-1/3'>
                            <label class='block m-2'>Color outline</label>
                            <input type='color' class='m-2 w-11/12' value='#000000'>
                        </div>
                    </div>

                    <div class='flex'>
                        <div class='w-1/2'>
                            <label class='block'>Outline type</label>
                            <select class='select select-bordered m-2 w-11/12'>
                                <option disabled selected>-</option>
                                <option>Solid</option>
                                <option>Dotted</option>
                                <option>Dashed</option>
                                <option>Double</option>
                            </select>
                        </div>

                        <div class='w-1/2'>
                            <label class='block'>Line width</label>
                            <input type='number' class='input input-bordered m-2 w-11/12' value='1'>
                        </div>
                    </div>
                    <input type='submit' value='Create' class='btn btn-md w-full mt-4 flex' />
                </form>
            </label>
        </label>

        <!-- EDIT FORM akorat dynamicky zmenit hodnoty podle vytahnuti Z DB !-->
        <input type='checkbox' id='edit-element' class='modal-toggle' />
        <label for='edit-element' class='modal cursor-pointer'>
            <label class='modal-box relative  max-w-5xl' for=''>
                <h3 class='text-2xl font-bold mb-4'>Edit element</h3>
                <form @submit.prevent='editElement()' action='#' method='POST'>
                    <label class='block'>Element name</label>
                    <input type='text' v-model='el1.name'
                           class='input input-bordered w-full m-2' />
                    <label class='block'>UPMM element</label>
                    <input type='text' v-model='el1.description'
                           class='input input-bordered w-full m-2' />
                    <label class='block'>Shape</label>
                    <select class='select select-bordered w-full m-2'>
                        <option disabled selected>-</option>
                        <option>Rectangle</option>
                        <option>Triangle</option>
                        <option>Circle</option>
                        <option>Square</option>
                    </select>
                    <h3 class='text-lg font-bold mt-2 mb-4'>Attributes of element</h3>
                    <div class='flex'>
                        <div class='w-1/3'>
                            <label class='block'>Type</label>
                            <select class='select select-bordered m-2 w-11/12' v-model='selected'>
                                <option disabled selected>-</option>
                                <option value='transparent'>Transparent</option>
                                <option value='fill'>Fill</option>
                            </select>
                        </div>

                        <div class='w-1/3' v-if="selected=='fill'">
                            <label class='block m-2'>Color inside</label>
                            <input type='color' class='m-2 w-11/12' value='#000000'>
                        </div>
                        <div class='w-1/3'>
                            <label class='block m-2'>Color outline</label>
                            <input type='color' class='m-2 w-11/12' value='#000000'>
                        </div>
                    </div>

                    <div class='flex'>
                        <div class='w-1/2'>
                            <label class='block'>Outline type</label>
                            <select class='select select-bordered m-2 w-11/12'>
                                <option disabled selected>-</option>
                                <option>Solid</option>
                                <option>Dotted</option>
                                <option>Dashed</option>
                                <option>Double</option>
                            </select>
                        </div>

                        <div class='w-1/2'>
                            <label class='block'>Line width</label>
                            <input type='number' class='input input-bordered m-2 w-11/12' value='1'>
                        </div>
                    </div>
                    <input type='submit' value='Create' class='btn btn-md w-full mt-4 flex' />
                </form>
            </label>
        </label>


    </div>
</template>
