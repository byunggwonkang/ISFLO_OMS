import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const SAuserGroupSettingsStore = defineStore('user-group-settings', {
  state: () => ({
    userGroupList: [] as any,
    menuList: [] as any,
    channelList: [] as any,
    storeList: [] as any,
  }), 
  getters: {
    getUserGroupList: (state: any) => state.userGroupList,
    getMenuList: (state: any) => state.menuList,
    getChannelList: (state: any) => state.channelList,
    getStoreList: (state: any) => state.storeList,
  },
  actions: {
    async fetchUserGroupList() {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INCLUDE_SA : encrypt("0"),
          FLT_INCLUDE_INACTIVE: encrypt("1")
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.userGroupList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchMenuList() {
      const { data }: any = await useAPIFetch('/IS_SA_MENU_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.menuList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchChannelList() {
      const { data }: any = await useAPIFetch('/IS_PA_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_BRAND_CODE: encrypt(''),
          FLT_INCLUDE_INACTIVE: encrypt('0'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.channelList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },    
    async fetchStoreList() {
      const { data }: any = await useAPIFetch('/IS_PA_STORE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INCLUDE_INACTIVE: encrypt('0'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.storeList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchUserGroupDetail(id: string) {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_DETAIL_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_GROUP_SID: encrypt(id),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      return {
        success: true,
        message: data.value?.MSG || '',
        data: data.value?.RESULT_DATA || {},
      };
    },
    async saveUserGroupDetail(formData: any) {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_DETAIL_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_GROUP_SID: encrypt(formData.FLT_GROUP_SID),
          FLT_GROUP_SNAME: encrypt(formData.FLT_GROUP_SNAME),
          FLT_GROUP_FNAME: encrypt(formData.FLT_GROUP_FNAME),
          FLT_GROUP_ACTIVE_YN: formData.FLT_GROUP_ACTIVE_YN ? encrypt('1') : encrypt('0'),
          FLT_GROUP_SA_YN: formData.FLT_GROUP_SA_YN ? encrypt('1') : encrypt('0'),
          FLT_GROUP_OMS_ADMIN_YN: formData.FLT_GROUP_OMS_ADMIN_YN ? encrypt('1') : encrypt('0'),
          FLT_GROUP_OMS_USER_YN: formData.FLT_GROUP_OMS_USER_YN ? encrypt('1') : encrypt('0'),
          FLT_GROUP_ESM_ADMIN_YN: formData.FLT_GROUP_ESM_ADMIN_YN ? encrypt('1') : encrypt('0'),
          FLT_GROUP_ESM_USER_YN: formData.FLT_GROUP_ESM_USER_YN ? encrypt('1') : encrypt('0'),
          FLT_GROUP_WMS_ADMIN_YN: formData.FLT_GROUP_WMS_ADMIN_YN ? encrypt('1') : encrypt('0'),
          FLT_GROUP_WMS_USER_YN: formData.FLT_GROUP_WMS_USER_YN ? encrypt('1') : encrypt('0'),
          FLT_GROUP_WH_GROUP_CODE: encrypt(formData.FLT_GROUP_WH_GROUP_CODE),
          FLT_GROUP_REMARK: encrypt(formData.FLT_GROUP_REMARK),
          ACCESS_MENUS: formData.ACCESS_MENUS.map((menu) => {
            return {
              SUB_MENU_CODE: encrypt(menu.SUB_MENU_CODE),
              READABLE: encrypt(menu.READABLE),
              WRITABLE: menu.WRITABLE === '0' || menu.WRITABLE === '' ? encrypt('W') : encrypt('W'),
            }
          }),
          
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || '',
      };
    }
  }
});
