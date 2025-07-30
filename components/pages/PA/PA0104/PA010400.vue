<script setup>
import {PlusIcon, DocumentDuplicateIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const smsSetting = useSmsSettingsStore()
const commonData = useCommonDataStore()
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { smsList } = storeToRefs(smsSetting)

const smsListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'PA010400_GRD00001')
})

const channel = ref({})
const brand = ref({})
const smsAgency = ref({})
const salesType = ref({})
const stepToSend = ref({})
const smsActive = ref(true)

const formData = ref({
  FLT_SMS_SID: '',
  FLT_SMS_BRAND_CODE: '',
  FLT_SMS_CHANNEL_CODE: '',
  FLT_SMS_AGENCY_CODE: '',
  FLT_SMS_SALES_TYPE_CODE: '',
  FLT_SMS_SEND_STATUS_CODE: '',
  FLT_SMS_SEND_TIME: '',
  FLT_SMS_ACTIVE_YN: '',
  FLT_SMS_TEXT: '',
  FLT_SMS_REMARK: '',
})

onBeforeMount(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await commonData.fetchPA010400CommonData()
  await smsSetting.fetchSmsList()
  await smsSetting.fetchUserGroupBrandList()
  await smsSetting.fetchChannelList()
  await smsSetting.fetchSmsAgencyList()
  resetFormData();
  isloading.isLoading = false
  togglePageLoading()
})

watch(salesType, (value) => {
  formData.value.FLT_SMS_SALES_TYPE_CODE = value?.value
}, {
  immediate: true,
  deep: true
})

const stepToSendOptions = (code) => {
  switch (code) {
    case '0010':
      return commonData.getOrderStatusList;
    case '0020':
      return commonData.getReturnStatusList;
    case '0030':
      return commonData.getExchangeStatusList;
    default:
      return [];
  }
};


const canCopySmsSetting = computed(() => {
  return formData.value.FLT_SMS_SID !== ''
})

const copySmsSetting = () => {
  formData.value.FLT_SMS_SID = ''
}

const resetFormData = () => {
  formData.value = {
    FLT_SMS_SID: '',
    FLT_SMS_BRAND_CODE: '',
    FLT_SMS_CHANNEL_CODE: '',
    FLT_SMS_AGENCY_CODE: '',
    FLT_SMS_SALES_TYPE_CODE: '',
    FLT_SMS_SEND_STATUS_CODE: '',
    FLT_SMS_SEND_TIME: '',
    FLT_SMS_ACTIVE_YN: '',
    FLT_SMS_TEXT: '',
    FLT_SMS_REMARK: '',
  }

  const defaultChannel = smsSetting.getChannelList[0];
  const defaultAgency = smsSetting.getSmsAgencyList[0];
  const defaultSalesType = commonData.getSaleTypeOptions[0];

  brand.value = {}
  channel.value = {
    name: decrypt(defaultChannel.CHANNEL_FNAME) + ' - ' + decrypt(defaultChannel.BRAND_SNAME),
    value: decrypt(defaultChannel.CHANNEL_CODE)
  }
  smsAgency.value = {
    name: decrypt(defaultAgency.AGENCY_FNAME),
    value: decrypt(defaultAgency.AGENCY_SID)
  }
  salesType.value = defaultSalesType
  stepToSend.value = stepToSendOptions(defaultSalesType.value)[0]
}

const onClickSmsRow = (item) => {
  Object.keys(item).forEach((key) => {
    formData.value[`FLT_${key}`] = decrypt(item[key])
  })

  const selectedChannel = smsSetting.getChannelList.find((channel) => channel.CHANNEL_CODE === item.SMS_CHANNEL_CODE)
  const selectedBrand = smsSetting.getUserGroupBrandList.find((brand) => parseInt(decrypt(brand.USER_BRAND_CODE)).toString() === decrypt(item.SMS_BRAND_CODE))
  const selectedSmsAgency = smsSetting.getSmsAgencyList.find((agency) => agency.AGENCY_SID === item.SMS_AGENCY_CODE)
  const selectedSalesType = commonData.getSaleTypeOptions.find((type) => type.value === decrypt(item.SMS_SALES_TYPE_CODE))
  const selectedStepToSend = stepToSendOptions(selectedSalesType.value).find((step) => step.value === decrypt(item.SMS_SEND_STATUS_CODE))

  smsActive.value = decrypt(item?.SMS_ACTIVE_YN) === '1' || decrypt(item?.SMS_ACTIVE_YN) === 'True'

  brand.value = {
    name: decrypt(selectedBrand?.USER_BRAND_FNAME),
    value: decrypt(selectedBrand?.USER_BRAND_CODE)
  }

  channel.value = {
    name: decrypt(selectedChannel?.CHANNEL_FNAME) + ' - ' + decrypt(selectedChannel?.BRAND_SNAME),
    value: decrypt(selectedChannel?.CHANNEL_CODE)
  }

  smsAgency.value = {
    name: decrypt(selectedSmsAgency?.AGENCY_FNAME),
    value: decrypt(selectedSmsAgency?.AGENCY_SID)
  }

  salesType.value = {
    name: selectedSalesType?.name,
    value: selectedSalesType?.value
  }

  stepToSend.value = {
    name: selectedStepToSend?.name,
    value: selectedStepToSend?.value
  }
}

watch(() => channel, (value) => {
  if (value) {
    const selectedChannel = smsSetting.getChannelList.find((channel) => decrypt(channel.CHANNEL_CODE) === value?.value.value)
    formData.value.FLT_SMS_BRAND_CODE = decrypt(selectedChannel?.BRAND_CODE)
  }
}, { deep: true })

