<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import { ArrowPathIcon } from "@heroicons/vue/24/solid";
import { Cog6ToothIcon } from "@heroicons/vue/24/outline";

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const stationsSettings = stationsSettingsStore()
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getComponentData2 } = usePageLoaderComponent('POP00350');
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { StationList,WHList } = storeToRefs(stationsSettings);

const openChannelsModal = ref(false)

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

const channeldata = ref({})

const formData = ref({
  FLT_STATION_USER_SID: '',
  FLT_USER_CODE: '',
  FLT_USER_FNAME: '',
  FLT_USER_GROUP_FNAME: '',  
  FLT_STATION_ID: '',
  FLT_STATION_WH_CODE: '',
  FLT_STATION_WH_BRAND_CODE: '',
  FLT_STATION_WH_BRAND_FNAME: '',  
  FLT_STATION_REMARK: '',
  STATION_CHANNEL_LIST: [],
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00350')
  await fetchStationList()
  await fetchWHList()

  Wearhouse.value = {
    name: '',
    value: '',
  };
  //country.value = WHList[0]
  isloading.isLoading = false
  togglePageLoading()
})


const Wearhouse = ref({})

const stationListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'EU010100_GRD00001')
})
const channelListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'EU010100_GRD00002')
})

const ChannelSave = (data) => {
  formData.value.STATION_CHANNEL_LIST = data.ChannelDatas.value.map((obj) => {
      const newObj = {};
      Object.entries(obj).forEach(([k, v]) => {
        if (k === 'CHANNEL_BILLNO_TYPE')
        newObj[k] = v ? encrypt('1') : encrypt('0');
        else
        newObj[k] = encrypt(v);
      });
      return newObj;
    });
  channeldata.value.STATION_CHANNEL_LIST = data.ChannelDatas

  /*
  for (let i = 0; i < channeldata.value.STATION_CHANNEL_LIST.length; i++) 
  {
    channeldata.value.STATION_CHANNEL_LIST[i].CHANNEL_BILLNO_TYPE = channeldata.value.STATION_CHANNEL_LIST[i].CHANNEL_BILLNO_TYPE ==='1' ? true : false
  }
  */
  openChannelsModal.value = false
};

const onClickSearch = async () => {
  toggleLoading()
  isloading.isLoading = true
  await stationsSettings.fetchStationList()
  isloading.isLoading = false
  toggleLoading()
}

const fetchStationList = async () => {
  await stationsSettings.fetchStationList()
}

const fetchWHList = async () => {
  await stationsSettings.fetchWHList()
}

const resetFormData = () => {
  formData.value = {
    FLT_STATION_USER_SID: '',
    FLT_USER_CODE: '',
    FLT_USER_FNAME: '',
    FLT_USER_GROUP_FNAME: '',  
    FLT_STATION_ID: '',
    FLT_STATION_WH_CODE: '',
    FLT_STATION_WH_BRAND_CODE: '',
    FLT_STATION_WH_BRAND_FNAME: '',  
    FLT_STATION_REMARK: '',
    STATION_CHANNEL_LIST: [],
  }
  Wearhouse.value = {
    name: '',
    value: '',
  };
}

const openChannelsPopup = async () => {
  formData.value.FLT_STATION_WH_CODE = Wearhouse.value?.value

  channeldata.value.STATION_WH_CODE = Wearhouse.value?.value

  openChannelsModal.value = true
}

const saveStation = async () => {

  DIALOG_TYPE.value = 'SAVE'
  DIALOG_TITLE.value = 'Stations'
  DIALOG_TEXT.value = 'Do you want to save the selected station?'

  openDialogModal.value = true
}

const ConfirmDialog = async () => {
  
  if(DIALOG_TYPE.value === 'SAVE')
  {
    formData.value.FLT_STATION_WH_CODE = Wearhouse.value?.value

    toggleLoading()
    isloading.isLoading = true
    const { success } = await stationsSettings.saveStation(formData.value)
    if (success) {
      await stationsSettings.fetchStationList()
      resetFormData()
    }
    isloading.isLoading = false
    toggleLoading()
  }
  openDialogModal.value = false
}

