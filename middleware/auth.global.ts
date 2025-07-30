export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore();
    const { currentTab } = storeToRefs(useTabsStore())

    if (to.path === '/auth/login' && auth.isAuthenticated) {
        if (currentTab.value?.href !== undefined) {
          return navigateTo(currentTab.value.href);
        }

        return navigateTo('/app/');
    }

    if (to.path !== '/auth/login' && !auth.isAuthenticated && to.path !== '/') {
        return navigateTo('/auth/login');
    }
});
