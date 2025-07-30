import { defineStore } from 'pinia'
const { user } = storeToRefs(useAuthStore());

export const useStockOfProductsStore = defineStore('stock-of-products', {
  state: () => ({
    userGroupBrandList: [] as any[],
    productStockList: [] as any[],
    filters: {
      FLT_BRAND_CODE: '',
      FLT_KEY_WORD: '',
      FLT_INCLUDE_STOCK: '1',
      FLT_STOCK_FROM: '',
      FLT_STOCK_TO: '',
    }
  }),
  getters: {
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getProductStockList: (state) => state.productStockList,
  },
  actions: {
    async fetchUserGroupBrandList() {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_BRAND_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
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
    async fetchProductStockList() {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_STOCK_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: user.value?.USER_SID,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.productStockList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    clearProductStockList() {
      this.productStockList = [];
    }
  }
})
