export const useGetCurrentWorkingSpaceFromUrl = () => {
  const route = useRoute();
  const menusStore = useMenusStore();

  const currentWorkingSpace = computed(() => {
    return findTabKey(route.params.tab);
  });

  const findTabKey = (key: string|string[]): any|string => {
    const menu = menusStore.getRegularMenus.find((menu:any) => menu.key === key);
    if (menu) {
      return menu;
    }

    for (const userMenu of menusStore.getUserMenus) {
      for (const menu of userMenu.children) {
        for (const child of menu.children) {
          if (child.key === key) {
            return child;
          }
        }

        if (menu.key === key) {
          return menu;
        }
      }
    }

    return 'Empty';
  };

  return {
    currentWorkingSpace
  }
}
