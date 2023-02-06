<script setup lang='ts'>
const { getWorkspaces } = useWorkspace();
const { getUser } = useUser();

const date = useDateFormat(useNow(), 'dddd, MMMM DD, YYYY')
const time = useDateFormat(useNow(), 'HH:mm:ss')

const { data: user } = await getUser();

const { data: workspaces } = await getWorkspaces();
const firstName = user.value?.firstName;
const lastName = user.value?.lastName;

const showEmptyWorkspacesMessage = useState<boolean>(() => workspaces.value!.length === 0);
</script>
<template>
    <div class="container mx-auto my-6">
        <p class="mb-4 mt-4 text-4xl font-bold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white">
            Dashboard
        </p>
        <Alert class='my-4'>
            Welcome back {{ firstName }} {{ lastName }}, today is {{ date }} and it's {{ time }}.
        </Alert>
        <AlertInform v-if='showEmptyWorkspacesMessage'>
            <div class="flex-1">
                <span>Hi, it looks like you haven't created a workspace yet. You can create one by clicking the following button.</span>
            </div>
            <div class="flex-none">
                <NuxtLink to='/workspaces' class="btn btn-sm btn-primary">Create workspace</NuxtLink>
            </div>
        </AlertInform>
        <div class='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-8 mt-8'>
            <CardsWorkspaceCard v-for='workspace in workspaces' :key='workspace.id' :workspace='workspace' />
        </div>
    </div>
</template>