const saveSmsSettingDetail = async () => {
  toggleLoading()
  isloading.isLoading = true

  formData.value.FLT_SMS_ACTIVE_YN = smsActive.value ? '1' : '0'

  const payload = {
    ...formData.value,
    FLT_SMS_CHANNEL_CODE: channel.value?.value,
    FLT_SMS_AGENCY_CODE: smsAgency.value?.value,
    FLT_SMS_SALES_TYPE_CODE: salesType.value?.value,
    FLT_SMS_SEND_STATUS_CODE: stepToSend.value?.value,
  }

  const { success } = await smsSetting.saveSmsSettingDetail(payload)
  if (success) {
    await smsSetting.fetchSmsList()
  }
  isloading.isLoading = false
  toggleLoading()
}
</script>

<template>
  <AppContent :loading="pageLoading">
    <div class="grid grid-cols-7 gap-x-6">
      <div class="col-span-5 space-y-3">
        <div class="flex justify-between items-center">
          <p>
            {{ getGridData('PA010400_GRD00001', 'caption', 'List of Messages') }}
          </p>

          <Button
            v-tooltip="{
              content: 'Add New',
              placement: 'left',
              trigger: 'hover',
              distance: 10,
              delay: 100,
              popperClass: 'bg-black text-white rounded-md'
            }"
            rounded
            variant="white"
            border
            size="xs"
            @click="resetFormData"
          >
            <PlusIcon class="w-5 h-5" />
          </Button>
        </div>

        <Table
          id="PA010400_GRD00001"
          header-variant="secondary"
          clickable
          class="overflow-x-auto"
          :columns="smsListTableColumns"
          :items="smsList"
          @on-row-click="onClickSmsRow"
        >
          <template #cell(SMS_ACTIVE_YN)="{ value }">
            <div>
              <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
            </div>
          </template>
        </Table>
      </div>

      <div class="col-span-2 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-2 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <p class="leading-6 font-medium text-sm text-gray-900">
                {{ getComponentData('PA010400_LBL00001', 'caption') }}
              </p>

              <Button
                v-tooltip="{
                  content: 'Copy',
                  placement: 'left',
                  trigger: 'hover',
                  distance: 10,
                  delay: 100,
                  popperClass: 'bg-black text-white rounded-md'
                }"
                :disabled="!canCopySmsSetting"
                rounded
                border
                size="xs"
                @click="copySmsSetting"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
              </Button>
            </div>
          </template>

          <FormGroup
            :label="getComponentData('PA010100_LBL00002', 'caption')"
            label-id="PA010400_LBL00002"
            label-for="PA010400_TXT00001"
            horizontal
            label-width="w-1/3"
          >
            <FormTextInput
              id="PA010400_TXT00001"
              v-model="formData.FLT_SMS_SID"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00003', 'caption')"
            label-id="PA010100_LBL00002"
            horizontal
            label-width="w-1/3"
          >
            <FormCombobox
              v-model="channel"
              :options="smsSetting.getChannelList.map((item) => ({
                name: decrypt(item.CHANNEL_FNAME) + ' - ' + decrypt(item.BRAND_SNAME),
                value: decrypt(item.CHANNEL_CODE)
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00004', 'caption')"
            label-id="PA010100_LBL00004"
            label-for="PA010100_CMB00001"
            horizontal
            label-width="w-1/3"
          >
            <FormCombobox
              id="PA010100_CMB00001"
              v-model="smsAgency"
              :options="smsSetting.getSmsAgencyList.map((item) => ({
                name: decrypt(item.AGENCY_FNAME),
                value: decrypt(item.AGENCY_SID)
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00005', 'caption')"
            label-id="PA010100_LBL00005"
            label-for="PA010100_CMB00002"
            horizontal
            label-width="w-1/3"
          >
            <FormCombobox
              id="PA010100_CMB00002"
              v-model="salesType"
              :options="commonData.getSaleTypeOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00006', 'caption')"
            label-id="PA010100_LBL00006"
            label-for="PA010100_CMB00003"
            horizontal
            label-width="w-1/3"
          >
            <FormCombobox
              id="PA010100_CMB00003"
              v-model="stepToSend"
              :options="stepToSendOptions(salesType.value)"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00007', 'caption')"
            label-id="PA010100_LBL00007"
            label-for="PA010100_TXT00002"
            horizontal
            label-width="w-1/3"
          >
            <FormTextInput
              id="PA010100_TXT00002"
              v-model="formData.FLT_SMS_SEND_TIME"
              type="number"
            />
          </FormGroup>

          <div>
            <FormCheckbox
              v-model="smsActive"
              :label="getComponentData('PA010100_LBL00008', 'caption')"
            />
          </div>

          <FormGroup
            :label="getComponentData('PA010100_LBL00009', 'caption')"
            label-id="PA010100_LBL00009"
            label-for="PA010100_TXT00003"
            horizontal
            label-width="w-1/3"
          >
            <FormTextareaInput
              id="PA010100_TXT00003"
              v-model="formData.FLT_SMS_TEXT"
              :rows="2"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00010', 'caption')"
            label-id="PA010100_LBL00010"
            label-for="PA010100_TXT00004"
            horizontal
            label-width="w-1/3"
          >
            <FormTextareaInput
              id="PA010100_TXT00004"
              v-model="formData.FLT_SMS_REMARK"
              :rows="2"
            />
          </FormGroup>
        </Card>

        <div class="text-end">
          <Button
            id="PA010400_BTN00003"
            class="w-30"
            rounded
            size="sm"
            :disabled="loading"
            :loading="loading"
            @click="saveSmsSettingDetail"
          >
            {{ getComponentData('PA010400_BTN00003', 'caption') }}
          </Button>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
