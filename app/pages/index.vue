<script setup lang="ts">
const router = useRouter();
const redirectTotemplates = () => {
  router.push("/templates");
}
</script>
<template>
  <div class="container mx-auto">
    <div class="card bg-base-100 shadow-xl w-1/2 mx-auto">
      <div class="card-body w-full">
        <h2 class="card-title">Login</h2>
        <form @submit.prevent='redirectTotemplates()' action="#" method="POST">
          <label class="block">E-mail</label>
          <input type="text" placeholder="Email" class="input input-bordered input-sm w-full max-w-lg m-2" />
          <label class="block">Password</label>
          <input type="text" placeholder="Password" class="input input-bordered input-sm w-full max-w-lg m-2" />
          <input type="submit" value="Submit" class="btn btn-sm w-full mt-4 flex" />
        </form>
      </div>
    </div>
  </div>
</template>
