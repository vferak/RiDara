export default defineNuxtRouteMiddleware((to, from) => {
    if (!(to.path === '/' || to.path === '/register')) {
        setPageLayout('app');
    }
})
