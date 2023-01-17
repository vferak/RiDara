export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth();

    if (to.path !== '/' && !auth.isLoggedIn()) {
        return navigateTo('/');
    }
})
