import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const useChannelSettingsStore = defineStore('channel-settings', {
  state: () => ({
    channelList: [] as any,
    saChannelList: [] as any,
    brandList: [] as any,
    filters: {
      FLT_CHANNEL_CODE: '',
      FLT_BRAND_CODE: encrypt(''),
      FLT_INCLUDE_INACTIVE: "1",
    },
  }),
  getters: {
    getSAChannelList: (state: any) => state.saChannelList,
    getChannelList: (state: any) => state.channelList,
    getBrandList: (state: any) => state.brandList,
  },
  actions: {
    clearChannelList() {
      this.channelList = [];
    },
    async fetchChannelList() {
      const {data}: any = await useAPIFetch('/IS_PA_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_BRAND_CODE: encrypt(this.filters.FLT_BRAND_CODE) || encrypt(''),
          FLT_INCLUDE_INACTIVE: encrypt(this.filters.FLT_INCLUDE_INACTIVE),
          USER_SID: encrypt(user.value?.USER_SID),
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
    async fetchBrandList() {
      const {data}: any = await useAPIFetch('/IS_PA_BRAND_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INCLUDE_INACTIVE: encrypt("1"),
          FLT_BRAND_CODE: encrypt(""),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.brandList = [
        {
          BRAND_CODE: '',
          BRAND_FNAME: 'All',
        },
        ...data.value?.RESULT_DATA || [],
      ];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchSAChannelList() {
      const {data}: any = await useAPIFetch('/IS_SA_CHANNEL_LIST_GET', {
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

      this.saChannelList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveChannelDetail(formData: any) {
      const {data}: any = await useAPIFetch('/IS_PA_CHANNEL_DETAIL_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_CHANNEL_DESCR_ENG: encrypt(formData.FLT_CHANNEL_DESCR_ENG),
          FLT_CHANNEL_DESCR_KOR: encrypt(formData.FLT_CHANNEL_DESCR_KOR),
          FLT_CHANNEL_DESCR_CHN: encrypt(formData.FLT_CHANNEL_DESCR_CHN),
          FLT_CHANNEL_DESCR_JPN: encrypt(formData.FLT_CHANNEL_DESCR_JPN),
          FLT_CHANNEL_STOCK_RATE: encrypt(formData.FLT_CHANNEL_STOCK_RATE),
          FLT_CHANNEL_ACTIVE_YN: encrypt(formData.FLT_CHANNEL_ACTIVE_YN),
          FLT_CHANNEL_WMS_LINK_YN: encrypt(formData.FLT_CHANNEL_WMS_LINK_YN),
          FLT_CHANNEL_OPEN_DATE: encrypt(formData.FLT_CHANNEL_OPEN_DATE),
          FLT_CHANNEL_CLOSE_DATE: encrypt(formData.FLT_CHANNEL_CLOSE_DATE),
          FLT_CHANNEL_ERP_LINK_YN: encrypt(formData.FLT_CHANNEL_ERP_LINK_YN),
          FLT_CHANNEL_ERP_CODE: encrypt(formData.FLT_CHANNEL_ERP_CODE),
          FLT_CHANNEL_ERP_ORDER_TYPE: encrypt(formData.FLT_CHANNEL_ERP_ORDER_TYPE),
          FLT_CHANNEL_ERP_ID_FROM: encrypt(formData.FLT_CHANNEL_ERP_ID_FROM),
          FLT_CHANNEL_ERP_ID_TO: encrypt(formData.FLT_CHANNEL_ERP_ID_TO),
          FLT_CHANNEL_ERP_EXT_01: encrypt(formData.FLT_CHANNEL_ERP_EXT_01),
          FLT_CHANNEL_ERP_EXT_02: encrypt(formData.FLT_CHANNEL_ERP_EXT_02),
          FLT_CHANNEL_ERP_EXT_03: encrypt(formData.FLT_CHANNEL_ERP_EXT_03),
          FLT_CHANNEL_API_URL: encrypt(formData.FLT_CHANNEL_API_URL),
          FLT_CHANNEL_API_REDIRECT_URL: encrypt(formData.FLT_CHANNEL_API_REDIRECT_URL),
          FLT_CHANNEL_API_TOKEN_URL: encrypt(formData.FLT_CHANNEL_API_TOKEN_URL),
          FLT_CHANNEL_API_SECRET_KEY: encrypt(formData.FLT_CHANNEL_API_SECRET_KEY),
          FLT_CHANNEL_API_CLIENT_KEY: encrypt(formData.FLT_CHANNEL_API_CLIENT_KEY),
          FLT_CHANNEL_API_EXT_01: encrypt(formData.FLT_CHANNEL_API_EXT_01),
          FLT_CHANNEL_API_EXT_02: encrypt(formData.FLT_CHANNEL_API_EXT_02),
          FLT_CHANNEL_API_EXT_03: encrypt(formData.FLT_CHANNEL_API_EXT_03),
          FLT_CHANNEL_API_EXT_04: encrypt(formData.FLT_CHANNEL_API_EXT_04),
          FLT_CHANNEL_API_EXT_05: encrypt(formData.FLT_CHANNEL_API_EXT_05),
          FLT_CHANNEL_API_EXT_06: encrypt(formData.FLT_CHANNEL_API_EXT_06),
          FLT_CHANNEL_API_EXT_07: encrypt(formData.FLT_CHANNEL_API_EXT_07),
          FLT_CHANNEL_API_EXT_08: encrypt(formData.FLT_CHANNEL_API_EXT_08),
          FLT_CHANNEL_API_EXT_09: encrypt(formData.FLT_CHANNEL_API_EXT_09),
          FLT_CHANNEL_API_EXT_10: encrypt(formData.FLT_CHANNEL_API_EXT_10),
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
})
