export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth();

    if (!(to.path === '/' || to.path === '/register') && !auth.isLoggedIn()) {
        return navigateTo('/');
    }
});
