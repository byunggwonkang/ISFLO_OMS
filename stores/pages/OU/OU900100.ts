import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());
import moment from "moment";
const defaultFilters = () => ({
  USER_SID: encrypt(user.value?.USER_SID),
  FLT_BRAND_CODE: '',
  FLT_ORDER_FROM_DATE: moment().format('YYYY-MM-DD'),
  FLT_ORDER_TO_DATE: moment().format('YYYY-MM-DD'),
  FLT_REPORT_TYPE: '0'
});

export const useSalesReportsStore = defineStore('sales-report', {
  state: () => ({
    userGroupBrandList: [] as any[],
    filters: defaultFilters(),
  }),
  getters: {
    getUserGroupBrandList: (state) => state.userGroupBrandList,
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
    async fetchReportDailyList() {
      const { data }: any = await useAPIFetch('/IS_OU_REPORT_DAILY_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          FLT_BRAND_CODE: encrypt(this.filters.FLT_BRAND_CODE),
          FLT_ORDER_FROM_DATE: encrypt(this.filters.FLT_ORDER_FROM_DATE),
          FLT_ORDER_TO_DATE: encrypt(this.filters.FLT_ORDER_TO_DATE),
          FLT_REPORT_TYPE: encrypt(this.filters.FLT_REPORT_TYPE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
  }
});
