import { defineStore } from 'pinia'
import moment from "moment";
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const useNonMerchandisingItemsStore = defineStore('non-merchandising-items', {
  state: () => ({
    userGroupBrandList: [] as any[],
    nmdItemList: [] as any[],
    warehouseList: [] as any[],
    nmdInOutList: [] as any[],
    filters: {
      FLT_NMD_BRAND_CODE: '',
      FLT_NMD_CODE: '',
      FLT_NMD_PRODTYPE_CODE: '',
      FLT_NMD_STOCKTYPE_CODE: '',
      FLT_NMD_STOCK_FROM: '',
      FLT_NMD_STOCK_TO: '',
      FLT_NMD_KEY_WORD: '',
    },
    inOutFilters: {
      FLT_NMD_BRAND_CODE: '',
      FLT_NMD_CODE: '',
      FLT_NMD_IO_FROM_DATE: moment().format('YYYY-MM-DD'),
      FLT_NMD_IO_TO_DATE: moment().format('YYYY-MM-DD'),
      FLT_NMD_IO_STOCKTYPE_CODE: '',
      FLT_NMD_IO_TYPE_CODE: '',
    }
  }),
  getters: {
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getNmdItemList: (state) => state.nmdItemList,
    getWarehouseList: (state) => state.warehouseList,
    getNmdInOutList: (state) => state.nmdInOutList,
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
          message: data.value.MSG
        }
      }

      this.userGroupBrandList = data.value.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async fetchNonMerchandisingItemList() {
      const { data }: any = await useAPIFetch('/IS_OU_NMD_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NMD_BRAND_CODE: encrypt(this.filters.FLT_NMD_BRAND_CODE),
          FLT_NMD_CODE: encrypt(this.filters.FLT_NMD_CODE),
          FLT_NMD_PRODTYPE_CODE: encrypt(this.filters.FLT_NMD_PRODTYPE_CODE),
          FLT_NMD_STOCKTYPE_CODE: encrypt(this.filters.FLT_NMD_STOCKTYPE_CODE),
          FLT_NMD_STOCK_FROM: encrypt(this.filters.FLT_NMD_STOCK_FROM),
          FLT_NMD_STOCK_TO: encrypt(this.filters.FLT_NMD_STOCK_TO),
          FLT_NMD_KEY_WORD: encrypt(this.filters.FLT_NMD_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.nmdItemList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async saveNonMerchandisingItemDetails(data: any) {
      const { data: res }: any = await useAPIFetch('/IS_OU_NMD_DETAIL_SET', {
        method: 'post',
        body: {
          ...data,
          FLT_NMD_BRAND_CODE: encrypt(data.FLT_NMD_BRAND_CODE),
          FLT_NMD_CODE: encrypt(data.FLT_NMD_CODE),
          FLT_NMD_ALU: encrypt(data.FLT_NMD_ALU),
          FLT_NMD_EAN: encrypt(data.FLT_NMD_EAN),
          FLT_NMD_SNAME: encrypt(data.FLT_NMD_SNAME),
          FLT_NMD_FNAME: encrypt(data.FLT_NMD_FNAME),
          FLT_NMD_STATUS_CODE: encrypt(data.FLT_NMD_STATUS_CODE),
          FLT_NMD_PRODUCT_TYPE: encrypt(data.FLT_NMD_PRODUCT_TYPE),
          FLT_NMD_GROSS_WEIGHT: encrypt(data.FLT_NMD_GROSS_WEIGHT),
          FLT_NMD_NET_WEIGHT: encrypt(data.FLT_NMD_NET_WEIGHT),
          FLT_NMD_WEIGHT_UNIT: encrypt(data.FLT_NMD_WEIGHT_UNIT),
          FLT_NMD_UNIT_NAME: encrypt(data.FLT_NMD_UNIT_NAME),
          FLT_NMD_SIZE_CODE: encrypt(data.FLT_NMD_SIZE_CODE),
          FLT_NMD_SIZE_NAME: encrypt(data.FLT_NMD_SIZE_NAME),
          FLT_NMD_COLOR_CODE: encrypt(data.FLT_NMD_COLOR_CODE),
          FLT_NMD_COLOR_NAME: encrypt(data.FLT_NMD_COLOR_NAME),
          FLT_NMD_SEASON_YEAR: encrypt(data.FLT_NMD_SEASON_YEAR),
          FLT_NMD_SEASON_TYPE: encrypt(data.FLT_NMD_SEASON_TYPE),
          FLT_NMD_SEASON_DATE: encrypt(data.FLT_NMD_SEASON_DATE),
          FLT_NMD_STOCK_YN: encrypt(data.FLT_NMD_STOCK_YN),
          FLT_NMD_DESCR_1: encrypt(data.FLT_NMD_DESCR_1),
          FLT_NMD_DESCR_2: encrypt(data.FLT_NMD_DESCR_2),
          FLT_NMD_DESCR_3: encrypt(data.FLT_NMD_DESCR_3),
          FLT_NMD_DESCR_4: encrypt(data.FLT_NMD_DESCR_4),
          FLT_NMD_DESCR_5: encrypt(data.FLT_NMD_DESCR_5),
          FLT_NMD_DESCR_6: encrypt(data.FLT_NMD_DESCR_6),
          FLT_NMD_DESCR_7: encrypt(data.FLT_NMD_DESCR_7),
          FLT_NMD_DESCR_8: encrypt(data.FLT_NMD_DESCR_8),
          FLT_NMD_DESCR_9: encrypt(data.FLT_NMD_DESCR_9),
          USER_SID: encrypt(user.value?.USER_SID),
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
        message: res.value?.MSG
      };
    },
    async saveNonInOutDetails(data: any) {
      const { data: res }: any = await useAPIFetch('/IS_OU_NMD_INOUT_DETAIL_SET', {
        method: 'post',
        body: {
          ...data,
          USER_SID: encrypt(user.value?.USER_SID),
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
        message: res.value?.MSG
      };
    },
    async fetchWarehouseList(code: string) {
      const { data }: any = await useAPIFetch('/IS_PA_WAREHOUSE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_BRAND_CODE: code,
          FLT_INCLUDE_INACTIVE: encrypt('0'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.warehouseList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async fetchNonMerchandisingItemInOutList() {
      const { data }: any = await useAPIFetch('/IS_OU_NMD_INOUT_LIST_GET', {
        method: 'post',
        body: {
          ...this.inOutFilters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NMD_BRAND_CODE: encrypt(this.inOutFilters.FLT_NMD_BRAND_CODE),
          FLT_NMD_CODE: encrypt(this.inOutFilters.FLT_NMD_CODE),
          FLT_NMD_IO_FROM_DATE: encrypt(this.inOutFilters.FLT_NMD_IO_FROM_DATE),
          FLT_NMD_IO_TO_DATE: encrypt(this.inOutFilters.FLT_NMD_IO_TO_DATE),
          FLT_NMD_IO_STOCKTYPE_CODE: encrypt(this.inOutFilters.FLT_NMD_IO_STOCKTYPE_CODE),
          FLT_NMD_IO_TYPE_CODE: encrypt(this.inOutFilters.FLT_NMD_IO_TYPE_CODE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.nmdInOutList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    resetInOutFilters () {
      this.inOutFilters = {
        FLT_NMD_BRAND_CODE: '',
        FLT_NMD_CODE: '',
        FLT_NMD_IO_FROM_DATE: moment().format('YYYY-MM-DD'),
        FLT_NMD_IO_TO_DATE: moment().format('YYYY-MM-DD'),
        FLT_NMD_IO_STOCKTYPE_CODE: '',
        FLT_NMD_IO_TYPE_CODE: '',
      }

      this.nmdInOutList = [];
    },
    clearNmdItemList() {
      this.nmdItemList = [];
    }
  },
});
