<script setup>
import { DocumentDuplicateIcon } from "@heroicons/vue/24/solid";
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const props = defineProps({
  storeData: {
    type: Object,
    default: () => ({
      STORE_SID: ''
    })
  }
})

const pageLoader = usePageLoaderStore()
const commonData = useCommonDataStore()
const storeSettings = useStoreSettingsStore()
const userSettings = useUserSettingsStore();

const { savingPassword } = storeToRefs(userSettings);
const { userGroupBrandList } = storeToRefs(storeSettings)
const { loading, toggleLoading } = useLoading()

const { getComponentData } = usePageLoaderComponent(['POP00120'])

const formData = ref({
  FLT_STORE_SID: '',
  FLT_BRAND_CODE: '',
  FLT_STORE_CODE: '',
  FLT_STORE_DNAME: '',
  FLT_STORE_SNAME_ENG: '',
  FLT_STORE_FNAME_ENG: '',
  FLT_STORE_SNAME_KOR: '',
  FLT_STORE_FNAME_KOR: '',
  FLT_STORE_SNAME_CHN: '',
  FLT_STORE_FNAME_CHN: '',
  FLT_STORE_SNAME_JPN: '',
  FLT_STORE_FNAME_JPN: '',
  FLT_STORE_LOGIN_ID: '',
  FLT_STORE_EMAIL: '',
  FLT_STORE_TEL: '',
  FLT_STORE_USER_GROUP_CODE: '',
  FLT_STORE_COUNTRY_CODE: '',
  FLT_STORE_LANGUAGE: '',
  FLT_STORE_ADDRESS_1: '',
  FLT_STORE_ADDRESS_2: '',
  FLT_STORE_TYPE_CODE: '',
  FLT_STORE_STATUS_CODE: '',
  FLT_STORE_REMARK: '',
  FLT_STORE_ONLINE_YN: '',
  FLT_STORE_ACTIVE_YN: '',
  FLT_STORE_OPEN_DATE: '',
  FLT_STORE_CLOSE_DATE: '',
  FLT_STORE_DEPARTMENTSTORE_CODE: '',
})

const brand = ref({})
const storeType = ref({})
const departmentStore = ref({})
const storeStatus = ref({})
const country = ref({})
const language = ref({})
const userGroup = ref({})
const passwordPayload = ref({
  FLT_USER_SID: props.storeData.STORE_SID,
  FLT_USER_CURRENT_PW: '',
  FLT_USER_NEW_PW: '',
});
const setFormValue = () => {
  if (props.storeData?.STORE_SID) {
    
    Object.entries(props.storeData).forEach(([key, value]) => {
      if (key === 'STORE_ONLINE_YN' || key === 'STORE_ACTIVE_YN') {
        formData.value[`FLT_${key}`] = decrypt(value) === '1'
      } else {
        formData.value[`FLT_${key}`] = decrypt(value)
      }
    })

    brand.value = {
      name: decrypt(props.storeData.BRAND_FNAME),
      value: parseInt(decrypt(props.storeData.BRAND_CODE)).toString() ?? '',
    }

    storeType.value = {
      name: decrypt(props.storeData.STORE_TYPE_FNAME),
      value: decrypt(props.storeData.STORE_TYPE_CODE)
    }

    language.value = {
      name: commonData.getLanguagesList.find((lang) => lang.value === decrypt(props.storeData.STORE_LANGUAGE))?.name ?? '',
      value: decrypt(props.storeData.STORE_LANGUAGE)
    }

    country.value = {
      name: decrypt(props.storeData.STORE_COUNTRY_FNAME),
      value: decrypt(props.storeData.STORE_COUNTRY_CODE)
    }

    userGroup.value = {
      name: decrypt(props.storeData.STORE_USER_GROUP_FNAME),
      value: decrypt(props.storeData.STORE_USER_GROUP_CODE)
    }

    storeStatus.value = {
      name: decrypt(props.storeData.STORE_STATUS_FNAME),
      value: decrypt(props.storeData.STORE_STATUS_CODE)
    }

    departmentStore.value = {
      name: decrypt(props.storeData.STORE_DEPARTMENTSTORE_FNAME),
      value: decrypt(props.storeData.STORE_DEPARTMENTSTORE_CODE)
    }
  } else {
    brand.value = {
      name: decrypt(userGroupBrandList.value[0]?.USER_BRAND_FNAME) ?? '',
      value: parseInt(decrypt(userGroupBrandList.value[0]?.USER_BRAND_CODE)).toString() ?? '',
    }

    storeType.value = {
      name: commonData.getStoreTypeOptions[0]?.name ?? '',
      value: commonData.getStoreTypeOptions[0]?.value ?? '',
    }

    departmentStore.value = {
      name: commonData.getDepartmentStoreOptions[0]?.name ?? '',
      value: commonData.getDepartmentStoreOptions[0]?.value ?? '',
    }

    storeStatus.value = {
      name: commonData.getStoreStatusOptions[0]?.name ?? '',
      value: commonData.getStoreStatusOptions[0]?.value ?? '',
    }

    language.value = {
      name: commonData.getLanguagesList[0]?.name ?? '',
      value: commonData.getLanguagesList[0]?.value ?? '',
    }

    country.value = {
      name: commonData.getCountriesList[0]?.name ?? '',
      value: commonData.getCountriesList[0]?.value ?? '',
    }

    userGroup.value = {
      name: commonData.getUserGroupList[0]?.name ?? '',
      value: commonData.getUserGroupList[0]?.value ?? '',
    }
  }
}

