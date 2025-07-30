<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const logisticsManagement = useLogisticsManagementStore()
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { logisticsList } = storeToRefs(logisticsManagement)

const formData = ref({
  FLT_COURIER_BRAND_CODE: '',
  FLT_COURIER_CHANNEL_CODE: '',
  FLT_COURIER_SID: '',
  FLT_COURIER_ACTIVE_YN: true,
  FLT_COURIER_ERP_CODE: '',
  FLT_COURIER_REMARK: '',
  FLT_COURIER_VALUE_01: '',
  FLT_COURIER_VALUE_02: '',
  FLT_COURIER_VALUE_03: '',
  FLT_COURIER_VALUE_04: '',
  FLT_COURIER_VALUE_05: '',
  FLT_COURIER_VALUE_06: '',
  FLT_COURIER_VALUE_07: '',
  FLT_COURIER_VALUE_08: '',
  FLT_COURIER_VALUE_09: '',
  FLT_COURIER_VALUE_10: ''
})

const brand = ref({})
const channel = ref({})
const courier = ref({})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await logisticsManagement.fetchUserGroupBrandList()
  await logisticsManagement.fetchLogisticsList()
  await logisticsManagement.fetchCourierList()
  await logisticsManagement.fetchChannelList()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')

  resetFormData()
  isloading.isLoading = false
  togglePageLoading()
})

const logisticsListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'PA010100_GRD00001')
})

const resetFormData = () => {
  formData.value = {
    FLT_COURIER_BRAND_CODE: '',
    FLT_COURIER_CHANNEL_CODE: '',
    FLT_COURIER_SID: '',
    FLT_COURIER_ACTIVE_YN: true,
    FLT_COURIER_ERP_CODE: '',
    FLT_COURIER_REMARK: '',
    FLT_COURIER_VALUE_01: '',
    FLT_COURIER_VALUE_02: '',
    FLT_COURIER_VALUE_03: '',
    FLT_COURIER_VALUE_04: '',
    FLT_COURIER_VALUE_05: '',
    FLT_COURIER_VALUE_06: '',
    FLT_COURIER_VALUE_07: '',
    FLT_COURIER_VALUE_08: '',
    FLT_COURIER_VALUE_09: '',
    FLT_COURIER_VALUE_10: ''
  }

  const defaultChannel = logisticsManagement.getChannelList[0]
  const defaultCourier = logisticsManagement.getCourierList[0]

  brand.value = {}
  channel.value = {
    name: decrypt(defaultChannel.CHANNEL_FNAME) + ' - ' + decrypt(defaultChannel.BRAND_SNAME),
    value: decrypt(defaultChannel.CHANNEL_CODE)
  }
  courier.value = {
    name: decrypt(defaultCourier.COURIER_FNAME),
    value: decrypt(defaultCourier.COURIER_SID)
  }
}

const onClickLogisticsListRow = (item) => {
  Object.entries(item).forEach(([key, value]) => {
    if (key === 'COURIER_ACTIVE_YN') {
      formData.value[`FLT_${key}`] = decrypt(value) === '1'
    } else {
      formData.value[`FLT_${key}`] = decrypt(value)
    }
  })

  const selectedCourier = logisticsManagement.getCourierList.find((courier) => courier.COURIER_SID === item.COURIER_SID)
  const selectedChannel = logisticsManagement.getChannelList.find((channel) => channel.CHANNEL_CODE === item.COURIER_CHANNEL_CODE)

  channel.value = {
    name: decrypt(selectedChannel.CHANNEL_FNAME) + ' - ' + decrypt(selectedChannel.BRAND_SNAME),
    value:decrypt(selectedChannel.CHANNEL_CODE)
  }

  courier.value = {
    name: decrypt(selectedCourier.COURIER_FNAME),
    value: decrypt(selectedCourier.COURIER_SID)
  }
}

watch(() => channel, (value) => {
  if (value) {
    const selectedChannel = logisticsManagement.getChannelList.find((channel) => decrypt(channel.CHANNEL_CODE) === value?.value.value)
    formData.value.FLT_COURIER_BRAND_CODE = decrypt(selectedChannel?.BRAND_CODE)
  }
}, { deep: true })

