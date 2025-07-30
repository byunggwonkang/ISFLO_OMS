<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import moment from "moment";

const pageLoader = usePageLoaderStore()
const commonData = useCommonDataStore()
const staffManagement = useStaffManagement()

const { currentTab } = storeToRefs(useTabsStore())
const { StaffList } = storeToRefs(staffManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(StaffList, perPage.value);

const { getComponentData } = usePageLoaderComponent(['POP00360'])
const { getGridData } = usePageLoaderGrid(['POP00360'])
const { loading, toggleLoading } = useLoading()

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

const Stafffilters = ref({  
  FLT_STAFF_SID: '',
  FLT_STAFF_TYPE_CODE: '',
  FLT_STAFF_ESM_YN: true,
  FLT_STAFF_WMS_YN: true,
  FLT_STAFF_JOIN_DATE_CHECK: true,
  FLT_STAFF_JOIN_DATE_FROM: moment().format('YYYY-MM') + "-01",
  FLT_STAFF_JOIN_DATE_TO: moment().format('YYYY-MM-DD'), 
  FLT_STAFF_SID: '',    
  FLT_STAFF_STATUS_CODE: '',    
})

const formData = ref({
  FLT_STAFF_SID: '',  
  FLT_STAFF_TYPE_CODE: '',
  FLT_STAFF_ID: '',
  FLT_STAFF_NAME: '',
  FLT_STAFF_TEL: '',
  FLT_STAFF_STATUS_CODE: '',
  FLT_STAFF_JOIN_DATE: '',
  FLT_STAFF_RESIGN_DATE: '',
  FLT_STAFF_CONTRACT_DATE_FROM: '',
  FLT_STAFF_CONTRACT_DATE_TO: '',
  FLT_STAFF_ESM_USER_YN: true,
  FLT_STAFF_WMS_USER_YN: true,
  FLT_STAFF_REMARK: '',
  FLT_UPDATE_TIME: '',
  FLT_UPDATE_USER: '',
})

const StaffType= ref({})
const StaffType2= ref({})
const UserStatus= ref({})
const UserStatus2= ref({})

const StaffListTableFields = computed(() => {
  return pageLoader.getTableData('POP00360', 'POP00360_GRD00001')
})

const fetchStaffList = async () => {
  Stafffilters.value.FLT_STAFF_TYPE_CODE = StaffType.value?.value
  Stafffilters.value.FLT_STAFF_STATUS_CODE = UserStatus.value?.value
  await staffManagement.fetchStaffList(Stafffilters.value)
}

const Search = async () => {
  isloading.isLoading = true
  await fetchStaffList()
  isloading.isLoading = false
  resetPage() 
}

const onClickItemRow = (item) => {

  Object.keys(item).forEach((key) => {
    formData.value[`FLT_${key}`] = decrypt(item[key])
  })

  StaffType2.value = commonData.getStaffTypes.find((StaffType2) => StaffType2.value === decrypt(item.STAFF_TYPE_CODE))
  UserStatus2.value = commonData.getUserStatus.find((UserStatus2) => UserStatus2.value === decrypt(item.STAFF_STATUS_CODE))
}
const resetFormData = () => {
  formData.value = {
    FLT_STAFF_SID: '',    
    FLT_STAFF_TYPE_CODE: '',
    FLT_STAFF_ID: '',
    FLT_STAFF_NAME: '',
    FLT_STAFF_TEL: '',
    FLT_STAFF_STATUS_CODE: '',
    FLT_STAFF_JOIN_DATE: '',
    FLT_STAFF_RESIGN_DATE: '',
    FLT_STAFF_CONTRACT_DATE_FROM: '',
    FLT_STAFF_CONTRACT_DATE_TO: '',
    FLT_STAFF_ESM_YN: '',
    FLT_STAFF_WMS_YN: '',
    FLT_STAFF_ESM_USER_YN: '',
    FLT_STAFF_WMS_USER_YN: '',
    FLT_STAFF_REMARK: '',
    FLT_UPDATE_TIME: '',
    FLT_UPDATE_USER: '',
  }
}

const StaffSave = async () => {

  DIALOG_TYPE.value = 'SAVE'
  DIALOG_TITLE.value = 'Warehouse Staff Save'
  DIALOG_TEXT.value = 'Would you like to save this staff information?'

  openDialogModal.value = true

}

const ConfirmDialog = async () => {
  
  if(DIALOG_TYPE.value === 'SAVE')
  {
    //formData.value.FLT_STAFF_ESM_USER_YN = formData.value.FLT_STAFF_ESM_USER_YN ===true ? '1' : '0'
    //formData.value.FLT_STAFF_WMS_USER_YN = formData.value.FLT_STAFF_WMS_USER_YN ===true ? '1' : '0'
    //formData.value.FLT_STAFF_ESM_YN = formData.value.FLT_STAFF_ESM_USER_YN ===true ? '1' : '0'
    //formData.value.FLT_STAFF_WMS_YN = formData.value.FLT_STAFF_WMS_USER_YN ===true ? '1' : '0'
    formData.value.FLT_STAFF_TYPE_CODE = StaffType2.value?.value
    formData.value.FLT_STAFF_STATUS_CODE = UserStatus2.value?.value

    toggleLoading()
    isloading.isLoading = true
    const { success } = await staffManagement.fetchsaveStaff(formData.value)
    if (success) {
      await fetchStaffList()
      resetFormData()
    }
    toggleLoading()
    isloading.isLoading = false
  }
  openDialogModal.value = false
}

onMounted(async () => {
  isloading.isLoading = true
  await commonData.fetchPOP00360CommonData();
  //await pageLoader.fetchPageLoadData('POP00360')
  StaffType.value = {
    name: 'All',
    value: '',
  };
  UserStatus.value = {
    name: 'All',
    value: '',
  };
  StaffType2.value = commonData.getStaffTypes[0]
  UserStatus2.value = commonData.getUserStatus[0]
  //ChannelDatasSetting()
  isloading.isLoading = false
  
})
</script>

<template>
  <div class="relative space-y-3">
    <div class="grid grid-cols-7 gap-y-3 gap-x-6">
      <div class="col-span-5 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-2 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >      
          <div class="grid grid-cols-3 gap-y-3 gap-x-12">
            <FormGroup
              :label="getComponentData('POP00360_LBL00003', 'caption', 'Staff Type')"
              label-id="POP00360_LBL00003"
              label-for="POP00360_CMB00002"
              horizontal
            >
              <FormSelect
                id="POP00360_CMB00002"
                v-model="StaffType"
                :options="[
                  {
                    name: 'All',
                    value: '',
                  },
                  ...commonData.getStaffTypes
                ]"
              />
            </FormGroup>
            <div class="col-1 py-2">
              <div class="grid grid-cols-2 gap-y-3">
                <FormGroup
                  :label="getComponentData('POP00360_LBL00004', 'caption','ESM Users')"
                  label-id="POP00360_LBL00004"
                  label-for="POP00360_CHK00001"
                  label-width="w-2/3"
                  horizontal
                >
                  <FormCheckbox
                    id="POP00360_CHK00001"
                    v-model="Stafffilters.FLT_STAFF_ESM_YN"
                    :checked="Stafffilters.FLT_STAFF_ESM_YN === '1'"
                  />
                </FormGroup>     
                <FormGroup
                  :label="getComponentData('POP00360_LBL00005', 'caption','WMS Users')"
                  label-id="POP00360_LBL00005"
                  label-for="POP00360_CHK00002"
                  label-width="w-2/3"
                  horizontal
                >
                  <FormCheckbox
                    id="POP00360_CHK00002"
                    v-model="Stafffilters.FLT_STAFF_WMS_YN"
                    :checked="Stafffilters.FLT_STAFF_WMS_YN === '1'"
                  />
                </FormGroup>       
              </div>
            </div>
            <FormGroup
              :label="getComponentData('POP00360_LBL00006', 'caption', 'Status')"
              label-id="POP00360_LBL00006"
              label-for="POP00360_CMB00003"
              horizontal
            >
              <FormSelect
                id="POP00360_CMB00003"
                v-model="UserStatus"
                :options="[
                  {
                    name: 'All',
                    value: '',
                  },
                  ...commonData.getUserStatus
                ]"
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00360_LBL00007', 'caption', 'Join Date')"
              label-id="POP00360_LBL00007"
              horizontal
            >
              <div class="inline-flex items-center space-x-2">
                <FormCheckbox
                  v-model="Stafffilters.FLT_STAFF_JOIN_DATE_CHECK"
                />
                <FormDatePicker
                  id="POP00360_DAT00001"
                  v-model.string="Stafffilters.FLT_STAFF_JOIN_DATE_FROM"
                  placeholder="Select a date"
                  mode="date"
                  :disabled="!Stafffilters.FLT_STAFF_JOIN_DATE_CHECK"
                />

                <FormDatePicker
                  id="POP00360_DAT00002"
                  v-model.string="Stafffilters.FLT_STAFF_JOIN_DATE_TO"
                  placeholder="Select a date"
                  mode="date"
                  :disabled="!Stafffilters.FLT_STAFF_JOIN_DATE_CHECK"
                />
              </div>
            </FormGroup>   
            <FormGroup
              :label="getComponentData('POP00360_LBL00008', 'caption', 'Key Word')"
              label-id="POP00360_LBL00008"
              label-for="POP00360_TXT00001"
              horizontal
            >
              <FormTextInput
                id="POP00360_TXT00001"
                v-model="Stafffilters.FLT_KEY_WORD"
              />
            </FormGroup>
            <div class="col-span-1 text-start">
              <Button
                id="POP00360_BTN00001"
                rounded
                variant="gray"
                :loading="loading"
                :disabled="loading"
                @click="Search"
              >
                {{ getComponentData('POP00360_BTN00001', 'caption', 'Search') }}
              </Button>
            </div>
          </div>                
        </Card>
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-3 space-y-3"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <p class="leading-6 font-medium text-gray-900">
                {{ getGridData('POP00360_GRD00002', 'caption','Search Result') }}
              </p>
            </div>        
          </template>
          <Table
            id="POP00360_GRD00002"
            border
            clickable
            header-variant="secondary"
            :columns="StaffListTableFields"
            :items="paginatedData"
            @on-row-click="onClickItemRow"
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
                {{ isLastPage ? StaffList?.length : currentPage * perPage }}
              </span>
              of
              <span class="mx-1">
                {{ StaffList?.length }}
              </span>
              results
            </p>

            <Pagination
              :total-items="StaffList?.length"
              :items-per-page="perPage"
              :current-page="currentPage"
              rounded
              active-variant="gray"
              @page-changed="currentPage = $event"
            />
          </div>
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
            <div class="flex justify-between items-center">
              <p class="leading-6 font-medium text-gray-900">
                {{ getComponentData('POP00360_LBL00009', 'caption','Detail of Staff') }}
              </p>
            </div>        
          </template>
          <FormGroup
            :label="getComponentData('POP00360_LBL00010', 'caption', 'Staff SID')"
            label-id="POP00360_LBL00010"
            label-for="POP00360_TXT00002"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <div class="inline-flex items-center space-x-2">
              <FormTextInput
                id="POP00360_TXT00002"         
                v-model="formData.FLT_STAFF_SID"
                disabled
              />           
              <Button
                id="POP00360_BTN00002"
                rounded
                class="w-30"
                variant="gray"
                :loading="loading"
                :disabled="loading"
                @click="resetFormData"
              >
                {{ getComponentData('POP00360_BTN00002', 'caption', 'NEW') }}
              </Button>            
            </div>
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00360_LBL00012', 'caption', 'Staff Type')"
            label-id="POP00360_LBL00012"
            label-for="POP00360_CMB00005"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="POP00360_CMB00005"
              v-model="StaffType2"
              :options="commonData.getStaffTypes"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00360_LBL00013', 'caption', 'Staff ID')"
            label-id="POP00360_LBL00013"
            label-for="POP00360_TXT00003"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormTextInput
              id="POP00360_TXT00003"
              v-model="formData.FLT_STAFF_ID"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00360_LBL00014', 'caption', 'Staff Name')"
            label-id="POP00360_LBL00014"
            label-for="POP00360_TXT00004"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormTextInput
              id="POP00360_TXT00004"
              v-model="formData.FLT_STAFF_NAME"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00360_LBL00015', 'caption', 'Staff Tel')"
            label-id="POP00360_LBL00015"
            label-for="POP00360_TXT00005"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormTextInput
              id="POP00360_TXT00005"
              v-model="formData.FLT_STAFF_TEL"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00360_LBL00016', 'caption', 'Status')"
            label-id="POP00360_LBL00016"
            label-for="POP00360_CMB00006"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormSelect
              id="POP00360_CMB00006"
              v-model="UserStatus2"
              :options="commonData.getUserStatus"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00360_LBL00017', 'caption', 'Join Date')"
            label-id="POP00360_LBL00017"
            label-for="POP00360_DAT00003"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormDatePicker
              id="POP00360_DAT00003"
              v-model.string="formData.FLT_STAFF_JOIN_DATE"
              placeholder="Select a date"
              mode="date"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00360_LBL00018', 'caption', 'Resign Date')"
            label-id="POP00360_LBL00018"
            label-for="POP00360_DAT00004"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormDatePicker
              id="POP00360_DAT00004"
              v-model.string="formData.FLT_STAFF_RESIGN_DATE"
              placeholder="Select a date"
              mode="date"
            />
          </FormGroup>   
          <FormGroup
            :label="getComponentData('POP00360_LBL00019', 'caption', 'Contract Period')"
            label-id="POP00360_LBL00019"
            label-for="POP00360_DAT00005"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <div>
              <FormDatePicker              
                id="POP00360_DAT00005"
                v-model.string="formData.FLT_STAFF_CONTRACT_DATE_FROM"
                placeholder="Select a date"
                mode="date"
              />
            </div>
            <div class="py-2">
              <FormDatePicker
                id="POP00360_DAT00006"
                v-model.string="formData.FLT_STAFF_CONTRACT_DATE_TO"
                placeholder="Select a date"
                mode="date"
              />
            </div>
          </FormGroup>  
          <FormGroup
            :label="getComponentData('POP00360_LBL00020', 'caption','ESM Users')"
            label-id="POP00360_LBL00020"
            label-for="POP00360_CHK00003"
            label-width="w-1/3"
            input-width="w-2/3"
            horizontal
          >
            <FormCheckbox
              id="POP00360_CHK00003"
              v-model="formData.FLT_STAFF_ESM_USER_YN"
              :checked="formData.FLT_STAFF_ESM_USER_YN === '1'"
            />
          </FormGroup>     
          <div class="py-3">
            <FormGroup
              :label="getComponentData('POP00360_LBL00021', 'caption','WMS Users')"
              label-id="POP00360_LBL00021"
              label-for="POP00360_CHK00004"
              label-width="w-1/3"
              input-width="w-2/3"
              horizontal
            >
              <FormCheckbox
                id="POP00360_CHK00004"
                v-model="formData.FLT_STAFF_WMS_USER_YN"
                :checked="formData.FLT_STAFF_WMS_USER_YN === '1'"
              />
            </FormGroup>
          </div>      
          <FormGroup
            :label="getComponentData('POP00360_LBL00022', 'caption','Remark')"
            label-id="POP00360_LBL00022"
            label-for="POP00360_TXT00006"
            label-width="w-1/3"
            input-width="w-2/3"
            horizontal
          >
            <FormTextareaInput
              id="POP00360_TXT00006"
              v-model="formData.FLT_STAFF_REMARK"
            />
          </FormGroup>     
          <FormGroup
            :label="getComponentData('POP00360_LBL00023', 'caption', 'Updated Time')"
            label-id="POP00360_LBL00023"
            label-for="POP00360_TXT00007"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormTextInput
              id="POP00360_TXT00007"
              v-model="formData.FLT_UPDATE_TIME"
              disabled
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00360_LBL00024', 'caption', 'Updated By')"
            label-id="POP00360_LBL00024"
            label-for="POP00360_TXT00008"
            horizontal
            label-width="w-1/3"
            input-width="w-2/3"
          >
            <FormTextInput
              id="POP00360_TXT00008"
              v-model="formData.FLT_UPDATE_USER"
              disabled
            />
          </FormGroup>  
          <div class="col-span-1 text-end">
            <Button
              id="POP00360_BTN00003"
              rounded
              variant="gray"
              :loading="loading"
              :disabled="loading"
              @click="StaffSave"
            >
              {{ getComponentData('POP00360_BTN00003', 'caption', 'SAVE') }}
            </Button>
          </div>             
        </Card>
      </div>
    </div>
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
  </div> 
</template>

<style scoped>

</style>
