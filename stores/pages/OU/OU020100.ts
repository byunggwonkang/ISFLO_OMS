import { defineStore } from 'pinia'
import moment from "moment/moment";
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

const getDefaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_BRAND_CODE: [],
  FLT_CATEGORY_CODE: '',
  FLT_SUB_CATEGORY_CODE: '',
  FLT_SUB_SUB_CATEGORY_CODE: '',
  FLT_DATE_CHECK: true,
  FLT_REGIST_START_DATE: moment().format('YYYY-MM') + "-01",
  FLT_REGIST_END_DATE: moment().format('YYYY-MM-DD'),
  FLT_STATUS_CODE: '',
  FLT_PRODUCT_NAME: '',
});

export const useSaleProductsStore = defineStore('sale-products', {
  state:() => ({
    productList: [] as any[],
    productCategoryList: [] as any[],
    productSubCategoryList: [] as any[],
    productSubSubCategoryList: [] as any[],
    productChannelCategoryList: [] as any[],
    productRelationalList: [] as any[],
    productItemsList: [] as any[],
    userGroupBrandList: [] as any[],
    filters: getDefaultFilters(),
    productDetail: {} as any,
    productChannel: {} as any,
    productOptionSetting: [] as any[],
  }),
  getters: {
    getUserGroupBrandList: (state) => state.userGroupBrandList,
    getProductList: (state) => state.productList,
    getProductCategoryList: (state) => state.productCategoryList,
    getProductSubCategoryList: (state) => state.productSubCategoryList,
    getProductSubSubCategoryList: (state) => state.productSubSubCategoryList,
    getProductDetail: (state) => state.productDetail,
    getProductChannel: (state) => state.productChannel,
    getProductOptionSetting: (state) => state.productOptionSetting,
    getProductChannelCategoryList: (state) => state.productChannelCategoryList,
    getProductRelationalList: (state) => state.productRelationalList,
    getProductItemsList: (state) => state.productItemsList,
  },
  actions: {
    async fetchProductList() {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_BRAND_CODE: this.filters.FLT_BRAND_CODE.map((BRAND) => encrypt(BRAND)),
          FLT_CATEGORY_CODE: encrypt(this.filters.FLT_CATEGORY_CODE),
          FLT_SUB_CATEGORY_CODE: encrypt(this.filters.FLT_SUB_CATEGORY_CODE),
          FLT_SUB_SUB_CATEGORY_CODE: encrypt(this.filters.FLT_SUB_SUB_CATEGORY_CODE),
          FLT_REGIST_START_DATE: this.filters.FLT_DATE_CHECK ? encrypt(this.filters.FLT_REGIST_START_DATE) : encrypt('') ,
          FLT_REGIST_END_DATE: this.filters.FLT_DATE_CHECK ? encrypt(this.filters.FLT_REGIST_END_DATE) : encrypt('') ,
          FLT_STATUS_CODE: encrypt(this.filters.FLT_STATUS_CODE),
          FLT_PRODUCT_NAME: encrypt(this.filters.FLT_PRODUCT_NAME),
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
    async fetchProductCategoryList(code: any) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_CATEGORY_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          CATEGORY_CODE: code?.categoryCode ? encrypt(code?.categoryCode) : encrypt('') ,
          SUB_CATEGORY_CODE: code?.subCategoryCode ? encrypt(code?.subCategoryCode) : encrypt('') ,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      if (code?.categoryCode === '' && code?.subCategoryCode === '') {
        this.productCategoryList = data.value?.RESULT_DATA ?? [];
      } else if (code?.categoryCode !== '' && code?.subCategoryCode === '') {
        this.productSubCategoryList = data.value?.RESULT_DATA ?? [];
      } else if (code?.categoryCode !== '' && code?.subCategoryCode !== '') {
        this.productSubSubCategoryList = data.value?.RESULT_DATA ?? [];
      }

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
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
    async fetchProductDetail(id: string) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_DETAIL_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          PRODUCT_SID: id
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.productDetail = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    },
    async saveProductDetail(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_DETAIL_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          ...formData,
          PRODUCT_SID: formData?.PRODUCT_SID ? encrypt(formData?.PRODUCT_SID) : encrypt('') ,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG,
        data: {
          PRODUCT_SID: data.value.PRODUCT_SID
        }
      };
    },
    async fetchProductChannel(channelData: object, url : string = '/IS_OU_PRODUCT_CHANNEL_10001_GET') {
      const { data }: any = await useAPIFetch(url, {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          ...channelData,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      this.productChannel = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    },
    async fetchProductOptionSetting(id: string) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_OPTION_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          PRODUCT_SID: id,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      this.productOptionSetting = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    },
    async saveProductOptionSetting(formData: object) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_OPTION_SET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          ...formData,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    },
    async fetchProductChannelCategoryList(channelData: object) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_CHANNEL_CATEGORY_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          ...channelData,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      this.productChannelCategoryList = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    },
    async fetchProductRelationalList(channelData: object) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_RELATIONAL_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          ...channelData,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      this.productRelationalList = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    },
    async saveProductChannel(formData: object, url: string = '/IS_OU_PRODUCT_CHANNEL_10001_SET') {
      const { data }: any = await useAPIFetch(url, {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          ...formData,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    },
    async fetchProductItemsList(id: string) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_ITEMS_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          PRODUCT_SID: id,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      this.productItemsList = data.value?.RESULT_DATA;

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    },
    async saveProductItemsList(formData: object) {
      const { data }: any = await useAPIFetch('/IS_OU_PRODUCT_ITEMS_SET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          ...formData,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG,
          data: null
        }
      }

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA
      };
    }
  },
});
