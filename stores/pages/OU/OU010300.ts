import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

const defaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_BRAND_CODE: '',
  FLT_ITEM_CODE: '',
  FLT_KEY_WORD: '',
  FLT_INCLUDE_INACTIVE: '0',
  FLT_INCLUDE_STOCK: '1',
  FLT_STOCK_FROM: '1',
  FLT_STOCK_TO: '',
});

export const useStockOfOriginalItemsStore = defineStore('stock-of-original-items', {
  state: () => ({
    userGroupBrandList: [] as any[],
    warehouseList: [] as any[],
    itemList: [] as any[],
    filters: defaultFilters(),
  }),
  getters: {
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getWarehouseList: (state) => state.warehouseList,
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

      this.userGroupBrandList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchWarehouseList() {
      const { data }: any = await useAPIFetch('/IS_PA_WAREHOUSE_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_BRAND_CODE: encrypt(this.filters.FLT_BRAND_CODE),
          FLT_ITEM_CODE: encrypt(this.filters.FLT_ITEM_CODE),
          FLT_KEY_WORD: encrypt(this.filters.FLT_KEY_WORD),
          FLT_INCLUDE_INACTIVE: encrypt(this.filters.FLT_INCLUDE_INACTIVE),
          FLT_INCLUDE_STOCK: encrypt(this.filters.FLT_INCLUDE_STOCK),
          FLT_STOCK_FROM: encrypt(this.filters.FLT_STOCK_FROM),
          FLT_STOCK_TO: encrypt(this.filters.FLT_STOCK_TO),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.warehouseList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchItemList() {
      const { data }: any = await useAPIFetch('/IS_OU_ITEM_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_BRAND_CODE: encrypt(this.filters.FLT_BRAND_CODE),
          FLT_ITEM_CODE: encrypt(this.filters.FLT_ITEM_CODE),
          FLT_KEY_WORD: encrypt(this.filters.FLT_KEY_WORD),
          FLT_INCLUDE_INACTIVE: encrypt(this.filters.FLT_INCLUDE_INACTIVE),
          FLT_INCLUDE_STOCK: encrypt(this.filters.FLT_INCLUDE_STOCK),
          FLT_STOCK_FROM: encrypt(this.filters.FLT_STOCK_FROM),
          FLT_STOCK_TO: encrypt(this.filters.FLT_STOCK_TO),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.itemList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    clearItemList() {
      this.itemList = [];
    }
  }
});
