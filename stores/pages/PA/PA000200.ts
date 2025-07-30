import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const useBrandSettingsStore = defineStore('brand-settings', {
  state: () => ({
    brandList: [] as any,
    filters: {
      FLT_BRAND_CODE: encrypt(''),
      FLT_BRAND_NAME: encrypt(''),
      FLT_INCLUDE_INACTIVE: encrypt("1"),
    },
  }),
  getters: {
    getBrandList: (state: any) => state.brandList,
  },
  actions: {
    async fetchBrandList() {
      const {data}: any = await useAPIFetch('/IS_PA_BRAND_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.brandList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveBrandDetail(brandData: any) {
      const { data }: any = await useAPIFetch('/IS_PA_BRAND_DETAIL_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_SAVE_TYPE: encrypt(brandData.FLT_SAVE_TYPE),
          FLT_BRAND_CODE: encrypt(brandData.FLT_BRAND_CODE),
          FLT_BRAND_SNAME_ENG: encrypt(brandData.FLT_BRAND_SNAME_ENG),
          FLT_BRAND_FNAME_ENG: encrypt(brandData.FLT_BRAND_FNAME_ENG),
          FLT_BRAND_SNAME_KOR: encrypt(brandData.FLT_BRAND_SNAME_KOR),
          FLT_BRAND_FNAME_KOR: encrypt(brandData.FLT_BRAND_FNAME_KOR),
          FLT_BRAND_SNAME_CHN: encrypt(brandData.FLT_BRAND_SNAME_CHN),
          FLT_BRAND_FNAME_CHN: encrypt(brandData.FLT_BRAND_FNAME_CHN),
          FLT_BRAND_SNAME_JPN: encrypt(brandData.FLT_BRAND_SNAME_JPN),
          FLT_BRAND_FNAME_JPN: encrypt(brandData.FLT_BRAND_FNAME_JPN),
          FLT_GLOBAL_CODE: encrypt(brandData.FLT_GLOBAL_CODE),
          FLT_BRAND_ACTIVE: brandData.FLT_BRAND_ACTIVE_YN ? encrypt('1') : encrypt('0'),
          FLT_BRAND_REMARK: encrypt(brandData.FLT_BRAND_REMARK),
          
          
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: data.value?.MSG || '',
        }, 4000)

        return {
          success: false,
          message: data.value.MSG
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