onMounted(async () => {
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData('POP00120')
  await storeSettings.fetchUserGroupBrandList()
  await commonData.fetchPOP00120CommonData();
  setFormValue()
  isloading.isLoading = false
})

const emits = defineEmits(['storeSaved'])

const transformFormData = () => {
  formData.value.FLT_BRAND_CODE = brand.value?.value || ''
  formData.value.FLT_STORE_TYPE_CODE = storeType.value?.value || ''
  formData.value.FLT_STORE_STATUS_CODE = storeStatus.value?.value || '0010'
  formData.value.FLT_STORE_COUNTRY_CODE = country.value?.value || ''
  formData.value.FLT_STORE_LANGUAGE = language.value?.value || ''
  formData.value.FLT_STORE_USER_GROUP_CODE = userGroup.value?.value || ''
  formData.value.FLT_STORE_DEPARTMENTSTORE_CODE = departmentStore.value?.value || ''
  formData.value.FLT_STORE_OPEN_DATE = moment(formData.value.FLT_STORE_OPEN_DATE).format('YYYY-MM-DD')
  formData.value.FLT_STORE_CLOSE_DATE = formData.value.FLT_STORE_CLOSE_DATE ? moment(formData.value.FLT_STORE_CLOSE_DATE).format('YYYY-MM-DD') : ''
}

const canResetPassword = computed(() => {
  return props.storeData?.STORE_SID && props.storeData?.STORE_LOGIN_ID
})

const saveStoreDetail = async () => {
  transformFormData()

  toggleLoading()
  const { success } = await storeSettings.saveStoreDetail(formData.value)
  if (success) {
    emits('storeSaved')
  }
  toggleLoading()
}

const savePassword = async () => {
  await userSettings.changePassword(passwordPayload.value);
}

