import { defineStore } from 'pinia'
import {notify} from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'
const { user } = storeToRefs(useAuthStore());
import moment from "moment";

const defaultFilters = () => ({  
  FLT_WORK_DATE_FROM: moment().format('YYYY-MM') + "-01",
  FLT_WORK_DATE_TO: moment().format('YYYY-MM-DD'),
  FLT_JOB_TYPE_CODE: '',
  FLT_INCLUDE_INCATIVE: '',
  FLT_KEY_WORD: '',
});
const defaultWorkStaff = () => ({  
  WORK_DATE: '',
  WH_GROUP_CODE: '',
  WH_GROUP_SNAME: '',
  WH_GROUP_FNAME: '',
  STAFF_LIST: [] as any,  
});

export const useStaffManagement = defineStore('staff-management', {
  state() {
    return {
      StaffSummaryList: [] as any,
      Workfilters: defaultFilters(),
      WorkStaffData: defaultWorkStaff(),
      PopWorkStaffData: defaultWorkStaff(),
      WorkStaffList: [] as any,
      PopWorkStaffList: [] as any,
      filters: defaultFilters(),
      StaffList: [] as any,
      PopStaffList: [] as any,
    }
  },
  actions: {
    clearStaffSummaryList() {
      this.StaffSummaryList = [];
    },
    clearWorkStaffList() {
      this.WorkStaffData = defaultWorkStaff();
      this.WorkStaffList = [] as any;
    },
    async fetchStaffSummaryList() {
      const {data}: any = await useAPIFetch('/IS_EU_STAFF_SUMMARY_GET', {
        method: 'post',
        body: {
          ...this.filters,
          USER_SID: encrypt(user.value?.USER_SID),  
          FLT_WORK_DATE_FROM: encrypt(this.filters.FLT_WORK_DATE_FROM),  
          FLT_WORK_DATE_TO: encrypt(this.filters.FLT_WORK_DATE_TO),
          FLT_JOB_TYPE_CODE: encrypt(this.filters.FLT_JOB_TYPE_CODE),
          FLT_INCLUDE_INCATIVE: encrypt(this.filters.FLT_INCLUDE_INCATIVE),
          FLT_KEY_WORD: encrypt(this.filters.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.StaffSummaryList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchWorkStaffList() {
      const {data}: any = await useAPIFetch('/IS_EU_STAFF_DAILY_LIST_GET', {
        method: 'post',
        body: {
          ...this.Workfilters,
          USER_SID: encrypt(user.value?.USER_SID),  
          FLT_WORK_DATE_FROM: encrypt(this.Workfilters.FLT_WORK_DATE_FROM),  
          FLT_WORK_DATE_TO: encrypt(this.Workfilters.FLT_WORK_DATE_TO),
          FLT_JOB_TYPE_CODE: encrypt(this.Workfilters.FLT_JOB_TYPE_CODE),
          FLT_INCLUDE_INCATIVE: encrypt(this.Workfilters.FLT_INCLUDE_INCATIVE),
          FLT_KEY_WORD: encrypt(this.Workfilters.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.WorkStaffData = data.value?.RESULT_DATA[0] || defaultWorkStaff();
      this.WorkStaffList = data.value?.RESULT_DATA[0].STAFF_LIST || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchPopWorkStaffList(Workfilters: any) {
      const {data}: any = await useAPIFetch('/IS_EU_STAFF_DAILY_LIST_GET', {
        method: 'post',
        body: {
          ...Workfilters,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WORK_DATE_FROM: encrypt(Workfilters.FLT_WORK_DATE_FROM),
          FLT_WORK_DATE_TO: encrypt(Workfilters.FLT_WORK_DATE_TO),
          FLT_JOB_TYPE_CODE: encrypt(Workfilters.FLT_JOB_TYPE_CODE),
          FLT_INCLUDE_INCATIVE: encrypt(Workfilters.FLT_INCLUDE_INCATIVE),
          FLT_KEY_WORD: encrypt(Workfilters.FLT_KEY_WORD),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }
      if (data.value?.RESULT_DATA.length > 0)
      {
        this.PopWorkStaffData = data.value?.RESULT_DATA[0] || defaultWorkStaff();
        this.PopWorkStaffList = data.value?.RESULT_DATA[0].STAFF_LIST || [];
      }
      else
      {
        this.PopWorkStaffData = defaultWorkStaff();
        this.PopWorkStaffList = [];
      }
      

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async CopyWorkStaff(WorkStaff: any) {
      const { data }: any = await useAPIFetch('/IS_EU_STAFF_DAILY_COPY_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_GROUP_CODE: encrypt(user.value?.USER_AUTH_WH_GROUP_CODE),
          FLT_WORK_DATE: encrypt(WorkStaff.FLT_WORK_DATE),
          FLT_COPY_DATE_FROM: encrypt(WorkStaff.FLT_COPY_DATE_FROM),
          FLT_COPY_DATE_TO: encrypt(WorkStaff.FLT_COPY_DATE_TO),
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
    },
    async DeleteWorkStaff(WorkStaff: any) {
      const { data }: any = await useAPIFetch('/IS_EU_STAFF_DAILY_DELETE_SET', {
        method: 'post',
        body: {
          ...WorkStaff,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_GROUP_CODE: encrypt(user.value?.USER_AUTH_WH_GROUP_CODE),
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
    },
    async fetchStaffList(Staff: any) {
      const {data}: any = await useAPIFetch('/IS_WU_STAFF_LIST_GET', {
        method: 'post',
        body: {
          ...Staff,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_STAFF_SID: encrypt(Staff.FLT_STAFF_SID),
          FLT_STAFF_TYPE_CODE: encrypt(Staff.FLT_STAFF_TYPE_CODE),
          FLT_STAFF_ESM_YN: Staff.FLT_STAFF_ESM_YN ? encrypt('1') : encrypt('0'),
          FLT_STAFF_WMS_YN: Staff.FLT_STAFF_WMS_YN ? encrypt('1') : encrypt('0'),
          FLT_STAFF_JOIN_DATE_FROM: Staff.FLT_STAFF_JOIN_DATE_CHECK ? encrypt(Staff.FLT_STAFF_JOIN_DATE_FROM) : encrypt('') ,
          FLT_STAFF_JOIN_DATE_TO: Staff.FLT_STAFF_JOIN_DATE_CHECK ? encrypt(Staff.FLT_STAFF_JOIN_DATE_TO) : encrypt('') ,          
          FLT_STAFF_STATUS_CODE: encrypt(Staff.FLT_STAFF_STATUS_CODE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.StaffList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchPopStaffList(Staff: any) {
      const {data}: any = await useAPIFetch('/IS_WU_STAFF_LIST_GET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_GROUP_CODE: encrypt(user.value?.USER_AUTH_WH_GROUP_CODE),
          FLT_STAFF_SID: encrypt(Staff.FLT_STAFF_SID),
          FLT_STAFF_TYPE_CODE: encrypt(Staff.FLT_STAFF_TYPE_CODE),
          FLT_STAFF_ESM_YN: encrypt(Staff.FLT_STAFF_ESM_YN),
          FLT_STAFF_WMS_YN: encrypt(Staff.FLT_STAFF_WMS_YN),
          FLT_STAFF_JOIN_DATE_FROM: encrypt(Staff.FLT_STAFF_JOIN_DATE_FROM),
          FLT_STAFF_JOIN_DATE_TO: encrypt(Staff.FLT_STAFF_JOIN_DATE_TO),
          FLT_STAFF_STATUS_CODE: encrypt(Staff.FLT_STAFF_STATUS_CODE),
        }
      });

      if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
        return {
          success: false,
          message: data.value?.MSG
        }
      }

      this.PopStaffList = data.value?.RESULT_DATA || [];

      return {
        success: true,
        message: data.value?.MSG || ''
      };
    },
    async fetchsaveStaff(StaffData: any) {
      const { data }: any = await useAPIFetch('/IS_WU_STAFF_DETAIL_SET', {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_GROUP_CODE: encrypt(user.value?.USER_AUTH_WH_GROUP_CODE),
          FLT_STAFF_SID: encrypt(StaffData.FLT_STAFF_SID), 
          FLT_STAFF_TYPE_CODE: encrypt(StaffData.FLT_STAFF_TYPE_CODE), 
          FLT_STAFF_ID: encrypt(StaffData.FLT_STAFF_ID), 
          FLT_STAFF_NAME: encrypt(StaffData.FLT_STAFF_NAME), 
          FLT_STAFF_TEL: encrypt(StaffData.FLT_STAFF_TEL), 
          FLT_STAFF_STATUS_CODE: encrypt(StaffData.FLT_STAFF_STATUS_CODE), 
          FLT_STAFF_JOIN_DATE: encrypt(StaffData.FLT_STAFF_JOIN_DATE), 
          FLT_STAFF_RESIGN_DATE: encrypt(StaffData.FLT_STAFF_RESIGN_DATE), 
          FLT_STAFF_CONTRACT_DATE_FROM: encrypt(StaffData.FLT_STAFF_CONTRACT_DATE_FROM), 
          FLT_STAFF_CONTRACT_DATE_TO: encrypt(StaffData.FLT_STAFF_CONTRACT_DATE_TO), 
          FLT_STAFF_ESM_USER_YN: StaffData.FLT_STAFF_ESM_USER_YN ? encrypt('1') : encrypt('0'),
          FLT_STAFF_WMS_USER_YN: StaffData.FLT_STAFF_WMS_USER_YN ? encrypt('1') : encrypt('0'),
          FLT_STAFF_REMARK: encrypt(StaffData.FLT_STAFF_REMARK), 
          FLT_UPDATE_TIME: encrypt(StaffData.FLT_UPDATE_TIME), 
          FLT_UPDATE_USER: encrypt(StaffData.FLT_UPDATE_USER), 
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
    },
    async saveWorkStaff(StaffData: any) {
      const { data }: any = await useAPIFetch('/IS_EU_STAFF_DAILY_SET', {
        method: 'post',
        body: {
          ...StaffData,
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_WH_GROUP_CODE: encrypt(user.value?.USER_AUTH_WH_GROUP_CODE),
          FLT_WORK_DATE: encrypt(StaffData.FLT_WORK_DATE),
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
