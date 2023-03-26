<script setup lang='ts'>
const router = useRouter();
const auth = useAuth();

const logOut = (): void => {
    auth.logOut();

    router.push('/');
}
</script>
<template>
    <nav class='navbar bg-base-200'>
        <div class='flex-none lg:hidden'>
            <label for='site-drawer' class='btn btn-square btn-ghost'>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'
                     class='inline-block w-6 h-6 stroke-current'>
                    <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                          d='M4 6h16M4 12h16M4 18h16'></path>
                </svg>
            </label>
        </div>
        <div class='flex-1'>
            <NuxtLink to='/dashboard' class='lg:hidden btn btn-ghost normal-case text-xl'>RiDara</NuxtLink>
        </div>
        <div class='flex-none gap-5'>
            <ThemeToggle />
            <div class='dropdown dropdown-end'>
                <label tabindex='0' class='btn btn-ghost btn-circle avatar'>
                    <div class='w-10 rounded-full'>
                        <img src='/user.png' />
                    </div>
                </label>
                <ul tabindex='0'
                    class='menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52'>
                    <li>
                        <NuxtLink to='/user/profile'>Profile</NuxtLink>
                    </li>
                    <li><a @click='logOut'>Logout</a></li>
                </ul>
            </div>
        </div>
    </nav>
</template>