watch(() => Wearhouse, (value) => {
  if (value) {
    const selectedChannel = WHList.value.find((channel) => decrypt(channel.WH_CODE) === value?.value.value)
    formData.value.FLT_STATION_WH_BRAND_CODE = selectedChannel?.WH_BRAND_CODE ? decrypt(selectedChannel?.WH_BRAND_CODE) : ''
    formData.value.FLT_STATION_WH_BRAND_FNAME = selectedChannel?.WH_BRAND_FNAME ? decrypt(selectedChannel?.WH_BRAND_FNAME) : ''
  }
}, { deep: true })
const onClickChannelListRow = (item) => {

  const RowData = {}
  Object.entries(item).forEach(([key, value]) => {
  if (Array.isArray(value)) {
    // 배열 안의 객체들을 처리
    RowData[key] = value.map((obj) => {
      const newObj = {};
      Object.entries(obj).forEach(([k, v]) => {
        if (k === 'CHANNEL_BILLNO_TYPE')
        newObj[k] = decrypt(v) === '1';
        else
        newObj[k] = decrypt(v);
      });
      return newObj;
    });
  } else {
    // 단일 값 처리
    RowData[key] = decrypt(value);
  }
});

  channeldata.value = RowData/*Object.entries(item).reduce((acc, [key, value]) => {
    
    if (key == 'STATION_CHANNEL_LIST')
    acc[`${key}`] = value;
    else
    acc[`${key}`] = decrypt(value);
    
    return acc;
  }, {});
*/
 // channeldata.value.STATION_CHANNEL_LIST = RowData.STATION_CHANNEL_LIST
/*
  for (let i = 0; i < channeldata.value.STATION_CHANNEL_LIST.length; i++) 
  {
    channeldata.value.STATION_CHANNEL_LIST[i].CHANNEL_BILLNO_TYPE = channeldata.value.STATION_CHANNEL_LIST[i].CHANNEL_BILLNO_TYPE = '1'
  }
*/
  formData.value.FLT_USER_CODE = decrypt(item.USER_CODE)
  formData.value.FLT_USER_FNAME = decrypt(item.USER_FNAME)
  formData.value.FLT_USER_GROUP_FNAME = decrypt(item.USER_GROUP_FNAME)
  formData.value.FLT_STATION_WH_BRAND_FNAME = decrypt(item.STATION_WH_BRAND_FNAME)

  formData.value.FLT_STATION_USER_SID = decrypt(item.USER_SID)
  formData.value.FLT_STATION_ID = decrypt(item.STATION_ID)
  formData.value.FLT_STATION_WH_CODE = decrypt(item.STATION_WH_CODE)
  formData.value.FLT_STATION_WH_BRAND_CODE = decrypt(item.STATION_WH_BRAND_CODE)
  formData.value.FLT_STATION_REMARK = decrypt(item.STATION_REMARK)
  formData.value.STATION_CHANNEL_LIST = item.STATION_CHANNEL_LIST


  const selectedWHGroup = WHList.value.find((WH) => WH.WH_CODE === item.STATION_WH_CODE)
    Wearhouse.value = {
        name: selectedWHGroup?.WH_FNAME ? decrypt(selectedWHGroup?.WH_FNAME) : '',
        value: selectedWHGroup?.WH_CODE ? decrypt(selectedWHGroup?.WH_CODE) : '',
      }
}
</script>

