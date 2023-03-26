<script setup lang='ts'>
const { getUserProfile } = useUser();

const { data: userData } = await getUserProfile();
</script>
<template>
    <div v-if="userData" class="container mx-auto h-full mt-4">
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto">
            <figure class="px-10 pt-10">
                <div class="avatar">
                    <div class="w-24 mask mask-squircle">
                        <img src='/user.png' />
                    </div>
                </div>
            </figure>
            <div class="card-body items-center text-center">
                <h2 class="card-title">{{ userData.user.email }}</h2>
                <p>Normal user</p>
                <div class="stats shadow">
                    <div class="stat place-items-center">
                        <div class="stat-title">Created projects</div>
                        <div class="stat-value">{{ userData.projects.length }}</div>
                    </div>

                    <div class="stat place-items-center">
                        <div class="stat-title">Number of workspaces</div>
                        <div class="stat-value">{{ userData.user.userWorkspaces.length }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto mt-8 px-10 pt-8">
           <FormUserEdit :user-email='userData.user.email' :first-name='userData.user.firstName' :last-name='userData.user.lastName'/>
        </div>
        <div class="card w-1/2 min-w-min bg-base-200 shadow-xl mx-auto mt-8 px-10 pt-8">
            <FormUserPasswordEdit />
        </div>
    </div>
</template>
