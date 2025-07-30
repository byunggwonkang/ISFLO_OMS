import { defineStore } from 'pinia'

export const useMenusStore = defineStore('menus', {
  state: () => ({
    regularMenus: [
      {
        name: 'My Page',
        key: 'my-page',
        href: '/app/',
        component: 'RF000100',
        group:'sa-group',
      },
      {
        name: 'Contents',
        key: 'contents',
        href: '/app/',
        component: 'RF000200',
        group:'sa-group',
      },
      {
        name: 'Notice',
        key: 'notice',
        href: '/app/',
        component: 'RF000300',
        group:'sa-group',
      }
    ],
    userMenus: [] as any[]
  }),
  getters: {
    getRegularMenus: (state) => state.regularMenus,
    getUserMenus: (state) => state.userMenus,
  },
  actions: {
    async fetchUserMenus(USER_SID: string) {
      const { data }: any = await useAPIFetch('/IS_GNR_USER_MENU_GET', {
        method: 'post',
        body: {
          USER_SID
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      const transformObject = (input) => {
        return input.map(systemMenu => {
          const systemMenuName = systemMenu.SYSTEM_MENU;
          const systemMenuKey = useKebabCase(systemMenuName);

          const mainMenus = systemMenu.MAIN_MENUS.map(mainMenu => {
            const mainMenuName = mainMenu.MENU_NAME;

            const subMenus = mainMenu.SUB_MENUS.map(subMenu => {
              const subMenuName = subMenu.SUB_NAME;
              const subMenuKey = useKebabCase(subMenuName);

              return {
                group: systemMenuKey,
                name: subMenuName,
                href: `/app/`,
                component: subMenu.SUB_CODE,
                key: subMenuKey,
                parentKey: useKebabCase(mainMenuName)
              };
            });

            return {
              name: mainMenuName,
              key: useKebabCase(mainMenuName),
              code: mainMenu.MENU_CODE,
              children: subMenus
            };
          });

          return {
            name: systemMenuName,
            key: systemMenuKey,
            children: mainMenus
          };
        });
      };

      const menus = transformObject(data.value?.RESULT_DATA?.USER_MENUS)
      this.setUserMenus(menus)

      return {
        success: true,
        message: data.value.MSG,
        menus
      };
    },
    setUserMenus(menus: any[]) {
      this.userMenus = menus
    }
  },
  persist: {
    storage: persistedState.localStorage
  }
});
