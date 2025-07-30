import { defineStore } from 'pinia'
import moment from "moment";
import { notify } from "notiwind";
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

export const useUserSettingsStore = defineStore('user-settings', {
    state: () => ({
      userGroupList: [] as any,
      usersList: [] as any,
      filters: {
        USER_SID: encrypt(user.value?.USER_SID),
        FLT_USER_SID: '',
        FLT_GROUP_CODE: '',
        FLT_USER_DNAME: '',
        FLT_INCLUDE_INACTIVE: false,
        FLT_DATE_CHECK: true,
        FLT_JOIN_FROM_DATE: moment().format('YYYY-MM') + "-01",
        FLT_JOIN_TO_DATE: moment().format('YYYY-MM-DD'),
      },
      savingUser: false,
      savingPassword: false
    }),
    getters: {
      getUsersList: (state: any) => state.usersList,
    },
    actions: {
      async fetchUserGroupList() {
        const { data }: any = await useAPIFetch('/IS_SA_USERGROUP_LIST_GET', {
          method: 'post',
          body: {
            USER_SID: encrypt(user.value?.USER_SID),
            FLT_INCLUDE_SA : encrypt("0"),
            FLT_INCLUDE_INACTIVE: encrypt("0")
          }
        });

        if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
          return {
            success: false,
            message: data.value?.MSG
          }
        }

        this.userGroupList = data.value?.RESULT_DATA || [];

        return {
          success: true,
          message: data.value?.MSG || ''
        };
      },
      clearUsersList() {
        this.usersList = [];
      },
      async fetchUsersList() {
        const {data}: any = await useAPIFetch('/IS_SA_USER_LIST_GET', {
          method: 'post',
          body: {
            ...this.filters,
            FLT_USER_SID: encrypt(this.filters.FLT_USER_SID),
            FLT_GROUP_CODE: encrypt(this.filters.FLT_GROUP_CODE),
            FLT_USER_DNAME: encrypt(this.filters.FLT_USER_DNAME),           
            FLT_INCLUDE_INACTIVE: this.filters.FLT_INCLUDE_INACTIVE ? encrypt('') : encrypt('1'),
            FLT_JOIN_FROM_DATE: this.filters.FLT_DATE_CHECK ? encrypt(this.filters.FLT_JOIN_FROM_DATE) : encrypt('') ,
            FLT_JOIN_TO_DATE: this.filters.FLT_DATE_CHECK ? encrypt(this.filters.FLT_JOIN_TO_DATE) : encrypt('') ,
          }
        });

        if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
          return {
            success: false,
            message: data.value.MSG
          }
        }

        this.usersList = data.value?.RESULT_DATA || [];

        return {
          success: true,
          message: data.value?.MSG || ''
        };
      },
      async changePassword(userData: any) {
        const { data }: any = await useAPIFetch('/IS_GNR_USER_PASSWORD_SET', {
          method: 'post',
          body: {
            ...userData,
            USER_SID: encrypt(user.value?.USER_SID),
          },
          onRequest: () => {
            this.savingPassword = true;
          },
          onResponse: () => {
            this.savingPassword = false;
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
      async saveUserData(userData: any) {
        const { data }: any = await useAPIFetch('/IS_SA_USER_DETAIL_SET', {
          method: 'post',
          body: {
            FLT_USER_SID: encrypt(userData.FLT_USER_SID),
            FLT_USER_CODE: encrypt(userData.FLT_USER_CODE),
            FLT_USER_DNAME: encrypt(userData.FLT_USER_DNAME),
            FLT_USER_SNAME: encrypt(userData.FLT_USER_SNAME),
            FLT_USER_FNAME: encrypt(userData.FLT_USER_FNAME),
            FLT_USER_LOGIN_ID: encrypt(userData.FLT_USER_LOGIN_ID),
            FLT_USER_LOGIN_PW: encrypt(userData.FLT_USER_LOGIN_PW),
            FLT_USER_GENDER_CODE: encrypt(userData.FLT_USER_GENDER_CODE),
            FLT_USER_EMAIL: encrypt(userData.FLT_USER_EMAIL),
            FLT_USER_TEL: encrypt(userData.FLT_USER_TEL),
            FLT_USER_MOBILE: encrypt(userData.FLT_USER_MOBILE),
            FLT_USER_ACTIVE_YN: encrypt(userData.FLT_USER_ACTIVE_YN),
            FLT_USER_GROUP_CODE: encrypt(userData.FLT_USER_GROUP_CODE),
            FLT_USER_COUNTRY_CODE: encrypt(userData.FLT_USER_COUNTRY_CODE),
            FLT_USER_DEPARTMENT_CODE: encrypt(userData.FLT_USER_DEPARTMENT_CODE),
            FLT_USER_POSITION_CODE: encrypt(userData.FLT_USER_POSITION_CODE),
            FLT_USER_LANGUAGE: encrypt(userData.FLT_USER_LANGUAGE),
            FLT_USER_STATUS_CODE: encrypt(userData.FLT_USER_STATUS_CODE),
            FLT_USER_STATUS_FNAME: encrypt(userData.FLT_USER_STATUS_FNAME),
            FLT_USER_JOIN_DATE: encrypt(userData.FLT_USER_JOIN_DATE),
            FLT_USER_RESIGN_DATE: encrypt(userData.FLT_USER_RESIGN_DATE),
            FLT_USER_IS_RESIGNED: encrypt(userData.FLT_USER_IS_RESIGNED),
            FLT_USER_REMARK: encrypt(userData.FLT_USER_REMARK),
            FLT_USER_UPDATE_USER: encrypt(userData.FLT_USER_UPDATE_USER),
            FLT_USER_UPDATE_DATE: encrypt(userData.FLT_USER_UPDATE_DATE),
            FLT_USER_CREATE_USER: encrypt(userData.FLT_USER_CREATE_USER),
            FLT_USER_CREATE_DATE: encrypt(userData.FLT_USER_CREATE_DATE),
            USER_SID: encrypt(user.value?.USER_SID),
          },
          onRequest: () => {
            this.savingUser = true;
          },
          onResponse: () => {
            this.savingUser = false;
          }
        });

        if (data.value?.MTY === 'FAIL' || data.value?.MTY === 'ERROR') {
          notify({
            group: 'error',
            title: 'Error',
            text: data.value.MSG,
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
          message: data.value.MSG
        };
      }
    },
});
