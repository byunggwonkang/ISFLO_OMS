<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import moment from "moment";
import VueFeather from "vue-feather";

const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const staffManagement = useStaffManagement()
const { currentTab } = storeToRefs(useTabsStore())

const { StaffSummaryList, filters, WorkStaffList,  WorkStaffData,Workfilters  } = storeToRefs(staffManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(WorkStaffList, perPage.value);
const { loading, toggleLoading } = useLoading()

const InCharge = ref({})

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const fetchStaffSummaryList = async () => {
  await staffManagement.fetchStaffSummaryList()
}

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

const fetchWorkStaffList = async () => {
  await staffManagement.fetchWorkStaffList()
}

const CopyformData = ref({
  FLT_WORK_DATE: '',
  FLT_COPY_DATE_FROM: moment().format('YYYY-MM-DD'),
  FLT_COPY_DATE_TO: moment().format('YYYY-MM-DD'), 
})

const DeleteformData = ref({  
  FLT_WORK_DATE_FROM: moment().format('YYYY-MM-DD'),
  FLT_WORK_DATE_TO: moment().format('YYYY-MM-DD'), 
})
const removeWork = async (item) => {
  
  DeleteformData.value.FLT_WORK_DATE_FROM = item.WORK_DATE
  DeleteformData.value.FLT_WORK_DATE_TO = item.WORK_DATE

  toggleLoading()
  isloading.isLoading = true
  const { success } = await staffManagement.DeleteWorkStaff(DeleteformData.value)
  if (success) {
    await fetchStaffSummaryList()    
  }
  isloading.isLoading = false
  toggleLoading()
};

onBeforeUnmount(() => {
  staffManagement.clearStaffSummaryList()
  staffManagement.clearWorkStaffList()
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')  
  await pageLoader.fetchPageLoadData('POP00310')
  await pageLoader.fetchPageLoadData('POP00360')
  await commonData.fetchEU010200CommonData();
  

  InCharge.value = {
    name: 'All',
    value: '',
  };
  isloading.isLoading = false

  togglePageLoading()
})

const search = async (showLoading = true) => {
  filters.value.FLT_WORK_DATE_TO = moment(filters.value.FLT_WORK_DATE_TO).format('YYYY-MM-DD')
  filters.value.FLT_JOB_TYPE_CODE = InCharge.value?.value ?? ''

  if (showLoading) toggleLoading()
  isloading.isLoading = true
  await fetchStaffSummaryList()
  isloading.isLoading = false
  if (showLoading) toggleLoading()

}

const Copy = async () => {

  DIALOG_TYPE.value = 'COPY'
  DIALOG_TITLE.value = 'Copy Staff Schedule'
  DIALOG_TEXT.value = 'Would you like to copy the schedule for the selected date?\n' + 
                      CopyformData.value.FLT_COPY_DATE_FROM + ' ~ ' + 
                      CopyformData.value.FLT_COPY_DATE_TO

  openDialogModal.value = true

}

const StaffWorkListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU010200_GRD00001')
})

const StaffListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'EU010200_GRD00002')
})

const openStaffManagementModal = ref(false)
const openStaffWorkModal = ref(false)
const isCreate = ref(false)
const isWorkdate = ref("")

const promotionItemData = ref({})
const onClickItemRow = (item) => {

  Object.keys(item).forEach((key) => {
    if (key === 'WORK_DATE'){
      Workfilters.value.FLT_WORK_DATE_FROM = moment(decrypt(item[key])).format('YYYY-MM-DD')
      Workfilters.value.FLT_WORK_DATE_TO = moment(decrypt(item[key])).format('YYYY-MM-DD')        
    }    
  })
  isloading.isLoading = true  
  fetchWorkStaffList()
  isloading.isLoading = false

  resetPage()  
}

