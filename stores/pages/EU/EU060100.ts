import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
import {notify} from "notiwind";
const { user } = storeToRefs(useAuthStore());
import moment from "moment";

const getDefaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_WH_CODE: '',
  FLT_BRAND_CODE: '',
  FLT_CHANNEL_CODE: '',
  FLT_DATE_TYPE: '',
  FLT_DATE_FROM: moment().format('YYYY-MM-DD'),
  FLT_DATE_TO: moment().format('YYYY-MM-DD'),
  FLT_KEY_WORD: '',
});

export const useCSManagementStore = defineStore('cs-management', {
  state() {
    return {
      WHList: [] as any[],
      ChannelList: [] as any[],
      filters: getDefaultFilters(),
      CSDetailList: [] as any[],
    }
  },
  actions: {
    resetChannelList() {
      this.ChannelList = [];
    },
    async fetchWHList() {
      const { data }: any = await useAPIFetch('/IS_EU_WAREHOUSE_LIST_GET', {
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
    this.WHList = data.value?.RESULT_DATA || [];
    return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchChannelList(FLT_WH_CODE: any) {
      const { data }: any = await useAPIFetch('/IS_EU_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_CODE: encrypt(FLT_WH_CODE),
          FLT_INCLUDE_INACTIVE: encrypt('0')
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.ChannelList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    }
  }
})
