export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuth();
    const { getCurrentUser } = useCurrentUser();

    if (!(to.path === '/' || to.path === '/register') && !auth.isLoggedIn() ) {
        return navigateTo('/');
    }

    if (
        getCurrentUser()?.role !== 'admin' &&
        (to.path.startsWith('/templates') || to.path.startsWith('/ontology'))
    ) {
        return navigateTo('/dashboard');
    }
})
