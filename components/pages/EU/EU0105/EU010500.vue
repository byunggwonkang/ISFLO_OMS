<script setup>
import { ArrowPathIcon } from "@heroicons/vue/24/solid";

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
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')

  await fetchChannelList()
  await commonData.fetchAllCommonData()

  country.value = commonData.getCountriesList[0]
  togglePageLoading()
})

const country = ref({})

const channelListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'EU010100_GRD00001')
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
  const { success } = await saChannelSettings.saveChannelDetail(formData.value)
  if (success) {
    await saChannelSettings.fetchChannelList()
    resetFormData()
  }
  toggleLoading()
}

const onClickChannelListRow = (item) => {
  Object.keys(item).forEach((key) => {
    formData.value[`FLT_${key}`] = item[key]
  })

  formData.value.FLT_SAVE_TYPE = 'UPDATE'
  formData.value.FLT_CHANNEL_COUNTRY_CODE = item.CHANNEL_COUNTRY_CODE

  country.value = commonData.getCountriesList.find((country) => country.value === item.CHANNEL_COUNTRY_CODE)
}
</script>

<template>
  <AppContent
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-4 gap-y-3 gap-x-12">
        <FormGroup          
          :label="getComponentData('EU010500_LBL00001', 'caption', 'QA Package Option : ')"
          label-id="EU010500_LBL00001"
          label-for="EU010500_LBL00002"
          horizontal
          class="font-medium text-sm text-blue-700"
          label-width="w-2/4"
        >
          <p 
            id="EU010500_LBL00002"
            class="leading-6 font-medium text-sm text-blue-700"
          >
            {{ getComponentData('EU010100_LBL00010', 'caption', 'Premium') }}
          </p>
        </FormGroup>
        <div class="col-span-1 text-start">
          <Button
            id="EU010500_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('EU010500_BTN00001', 'caption', 'STATUS') }}
          </Button>
        </div>
        <FormGroup />
        <div class="col-span-1 text-end">
          <Button
            id="EU010500_BTN00002"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('EU010500_BTN00002', 'caption', 'QA VIEWER') }}
          </Button>
        </div>
        <FormGroup
          :label="getComponentData('EU010500_LBL00003', 'caption', '- Resolution : ')"
          label-id="EU010500_LBL00003"
          label-for="EU010500_LBL00004"
          horizontal
          label-width="w-2/4"
        >
          <p 
            id="EU010500_LBL00004"
            class="leading-6 font-medium text-sm text-blue-700"
          >
            {{ getComponentData('EU010500_LBL00004', 'caption', 'HD') }}
          </p>
        </FormGroup>
        <FormGroup />
        <FormGroup />
        <FormGroup />
        <FormGroup
          :label="getComponentData('EU010500_LBL00005', 'caption', '- Video Storage : ')"
          label-id="EU010500_LBL00005"
          label-for="EU010500_LBL00006"
          horizontal
          label-width="w-2/4"
        >
          <p 
            id="EU010500_LBL00006"
            class="leading-6 font-medium text-sm text-blue-700"
          >
            {{ getComponentData('EU010500_LBL00006', 'caption', '3GB') }}
          </p>
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU010500_LBL00007', 'caption', '- Video Storage Expired  : ')"
          label-id="EU010500_LBL00007"
          label-for="EU010500_LBL00008"
          horizontal
          label-width="w-2/4"
        >
          <p 
            id="EU010500_LBL00008"
            class="leading-6 font-medium text-sm text-blue-700"
          >
            {{ getComponentData('EU010500_LBL00008', 'caption', '180 days') }}
          </p>
        </FormGroup>
        <FormGroup />
        <FormGroup />
        <FormGroup
          :label="getComponentData('EU010500_LBL00009', 'caption', '- Pictures Storage : ')"
          label-id="EU010500_LBL00009"
          label-for="EU010500_LBL00010"
          horizontal
          label-width="w-2/4"
        >
          <p 
            id="EU010500_LBL00010"
            class="leading-6 font-medium text-sm text-blue-700"
          >
            {{ getComponentData('EU010500_LBL00010', 'caption', '1GB') }}
          </p>
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU010500_LBL00011', 'caption', '- Picture Storage Expired  : ')"
          label-id="EU010500_LBL00011"
          label-for="EU010500_LBL00012"
          horizontal
          label-width="w-2/4"
        >
          <p 
            id="EU010500_LBL00012"
            class="leading-6 font-medium text-sm text-blue-700"
          >
            {{ getComponentData('EU010500_LBL00012', 'caption', '180 days') }}
          </p>
        </FormGroup>
      </div>
    </template>
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >     
      <template #header>            
        <div>
          <FormCheckbox
            id="EU010500_CHK00001"
            v-model="formData.FLT_CHANNEL_ACTIVE_YN"
            :label="getComponentData('EU010500_LBL00013', 'caption', 'Enable QA Viewer')"
            label-id="EU010500_LBL00013"
            :checked="formData.FLT_CHANNEL_ACTIVE_YN === '1'"
          />
        </div>
      </template>

      <Card
        divider
        shadow-size="none"
        card-header-class="px-3 py-2 space-y-1"
        class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
        card-body-class="p-3 space-y-3"
      > 
        <template #header>            
          <div>
            <FormCheckbox
              id="EU010500_CHK00002"
              v-model="formData.FLT_CHANNEL_ACTIVE_YN"
              :label="getComponentData('EU010500_LBL00014', 'caption', 'Recording Shipment Inspection')"
              label-id="EU010500_LBL00014"
              :checked="formData.FLT_CHANNEL_ACTIVE_YN === '1'"
            />
          </div>
        </template>
        <div class="grid grid-cols-4 gap-y-3 gap-x-12">        
          <FormGroup
            :label="getComponentData('EU010500_LBL00015', 'caption', 'Starting Event')"
            label-id="EU010500_LBL00015"
            label-for="EU010500_CMB00001"
            horizontal
            label-width="w-1/4"
          >
            <FormSelect
              id="EU010500_CMB00001"
              v-model="country"
              :options="commonData.getCountriesList"
            />
          </FormGroup>
          <FormGroup />
          <FormGroup />
          <FormGroup />
          <FormGroup
            :label="getComponentData('EU010500_LBL00016', 'caption', 'Ending Event')"
            label-id="EU010500_LBL00016"
            label-for="EU010500_CMB00002"
            horizontal
            label-width="w-1/4"
          >
            <FormSelect
              id="EU010500_CMB00002"
              v-model="country"
              :options="commonData.getCountriesList"
            />
          </FormGroup>
          <FormGroup />
          <FormGroup />
          <FormGroup />
          <FormGroup
            :label="getComponentData('EU010500_LBL00017', 'caption', 'Viewer Type')"
            label-id="EU010500_LBL00017"
            label-for="EU010500_CHK00003"
            horizontal
            label-width="w-1/4"
          >
            <FormCheckbox
              id="EU010500_CHK00003"
              v-model="formData.FLT_CHANNEL_ACTIVE_YN"
              :checked="formData.FLT_CHANNEL_ACTIVE_YN === '1'"
            />
          </FormGroup>
        </div> 
      </Card>
      <Card
        divider
        shadow-size="none"
        card-header-class="px-3 py-2 space-y-1"
        class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
        card-body-class="p-3 space-y-3"
      > 
        <template #header>            
          <div>
            <FormCheckbox
              id="EU010500_CHK00004"
              v-model="formData.FLT_CHANNEL_ACTIVE_YN"
              :label="getComponentData('EU010500_LBL00018', 'caption', 'Recording Return Inspection')"
              label-id="EU010500_LBL00018"
              :checked="formData.FLT_CHANNEL_ACTIVE_YN === '1'"
            />
          </div>
        </template>
        <div class="grid grid-cols-4 gap-y-3 gap-x-12">        
          <FormGroup
            :label="getComponentData('EU010500_LBL00019', 'caption', 'Starting Event')"
            label-id="EU010500_LBL00019"
            label-for="EU010500_CMB00003"
            horizontal
            label-width="w-1/4"
          >
            <FormSelect
              id="EU010500_CMB00003"
              v-model="country"
              :options="commonData.getCountriesList"
            />
          </FormGroup>
          <FormGroup />
          <FormGroup />
          <FormGroup />
          <FormGroup
            :label="getComponentData('EU010500_LBL00020', 'caption', 'Ending Event')"
            label-id="EU010500_LBL00020"
            label-for="EU010500_CMB00004"
            horizontal
            label-width="w-1/4"
          >
            <FormSelect
              id="EU010500_CMB00004"
              v-model="country"
              :options="commonData.getCountriesList"
            />
          </FormGroup>
          <FormGroup />
          <FormGroup />
          <FormGroup />
          <FormGroup
            :label="getComponentData('EU010500_LBL00021', 'caption', 'Viewer Type')"
            label-id="EU010500_LBL00021"
            label-for="EU010500_CHK00005"
            horizontal
            label-width="w-1/4"
          >
            <FormCheckbox
              id="EU010500_CHK00005"
              v-model="formData.FLT_CHANNEL_ACTIVE_YN"
              :checked="formData.FLT_CHANNEL_ACTIVE_YN === '1'"
            />
          </FormGroup>
        </div> 
      </Card>

      <div>
        <FormCheckbox
          id="EU010500_CHK00006"
          v-model="formData.FLT_CHANNEL_ACTIVE_YN"
          :label="getComponentData('EU010500_LBL00022', 'caption', 'Taking Pictures for Return Inspection')"
          label-id="EU010500_LBL00022"
          :checked="formData.FLT_CHANNEL_ACTIVE_YN === '1'"
        />
      </div>
    </Card>
    <div class="grid grid-cols-4 gap-y-3 gap-x-12">
      <FormGroup />
      <FormGroup />
      <FormGroup />
      <div class="col-span-1 text-end">
        <Button
          id="EU010500_BTN00003"
          rounded
          variant="gray"
          :loading="loading"
          :disabled="loading"
          @click="search"
        >
          {{ getComponentData('EU010500_BTN00003', 'caption', 'Save') }}
        </Button>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
