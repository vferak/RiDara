<script setup lang='ts'>
const { getUser } = useUser();
const { setCurrentUser } = useCurrentUser();
const { getCurrentWorkspace } = useCurrentWorkspace();

const { data: user } = await getUser();

setCurrentUser(user.value!);
const currentWorkspace = await getCurrentWorkspace();

const navs = useState(() => [
    {
        key: 'overview',
        name: 'Overview',
        visible: true,
        links: [
            {name: 'Dashboard', route: '/dashboard', icon: 'gg-collage'},
            {name: 'Workspaces', route: '/workspaces', icon: 'gg-work-alt'},
        ],
    },
    {
        key: 'workspace',
        name: currentWorkspace?.value?.name,
        visible: !!currentWorkspace?.value,
        links: [
            {name: 'Projects', route: `/projects`, icon: 'gg-album'},
            {name: 'Workspace settings', route: `workspaces/${currentWorkspace.value?.uuid}/settings`, icon: 'gg-options'},
        ],
    },
    {
        key: 'admin',
        name: 'Admin',
        visible: true,
        links: [
            {name: 'Templates', route: '/templates', icon: 'gg-template'},
            {name: 'Ontology files', route: '/ontology/files', icon: 'gg-file-document'},
        ],
    },
]);

watch(currentWorkspace, () => {
    const workspaceNav = navs.value.find((nav) => nav.key === 'workspace');
    workspaceNav!.name = currentWorkspace?.value?.name;
    workspaceNav!.visible = !!currentWorkspace?.value;

    const settingsLink = workspaceNav!.links.find(
        (link) => link.name === 'Workspace settings'
    );

    settingsLink!.route = `workspaces/${currentWorkspace.value?.uuid}/settings`;
})
</script>
<template>
    <div class="flex flex-col h-screen">
        <div class="drawer drawer-mobile">
            <input id="site-drawer" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col items-center justify-center">
                <LayoutNavbar/>

                <div class="bg-base-100 h-full w-full overflow-auto">
                    <slot />
                </div>

                <LayoutFooter/>
            </div>
            <div class="drawer-side">
                <label for="site-drawer" class="drawer-overlay"></label>
                <aside class='w-80 bg-base-300 h-full'>
                    <div class='hidden lg:flex px-4 py-2'>
                        <NuxtLink class='btn btn-ghost justify-start normal-case text-3xl font-bold w-full' to="/dashboard">RiDara</NuxtLink>
                    </div>
                    <div class='flex flex-col'>
                        <div v-for='nav in navs' :key='nav.key'>
                            <div v-if='nav.visible'>
                                <div class="divider">{{ nav.name }}</div>
                                <ul class="menu p-4 text-base-content">
                                    <li v-for='navLink in nav.links' :key='navLink.route'>
                                        <NuxtLink :to="navLink.route" class='flex gap-4 items-stretch'>
                                            <span class='flex-none w-6 flex justify-center items-center'>
                                                <i :class="navLink.icon"></i>
                                            </span>
                                            <span class='flex-1 font-medium'>
                                                {{ navLink.name }}
                                            </span>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</template>
