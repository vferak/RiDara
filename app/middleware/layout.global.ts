export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path !== '/') {
        setPageLayout('app');
    }
})
