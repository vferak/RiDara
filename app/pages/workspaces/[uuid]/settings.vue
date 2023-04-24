<script setup lang='ts'>
const router = useRouter();
const route = useRoute();
const { clearCurrentWorkspace } = useCurrentWorkspace();
const { getWorkspace, getUsersFromWorkspace, updateWorkspace, addUserToWorkspace, removeUserFromWorkspace, getUsersNotInWorkspace, deleteWorkspace } = useWorkspace();

const uuid = route.params.uuid.toString();

const { data: workspace, refresh: refreshWorkspace } = await getWorkspace(uuid);
const { data: userWorkspaces, refresh: refreshUsers } = await getUsersFromWorkspace(uuid);
const { data: usersNotInWorkspace, refresh: refreshUsersNotInWorkspace } = await getUsersNotInWorkspace(uuid);

const users = userWorkspaces.value!.map((userWorkspace) => userWorkspace.user);

const modalState = useState<boolean>(() => false);
const { modalState: addUserState, openModal: openAddUser, closeModal: closeAddUser } = useModal('add-user');
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

const addUser = async (userUuid: string) => {
    await addUserToWorkspace(userUuid, workspace.value!.uuid);
    await refreshWorkspace();
    await refreshUsers();
    await refreshUsersNotInWorkspace();
    closeAddUser();
};

const removeUser = async (userUuid: string) => {
    await removeUserFromWorkspace(userUuid, workspace.value!.uuid);
    await refreshWorkspace();
    await refreshUsers();
    await refreshUsersNotInWorkspace();
};

const deleteUser = async () => {
    await deleteWorkspace(workspace.value!.uuid);
    await clearCurrentWorkspace();
    router.push('/workspaces');
};

</script>

<template>
    <div v-if="workspace" class="container mx-auto h-full mt-4">
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto">
            <div class="card-body items-center text-center">
                <h2 class="card-title text-2xl">{{ workspace.name }}</h2>
                <span>owner: {{ workspace.owner.firstName }} {{ workspace.owner.lastName }}</span>
                <button @click='openModal' class="btn mt-2 btn-xs">Edit</button>
                <Modal v-model='modalState'>
                    <h3 class='text-lg font-bold'>Update workspace name</h3>
                    <FormWorkspace @form-sent='update' :name='workspace.name'/>
                </Modal>
            </div>
        </div>
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto mt-8 px-10 pt-8">
            <div v-if="users" class="mx-auto h-full">
                <div class='float-right'>
                    <button @click='deleteUser' class='btn mt-4 mr-3 btn-md'>
                        Delete workspace
                    </button>
                    <button @click='openAddUser' class='btn mt-4 btn-md'>
                        Add user
                    </button>
                    <Modal v-model='addUserState'>
                        <h3 class='text-lg font-bold'>Add user to workspace</h3>
                        <FormAddUserWorkspace @form-sent='addUser' :users='usersNotInWorkspace'/>
                    </Modal>
                </div>

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
                        <tr v-for="useWorkspace in userWorkspaces" :key="useWorkspace.user.uuid">
                            <td>
                                <div class="items-center space-x-3">
                                    <div class="font-bold">{{ useWorkspace.user.firstName }} {{ useWorkspace.user.lastName }}</div>
                                </div>
                            </td>
                            <td>
                               {{ useWorkspace.user.email }}
                            </td>
                            <td>
                                <button @click='removeUser(useWorkspace.user.uuid)' class="btn btn-ghost btn-xs">Remove</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
