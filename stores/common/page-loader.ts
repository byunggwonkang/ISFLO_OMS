import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());

interface ResonseData {
  CODE: string;
  MSG: string;
  MTY: string;
  RESULT_DATA: any;
}

interface Property {
  Seq: string;
  Name: string;
  Value: string;
}

export const usePageLoaderStore = defineStore('page-loader', {
  state: () => ({
    pageLoadData: {} as any
  }),
  getters: {
    getPageLoadData: (state) => state.pageLoadData,
  },
  actions: {
    async fetchPageLoadData(code: string) {
      if (!code) {
        return;
      }

      const { data } = await useAPIFetch('/IS_GNR_PAGELOADER_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          UIUX_CODE: encrypt(code)
        }
      });

      const dataValue = data.value as ResonseData;

      if (dataValue?.MTY === 'FAIL' || dataValue?.MTY === 'ERROR') {
        notify({
          group: 'error',
          title: 'Error',
          text: dataValue?.MSG + ' for ' + code,
        }, 4000)

        return {
          success: false,
          message: dataValue.MSG
        }
      }

      this.pageLoadData[code] = dataValue?.RESULT_DATA;

      return {
        success: true,
        message: dataValue?.MSG
      };
    },
    getTableData(code: string, gridId: string) {
      if (!this.pageLoadData[code]) {
        return []; // return empty array if pageLoadData[code] is undefined
      }

      const grid = this.pageLoadData[code]['GRIDS'].find((grid: any) => grid?.GRID_ID === gridId);

      if (!grid) {
        return []; // return empty array if grid is undefined
      }

      const columns: any[] = grid.COLUMNS;

      return columns.map(item => {
        return this.transformProperties(item.PROPERTIES);
      });
    },
    transformProperties(properties: Property[]) {
      return properties?.reduce((acc: Record<string, string | string[]>, prop) => {
        const propName = prop.Name.charAt(0).toLowerCase() + prop.Name.slice(1);
        let propValue: string | string[] = prop.Value;

        if (propName === "fontStyle") {
          propValue = propValue.split(',').map(style => style.trim());
        }

        acc[propName] = propValue;
        return acc;
      }, {});
    },
    getComponentProperties(code: string) {
      if (!this.pageLoadData[code]) {
        return {}; // return empty object if pageLoadData[code] is undefined
      }

      return this.pageLoadData[code]['COMPONENTS'].reduce((acc: Record<string, any>, component: any) => {
        const properties = this.transformProperties(component.PROPERTIES);
        acc[component.COMPONENT_ID] = properties;
        return acc;
      }, {});
    },
    getGridProperties(code: string) {
      if (!this.pageLoadData[code]) {
        return {}; // return empty object if pageLoadData[code] is undefined
      }

      return this.pageLoadData[code]['GRIDS'].reduce((acc: Record<string, any>, grid: any) => {
        const properties = this.transformProperties(grid.PROPERTIES);
        acc[grid.GRID_ID] = properties;
        return acc;
      }, {});
    },
    async fetchPageLoadDataByCodes(codes: string[]) {
      codes.map(code => this.fetchPageLoadData(code));
    },
  },
  persist: {
    storage: persistedState.sessionStorage
  }
});