const StaffWorkModal = async (Create = true) => {
  isCreate.value = Create
  isWorkdate.value = ''
  if (!Create){isWorkdate.value = WorkStaffData.value.WORK_DATE }
  openStaffWorkModal.value = true
}

const ConfirmDialog = async () => {
  
  if(DIALOG_TYPE.value === 'COPY')
  {
    CopyformData.value.FLT_WORK_DATE = decrypt(WorkStaffData.value.WORK_DATE)  

    toggleLoading()
  isloading.isLoading = true
    const { success } = await staffManagement.CopyWorkStaff(CopyformData.value)
    if (success) {
      await fetchStaffSummaryList()    
    }
    isloading.isLoading = false
    toggleLoading()

  }
  openDialogModal.value = false
}

</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-y-3 gap-x-12">       
        <FormGroup
          :label="getComponentData('EU010200_LBL00002', 'caption', 'Work Date')"
          label-id="EU010200_LBL00002"
          horizontal
        >
          <div class="inline-flex items-center space-x-2">
            <FormDatePicker
              id="EU010200_DAT00001"
              v-model.string="filters.FLT_WORK_DATE_FROM"
              placeholder="Select a date"
              mode="date"
            />

            <FormDatePicker
              id="EU010200_DAT00002"
              v-model.string="filters.FLT_WORK_DATE_TO"
              placeholder="Select a date"
              mode="date"
            />
          </div>
        </FormGroup>
        
        <FormGroup
          :label="getComponentData('EU010200_LBL00003', 'caption', 'In Charge')"
          label-id="EU010200_LBL00003"
          label-for="EU010200_CMB00003"
          horizontal
        >
          <FormSelect
            id="EU010200_CMB00002"
            v-model="InCharge"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...commonData.getESMJobTypes
            ]"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('EU010200_LBL00004', 'caption', 'Staff Name')"
          label-id="EU010200_LBL00004"
          horizontal
        >
          <FormTextInput
            id="EU010200_TXT00001"
            v-model="filters.FLT_KEY_WORD"
          />
        </FormGroup>

        <div class="col-span-1 text-start">
          <Button
            id="EU010200_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('EU010200_BTN00001', 'caption', 'Search') }}
          </Button>
        </div>

        <div class="col-span-1 text-end">
          <Button
            id="EU010200_BTN00002"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="openStaffManagementModal = true"
          >
            {{ getComponentData('EU010200_BTN00002', 'caption', 'Staffs') }}
          </Button>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-7 py-3 gap-y-6 gap-x-6">
      <div class="col-span-2 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-3 space-y-3"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >
          <span class="font-black text-md">
            {{ getGridData('EU010200_GRD00001', 'caption', 'Staffs Count') }}
          </span>
          <Table
            id="EU010200_GRD00001"
            style="max-height: 50rem;"
            border
            clickable
            class="w-auto h-200 overflow-y-auto"
            header-variant="secondary"           
            :columns="[
              ...StaffWorkListTableFields,
              {
                caption: 'DELETE',
                dataFieldName: 'ACTION',
                display: 'Y'
              }
            ]" 
            :items="StaffSummaryList"
            @on-row-click="onClickItemRow"
          >
            <template #cell(ACTION)="{ item }">
              <span
                class=" cursor-pointer hover:font-bold hover:text-blue-700"
                @click="(e) => {
                  e.stopPropagation();
                  removeWork(item)
                }"
              >
                <VueFeather
                  type="x-square"
                  class="h-5 w-5"
                />
              </span>
            </template>
          </Table>
        </Card>        
      </div>
      <div class="col-span-5 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-3 space-y-3"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >          
          <template #header>
            <div class="grid grid-cols-5 gap-y-3 gap-x-12">        
              <FormGroup
                :label="getComponentData('EU010200_LBL00005', 'caption', 'Date')"
                label-id="EU010200_LBL00005"
                horizontal
              >
                <FormTextInput
                  id="EU010200_TXT00001"
                  :value="decrypt(WorkStaffData.WORK_DATE)"
                  disabled
                />
              </FormGroup>

              <div class="col-span-1 text-start">
                <Button
                  id="EU010200_BTN00003"
                  rounded
                  variant="gray"
                  :disabled="WorkStaffData.WORK_DATE == ''"
                  @click="StaffWorkModal(false)"
                >
                  {{ getComponentData('EU010200_BTN00003', 'caption', 'Detail') }}
                </Button>
              </div>
              <FormGroup />
              <FormGroup />
              <div class="col-span-1 text-end">
                <Button
                  id="EU010200_BTN00004"
                  rounded
                  variant="gray"
                  :loading="loading"
                  :disabled="loading"
                  @click="StaffWorkModal(true)"
                >
                  {{ getComponentData('EU010200_BTN00004', 'caption', 'New') }}
                </Button>
              </div>
            </div>
          </template>
          <span class="font-black text-md">
            {{ getGridData('EU010200_GRD00002', 'caption', 'List of Staffs') }}
          </span>
          <Table
            id="EU010200_GRD00002"
            border
            header-variant="secondary"
            :columns="StaffListTableFields"
            :items="paginatedData"
          >
            <template #cell(STAFF_ESM_USER_YN)="{ value }">
              <div>
                <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
              </div>
            </template>
            <template #cell(STAFF_WMS_USER_YN)="{ value }">
              <div>
                <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
              </div>
            </template>
          </Table>
          <!-- Pagination -->
          <div
            class="flex justify-between items-center"
          >
            <p class="text-sm text-gray-700">
              Showing
              <span class="mx-1">
                {{ (currentPage - 1) * perPage + 1 }}
              </span>
              to
              <span class="mx-1">
                {{ isLastPage ? WorkStaffList?.length : currentPage * perPage }}
              </span>
              of
              <span class="mx-1">
                {{ WorkStaffList?.length }}
              </span>
              results
            </p>

            <Pagination
              :total-items="WorkStaffList?.length"
              :items-per-page="perPage"
              :current-page="currentPage"
              rounded
              active-variant="gray"
              @page-changed="currentPage = $event"
            />
          </div>
        </Card>  
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-3 space-y-3"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >
          <div class="grid grid-cols-4 gap-y-3 gap-x-12">
            <div 
              class="col-span-1 text-end"
              horizontal
            >
              <div class="inline-flex items-center space-x-2">
                <FormDatePicker
                  id="EU010200_DAT00003"
                  v-model.string="CopyformData.FLT_COPY_DATE_FROM"
                  placeholder="Select a date"
                  mode="date"
                />

                <FormDatePicker
                  id="EU010200_DAT00004"
                  v-model.string="CopyformData.FLT_COPY_DATE_TO"
                  placeholder="Select a date"
                  mode="date"
                />                
                <Button
                  id="EU010200_BTN00002"
                  rounded
                  class="w-60"
                  variant="gray"
                  :disabled="WorkStaffData.WORK_DATE == ''"
                  @click="Copy"
                >
                  {{ getComponentData('EU010200_BTN00005', 'caption', 'Copy To') }}
                </Button>            
              </div>
            </div>
          </div>
        </Card> 
      </div>
    </div>

    <Modal
      :show="openStaffManagementModal"
      divider
      size="11xl"
      @close="() => {
        openStaffManagementModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00360_LBL00001', 'caption', 'Warehouse Staffs') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00360'"          
        />
      </template>
    </Modal>

    <Modal
      :show="openStaffWorkModal"
      divider
      size="11xl"
      @close="() => {
        openStaffWorkModal = false
        isCreate = false
        search(false)
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00310_LBL00001', 'caption', 'Schedule of staffs') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00310'"          
          :create="isCreate"
          :workdate="isWorkdate"
          :whgroup="isCreate"
          @promotion-saved="() => {
            openStaffWorkModal = false
            search(false)
          }"
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
