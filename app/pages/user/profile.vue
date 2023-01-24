<script setup lang='ts'>
const { getUserProfile } = useUser();

const { data: user } = await getUserProfile();
</script>
<template>
    <div v-if="user" class="container mx-auto h-full mt-4">
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto">
            <figure class="px-10 pt-10">
                <div class="avatar">
                    <div class="w-24 mask mask-squircle">
                        <img src="https://api.lorem.space/image/face?hash=47449" />
                    </div>
                </div>
            </figure>
            <div class="card-body items-center text-center">
                <h2 class="card-title">{{ user.email }}</h2>
                <p>Normal user</p>
                <div class="stats shadow">
                    <div class="stat place-items-center">
                        <div class="stat-title">Created projects</div>
                        <div class="stat-value">count(getProjects)</div>
                    </div>

                    <div class="stat place-items-center">
                        <div class="stat-title">Number of workspaces</div>
                        <div class="stat-value">{{ user.userWorkspaces.length }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto mt-8 px-10 pt-8">
           <FormUserEdit :user-email='user.email' :first-name='user.firstName' :last-name='user.lastName'/>
        </div>
    </div>
</template>
