import { defineStore } from 'pinia'
import moment from "moment";
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

export const useStoreSettingsStore = defineStore('store-settings', {
  state: () => ({
    storeList: [] as any,
    userGroupBrandList: [] as any[],
    filters: {
      FLT_BRAND_CODE: '',
      FLT_STORE_CODE: '',
      FLT_STORE_SNAME: '',
      FLT_INCLUDE_INACTIVE: "1",
      FLT_DATE_CHECK: true,
      FLT_OPEN_FROM_DATE: moment().format('YYYY-MM') + "-01",
      FLT_OPEN_TO_DATE: moment().format('YYYY-MM-DD'),
    },
  }),
  getters: {
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getStoreList: (state: any) => state.storeList,
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

      this.userGroupBrandList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    clearStoreList() {
      this.storeList = [];
    },
    async fetchStoreList() {
      const {data}: any = await useAPIFetch('/IS_PA_STORE_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_BRAND_CODE: encrypt(this.filters.FLT_BRAND_CODE),
          FLT_STORE_CODE: encrypt(this.filters.FLT_STORE_CODE),
          FLT_STORE_SNAME: encrypt(this.filters.FLT_STORE_SNAME),
          FLT_INCLUDE_INACTIVE: encrypt(this.filters.FLT_INCLUDE_INACTIVE),
          FLT_OPEN_FROM_DATE: this.filters.FLT_DATE_CHECK ? encrypt(this.filters.FLT_OPEN_FROM_DATE) : encrypt('') ,
          FLT_OPEN_TO_DATE: this.filters.FLT_DATE_CHECK ? encrypt(this.filters.FLT_OPEN_TO_DATE) : encrypt('') ,
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
    async saveStoreDetail(storeData: any) {
      const { data }: any = await useAPIFetch('/IS_PA_STORE_DETAIL_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STORE_SID: encrypt(storeData.FLT_STORE_SID),
          FLT_BRAND_CODE: encrypt(storeData.FLT_BRAND_CODE),
          FLT_STORE_CODE: encrypt(storeData.FLT_STORE_CODE),
          FLT_STORE_DNAME: encrypt(storeData.FLT_STORE_DNAME),
          FLT_STORE_SNAME_ENG: encrypt(storeData.FLT_STORE_SNAME_ENG),
          FLT_STORE_FNAME_ENG: encrypt(storeData.FLT_STORE_FNAME_ENG),
          FLT_STORE_SNAME_KOR: encrypt(storeData.FLT_STORE_SNAME_KOR),
          FLT_STORE_FNAME_KOR: encrypt(storeData.FLT_STORE_FNAME_KOR),
          FLT_STORE_SNAME_CHN: encrypt(storeData.FLT_STORE_SNAME_CHN),
          FLT_STORE_FNAME_CHN: encrypt(storeData.FLT_STORE_FNAME_CHN),
          FLT_STORE_SNAME_JPN: encrypt(storeData.FLT_STORE_SNAME_JPN),
          FLT_STORE_FNAME_JPN: encrypt(storeData.FLT_STORE_FNAME_JPN),
          FLT_STORE_LOGIN_ID: encrypt(storeData.FLT_STORE_LOGIN_ID),
          FLT_STORE_EMAIL: encrypt(storeData.FLT_STORE_EMAIL),
          FLT_STORE_TEL: encrypt(storeData.FLT_STORE_TEL),
          FLT_STORE_USER_GROUP_CODE: encrypt(storeData.FLT_STORE_USER_GROUP_CODE),
          FLT_STORE_COUNTRY_CODE: encrypt(storeData.FLT_STORE_COUNTRY_CODE),
          FLT_STORE_LANGUAGE: encrypt(storeData.FLT_STORE_LANGUAGE),
          FLT_STORE_ADDRESS_1: encrypt(storeData.FLT_STORE_ADDRESS_1),
          FLT_STORE_ADDRESS_2: encrypt(storeData.FLT_STORE_ADDRESS_2),
          FLT_STORE_TYPE_CODE: encrypt(storeData.FLT_STORE_TYPE_CODE),
          FLT_STORE_STATUS_CODE: encrypt(storeData.FLT_STORE_STATUS_CODE),
          FLT_STORE_REMARK: encrypt(storeData.FLT_STORE_REMARK),
          FLT_STORE_ONLINE_YN: storeData.FLT_STORE_ONLINE_YN ? encrypt('1') : encrypt('0'),
          FLT_STORE_ACTIVE_YN: storeData.FLT_STORE_ACTIVE_YN ? encrypt('1') : encrypt('0'),
          FLT_STORE_OPEN_DATE: encrypt(storeData.FLT_STORE_OPEN_DATE),
          FLT_STORE_CLOSE_DATE: encrypt(storeData.FLT_STORE_CLOSE_DATE),
          FLT_STORE_DEPARTMENTSTORE_CODE: encrypt(storeData.FLT_STORE_DEPARTMENTSTORE_CODE),         
          
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
