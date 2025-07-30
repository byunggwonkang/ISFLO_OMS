<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const saChannelSettings = useSAChannelSettingsStore()
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { channelList } = storeToRefs(saChannelSettings);

const formData = ref({
  FLT_SAVE_TYPE: 'INSERT',
  FLT_CHANNEL_CODE: '',
  FLT_CHANNEL_SNAME_ENG: '',
  FLT_CHANNEL_FNAME_ENG: '',
  FLT_CHANNEL_SNAME_KOR: '',
  FLT_CHANNEL_FNAME_KOR: '',
  FLT_CHANNEL_SNAME_CHN: '',
  FLT_CHANNEL_FNAME_CHN: '',
  FLT_CHANNEL_SNAME_JPN: '',
  FLT_CHANNEL_FNAME_JPN: '',
  FLT_CHANNEL_ACTIVE_YN: '',
  FLT_CHANNEL_COUNTRY_CODE: '',
  FLT_CHANNEL_REMARK: ''
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')

  await fetchChannelList()
  await commonData.fetchSA000300CommonData()

  country.value = commonData.getCountriesList[0]
  isloading.isLoading = false
  togglePageLoading()
})

const country = ref({})

const channelListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'SA000300_GRD00001')
})

const fetchChannelList = async () => {
  await saChannelSettings.fetchChannelList()
}

const resetFormData = () => {
  formData.value = {
    FLT_SAVE_TYPE: 'INSERT',
    FLT_CHANNEL_CODE: '',
    FLT_CHANNEL_SNAME_ENG: '',
    FLT_CHANNEL_FNAME_ENG: '',
    FLT_CHANNEL_SNAME_KOR: '',
    FLT_CHANNEL_FNAME_KOR: '',
    FLT_CHANNEL_SNAME_CHN: '',
    FLT_CHANNEL_FNAME_CHN: '',
    FLT_CHANNEL_SNAME_JPN: '',
    FLT_CHANNEL_FNAME_JPN: '',
    FLT_CHANNEL_ACTIVE_YN: '',
    FLT_CHANNEL_COUNTRY_CODE: '',
    FLT_CHANNEL_REMARK: ''
  }
}

const saveChannelDetail = async () => {
  formData.value.FLT_CHANNEL_COUNTRY_CODE = country.value?.value

  toggleLoading()
  
  isloading.isLoading = true
  const { success } = await saChannelSettings.saveChannelDetail(formData.value)
  if (success) {
    await saChannelSettings.fetchChannelList()
    resetFormData()
  }
  isloading.isLoading = false
  toggleLoading()
}

const onClickChannelListRow = (item) => {
  Object.keys(item).forEach((key) => {
    formData.value[`FLT_${key}`] = decrypt(item[key])
  })

  formData.value.FLT_SAVE_TYPE = 'UPDATE'
  formData.value.FLT_CHANNEL_COUNTRY_CODE = decrypt(item.CHANNEL_COUNTRY_CODE)

  country.value = commonData.getCountriesList.find((country) => country.value === decrypt(item.CHANNEL_COUNTRY_CODE))
}
</script>

<template>
  <AppContent
    :loading="pageLoading"
  >
    <div class="grid grid-cols-7 gap-x-6">
      <div class="col-span-5 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-1 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <p>
                {{ getGridData('SA000300_GRD00001', 'caption', 'List of Channels') }}
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
          </template>
          <Table
            id="SA000300_GRD00001"
            header-variant="secondary"
            clickable
            :columns="channelListTableColumns"
            :items="channelList"
            @on-row-click="onClickChannelListRow"
          >
            <template #cell(CHANNEL_ACTIVE_YN)="{ value }">
              <div>
                <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
              </div>
            </template>
          </Table>
        </Card>
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
              {{ getComponentData('SA000300_LBL00013', 'caption', 'Detail Of Channel') }}
            </p>
          </template>

          <FormGroup
            :label="getComponentData('SA000300_LBL00001', 'caption', 'Channel Code')"
            label-id="SA000300_LBL00001"
            label-for="SA000300_TXT00001"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00001"
              v-model="formData.FLT_CHANNEL_CODE"
              :disabled="formData.FLT_SAVE_TYPE === 'UPDATE'"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00002', 'caption', 'Channel Short Name (ENG)')"
            label-id="SA000300_LBL00002"
            label-for="SA000300_TXT00002"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00002"
              v-model="formData.FLT_CHANNEL_SNAME_ENG"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00003', 'caption', 'Channel Full Name (ENG)')"
            label-id="SA000300_LBL00003"
            label-for="SA000300_TXT00003"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00003"
              v-model="formData.FLT_CHANNEL_FNAME_ENG"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00004', 'caption', 'Channel Short Name (KOR)')"
            label-id="SA000300_LBL00004"
            label-for="SA000300_TXT00004"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00004"
              v-model="formData.FLT_CHANNEL_SNAME_KOR"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00005', 'caption', 'Channel Full Name (KOR)')"
            label-id="SA000300_LBL00005"
            label-for="SA000300_TXT00005"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00005"
              v-model="formData.FLT_CHANNEL_FNAME_KOR"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00006', 'caption', 'Channel Short Name (CHN)')"
            label-id="SA000300_LBL00006"
            label-for="SA000300_TXT00006"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00006"
              v-model="formData.FLT_CHANNEL_SNAME_CHN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00007', 'caption', 'Channel Full Name (CHN)')"
            label-id="SA000300_LBL00007"
            label-for="SA000300_TXT00007"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00007"
              v-model="formData.FLT_CHANNEL_FNAME_CHN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00008', 'caption', 'Channel Short Name (JPN)')"
            label-id="SA000300_LBL00008"
            label-for="SA000300_TXT00008"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00008"
              v-model="formData.FLT_CHANNEL_SNAME_JPN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00009', 'caption', 'Channel Full Name (JPN)')"
            label-id="SA000300_LBL00009"
            label-for="SA000300_TXT00009"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00009"
              v-model="formData.FLT_CHANNEL_FNAME_JPN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000300_LBL00010', 'caption', 'Channel Active')"
            label-id="SA000300_LBL00010"
            label-for="SA000300_CMB00001"
            horizontal
            label-width="w-2/4"
          >
            <FormSelect
              id="SA000300_CMB00001"
              v-model="country"
              :options="commonData.getCountriesList"
            />
          </FormGroup>

          <div>
            <FormCheckbox
              v-model="formData.FLT_CHANNEL_ACTIVE_YN"
              :label="getComponentData('SA000300_LBL00011', 'caption', 'Channel Active')"
              label-id="SA000300_LBL00011"
              :checked="formData.FLT_CHANNEL_ACTIVE_YN === '1'"
            />
          </div>

          <FormGroup
            :label="getComponentData('SA000300_LBL00012', 'caption', 'Channel Remark')"
            label-id="SA000300_LBL00012"
            label-for="SA000300_TXT00010"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000300_TXT00010"
              v-model="formData.FLT_CHANNEL_REMARK"
            />
          </FormGroup>

          <div class="text-end">
            <Button
              id="SA000300_BTN00002"
              class="w-30"
              rounded
              :disabled="loading"
              :loading="loading"
              @click="saveChannelDetail"
            >
              {{ getComponentData('SA000300_BTN00002', 'caption') }}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
