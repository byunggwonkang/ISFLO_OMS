import { defineStore } from 'pinia'
import {notify} from "notiwind";
const { user } = storeToRefs(useAuthStore());
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'

const defaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_PROM_SID: '',
  FLT_PROM_BRAND_CODE: '',
  FLT_PROM_CHANNEL_CODE: [],
  FLT_PROM_TYPE_CODE: [],
  FLT_PROM_DATE_START: moment().format('YYYY-MM-DD'),
  FLT_PROM_DATE_END: moment().format('YYYY-MM-DD'),
  FLT_PROM_STATUS_CODE: [],
  FLT_PROM_TITLE: '',
});

export const usePromotionManagementStore = defineStore('promotion-management', {
  state() {
    return {
      productList: [] as any[],
      channelList: [] as any,
      brandList: [] as any,
      promotionList: [] as any,
      filters: defaultFilters(),
      userGroupChannelList: [] as any[],
      nmdItemList: [] as any[],
      itemList: [] as any[],
      orderList: [] as any[],
      nmdFilters: {
        FLT_NMD_BRAND_CODE: '',
        FLT_NMD_CODE: '',
        FLT_NMD_PRODTYPE_CODE: '',
        FLT_NMD_STOCKTYPE_CODE: '',
        FLT_NMD_STOCK_FROM: '',
        FLT_NMD_STOCK_TO: '',
        FLT_NMD_KEY_WORD: '',
      },
      originalItemFilters: {
        FLT_BRAND_CODE: '',
        FLT_ITEM_CODE: '',
        FLT_KEY_WORD: '',
        FLT_INCLUDE_INACTIVE: '0',
        FLT_INCLUDE_STOCK: '0',
        FLT_STOCK_FROM: '',
        FLT_STOCK_TO: '',
      },
      productListFilters: {
        FLT_BRAND_CODE: [],
        FLT_CATEGORY_CODE: '',
        FLT_SUB_CATEGORY_CODE: '',
        FLT_SUB_SUB_CATEGORY_CODE: '',
        FLT_REGIST_START_DATE: '',
        FLT_REGIST_END_DATE: '',
        FLT_STATUS_CODE: '',
        FLT_PRODUCT_NAME: '',
      },
      orderListFilters: {
        FLT_PROM_SID: '',
        FLT_VIEW_OPT: '',
        FLT_SPLIT_OPT: '',
        FLT_CHANNELS: [],
        FLT_STATUS: [],
        FLT_DATE_FROM: moment().format('YYYY-MM-DD'),
        FLT_DATE_TO: moment().format('YYYY-MM-DD'),
      },
    }
  },
  actions: {
    clearPromotionList() {
      this.promotionList = [];
    },
    clearNmdItemList() {
      this.nmdItemList = [];
    },
    clearItemList() {
      this.itemList = [];
    },
    clearProductList() {
      this.productList = [];
    },
    clearOrderList() {
      this.orderList = [];
    },
    async fetchOrderList() {
      const { data }: any = await useAPIFetch('/IS_OU_PROMOTION_ORDER_LIST_GET', {
        method: 'post',
        body: {
          ...this.orderListFilters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_PROM_SID: encrypt(this.orderListFilters.FLT_PROM_SID),
          FLT_VIEW_OPT: encrypt(this.orderListFilters.FLT_VIEW_OPT),
          FLT_SPLIT_OPT: encrypt(this.orderListFilters.FLT_SPLIT_OPT),
          FLT_CHANNELS: this.orderListFilters.FLT_CHANNELS.map((CHANNEL) => encrypt(CHANNEL)),
          FLT_STATUS: this.orderListFilters.FLT_STATUS.map((STATUS) => encrypt(STATUS)),
          FLT_DATE_FROM: encrypt(this.orderListFilters.FLT_DATE_FROM),
          FLT_DATE_TO: encrypt(this.orderListFilters.FLT_DATE_TO),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.orderList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchProductList() {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_LIST_GET', {
        method: 'post',
        body: {
          ...this.productListFilters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_BRAND_CODE: this.productListFilters.FLT_BRAND_CODE.map((BRAND) => encrypt(BRAND)),
          FLT_CATEGORY_CODE: encrypt(this.productListFilters.FLT_CATEGORY_CODE),
          FLT_SUB_CATEGORY_CODE: encrypt(this.productListFilters.FLT_SUB_CATEGORY_CODE),
          FLT_SUB_SUB_CATEGORY_CODE: encrypt(this.productListFilters.FLT_SUB_SUB_CATEGORY_CODE),
          FLT_REGIST_START_DATE: encrypt(this.productListFilters.FLT_REGIST_START_DATE),
          FLT_REGIST_END_DATE: encrypt(this.productListFilters.FLT_REGIST_END_DATE),
          FLT_STATUS_CODE: encrypt(this.productListFilters.FLT_STATUS_CODE),
          FLT_PRODUCT_NAME: encrypt(this.productListFilters.FLT_PRODUCT_NAME),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.productList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchItemList() {
      const { data }: any = await useAPIFetch('/IS_OU_ITEM_LIST_GET', {
        method: 'post',
        body: {
          ...this.originalItemFilters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_BRAND_CODE: encrypt(this.originalItemFilters.FLT_BRAND_CODE),
          FLT_ITEM_CODE: encrypt(this.originalItemFilters.FLT_ITEM_CODE),
          FLT_KEY_WORD: encrypt(this.originalItemFilters.FLT_KEY_WORD),
          FLT_INCLUDE_INACTIVE: encrypt(this.originalItemFilters.FLT_INCLUDE_INACTIVE),
          FLT_INCLUDE_STOCK: encrypt(this.originalItemFilters.FLT_INCLUDE_STOCK),
          FLT_STOCK_FROM: encrypt(this.originalItemFilters.FLT_STOCK_FROM),
          FLT_STOCK_TO: encrypt(this.originalItemFilters.FLT_STOCK_TO),
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
    async fetchNonMerchandisingItemList() {
      const { data }: any = await useAPIFetch('/IS_OU_NMD_LIST_GET', {
        method: 'post',
        body: {
          ...this.nmdFilters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NMD_BRAND_CODE: encrypt(this.nmdFilters.FLT_NMD_BRAND_CODE),
          FLT_NMD_CODE: encrypt(this.nmdFilters.FLT_NMD_CODE),
          FLT_NMD_PRODTYPE_CODE: encrypt(this.nmdFilters.FLT_NMD_PRODTYPE_CODE),
          FLT_NMD_STOCKTYPE_CODE: encrypt(this.nmdFilters.FLT_NMD_STOCKTYPE_CODE),
          FLT_NMD_STOCK_FROM: encrypt(this.nmdFilters.FLT_NMD_STOCK_FROM),
          FLT_NMD_STOCK_TO: encrypt(this.nmdFilters.FLT_NMD_STOCK_TO),
          FLT_NMD_KEY_WORD: encrypt(this.nmdFilters.FLT_NMD_KEY_WORD),
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
    async fetchUserGroupChannelList() {
      const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_CHANNEL_LIST_GET', {
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

      this.userGroupChannelList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchChannelList() {
      const {data}: any = await useAPIFetch('/IS_PA_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          FLT_BRAND_CODE: encrypt(this.filters.FLT_PROM_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(''),
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_INCLUDE_INACTIVE: encrypt(''),
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
          FLT_INCLUDE_INACTIVE: encrypt("0"),
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
    async fetchPromotionList() {
      const {data}: any = await useAPIFetch('/IS_OU_PROMOTION_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_PROM_SID: encrypt(this.filters.FLT_PROM_SID),
          FLT_PROM_BRAND_CODE: encrypt(this.filters.FLT_PROM_BRAND_CODE),
          FLT_PROM_CHANNEL_CODE: this.filters.FLT_PROM_CHANNEL_CODE.map((CHANNEL) => encrypt(CHANNEL)),
          FLT_PROM_TYPE_CODE: this.filters.FLT_PROM_TYPE_CODE.map((TYPES) => encrypt(TYPES)),
          FLT_PROM_DATE_START: encrypt(this.filters.FLT_PROM_DATE_START),
          FLT_PROM_DATE_END: encrypt(this.filters.FLT_PROM_DATE_END),
          FLT_PROM_STATUS_CODE: this.filters.FLT_PROM_STATUS_CODE.map((STATUS) => encrypt(STATUS)),
          FLT_PROM_TITLE: encrypt(this.filters.FLT_PROM_TITLE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.promotionList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async savePromotion(promotionData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_PROMOTION_DETAIL_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),          
          FLT_PROM_SID : encrypt(promotionData.FLT_PROM_SID),
          FLT_PROM_TITLE : encrypt(promotionData.FLT_PROM_TITLE),
          FLT_PROM_DESCRIPTION : encrypt(promotionData.FLT_PROM_DESCRIPTION),
          FLT_PROM_BRAND_CODE : encrypt(promotionData.FLT_PROM_BRAND_CODE),
          FLT_PROM_STATUS_CODE : encrypt(promotionData.FLT_PROM_STATUS_CODE),
          FLT_PROM_START_DATE : encrypt(promotionData.FLT_PROM_START_DATE),
          FLT_PROM_END_DATE : encrypt(promotionData.FLT_PROM_END_DATE),
          FLT_PROM_TEXT_NOTICE : encrypt(promotionData.FLT_PROM_TEXT_NOTICE),
          FLT_PROM_REMARK : encrypt(promotionData.FLT_PROM_REMARK),
          FLT_PROM_CONDITION_AMT_YN : encrypt(promotionData.FLT_PROM_CONDITION_AMT_YN),
          FLT_PROM_CONDITION_AMT_VALUE : encrypt(promotionData.FLT_PROM_CONDITION_AMT_VALUE),
          FLT_PROM_CONDITION_PROD_YN : promotionData.FLT_PROM_CONDITION_YN === '1' ? encrypt(promotionData.FLT_PROM_CONDITION_PROD_YN) : encrypt('0'), 
          FLT_PROM_CONDITION_ITEM_YN : promotionData.FLT_PROM_CONDITION_YN === '1' ? encrypt(promotionData.FLT_PROM_CONDITION_ITEM_YN) : encrypt('0'), 
          FLT_PROM_CONDITION_PROD_LIST : promotionData.FLT_PROM_CONDITION_PROD_LIST,
          FLT_PROM_CONDITION_ITEM_LIST : promotionData.FLT_PROM_CONDITION_ITEM_LIST,
          FLT_PRODUCT_CHANNEL : promotionData.FLT_PRODUCT_CHANNEL,
          FLT_PROM_ITEM_LIST : promotionData.FLT_PROM_ITEM_LIST,
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
        message: data.value.MSG
      };
    }
  }
})
