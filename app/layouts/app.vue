<script setup lang='ts'>
const { getUser } = useUser();
const { setCurrentUser } = useCurrentUser();
const { getCurrentWorkspace } = useCurrentWorkspace();
const route = useRoute();

const { data: user } = await getUser();

setCurrentUser(user.value!);
const currentWorkspace = await getCurrentWorkspace();

const navs = useState<{
    key: string,
    name: string,
    visible: boolean,
    links: {
        name: string,
        route: string,
        icon: string,
    }[]
}[]>();

const renderNav = () => {
    navs.value = [
        {
            key: 'overview',
            name: 'Overview',
            visible: true,
            links: [
                {name: 'Dashboard', route: '/dashboard', icon: 'gg-collage'},
                {name: 'Workspaces', route: '/workspaces', icon: 'gg-work-alt'},
            ],
        },
    ];

    if (currentWorkspace.value) {
        navs.value.push({
            key: 'workspace',
            name: currentWorkspace!.value!.name,
            visible: !!currentWorkspace?.value,
            links: [
                {name: 'Projects', route: `/projects`, icon: 'gg-album'},
                {name: 'Workspace settings', route: `/workspace/${currentWorkspace.value?.uuid}/settings`, icon: 'gg-options'},
            ],
        });
    }

    if (user.value && user.value.role === 'admin') {
        navs.value.push({
            key: 'admin',
            name: 'Admin',
            visible: true,
            links: [
                {name: 'Templates', route: '/templates', icon: 'gg-template'},
                {name: 'Ontology files', route: '/ontology', icon: 'gg-file-document'},
            ],
        })
    }
};

renderNav();

watch(currentWorkspace, () => {
    renderNav();
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
                        <NuxtLink class='btn btn-ghost text-primary justify-start normal-case text-3xl font-bold w-full' to="/dashboard">RiDara</NuxtLink>
                    </div>
                    <div class='flex flex-col'>
                        <div v-for='nav in navs' :key='nav.key'>
                            <div v-if='nav.visible'>
                                <div class="divider">{{ nav.name }}</div>
                                <ul class="menu p-4 text-base-content">
                                    <li v-for='navLink in nav.links' :key='navLink.route'>
                                        <NuxtLink :to="navLink.route" class='flex gap-4 items-stretch' :class='{"active": route.path.includes(navLink.route)}'>
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
