import { defineStore } from 'pinia'
import {notify} from "notiwind";
const { user } = storeToRefs(useAuthStore());

export const useSAChannelSettingsStore = defineStore('sa-channel-settings', {
  state: () => ({
    channelList: [] as any,
    filters: {
      FLT_CHANNEL_CODE: '',
      FLT_INCLUDE_INACTIVE: '1',
    }
  }),
  getters: {
    getChannelList: (state: any) => state.channelList,
  },
  actions: {
    async fetchChannelList() {
      const {data}: any = await useAPIFetch('/IS_SA_CHANNEL_LIST_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: user.value?.USER_SID
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.channelList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async saveChannelDetail(channelData: any) {
      const { data }: any = await useAPIFetch('/IS_SA_CHANNEL_DETAIL_SET', {
        method: 'post',
        body: {
          ...channelData,
          USER_SID: user.value?.USER_SID,
          FLT_CHANNEL_ACTIVE_YN: channelData.FLT_CHANNEL_ACTIVE_YN ? '1' : '0',
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
