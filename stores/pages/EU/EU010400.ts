import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

export const useProductImageViewer = defineStore('product-image-viewer', {
  state: () => ({
    ViewerList: [] as any,
    filters: {
      FLT_CHANNEL_CODE: '',
      FLT_INCLUDE_INACTIVE: '1',
    }
  }),
  getters: {
    getChannelList: (state: any) => state.ViewerList,
  },
  actions: {
    async fetchViewerList() {
      const {data}: any = await useAPIFetch('/IS_EU_IMAGEVIEWER_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID)
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value.MSG
        }
      }

      this.ViewerList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async DeleteViewerList(ViewerData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_IMAGEVIEWER_DELETE_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_IMGV_SET_NAME: encrypt(ViewerData),
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
    async SaveViewerList(ViewerData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_IMAGEVIEWER_DETAIL_SET', {
        method: 'post',
        body: {
          ...ViewerData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_IMGV_SET_NAME: encrypt(ViewerData.FLT_IMGV_SET_NAME),
          FLT_IMGV_SET_ACTIVE_YN: ViewerData.FLT_IMGV_SET_ACTIVE_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_PREFIX_URL: encrypt(ViewerData.FLT_IMGV_SET_PREFIX_URL),
          FLT_IMGV_SET_FILENAME: encrypt(ViewerData.FLT_IMGV_SET_FILENAME),
          FLT_IMGV_SET_FILENAME_PREFIX_YN: ViewerData.FLT_IMGV_SET_FILENAME_PREFIX_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_FILENAME_PREFIX: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_PREFIX),
          FLT_IMGV_SET_FILENAME_PREFIX_SEP: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_PREFIX_SEP),
          FLT_IMGV_SET_FILENAME_DATA01_CODE: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA01_CODE),
          FLT_IMGV_SET_FILENAME_DATA01_NAME: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA01_NAME),
          FLT_IMGV_SET_FILENAME_DATA01_SEP: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA01_SEP),
          FLT_IMGV_SET_FILENAME_DATA02_YN: ViewerData.FLT_IMGV_SET_FILENAME_DATA02_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_FILENAME_DATA02_CODE: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA02_CODE),
          FLT_IMGV_SET_FILENAME_DATA02_NAME: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA02_NAME),
          FLT_IMGV_SET_FILENAME_DATA02_SEP: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA02_SEP),
          FLT_IMGV_SET_FILENAME_DATA03_YN: ViewerData.FLT_IMGV_SET_FILENAME_DATA03_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_FILENAME_DATA03_CODE: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA03_CODE),
          FLT_IMGV_SET_FILENAME_DATA03_NAME: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA03_NAME),
          FLT_IMGV_SET_FILENAME_DATA03_SEP: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA03_SEP),
          FLT_IMGV_SET_FILENAME_DATA04_YN: ViewerData.FLT_IMGV_SET_FILENAME_DATA04_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_FILENAME_DATA04_CODE: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA04_CODE),
          FLT_IMGV_SET_FILENAME_DATA04_NAME: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA04_NAME),
          FLT_IMGV_SET_FILENAME_DATA04_SEP: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA04_SEP),
          FLT_IMGV_SET_FILENAME_DATA05_YN: ViewerData.FLT_IMGV_SET_FILENAME_DATA05_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_FILENAME_DATA05_CODE: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA05_CODE),
          FLT_IMGV_SET_FILENAME_DATA05_NAME: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA05_NAME),
          FLT_IMGV_SET_FILENAME_DATA05_SEP: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_DATA05_SEP),
          FLT_IMGV_SET_FILENAME_SUFFIX_YN: ViewerData.FLT_IMGV_SET_FILENAME_SUFFIX_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_FILENAME_SUFFIX: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_SUFFIX),
          FLT_IMGV_SET_FILENAME_EXT: encrypt(ViewerData.FLT_IMGV_SET_FILENAME_EXT),
          FLT_IMGV_SET_EVENT_SHIP_YN: ViewerData.FLT_IMGV_SET_EVENT_SHIP_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_CODE),
          FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_NAME),
          FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_CODE),
          FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_NAME),
          FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_CODE),
          FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_NAME),
          FLT_IMGV_SET_EVENT_RETURN_YN: ViewerData.FLT_IMGV_SET_EVENT_RETURN_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_CODE),
          FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_NAME),
          FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE),
          FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_NAME),
          FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_CODE),
          FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_NAME),
          FLT_IMGV_SET_EVENT_EXCHANGE_YN: ViewerData.FLT_IMGV_SET_EVENT_EXCHANGE_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_CODE),
          FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_NAME),
          FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_CODE),
          FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_NAME),
          FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_CODE),
          FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_NAME),
          FLT_IMGV_SET_EVENT_STOCK_YN: ViewerData.FLT_IMGV_SET_EVENT_STOCK_YN? encrypt('1') : encrypt('0'),
          FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_CODE),
          FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_NAME),
          FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_CODE),
          FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_NAME),
          FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_CODE: encrypt(ViewerData.FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_CODE),
          FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_NAME: encrypt(ViewerData.FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_NAME),
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
