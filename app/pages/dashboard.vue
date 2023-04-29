<script setup lang='ts'>
useHead({
    title: useTitle().createTitle('Dashboard'),
});

const { getWorkspaces } = useWorkspace();
const { getUser } = useUser();

const date = useDateFormat(useNow(), 'dddd, MMMM DD, YYYY', { locales: 'en-US' })
const time = useDateFormat(useNow(), 'HH:mm:ss', { locales: 'en-US' })

const { data: user } = await getUser();

const { data: workspaces } = await getWorkspaces();
const firstName = user.value?.firstName;
const lastName = user.value?.lastName;

const exist = computed(() => workspaces.value !== null && workspaces.value?.length === 0);
</script>
<template>
    <div class="hero py-12 bg-primary text-primary-content">
        <div class="hero-content text-center">
            <div class="max-w-2xl">
                <h1 class="text-6xl font-bold">Welcome to RiDara</h1>
                <p class="text-3xl py-16">This tool allows semiformal process modeling based on formal restrictions from Unified Process Meta Model.</p>
                <NuxtLink to='/workspaces' class="btn btn-secondary btn-lg">Start now</NuxtLink>
            </div>
        </div>
    </div>
    <div class="container mx-auto my-6">
        <Alert class='my-4'>
            Welcome back {{ firstName }} {{ lastName }}, today is {{ date }} and it's {{ time }}.
        </Alert>

        <AlertInform v-if='exist'>
            <div class="flex-1">
                <span>Hi, it looks like you haven't created a workspace yet. You can create one by clicking the following button.</span>
            </div>
            <div class="flex-none">
                <NuxtLink to='/workspaces' class="btn btn-sm btn-primary">Create workspace</NuxtLink>
            </div>
        </AlertInform>
        <div class='grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-8 mt-8'>
            <CardsWorkspaceCard v-for='workspace in workspaces' :key='workspace.id' :workspace='workspace' />
        </div>
    </div>
</template>