const copyStoreDetail = () => {
  formData.value.FLT_STORE_SID = ''
}
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-x-6">
      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00120_LBL00002', 'caption')"
          label-id="POP00120_LBL00002"
          label-for="POP00120_TXT00001"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00001"
            v-model="formData.FLT_STORE_SID"
            disabled
            :placeholder="getComponentData('POP00120_TXT00001', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00003', 'caption')"
          label-id="POP00120_LBL00003"
          label-for="POP00120_CMB00001"
          horizontal
        >
          <FormCombobox
            id="POP00120_CMB00001"
            v-model="brand"
            :options="userGroupBrandList.map((brand) => ({
              name: decrypt(brand.USER_BRAND_FNAME),
              value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
            }))"
          />
        </FormGroup>
      </div>
      <div class="space-y-3">
        <div>
          <Button
            id="POP00120_BTN00001"
            variant="gray"
            rounded
            size="sm"
            :disabled="!formData.FLT_STORE_SID"
            @click="copyStoreDetail"
          >
            <DocumentDuplicateIcon class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-x-6">
      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00120_LBL00004', 'caption')"
          label-id="POP00120_LBL00004"
          label-for="POP00120_TXT00002"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00002"
            v-model="formData.FLT_STORE_CODE"
            :placeholder="getComponentData('POP00120_TXT00002', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00005', 'caption')"
          label-id="POP00120_LBL00005"
          label-for="POP00120_TXT00003"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00003"
            v-model="formData.FLT_STORE_SNAME_ENG"
            :placeholder="getComponentData('POP00120_TXT00003', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00006', 'caption')"
          label-id="POP00120_LBL00006"
          label-for="POP00120_TXT00004"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00004"
            v-model="formData.FLT_STORE_FNAME_ENG"
            :placeholder="getComponentData('POP00120_TXT00004', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00009', 'caption')"
          label-id="POP00120_LBL00009"
          label-for="POP00120_TXT00008"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00008"
            v-model="formData.FLT_STORE_SNAME_CHN"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00010', 'caption')"
          label-id="POP00120_LBL00010"
          label-for="POP00120_TXT00009"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00009"
            v-model="formData.FLT_STORE_FNAME_CHN"
          />
        </FormGroup>
      </div>
      <div class="space-y-3">
        <FormGroup
          label="Display Name"
          horizontal
        >
          <FormTextInput
            v-model="formData.FLT_STORE_DNAME"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00007', 'caption')"
          label-id="POP00120_LBL00007"
          label-for="POP00120_TXT00006"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00006"
            v-model="formData.FLT_STORE_SNAME_KOR"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00008', 'caption')"
          label-id="POP00120_LBL00008"
          label-for="POP00120_TXT00007"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00007"
            v-model="formData.FLT_STORE_FNAME_KOR"
            :placeholder="getComponentData('POP00120_TXT00007', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00011', 'caption')"
          label-id="POP00120_LBL00011"
          label-for="POP00120_TXT00010"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00010"
            v-model="formData.FLT_STORE_SNAME_JPN"
            :placeholder="getComponentData('POP00120_TXT00010', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00012', 'caption')"
          label-id="POP00120_LBL00012"
          label-for="POP00120_TXT00011"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00011"
            v-model="formData.FLT_STORE_FNAME_JPN"
            :placeholder="getComponentData('POP00120_TXT00011', 'placeholder')"
          />
        </FormGroup>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-x-6">
      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00120_LBL00013', 'caption')"
          label-id="POP00120_LBL00013"
          label-for="POP00120_CMB00002"
          horizontal
        >
          <FormCombobox
            id="POP00120_CMB00002"
            v-model="storeType"
            :options="commonData.getStoreTypeOptions"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00014', 'caption')"
          label-id="POP00120_LBL00014"
          label-for="POP00120_CMB00003"
          horizontal
        >
          <FormCombobox
            id="POP00120_CMB00003"
            v-model="departmentStore"
            :options="commonData.getDepartmentStoreOptions"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00015', 'caption')"
          label-id="POP00120_LBL00015"
          label-for="POP00120_CMB00004"
          horizontal
        >
          <FormCombobox
            id="POP00120_CMB00004"
            v-model="storeStatus"
            :options="commonData.getStoreStatusOptions"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00019', 'caption')"
          label-id="POP00120_LBL00019"
          label-for="POP00120_TXT00013"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00013"
            v-model="formData.FLT_STORE_TEL"
            :placeholder="getComponentData('POP00120_TXT00013', 'placeholder')"
          />
        </FormGroup>
      </div>

      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00120_LBL00016', 'caption')"
          label-id="POP00120_LBL00016"
          label-for="POP00120_DAT00001"
          horizontal
        >
          <FormDatePicker
            id="POP00120_DAT00001"
            v-model="formData.FLT_STORE_OPEN_DATE"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00017', 'caption')"
          label-id="POP00120_LBL00017"
          label-for="POP00120_DAT00002"
          horizontal
        >
          <FormDatePicker
            id="POP00120_DAT00002"
            v-model="formData.FLT_STORE_CLOSE_DATE"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00018', 'caption')"
          label-id="POP00120_LBL00018"
          label-for="POP00120_TXT00012"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00012"
            v-model="formData.FLT_STORE_EMAIL"
            :placeholder="getComponentData('POP00120_TXT00012', 'placeholder')"
          />
        </FormGroup>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-x-6">
      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00120_LBL00020', 'caption')"
          label-id="POP00120_LBL00020"
          label-for="POP00120_TXT00014"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00014"
            v-model="formData.FLT_STORE_ADDRESS_1"
            :placeholder="getComponentData('POP00120_TXT00014', 'placeholder')"
          />
        </FormGroup>


        <div class="flex items-center space-x-6">
          <FormCheckbox
            id="POP00120_CHK00001"
            v-model="formData.FLT_STORE_ONLINE_YN"
            :label="getComponentData('POP00120_LBL00022', 'caption')"
            :value="'1'"
            :checked="formData.FLT_STORE_ONLINE_YN === '1'"
          />

          <FormCheckbox
            id="POP00120_CHK00002"
            v-model="formData.FLT_STORE_ACTIVE_YN"
            :label="getComponentData('POP00120_LBL00024', 'caption')"
            :value="'1'"
            :checked="formData.FLT_STORE_ACTIVE_YN === '1'"
          />
        </div>
      </div>
      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00120_LBL00021', 'caption')"
          label-id="POP00120_LBL00021"
          label-for="POP00120_TXT00015"
          horizontal
        >
          <FormTextInput
            id="POP00120_TXT00015"
            v-model="formData.FLT_STORE_ADDRESS_2"
            :placeholder="getComponentData('POP00120_TXT00015', 'placeholder')"
          />
        </FormGroup>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-x-6">
      <div class="space-y-3">
        <div class="space-y-1">
          <FormGroup
            :label="getComponentData('POP00120_LBL00023', 'caption')"
            label-id="POP00120_LBL00023"
            label-for="POP00120_TXT00016"
            horizontal
          >
            <FormTextInput
              id="POP00120_TXT00016"
              v-model="formData.FLT_STORE_LOGIN_ID"
              :placeholder="getComponentData('POP00120_TXT00016', 'placeholder')"
            />
          </FormGroup>

          <div
            v-if="canResetPassword"
            class="inline-flex items-center justify-end w-full"
          >
            <Button
              id="POP00120_BTN00002"
              rounded
              variant="gray"
              :loading="savingPassword"
              :disabled="savingPassword"
              size="sm"
              @click="savePassword"
            >
              {{ getComponentData('POP00120_BTN00002', 'caption') }}
            </Button>
          </div>
        </div>

        <FormGroup
          :label="getComponentData('POP00120_LBL00025', 'caption')"
          label-id="POP00120_LBL00025"
          label-for="POP00120_CMB00005"
          horizontal
        >
          <FormCombobox
            id="POP00120_CMB00005"
            v-model="userGroup"
            :options="commonData.getUserGroupList"
          />
        </FormGroup>

        <FormGroup
          label="Language"
          horizontal
        >
          <FormCombobox
            id="POP00120_CMB00005"
            v-model="language"
            :options="commonData.getLanguagesList"
          />
        </FormGroup>
      </div>

      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00120_LBL00026', 'caption')"
          label-id="POP00120_LBL00026"
          label-for="POP00120_CMB00006"
          horizontal
        >
          <FormCombobox
            id="POP00120_CMB00006"
            v-model="country"
            :options="commonData.getCountriesList"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00120_LBL00027', 'caption')"
          label-id="POP00120_LBL00027"
          label-for="POP00120_TXT00017"
          horizontal
        >
          <FormTextareaInput
            id="POP00120_TXT00017"
            v-model="formData.FLT_STORE_REMARK"
            :placeholder="getComponentData('POP00120_TXT00017', 'placeholder')"
          />
        </FormGroup>
      </div>
    </div>

    <div class="flex justify-end pb-1">
      <Button
        id="POP00120_BTN00003"
        variant="gray"
        rounded
        class="w-30"
        size="sm"
        :disabled="loading"
        :loading="loading"
        @click="saveStoreDetail"
      >
        {{ getComponentData('POP00120_BTN00003', 'caption') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