<template>
  <AppContent
    :loading="pageLoading"
  >
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <p>
            {{ getGridData('EU010100_GRD00001', 'caption', 'Search Result') }}
          </p>

          <Button
            v-tooltip="{
              content: getComponentData('EU010100_BTN00001', 'caption','Refresh'),
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
            @click="onClickSearch"
          >
            <ArrowPathIcon class="w-5 h-5" />
          </Button>
        </div>
      </template>          
      <Table
        id="EU010100_GRD00001"
        header-variant="secondary"
        clickable
        :columns="stationListTableColumns"
        :items="StationList"
        @on-row-click="onClickChannelListRow"
      >
        <template #cell(USER_ACTIVE_YN)="{ value }">
          <div>
            <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
          </div>
        </template>
      </Table>
    </Card> 
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>            
        <p class="leading-6 font-medium text-sm text-gray-900">
          {{ getGridData('EU010100_LBL00001', 'caption', 'Detail Of Station') }}
        </p>
      </template>
      <div class="grid grid-cols-4 gap-y-3 gap-x-12">
        <FormGroup
          :label="getComponentData('EU010100_LBL00002', 'caption', 'User ID')"
          label-id="EU010100_LBL00002"
          label-for="EU010100_TXT00001"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="EU010100_TXT00001"
            v-model="formData.FLT_STATION_USER_SID"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('EU010100_LBL00003', 'caption', 'User Code')"
          label-id="EU010100_LBL00003"
          label-for="EU010100_TXT00002"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="EU010100_TXT00002"
            v-model="formData.FLT_USER_CODE"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('EU010100_LBL00004', 'caption', 'User Name')"
          label-id="EU010100_LBL00004"
          label-for="EU010100_TXT00003"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="EU010100_TXT00003"
            v-model="formData.FLT_USER_FNAME"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('EU010100_LBL00005', 'caption', 'Group')"
          label-id="EU010100_LBL00005"
          label-for="EU010100_TXT00004"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="EU010100_TXT00004"
            v-model="formData.FLT_USER_GROUP_FNAME"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('EU010100_LBL00006', 'caption', 'Station No')"
          label-id="EU010100_LBL00006"
          label-for="EU010100_TXT00005"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="EU010100_TXT00005"
            v-model="formData.FLT_STATION_ID"
          />
        </FormGroup>
        
        <FormGroup
          :label="getComponentData('EU010100_LBL00007', 'caption', 'Warehouse')"
          label-id="EU010100_LBL00007"
          label-for="EU010100_TXT00006"
          horizontal
          label-width="w-2/4"
        >
          <FormSelect
            id="EU010100_CMB00001"
            v-model="Wearhouse"
            :options="[
              {
                name: '',
                value: '',
              },
              ...WHList.map((item) => ({
                name: decrypt(item.WH_FNAME),
                value: decrypt(item.WH_CODE),
              }))
            ]" 
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('EU010100_LBL00008', 'caption', 'Brand')"
          label-id="EU010100_LBL00008"
          label-for="EU010100_TXT00006"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="EU010100_TXT00006"
            v-model="formData.FLT_STATION_WH_BRAND_FNAME"
            disabled
          />
        </FormGroup>         
        <FormGroup
          :label="getComponentData('EU010100_LBL00009', 'caption', 'Remark')"
          label-id="EU010100_LBL00009"
          label-for="EU010100_TXT00007"
          horizontal
          label-width="w-2/4"
        >
          <FormTextareaInput
            id="EU010100_TXT00007"
            v-model="formData.FLT_STATION_REMARK"
          />
        </FormGroup>  
      </div>   
      <Card
        divider
        shadow-size="none"
        card-header-class="px-3 py-2 space-y-1"
        class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
        card-body-class="p-3 space-y-3"
      >
        <template #header>
          <div class="flex justify-between items-center">
            <p>
              {{ getGridData('EU010100_GRD00002', 'caption', 'Channels') }}
            </p>

            <Button
              v-tooltip="{
                content: getComponentData('EU010100_BTN00002', 'caption','Setting'),
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
              :disabled="formData.FLT_STATION_USER_SID == ''"  
              @click="openChannelsPopup()"
            >
              <Cog6ToothIcon class="w-5 h-5" />
            </Button>
          </div>
        </template>          
        <Table
          id="EU010100_GRD00002"
          header-variant="secondary"
          clickable
          :columns="channelListTableColumns"
          :items="formData.STATION_CHANNEL_LIST"
        >
          <template #cell(CHANNEL_ACTIVE_YN)="{ value }">
            <div>
              <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
            </div>
          </template>
          <template #cell(CHANNEL_BILLNO_TYPE)="{ value }">
            <div>
              <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
            </div>
          </template>
        </Table>
      </Card>      
      <div class="grid grid-cols-6 gap-y-3 gap-x-12">
        <FormGroup />
        <FormGroup />
        <FormGroup />
        <FormGroup />
        <div class="col-span-2 text-end">
          <div class="inline-flex items-center space-x-2">
            <Button
              id="EU010100_BTN00004"
              class="w-60"
              rounded
              :disabled="formData.FLT_STATION_USER_SID == ''"
              :loading="loading"
              @click="resetFormData"
            >
              {{ getComponentData('EU010100_BTN00004', 'caption','Clear Station Info.') }}
            </Button> 
            <Button
              id="EU010100_BTN00003"
              class="w-30"
              rounded
              :disabled="formData.FLT_STATION_USER_SID == ''"
              :loading="loading"
              @click="saveStation"
            >
              {{ getComponentData('EU010100_BTN00003', 'caption','SAVE') }}
            </Button>
          </div>          
        </div>         
      </div>        
    </Card>     
    <!-- Edit User Modal -->
    <Modal
      :show="openChannelsModal"
      size="11xl"
      divider
      @close="() => {
        openChannelsModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData2('POP00350_LBL00001', 'caption','Station Channel Setting') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00350`"
          :channeldata="channeldata"
          @data-changed="ChannelSave"
        />
      </template>
    </Modal>
    <!-- Dialog Modal -->
    <Modal
      :show="openDialogModal"
      divider
      @close="() => {
        openDialogModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00001_LBL00001', 'caption', 'Information') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00001'"
          :dialogTitle="DIALOG_TITLE"
          :dialogText="DIALOG_TEXT"
          @btn-confirm="ConfirmDialog"
          @btn-cancel="() => {
            openDialogModal = false
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
