import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const useWarehouseSettingsStore = defineStore('warehouse-settings', {
  state: () => ({
    warehouseList: [] as any,
    brandList: [] as any,
  }),
  getters: {
    getWarehouseList: (state: any) => state.warehouseList,
    getBrandList: (state: any) => state.brandList,
  },
  actions: {
    async fetchWarehouseList() {
      const {data}: any = await useAPIFetch('/IS_PA_WAREHOUSE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INCLUDE_INACTIVE: encrypt("1"),
          FLT_BRAND_CODE: encrypt(''),
          FLT_WH_USED_ECOMM_YN: encrypt(''),
          FLT_WH_USED_REGULAR_YN: encrypt(''),
          FLT_WH_CODE: encrypt(''),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.warehouseList = data.value?.RESULT_DATA || [];

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
          FLT_BRAND_CODE: encrypt(''),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.brandList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveWarehouseDetail(warehouseData: any) {
      const { data }: any = await useAPIFetch('/IS_PA_WAREHOUSE_DETAIL_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_CODE: encrypt(warehouseData.FLT_WH_CODE),
          FLT_WH_SNAME: encrypt(warehouseData.FLT_WH_SNAME),
          FLT_WH_FNAME: encrypt(warehouseData.FLT_WH_FNAME),
          FLT_WH_BRAND_CODE: encrypt(warehouseData.FLT_WH_BRAND_CODE),
          FLT_WH_GROUP_CODE: encrypt(warehouseData.FLT_WH_GROUP_CODE),
          FLT_WH_TYPE_CODE: encrypt(warehouseData.FLT_WH_TYPE_CODE),
          FLT_WH_USED_ECOMM_YN: warehouseData.FLT_WH_USED_ECOMM_YN ? encrypt('1') : encrypt('0'),
          FLT_WH_USED_REGULAR_YN: warehouseData.FLT_WH_USED_REGULAR_YN ? encrypt('1') : encrypt('0'),
          FLT_WH_OPEN_DATE: encrypt(warehouseData.FLT_WH_OPEN_DATE),
          FLT_WH_CLOSE_DATE: encrypt(warehouseData.FLT_WH_CLOSE_DATE),
          FLT_WH_ERP_CODE: encrypt(warehouseData.FLT_WH_ERP_CODE),
          FLT_WH_ACTIVE_YN: warehouseData.FLT_WH_ACTIVE_YN ? encrypt('1') : encrypt('0'),
          FLT_WH_REMARK: encrypt(warehouseData.FLT_WH_REMARK),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
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
