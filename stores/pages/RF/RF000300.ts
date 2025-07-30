import { defineStore } from 'pinia'
import {notify} from "notiwind";
import moment from "moment";
const { user } = storeToRefs(useAuthStore());

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    noticeList: [] as any,
    userStoreList: [] as any,
    filters: {
      FLT_NOTICE_NEW_YN: true as any,
      FLT_NOTICE_STATUS_CODE: '',
      FLT_NOTICE_DATE_FROM: moment().format('YYYY-MM-DD'),
      FLT_NOTICE_DATE_TO: moment().format('YYYY-MM-DD'),
      FLT_NOTICE_KEYWORD: '',
    }
  }),
  getters: {
    getNoticeList: (state: any) => state.noticeList,
    getUserStoreList: (state: any) => state.userStoreList,
  },
  actions: {
    async fetchNoticeList() {
      const {data}: any = await useAPIFetch('/IS_GNR_NOTICE_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: user.value?.USER_SID,
          FLT_NOTICE_DATE_FROM: this.filters.FLT_NOTICE_NEW_YN === '1' ? '' : this.filters.FLT_NOTICE_DATE_FROM,
          FLT_NOTICE_DATE_TO: this.filters.FLT_NOTICE_NEW_YN === '1' ? '' : this.filters.FLT_NOTICE_DATE_TO,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.noticeList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async fetchUserStoreList() {
      const {data}: any = await useAPIFetch('/IS_GNR_USER_STORE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          FLT_INCLUDE_INACTIVE: "0"
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.userStoreList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async saveNoticeDetail(noticeData: any) {
      const {data}: any = await useAPIFetch('/IS_GNR_NOTICE_DETAIL_SET', {
        method: 'post',
        body: {
          ...noticeData,
          USER_SID: user.value?.USER_SID,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      notify(
        {
          group: 'success',
          title: 'Success',
          text: data.value?.MSG || '',
        },
        4000
      )

      return {
        success: true,
        message: data.value?.MSG
      };
    },
    async fetchNoticeDetail(id: string) {
      const {data}: any = await useAPIFetch('/IS_GNR_NOTICE_DETAIL_GET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          FLT_NOTICE_SID: id,
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      return {
        success: true,
        message: data.value?.MSG,
        data: data.value?.RESULT_DATA || {},
      };
    },
    async setAsReadNotice(id: string) {
      const {data}: any = await useAPIFetch('/IS_GNR_NOTICE_READ_SET', {
        method: 'post',
        body: {
          USER_SID: user.value?.USER_SID,
          FLT_NOTICE_SID: id,
          FLT_NOTICE_READ_YN: '1',
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      return {
        success: true,
        message: data.value?.MSG
      };
    }
  },
});
