<script setup lang='ts'>
const { getWorkspaces } = useWorkspace();
const { getUser } = useUser();

const date = useDateFormat(useNow(), 'dddd, MMMM DD, YYYY')
const time = useDateFormat(useNow(), 'HH:mm:ss')

const { data: user } = await getUser();

const { data: workspaces } = await getWorkspaces();
const firstName = user.value?.firstName;
const lastName = user.value?.lastName;

const exist = computed(() => workspaces.value !== null && workspaces.value?.length === 0);
</script>
<template>
    <LayoutGridList title='Dashboard'>
        <template v-slot:alerts>
            <Alert>
                Welcome back {{ firstName }} {{ lastName }}, today is {{ date }} and it's {{ time }}.
            </Alert>
            <AlertInform v-if='exist' class='mt-4'>
                <div class="flex-1">
                    <span>Hi, it looks like you haven't created a workspace yet. You can create one by clicking the following button.</span>
                </div>
                <div class="flex-none">
                    <NuxtLink to='/workspaces' class="btn btn-sm btn-primary">Create workspace</NuxtLink>
                </div>
            </AlertInform>
        </template>

        <template v-slot:grid>
            <CardsWorkspaceCard v-for='workspace in workspaces' :key='workspace.id' :workspace='workspace' />
        </template>
    </LayoutGridList>
</template>
