import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const stationsSettingsStore = defineStore('sa-channel-settings', {
  state: () => ({
    StationList: [] as any,
    WHList: [] as any,
    ChannelList: [] as any,
    filters: {
      FLT_USER_SID: '',
      FLT_INCLUDE_INACTIVE: '1',
    }
  }),
  getters: {
    getStationList: (state: any) => state.StationList,
    getWHList: (state: any) => state.WHList,
    getChannelList: (state: any) => state.ChannelList,
  },
  actions: {
    async fetchStationList() {
      const {data}: any = await useAPIFetch('/IS_EU_STATION_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_USER_SID: encrypt(this.filters.FLT_USER_SID),
          FLT_INCLUDE_INACTIVE: encrypt(this.filters.FLT_INCLUDE_INACTIVE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.StationList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchWHList() {
      const { data }: any = await useAPIFetch('/IS_EU_WAREHOUSE_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_GROUP_CODE: encrypt('SA_WH_GROUP'),
          FLT_INCLUDE_INACTIVE: encrypt('0'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.WHList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    }, 
    async fetchChannelList(whCode: string) {
      const { data }: any = await useAPIFetch('/IS_EU_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_CODE: encrypt(whCode),
          FLT_INCLUDE_INACTIVE: encrypt('0'),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.ChannelList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveStation(StationData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_STATION_DETAIL_SET', {
        method: 'post',
        body: {
          ...StationData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STATION_USER_SID: encrypt(StationData.FLT_STATION_USER_SID),
          FLT_USER_CODE: encrypt(StationData.FLT_USER_CODE),
          FLT_USER_FNAME: encrypt(StationData.FLT_USER_FNAME),
          FLT_USER_GROUP_FNAME: encrypt(StationData.FLT_USER_GROUP_FNAME),
          FLT_STATION_ID: encrypt(StationData.FLT_STATION_ID),
          FLT_STATION_WH_CODE: encrypt(StationData.FLT_STATION_WH_CODE),
          FLT_STATION_WH_BRAND_CODE: encrypt(StationData.FLT_STATION_WH_BRAND_CODE),
          FLT_STATION_WH_BRAND_FNAME: encrypt(StationData.FLT_STATION_WH_BRAND_FNAME),
          FLT_STATION_REMARK: encrypt(StationData.FLT_STATION_REMARK),
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
