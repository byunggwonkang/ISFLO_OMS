<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const props = defineProps({
  commonData: {
    type: Object,
    default: () => ({
      SAVE_TYPE: 'INSERT',
      GROUP_CODE: '',
      COMM_CODE: '',
      COMM_SNAME_ENG: '',
      COMM_FNAME_ENG: '',
      COMM_SNAME_KOR: '',
      COMM_FNAME_KOR: '',
      COMM_SNAME_CHN: '',
      COMM_FNAME_CHN: '',
      COMM_SNAME_JPN: '',
      COMM_FNAME_JPN: '',
      GLOBAL_CODE: '',
      COMM_ACTIVE: '',
      COMM_SEQ: '',
      COMM_REMARK: ''
    }),
  },
  commonDataStore: {
    required: true,
    type: Object
  }
})

const emits = defineEmits(['commonDataSaved'])

const { getComponentData } = usePageLoaderComponent('POP00110')
const { loading, toggleLoading } = useLoading()

const commonDataPiniaStore = useCommonDataStore()

const formData = ref({
  FLT_SAVE_TYPE: 'INSERT',
  FLT_GROUP_CODE: '',
  FLT_COMM_CODE: '',
  FLT_COMM_SNAME_ENG: '',
  FLT_COMM_FNAME_ENG: '',
  FLT_COMM_SNAME_KOR: '',
  FLT_COMM_FNAME_KOR: '',
  FLT_COMM_SNAME_CHN: '',
  FLT_COMM_FNAME_CHN: '',
  FLT_COMM_SNAME_JPN: '',
  FLT_COMM_FNAME_JPN: '',
  FLT_GLOBAL_CODE: '',
  FLT_COMM_ACTIVE: true,
  FLT_COMM_SEQ: '',
  FLT_COMM_REMARK: ''
})

const setFormValue = () => {
  formData.value.FLT_SAVE_TYPE = decrypt(props.commonData?.SAVE_TYPE) ?? ''
  formData.value.FLT_GROUP_CODE = decrypt(props.commonData?.GROUP_CODE) ?? ''
  formData.value.FLT_COMM_CODE = decrypt(props.commonData?.COMM_CODE) ?? ''
  formData.value.FLT_COMM_SNAME_ENG = decrypt(props.commonData?.COMM_SNAME_ENG) ?? ''
  formData.value.FLT_COMM_FNAME_ENG = decrypt(props.commonData?.COMM_FNAME_ENG) ?? ''
  formData.value.FLT_COMM_SNAME_KOR = decrypt(props.commonData?.COMM_SNAME_KOR) ?? ''
  formData.value.FLT_COMM_FNAME_KOR = decrypt(props.commonData?.COMM_FNAME_KOR) ?? ''
  formData.value.FLT_COMM_SNAME_CHN = decrypt(props.commonData?.COMM_SNAME_CHN) ?? ''
  formData.value.FLT_COMM_FNAME_CHN = decrypt(props.commonData?.COMM_FNAME_CHN) ?? ''
  formData.value.FLT_COMM_SNAME_JPN = decrypt(props.commonData?.COMM_SNAME_JPN) ?? ''
  formData.value.FLT_COMM_FNAME_JPN = decrypt(props.commonData?.COMM_FNAME_JPN) ?? ''
  formData.value.FLT_GLOBAL_CODE = decrypt(props.commonData?.GLOBAL_CODE) ?? ''
  formData.value.FLT_COMM_ACTIVE = decrypt(props.commonData?.COMM_ACTIVE) === '1'
  formData.value.FLT_COMM_SEQ = decrypt(props.commonData?.COMM_SEQ) ?? ''
  formData.value.FLT_COMM_REMARK = decrypt(props.commonData?.COMM_REMARK) ?? ''
}

onMounted(() => {
  isloading.isLoading = true
  if (decrypt(props.commonData.SAVE_TYPE) === 'UPDATE') {
    setFormValue()
  }
  formData.value.FLT_GROUP_CODE = decrypt(props.commonData?.GROUP_CODE) ?? ''

  isloading.isLoading = false
})

