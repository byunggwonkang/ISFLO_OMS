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

export const useShipmentInspectionStore = defineStore('shipment-inspection', {
  state() {
    return {
      StationList: [] as any[],
      WorkStaffList: [] as any[],
      STATION_USER_SID: {} as any,
      orderSummaryList: [] as any[],
      orderStatusList: [] as any[],
      orderList: [] as any[],

      orderListFilters: {
        FLT_STATION_USER_SID: '',
        FLT_CHANNEL_CODE: '',
        FLT_ORDER_SID: '',
        FLT_KEY_WORD: '',
      },
      orderDetailInfo: {} as any,
      orderDetailInfoOperationNote: [] as any[],
      orderPackingItemList: [] as any[],
    }
  },
  getters: {    
    getOrderDetailInfoOperationNote: (state) => state.orderDetailInfoOperationNote,
  },
  actions: {
    clearOrderList() {
      this.orderList = [];
    },
    clearOrderPackingItemList() {
      this.orderPackingItemList = [];
    },
    clearOrderDetailInfo() {
      this.orderDetailInfo = {};
    },
    clearOrderOperationNote() {
      this.orderDetailInfoOperationNote = [];
    },
    async fetchStationList() {
      const { data }: any = await useAPIFetch('/IS_EU_STATION_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_USER_SID:encrypt(''),
          FLT_INCLUDE_INACTIVE:encrypt('0'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.StationList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchWorkStaffList() {
      const {data}: any = await useAPIFetch('/IS_EU_STAFF_DAILY_LIST_GET', {
        method: 'post',
        body: {
          FLT_WORK_DATE_FROM:encrypt( moment().format('YYYY-MM-DD')),
          FLT_WORK_DATE_TO: encrypt(moment().format('YYYY-MM-DD')),
          FLT_JOB_TYPE_CODE: encrypt('0010'),
          FLT_INCLUDE_INCATIVE: encrypt(''),
          FLT_KEY_WORD: encrypt(''),
          USER_SID: encrypt(user.value?.USER_SID)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }
      if (data.value?.RESULT_DATA.length > 0){ this.WorkStaffList = data.value?.RESULT_DATA[0].STAFF_LIST || []; }
      else{this.WorkStaffList = [];}
      

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchOrderSummaryList() {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_SUMMARY_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(this.STATION_USER_SID)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.orderSummaryList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderStatusList() {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_STATUS_LIST_GET', {
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

      this.orderStatusList = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderList(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_LIST_GET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
          FLT_KEY_WORD: encrypt(formData.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.orderList = data.value.RESULT_DATA || [];

      return {
        success: true,
        message: data.value.MSG,
        data: data.value.RESULT_DATA
      };
    },
    async fetchOrderDetailInfo(orderSID: string) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_ORDER_SID: orderSID
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.orderDetailInfo = data.value.RESULT_DATA;

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderDetailInfoOperationNote(orderSID: string) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_NOTE_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_ORDER_SID: encrypt(orderSID),
          FLT_NOTE_TYPE: encrypt('O'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.orderDetailInfoOperationNote = data.value.RESULT_DATA;
      return {
        success: true,
        message: data.value.MSG
      };
    },
    async addOrderOperationNote(formData: any) {
      const { data }: any = await useAPIFetch('/IS_OU_ORDER_DETAIL_INFO_NOTE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_NOTE_TYPE: encrypt('O'),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
          FLT_NOTE: encrypt(formData.FLT_NOTE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        };
      }

      this.orderDetailInfoOperationNote = data.value.RESULT_DATA;

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value.MSG
      };
    },
    async fetchOrderStatusChange(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_STATUS_CHANGE_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
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
    },
    async fetchOrderSubStatusChange(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_SUBSTATUS_CHANGE_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
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
    },
    async fetchOrderItemInputSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_ITEM_INPUT_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),


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

      this.orderPackingItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchOrderItemInputADDSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_ITEM_INPUT_ADD_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
          FLT_ITEM_CODE: encrypt(formData.FLT_ITEM_CODE),
          FLT_WAYBILL_NO: encrypt(formData.FLT_WAYBILL_NO),
          FLT_INPUT_TYPE_CODE: encrypt(formData.FLT_INPUT_TYPE_CODE),
          FLT_STAFF_SID: encrypt(formData.FLT_STAFF_SID),
          FLT_QAVIEW_ID: encrypt(formData.FLT_QAVIEW_ID),
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

      this.orderPackingItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchOrderItemInputResetSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_ITEM_INPUT_RESET_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
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
    },
    async fetchOrderItemInputClearSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_ITEM_INPUT_CLEAR_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
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
    },
    async fetchOrderStatusPackedSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_STATUS_PACKED_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
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
    },
    async fetchOrderItemInputGet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_ITEM_INPUT_GET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(formData.FLT_STATION_USER_SID),
          FLT_BRAND_CODE: encrypt(formData.FLT_BRAND_CODE),
          FLT_CHANNEL_CODE: encrypt(formData.FLT_CHANNEL_CODE),
          FLT_ORDER_SID: encrypt(formData.FLT_ORDER_SID),
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

      this.orderPackingItemList = data.value.RESULT_DATA || [];

      notify({
        group: 'success',
        title: 'Success',
        text: data.value?.MSG || '',
      }, 4000)

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchOrderWaybillDeleteSet(formData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_ORDER_WAYBILL_DELETE_SET', {
        method: 'post',
        body: {
          ...formData,
          USER_SID: encrypt(user.value?.USER_SID),
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
})
