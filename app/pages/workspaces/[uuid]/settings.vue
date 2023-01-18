<script setup lang='ts'>
import { Workspace } from '~/composables/useWorkspace';
import { User } from '~/composables/useUser';

const workspace = useWorkspace();
const workspaceValue = useState<Workspace>();
const usersInWorkspace = useState<User[]>();
const route = useRoute();
const uuid = route.params.uuid.toString();

onBeforeMount(async () => {
    usersInWorkspace.value = await workspace.getUsersFromWorkspace(uuid);
    workspaceValue.value = await workspace.getWorkspace(uuid);
    console.log(usersInWorkspace.value);
});

const modalState = useState<boolean>(() => false);
const closeModal = async () => {
    modalState.value = false;
};

const openModal = () => {
    modalState.value = true;
};

const updateWorkspace = async (name: string) => {
    await workspace.update(workspaceValue.value.uuid,name);
    workspaceValue.value = await workspace.getWorkspace(uuid);
    await closeModal();
};

</script>

<template>
    <div v-if="workspaceValue" class="container mx-auto h-full mt-4">
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto">
            <div class="card-body items-center text-center">
                <h2 class="card-title text-2xl">{{ workspaceValue.name }}</h2>
                <button @click='openModal' class="btn mt-4 btn-xs">Edit</button>
                <Modal v-model='modalState'>
                    <h3 class='text-lg font-bold'>Update workspace name</h3>
                    <FormWorkspace @form-sent='updateWorkspace' :name='workspaceValue.name'/>
                </Modal>
            </div>
        </div>
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto mt-8 px-10 pt-8">
            <div v-if="usersInWorkspace" class="container mx-auto h-full mt-4">
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
                        <tr v-for="user in usersInWorkspace" :key="user.uuid">
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
