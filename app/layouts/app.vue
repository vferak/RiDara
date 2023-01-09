<script setup lang='ts'>
const router = useRouter();
const auth = useAuth();

const logOut = (): void => {
    auth.logOut();

    router.push('/');
}
</script>
<template>
    <div>
        <div class="drawer">
            <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
            <div class="drawer-content flex flex-col">
                <!-- Navbar -->
                <div class="navbar bg-base-200">
                    <div class="flex-1">
                        <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">RiDara</NuxtLink>

                    </div>
                    <div class="flex-none gap-3">
                        <ul class="menu menu-horizontal p-0">
                            <li><NuxtLink to="/diagrams">Diagrams</NuxtLink></li>
                        </ul>
                        <div class="dropdown dropdown-end">
                            <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                                <div class="w-10 rounded-full">
                                    <img src="https://placeimg.com/80/80/people" />
                                </div>
                            </label>
                            <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52">
                                <li>
                                    <a class="justify-between">
                                        Profile
                                        <span class="badge">New</span>
                                    </a>
                                </li>
                                <li><a>Settings</a></li>
                                <li><a @click='logOut'>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="bg-base-100">
                    <slot />
                </div>


            </div>
        </div>

        <LayoutFooter/>

    </div>
</template>
