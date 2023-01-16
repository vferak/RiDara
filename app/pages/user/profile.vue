<script setup lang='ts'>

import { User } from '~/composables/useUser';

const user = useUser();
const userData = useState<User>();

onBeforeMount(async () => {
    userData.value = await user.getProfile();
})
</script>

<template>
    <div v-if="userData" class="container mx-auto h-full mt-4">
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto">
            <figure class="px-10 pt-10">
                <div class="avatar">
                    <div class="w-24 mask mask-squircle">
                        <img src="https://api.lorem.space/image/face?hash=47449" />
                    </div>
                </div>
            </figure>
            <div class="card-body items-center text-center">
                <h2 class="card-title">{{ userData.email }}</h2>
                <p>Normal user</p>
                <div class="stats shadow">
                    <div class="stat place-items-center">
                        <div class="stat-title">Created projects</div>
                        <div class="stat-value">count(getProjects)</div>
                    </div>

                    <div class="stat place-items-center">
                        <div class="stat-title">Number of workspaces</div>
                        <div class="stat-value">{{ userData.userWorkspaces.length }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto mt-8 px-10 pt-8">
           <FormUserEdit :user-email='userData.email'/>
        </div>
    </div>
</template>
