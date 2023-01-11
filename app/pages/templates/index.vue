<script setup lang='ts'>

const templates = [
    { id: 1, name: 'První template', description: 'První pospis template' },
    { id: 2, name: 'Druhy template', description: 'Druhy pospis template' },
    { id: 3, name: 'Treti template', description: 'Treti pospis template' },
    { id: 4, name: 'Ctvrty template', description: 'Ctvrty pospis template' },
];

const router = useRouter();
const redirectToCreate = () => {
    router.push('templates/create');
};
//uložit načtený file do databáze/struktury projektu abych pak v definici mohl vybrat ze chci definovat elementy podle tohoto soubory a nemusim prochazet ten jeden velky
const createFile = () => {
    router.push('templates/savefile');
};
</script>

<template>
    <div>
        <div class='container mx-auto'>

            <div class='flex items-center justify-between'>
                <p class='mb-4 mt-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
                    Defined templates</p>
                <div class='text-end'>
                    <label for='new-template' class='btn mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>New
                        template</label>
                    <label for='import-owl' class='btn mt-4 ml-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>Import OWL
                        file</label>
                </div>

            </div>

            <div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5'>
                <CardsDiagramCard v-for='template in templates' :key='template.id' :templates='template' />
            </div>
        </div>

        <input type='checkbox' id='new-template' class='modal-toggle' />
        <label for='new-template' class='modal cursor-pointer'>
            <label class='modal-box relative' for=''>
                <h3 class='text-lg font-bold'>Create new template</h3>
                <form @submit.prevent='redirectToCreate()' action='#' method='POST'>
                    <label class='block'>Name</label>
                    <input type='text' placeholder='Name of template'
                           class='input input-bordered input w-full  m-2' />
                    <label class='block'>Description</label>
                    <textarea class='textarea textarea-bordered w-full m-2'
                              placeholder='Description of template'></textarea>
                    <input type='submit' value='Submit' class='btn btn-sm w-full mt-4 flex' />
                </form>
            </label>
        </label>

        <input type='checkbox' id='import-owl' class='modal-toggle' />
        <label for='import-owl' class='modal cursor-pointer'>
            <label class='modal-box relative' for=''>
                <h3 class='text-lg font-bold'>Import new OWL file</h3>
                <form @submit.prevent='createFile()' action='#' method='POST'>
                    <label class='block mt-4'>Choose file</label>
                    <input type='file' class='file-input file-input-bordered w-full  mt-2' />
                    <input type='submit' value='Submit' class='btn btn-sm w-1/2 mx-auto mt-4 flex' />
                </form>
            </label>
        </label>
    </div>
</template>