const saveCommonData = async () => {
  toggleLoading()
  isloading.isLoading = true
  const { success } = await props.commonDataStore.saveCommonData(formData.value)
  if (success) {
    //commonDataPiniaStore.fetchAllCommonData()
    emits('commonDataSaved')
  }
  isloading.isLoading = false
  toggleLoading()
}
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-x-6 gap-y-3">
      <div class="col-start-1 col-end-1">
        <FormGroup
          :label="getComponentData('POP00110_LBL01002', 'caption', 'Code')"
          label-id="POP00110_LBL01002"
          label-for="POP00110_TXT01001"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01001"
            v-model="formData.FLT_COMM_CODE"
          />
        </FormGroup>
      </div>

      <div class="col-start-1 space-y-3">
        <FormGroup
          :label="getComponentData('POP00110_LBL01003', 'caption', 'Short Name[ENG]')"
          label-id="POP00110_LBL01003"
          label-for="POP00110_TXT01002"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01002"
            v-model="formData.FLT_COMM_SNAME_ENG"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01004', 'caption', 'Full Name[ENG]')"
          label-id="POP00110_LBL01004"
          label-for="POP00110_TXT01003"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01003"
            v-model="formData.FLT_COMM_FNAME_ENG"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01005', 'caption', 'Short Name[LOC]')"
          label-id="POP00110_LBL01005"
          label-for="POP00110_TXT01004"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01004"
            v-model="formData.FLT_COMM_SNAME_KOR"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01006', 'caption', 'Full Name[LOC]')"
          label-id="POP00110_LBL01006"
          label-for="POP00110_TXT01005"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01005"
            v-model="formData.FLT_COMM_FNAME_KOR"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01011', 'caption', 'Sequence')"
          label-id="POP00110_LBL01011"
          label-for="POP00110_TXT01010"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01010"
            v-model="formData.FLT_COMM_SEQ"
          />
        </FormGroup>

        <div>
          <FormCheckbox
            id="POP00110_CHK01001"
            v-model="formData.FLT_COMM_ACTIVE"
            :label="getComponentData('POP00110_LBL01013', 'caption', 'Active')"
            :checked="formData.FLT_COMM_ACTIVE === '1'"
          />
        </div>
      </div>

      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00110_LBL01007', 'caption', 'Short Name[CHN]')"
          label-id="POP00110_LBL01007"
          label-for="POP00110_TXT01006"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01006"
            v-model="formData.FLT_COMM_SNAME_CHN"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01008', 'caption', 'Full Name[CHN]')"
          label-id="POP00110_LBL01008"
          label-for="POP00110_TXT01007"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01007"
            v-model="formData.FLT_COMM_FNAME_CHN"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01009', 'caption', 'Short Name[JPN]')"
          label-id="POP00110_LBL01009"
          label-for="POP00110_TXT01008"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01008"
            v-model="formData.FLT_COMM_SNAME_JPN"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01010', 'caption', 'Full Name[JPN]')"
          label-id="POP00110_LBL01010"
          label-for="POP00110_TXT01009"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01009"
            v-model="formData.FLT_COMM_FNAME_JPN"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01012', 'caption', 'ERP Code')"
          label-id="POP00110_LBL01012"
          label-for="POP00110_TXT01011"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01011"
            v-model="formData.FLT_GLOBAL_CODE"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00110_LBL01014', 'caption', 'Remark')"
          label-id="POP00110_LBL01014"
          label-for="POP00110_TXT01012"
          horizontal
        >
          <FormTextInput
            id="POP00110_TXT01012"
            v-model="formData.FLT_COMM_REMARK"
          />
        </FormGroup>
      </div>
    </div>

    <div class="flex justify-end pb-1">
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        :disabled="loading"
        :loading="loading"
        @click="saveCommonData"
      >
        {{ getComponentData('POP00110_BTN01001', 'caption') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
