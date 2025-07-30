import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const useSAChannelSettingsStore = defineStore('sa-channel-settings', {
  state: () => ({
    channelList: [] as any,
    filters: {
      FLT_CHANNEL_CODE: '',
      FLT_INCLUDE_INACTIVE: encrypt('1'),
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
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_CHANNEL_CODE: encrypt(this.filters.FLT_CHANNEL_CODE),

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
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_SAVE_TYPE: encrypt(channelData.FLT_SAVE_TYPE),
          FLT_CHANNEL_CODE: encrypt(channelData.FLT_CHANNEL_CODE),
          FLT_CHANNEL_SNAME_ENG: encrypt(channelData.FLT_CHANNEL_SNAME_ENG),
          FLT_CHANNEL_FNAME_ENG: encrypt(channelData.FLT_CHANNEL_FNAME_ENG),
          FLT_CHANNEL_SNAME_KOR: encrypt(channelData.FLT_CHANNEL_SNAME_KOR),
          FLT_CHANNEL_FNAME_KOR: encrypt(channelData.FLT_CHANNEL_FNAME_KOR),
          FLT_CHANNEL_SNAME_CHN: encrypt(channelData.FLT_CHANNEL_SNAME_CHN),
          FLT_CHANNEL_FNAME_CHN: encrypt(channelData.FLT_CHANNEL_FNAME_CHN),
          FLT_CHANNEL_SNAME_JPN: encrypt(channelData.FLT_CHANNEL_SNAME_JPN),
          FLT_CHANNEL_FNAME_JPN: encrypt(channelData.FLT_CHANNEL_FNAME_JPN),
          FLT_CHANNEL_ACTIVE_YN: channelData.FLT_CHANNEL_ACTIVE_YN ? encrypt('1') : encrypt('0'),
          FLT_CHANNEL_COUNTRY_CODE: encrypt(channelData.FLT_CHANNEL_COUNTRY_CODE),
          FLT_CHANNEL_REMARK: encrypt(channelData.FLT_CHANNEL_REMARK),
          
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
