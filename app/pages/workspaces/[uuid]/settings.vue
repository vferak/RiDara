<script setup lang='ts'>
const route = useRoute();
const { getWorkspace, getUsersFromWorkspace, updateWorkspace } = useWorkspace();

const uuid = route.params.uuid.toString();

const { data: workspace, refresh: refreshWorkspace } = await getWorkspace(uuid);
const { data: users } = getUsersFromWorkspace(uuid);

const modalState = useState<boolean>(() => false);

const openModal = () => {
    modalState.value = true;
};

const closeModal = async () => {
    modalState.value = false;
};

const update = async (name: string) => {
    await updateWorkspace(workspace.value!.uuid,name);
    await refreshWorkspace();
    await closeModal();
};

</script>

<template>
    <div v-if="workspace" class="container mx-auto h-full mt-4">
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto">
            <div class="card-body items-center text-center">
                <h2 class="card-title text-2xl">{{ workspace.name }}</h2>
                <button @click='openModal' class="btn mt-4 btn-xs">Edit</button>
                <Modal v-model='modalState'>
                    <h3 class='text-lg font-bold'>Update workspace name</h3>
                    <FormWorkspace @form-sent='update' :name='workspace.name'/>
                </Modal>
            </div>
        </div>
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto mt-8 px-10 pt-8">
            <div v-if="users" class="container mx-auto h-full mt-4">
                <div class="overflow-x-auto w-full">
                    <table class="table w-full mb-12 text-center items-center">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="user in users" :key="user.uuid">
                            <td>
                                <div class="flex items-center space-x-3">
                                    <div>
                                        <div class="font-bold">Jméno Přijmení</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge badge-ghost badge-sm">{{ user.email }}</span>
                            </td>
                            <th>
                                <button class="btn btn-ghost btn-xs">Remove</button>
                            </th>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
