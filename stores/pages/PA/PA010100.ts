import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

export const useLogisticsManagementStore = defineStore('logistics-management', {
  state: () => ({
    userGroupBrandList: [] as any[],
    logisticsList: [] as any,
    courierList: [] as any,
    channelList: [] as any,
    filters: {
      FLT_BRAND_CODE : '',
      FLT_CHANNEL_CODE : '',
      FLT_INCLUDE_INACTIVE : '',
    }
  }),
  getters: {
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getLogisticsList: (state: any) => state.logisticsList,
    getCourierList: (state: any) => state.courierList,
    getChannelList: (state: any) => state.channelList
  },
  actions: {
    async fetchUserGroupBrandList() {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_BRAND_LIST_GET', {
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

      this.userGroupBrandList = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async fetchLogisticsList() {
      const {data}: any = await useAPIFetch('/IS_PA_COURIER_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_BRAND_CODE : encrypt(this.filters.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE : encrypt(this.filters.FLT_CHANNEL_CODE),
          FLT_INCLUDE_INACTIVE: encrypt('1'),
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.logisticsList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchCourierList() {
      const {data}: any = await useAPIFetch('/IS_SA_COURIER_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_BRAND_CODE : encrypt(this.filters.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE : encrypt(this.filters.FLT_CHANNEL_CODE),
          FLT_INCLUDE_INACTIVE: encrypt(''),
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.courierList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchChannelList() {
      const {data}: any = await useAPIFetch('/IS_PA_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_BRAND_CODE : encrypt(this.filters.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE : encrypt(this.filters.FLT_CHANNEL_CODE),
          FLT_INCLUDE_INACTIVE: encrypt('0'),
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.channelList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveLogisticsDetail(formData: any) {
      const {data}: any = await useAPIFetch('/IS_PA_COURIER_DETAIL_SET', {
        method: 'post',
        body: {
          FLT_COURIER_BRAND_CODE: encrypt(formData.FLT_COURIER_BRAND_CODE),
          FLT_COURIER_CHANNEL_CODE: encrypt(formData.FLT_COURIER_CHANNEL_CODE),
          FLT_COURIER_SID: encrypt(formData.FLT_COURIER_SID),
          FLT_COURIER_ACTIVE_YN: formData.FLT_COURIER_ACTIVE_YN ? encrypt('1') : encrypt('0'),
          FLT_COURIER_ERP_CODE: encrypt(formData.FLT_COURIER_ERP_CODE),
          FLT_COURIER_REMARK: encrypt(formData.FLT_COURIER_REMARK),
          FLT_COURIER_VALUE_01: encrypt(formData.FLT_COURIER_VALUE_01),
          FLT_COURIER_VALUE_02: encrypt(formData.FLT_COURIER_VALUE_02),
          FLT_COURIER_VALUE_03: encrypt(formData.FLT_COURIER_VALUE_03),
          FLT_COURIER_VALUE_04: encrypt(formData.FLT_COURIER_VALUE_04),
          FLT_COURIER_VALUE_05: encrypt(formData.FLT_COURIER_VALUE_05),
          FLT_COURIER_VALUE_06: encrypt(formData.FLT_COURIER_VALUE_06),
          FLT_COURIER_VALUE_07: encrypt(formData.FLT_COURIER_VALUE_07),
          FLT_COURIER_VALUE_08: encrypt(formData.FLT_COURIER_VALUE_08),
          FLT_COURIER_VALUE_09: encrypt(formData.FLT_COURIER_VALUE_09),
          FLT_COURIER_VALUE_10: encrypt(formData.FLT_COURIER_VALUE_10),
          USER_SID: encrypt(user.value?.USER_SID),
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
        message: data.value?.MSG || ''
      };
    }
  }
});
