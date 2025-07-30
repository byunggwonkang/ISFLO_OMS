import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'

interface LoginParams {
  USER_ID: string
  USER_PW: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login({ USER_ID, USER_PW }: LoginParams) {
      const { data }: any = await useAPIFetch('/IS_GNR_USER_LOGIN_GET', {
          method: 'post',
          body: {
            USER_ID,
            USER_PW
          }
      })

      if (data.value.MTY === 'FAIL' || data.value.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      await useMenusStore().fetchUserMenus(data.value.RESULT_DATA.USER_SID)

      this.setUser({
        USER_SID : decrypt(data.value.RESULT_DATA.USER_SID),
        USER_TYPE : decrypt(data.value.RESULT_DATA.USER_TYPE),
        USER_BRAND_CODE : decrypt(data.value.RESULT_DATA.USER_BRAND_CODE),
        USER_BRAND_SNAME : decrypt(data.value.RESULT_DATA.USER_BRAND_SNAME),
        USER_BRAND_FNAME : decrypt(data.value.RESULT_DATA.USER_BRAND_FNAME),
        USER_CODE : decrypt(data.value.RESULT_DATA.USER_CODE),
        USER_DISP_NAME : decrypt(data.value.RESULT_DATA.USER_DISP_NAME),
        USER_SNAME : decrypt(data.value.RESULT_DATA.USER_SNAME),
        USER_FNAME : decrypt(data.value.RESULT_DATA.USER_FNAME),
        USER_DEPARTMENT : decrypt(data.value.RESULT_DATA.USER_DEPARTMENT),
        USER_POSITION : decrypt(data.value.RESULT_DATA.USER_POSITION),
        USER_COUNTRY : decrypt(data.value.RESULT_DATA.USER_COUNTRY),
        USER_LANGUAGE : decrypt(data.value.RESULT_DATA.USER_LANGUAGE),
        USER_STATUS : decrypt(data.value.RESULT_DATA.USER_STATUS),
        USER_JOIN_DATE : decrypt(data.value.RESULT_DATA.USER_JOIN_DATE),
        USER_AUTH_SNAME : decrypt(data.value.RESULT_DATA.USER_AUTH_SNAME),
        USER_AUTH_FNAME : decrypt(data.value.RESULT_DATA.USER_AUTH_FNAME),
        USER_SYSADMIN_YN : decrypt(data.value.RESULT_DATA.USER_SYSADMIN_YN),
        USER_AUTH_WH_GROUP_CODE : decrypt(data.value.RESULT_DATA.USER_AUTH_WH_GROUP_CODE),
        USER_LOGIN_ID: decrypt(USER_ID),
      })

      return {
        success: true,
        message: data.value.MSG
      };
    },
    setUser(user: any) {
      this.user = user
    },
    logout() {
      const { data }: any = useAPIFetch('/IS_GNR_USER_LOGOUT_SET', {
        method: 'post',
        body: {
          USER_ID: encrypt(this.user?.USER_LOGIN_ID)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.user = null
      return {
        success: true,
      };
    },
  },
  persist: {
    storage: persistedState.sessionStorage
  }
})