const saveLogisticsDetail = async () => {
  formData.value.FLT_COURIER_CHANNEL_CODE = channel.value.value
  formData.value.FLT_COURIER_SID = courier.value.value

  toggleLoading()
  isloading.isLoading = true
  const { success } = await logisticsManagement.saveLogisticsDetail(formData.value)
  if (success) {
    await logisticsManagement.fetchLogisticsList()
    resetFormData()
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
            {{ getGridData('PA010100_GRD00001', 'caption', 'List of Brands') }}
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
          id="PA010100_GRD00001"
          header-variant="secondary"
          clickable
          class="overflow-x-auto"
          :columns="logisticsListTableColumns"
          :items="logisticsList"
          @on-row-click="onClickLogisticsListRow"
        >
          <template #cell(COURIER_ACTIVE_YN)="{ value }">
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
            <p class="leading-6 font-medium text-sm text-gray-900">
              {{ getComponentData('PA010100_LBL00001', 'caption') }}
            </p>
          </template>

          <FormGroup
            :label="getComponentData('PA010100_LBL00002', 'caption')"
            label-id="PA010100_LBL00002"
            label-for="PA010100_CMB00001"
            horizontal
            label-width="w-1/3"
          >
            <FormCombobox
              id="PA010100_CMB00001"
              v-model="channel"
              :options="logisticsManagement.getChannelList.map((item) => ({
                name: decrypt(item.CHANNEL_FNAME) + ' - ' + decrypt(item.BRAND_SNAME),
                value: decrypt(item.CHANNEL_CODE)
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00003', 'caption')"
            label-id="PA010100_LBL00003"
            label-for="PA010100_CMB00002"
            horizontal
            label-width="w-1/3"
          >
            <FormCombobox
              id="PA010100_CMB00002"
              v-model="courier"
              :options="logisticsManagement.getCourierList.map((item) => ({
                name: decrypt(item.COURIER_FNAME),
                value: decrypt(item.COURIER_SID)
              }))"
            />
          </FormGroup>

          <div>
            <FormCheckbox
              v-model="formData.FLT_COURIER_ACTIVE_YN"
              value="1"
              :label="getComponentData('PA010100_LBL00004', 'caption')"
              label-id="PA010100_CHK00001"
              :checked="formData.FLT_COURIER_ACTIVE_YN === '1'"
            />
          </div>

          <FormGroup
            :label="getComponentData('PA010100_LBL00005', 'caption')"
            label-id="PA010100_LBL00005"
            label-for="PA010100_TXT00001"
            horizontal
            label-width="w-1/3"
          >
            <FormTextInput
              id="PA010100_TXT00001"
              v-model="formData.FLT_COURIER_ERP_CODE"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00006', 'caption')"
            label-id="PA010100_LBL00006"
            label-for="PA010100_TXT00002"
            horizontal
            label-width="w-1/3"
          >
            <FormTextInput
              id="PA010100_TXT00002"
              v-model="formData.FLT_COURIER_VALUE_01"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00007', 'caption')"
            label-id="PA010100_LBL00007"
            label-for="PA010100_TXT00003"
            horizontal
            label-width="w-1/3"
          >
            <FormTextInput
              id="PA010100_TXT00003"
              v-model="formData.FLT_COURIER_VALUE_02"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00008', 'caption')"
            label-id="PA010100_LBL00008"
            label-for="PA010100_TXT00004"
            horizontal
            label-width="w-1/3"
          >
            <FormTextInput
              id="PA010100_TXT00004"
              v-model="formData.FLT_COURIER_VALUE_03"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00009', 'caption')"
            label-id="PA010100_LBL00009"
            label-for="PA010100_TXT00005"
            horizontal
            label-width="w-1/3"
          >
            <FormTextInput
              id="PA010100_TXT00005"
              v-model="formData.FLT_COURIER_VALUE_04"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00010', 'caption')"
            label-id="PA010100_LBL00010"
            label-for="PA010100_TXT00006"
            horizontal
            label-width="w-1/3"
          >
            <FormTextInput
              id="PA010100_TXT00006"
              v-model="formData.FLT_COURIER_VALUE_05"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010100_LBL00011', 'caption')"
            label-id="PA010100_LBL00011"
            label-for="PA010100_TXT00007"
            horizontal
            label-width="w-1/3"
          >
            <FormTextareaInput
              id="PA010100_TXT00007"
              v-model="formData.FLT_COURIER_REMARK"
            />
          </FormGroup>
        </Card>

        <div class="text-end">
          <Button
            id="PA010100_BTN00002"
            class="w-30"
            rounded
            size="sm"
            :disabled="loading"
            :loading="loading"
            @click="saveLogisticsDetail"
          >
            {{ getComponentData('PA010100_BTN00002', 'caption') }}
          </Button>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
