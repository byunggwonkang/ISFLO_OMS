import { defineStore } from 'pinia'
import {notify} from "notiwind";
const { user } = storeToRefs(useAuthStore());

export const useProfileStore = defineStore('profile', {
  state: () => ({
    userProfile: {} as any,
  }),
  getters: {
    getUserProfile: (state: any) => state.userProfile,
  },
  actions: {
    async fetchUserProfile() {
      const {data}: any = await useAPIFetch('/IS_GNR_USER_STORE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          FLT_USER_SID: user.value?.USER_SID,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.userProfile = data.value?.RESULT_DATA[0] || {};

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async updateUserProfile(data: any) {
      const {data: res}: any = await useAPIFetch('/IS_GNR_USER_STORE_DETAIL_SET', {
        method: 'post',
        body: {
          ...data,
          USER_SID: user.value?.USER_SID,
          FLT_USER_SID: user.value?.USER_SID,
        }
      });

      if (res.value?.MTY === 'FAIL' || res.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: res.value?.MSG
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: 'asas'
      };
    },
    async changePassword(formData: any) {
      const {data}: any = await useAPIFetch('/IS_GNR_USER_PASSWORD_SET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          FLT_USER_SID: user.value?.USER_SID,
          FLT_USER_CURRENT_PW: formData.FLT_USER_CURRENT_PW,
          FLT_USER_NEW_PW: formData.FLT_USER_NEW_PW,
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
        message: data.value?.MSG
      };
    }
  }
});
