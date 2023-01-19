<script setup lang='ts'>
import { Workspace } from '~/composables/useWorkspace';
import { User } from '~/composables/useUser';

const workspace = useWorkspace();
const workspaceValue = useState<Workspace>();
const usersInWorkspace = useState<User[]>();
const usersNotInWorkspace = useState<User[]>();
const route = useRoute();
const router = useRouter();
const uuid = route.params.uuid.toString();

onBeforeMount(async () => {
    usersInWorkspace.value = await workspace.getUsersFromWorkspace(uuid);
    workspaceValue.value = await workspace.getWorkspace(uuid);
    usersNotInWorkspace.value = await workspace.getUsersNotInWorkspace(uuid);
});

const workspaceModalState = useState<boolean>(() => false);
const usersModalState = useState<boolean>(() => false);
const closeWorkspaceModal = async () => {
    workspaceModalState.value = false;
};

const openWorkspaceModal = () => {
    workspaceModalState.value = true;
};

const closeUsersModal = async () => {
    usersModalState.value = false;
    await workspace.getWorkspace(uuid);
};

const openUsersModal = () => {
    usersModalState.value = true;
};

const updateWorkspace = async (name: string) => {
    await workspace.update(workspaceValue.value.uuid, name);
    workspaceValue.value = await workspace.getWorkspace(uuid);
    await closeWorkspaceModal();
};

const deleteWorkspace = async () => {
    await workspace.deleteWorkspace(workspaceValue.value.uuid)
    router.push('/workspaces');
};

const removeUserFromWorkspace = async (userUuid: string) => {
    await workspace.removeUserFromWorkspace(workspaceValue.value.uuid, userUuid)
    usersInWorkspace.value = await workspace.getUsersFromWorkspace(uuid);
};

const addUserToWorkspace = async (userUuid: string) => {
    await workspace.addUserToWorkspace(workspaceValue.value.uuid, userUuid)
    usersNotInWorkspace.value = await workspace.getUsersNotInWorkspace(uuid);
    //await workspace.getWorkspace(uuid);
    //await closeUsersModal();
    //TODO dodělat refresh uživatelů ve workspacu po zavření modalu a upravit to zavření modalu
};

</script>

<template>
    <div v-if="workspaceValue" class="container mx-auto h-full mt-4">
        <div class="card-actions justify-end">
            <button @click='deleteWorkspace' class="btn btn-primary">Delete workspace</button>
            <button @click='openUsersModal' class="btn btn-primary">Add user</button>
        </div>
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto">
            <div class="card-body items-center text-center">
                <h2 class="card-title text-2xl">{{ workspaceValue.name }}</h2>
                <button @click='openWorkspaceModal' class="btn mt-4 btn-xs">Edit</button>
                <Modal v-model='workspaceModalState'>
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
                                <button @click='removeUserFromWorkspace(user.uuid)' class="btn btn-ghost btn-xs">Remove</button>
                            </th>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <Modal v-model='usersModalState'>
            <button @click='closeUsersModal' class='btn btn:sm'>Close (nevím jak zavřít)</button>
            <h3 class='text-lg font-bold'>Add users to workspace</h3>
            <table class="table w-full mb-12 text-center items-center">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in usersNotInWorkspace" :key="user.uuid">
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
                        <button @click='addUserToWorkspace(user.uuid)' class="btn btn-ghost btn-xs">Add</button>
                    </th>
                </tr>
                </tbody>
            </table>
        </Modal>
    </div>
</template>
