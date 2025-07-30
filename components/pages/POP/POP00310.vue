<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

import moment from "moment";
import VueFeather from "vue-feather";

const pageLoader = usePageLoaderStore()
const commonData = useCommonDataStore()
const staffManagement = useStaffManagement()
const InputData = ref([])

const PopWorkStaffList2 = ref([])
const { currentTab } = storeToRefs(useTabsStore())
const { PopStaffList,PopWorkStaffList, PopWorkStaffData } = storeToRefs(staffManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(PopStaffList, perPage.value);
const perPage2 = ref(15)
const { currentPage2, paginatedData2, isLastPage2, resetPage2 } = usePagination(PopWorkStaffList2, perPage2.value);

const { getComponentData } = usePageLoaderComponent(['POP00310'])
const { getGridData } = usePageLoaderGrid(['POP00310'])
const { loading, toggleLoading } = useLoading()

const props = defineProps({
  create: {
    type: Boolean,
    default: false,
  },
  workdate: {
    type: String,
    default: '',
  },
  whgroup: {
    type: String,
    default: '',
  },
})

const StaffType= ref({})
const UserStatus= ref({})

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

const DeleteformData = ref({  
  FLT_WORK_DATE_FROM: '',
  FLT_WORK_DATE_TO: '', 
})

const formData = ref({
  FLT_WORK_DATE: '',  
  STAFF_LIST: [],
})

const Workfilters = ref({  
  FLT_WORK_DATE_FROM: moment().format('YYYY-MM-DD'),
  FLT_WORK_DATE_TO: moment().format('YYYY-MM-DD'),
  FLT_JOB_TYPE_CODE: '',
  FLT_INCLUDE_INCATIVE: '',
  FLT_KEY_WORD: '',
});

const Stafffilters = ref({  
  FLT_STAFF_SID: '',
  FLT_STAFF_TYPE_CODE: '',
  FLT_STAFF_ESM_YN: '',
  FLT_STAFF_WMS_YN: '',      
  FLT_STAFF_JOIN_DATE_FROM: '',
  FLT_STAFF_JOIN_DATE_TO: '', 
  FLT_STAFF_SID: '',    
  FLT_STAFF_STATUS_CODE: '', 
})

const removeWork = async () => {

  DIALOG_TYPE.value = 'DELETE'
  DIALOG_TITLE.value = 'Delete Staff Schedule'
  DIALOG_TEXT.value = 'Would you like to delete the schedule for the selected date?'

  openDialogModal.value = true
};

const StaffListTableFields = computed(() => {
  return pageLoader.getTableData('POP00310' , 'POP00310_GRD00001')
})

const WorkStaffListTableFields = computed(() => {
  return pageLoader.getTableData('POP00310' , 'POP00310_GRD00002')
})

const fetchStaffList = async () => {
  isloading.isLoading = true
  Stafffilters.value.FLT_STAFF_TYPE_CODE = StaffType.value?.value
  Stafffilters.value.FLT_STAFF_STATUS_CODE = UserStatus.value?.value
  await staffManagement.fetchPopStaffList(Stafffilters.value)

  for (let i = 0; i < PopWorkStaffList.value.length; i++) 
  {
    const index = PopStaffList.value.findIndex((item) => item.STAFF_SID === PopWorkStaffList.value[i].STAFF_SID);

    
    if (index != -1) {
      PopStaffList.value = PopStaffList.value.filter((option) => option !== PopStaffList.value[index])      
      //updateProductItemQty(index);
    } 
  }
  isloading.isLoading = false
}

const fetchWorkStaffList = async () => {
  
  await staffManagement.fetchPopWorkStaffList(Workfilters.value)
}

const CheckedSetting = async (CheckedID,index) => {
  
  if (CheckedID === "INSPECTION")
  {     
    InputData.value[index].STAFF_INCHARGE_PACKING = false
    InputData.value[index].STAFF_INCHARGE_NORMAL = false
    
  }
  else if (CheckedID === "PACKING")
  {
    InputData.value[index].STAFF_INCHARGE_INSPECTION = false    
    InputData.value[index].STAFF_INCHARGE_NORMAL = false
  }
  else if (CheckedID === "NORMAL")
  {
    InputData.value[index].STAFF_INCHARGE_INSPECTION = false
    InputData.value[index].STAFF_INCHARGE_PACKING = false
  }
}

const StaffADD = async (item) => {

  InputData.value.push({
    STAFF_SID : item.STAFF_SID,
    STAFF_ID : item.STAFF_ID,
    STAFF_NAME : item.STAFF_NAME,
    STAFF_INCHARGE_INSPECTION : false,
    STAFF_INCHARGE_PACKING : false,
    STAFF_INCHARGE_NOMARL : false
  })

  PopWorkStaffList2.value.push(
  {
      STAFF_SID : item.STAFF_SID,
      STAFF_ID : item.STAFF_ID,
      STAFF_NAME : item.STAFF_NAME,
      STAFF_TEL : item.STAFF_TEL,
      STAFF_TYPE_CODE : item.STAFF_TYPE_CODE,
      STAFF_TYPE_SNAME : item.STAFF_TYPE_SNAME,
      STAFF_TYPE_FNAME : item.STAFF_TYPE_FNAME,
      STAFF_INCHARGE_CODE : "",
      STAFF_INCHARGE_SNAME : "",
      STAFF_INCHARGE_FNAME : "",
      STAFF_STATUS_CODE : item.STAFF_STATUS_CODE,
      STAFF_STATUS_SNAME : item.STAFF_STATUS_SNAME,
      STAFF_STATUS_FNAME : item.STAFF_STATUS_FNAME,
      STAFF_JOIN_DATE : item.STAFF_JOIN_DATE,
      STAFF_RESIGN_DATE : item.STAFF_RESIGN_DATE,
      STAFF_CONTRACT_DATE_FROM : item.STAFF_CONTRACT_DATE_FROM,
      STAFF_CONTRACT_DATE_TO : item.STAFF_CONTRACT_DATE_TO,
      STAFF_ESM_USER_YN : item.STAFF_ESM_USER_YN,
      STAFF_WMS_USER_YN : item.STAFF_WMS_USER_YN,
      STAFF_REMARK : item.STAFF_REMARK,

      REGISTER_DATE : "",
      REGISTER_TIME : "",
      REGISTER_USER : ""
  })

  PopStaffList.value = PopStaffList.value.filter((option) => option !== item)  

};

watch(() => Workfilters.value.FLT_WORK_DATE_FROM, async () => {
  DateSearch() 
}, {
  immediate: true,
  deep: true,
})

const resetFormData = () => {
  formData.value = {
    FLT_WORK_DATE: '',    
    STAFF_LIST: [],
  }
}

const saveWorkStaff = async () => {
  
  DIALOG_TYPE.value = 'SAVE'
  DIALOG_TITLE.value = 'Save Staff Schedule'
  DIALOG_TEXT.value = 'Would you like to save the schedule for the selected date?'

  openDialogModal.value = true
}

const RemoteStaff = async (item) => {
  PopWorkStaffList2.value = PopWorkStaffList2.value.filter((option) => option !== PopWorkStaffList2.value[item])  
  InputData.value = InputData.value.filter((option) => option !== InputData.value[item])  
  PopWorkStaffList.value = PopWorkStaffList2.value
  fetchStaffList()
};

const DateSearch = async () => {
  isloading.isLoading = true

  InputData.value = [];
  PopWorkStaffList2.value = [];
  Workfilters.value.FLT_WORK_DATE_TO = Workfilters.value.FLT_WORK_DATE_FROM
  
  await fetchWorkStaffList()
  await fetchStaffList()

  resetPage() 
  resetPage2() 
  
  DeleteformData.value.FLT_WORK_DATE_FROM = PopWorkStaffData.value.WORK_DATE
  DeleteformData.value.FLT_WORK_DATE_TO = PopWorkStaffData.value.WORK_DATE

  for (let i = 0; i < PopWorkStaffList.value.length; i++) 
  {
    const index = PopStaffList.value.findIndex((item) => item.STAFF_SID === PopWorkStaffList.value[i].STAFF_SID);
    
    if (index != -1) {
      PopStaffList.value = PopStaffList.value.filter((option) => option !== PopStaffList.value[index])      
      //updateProductItemQty(index);
    }

    if (decrypt(PopWorkStaffList.value[i].STAFF_INCHARGE_CODE) === '0010')
    {
      InputData.value.push({
        STAFF_SID : decrypt(PopWorkStaffList.value[i].STAFF_SID),
        STAFF_ID : decrypt(PopWorkStaffList.value[i].STAFF_ID),
        STAFF_NAME : decrypt(PopWorkStaffList.value[i].STAFF_NAME),
        STAFF_INCHARGE_INSPECTION : true,
        STAFF_INCHARGE_PACKING : false,
        STAFF_INCHARGE_NORMAL : false,
      })
    }
    else if (decrypt(PopWorkStaffList.value[i].STAFF_INCHARGE_CODE) === '0020')
    {
      InputData.value.push({
        STAFF_SID : decrypt(PopWorkStaffList.value[i].STAFF_SID),
        STAFF_ID : decrypt(PopWorkStaffList.value[i].STAFF_ID),
        STAFF_NAME : decrypt(PopWorkStaffList.value[i].STAFF_NAME),
        STAFF_INCHARGE_INSPECTION : false,
        STAFF_INCHARGE_PACKING : true,
        STAFF_INCHARGE_NORMAL : false
      })
    }
    else if (decrypt(PopWorkStaffList.value[i].STAFF_INCHARGE_CODE) === '0030')
    {
      InputData.value.push({
        STAFF_SID : decrypt(PopWorkStaffList.value[i].STAFF_SID),
        STAFF_ID : decrypt(PopWorkStaffList.value[i].STAFF_ID),
        STAFF_NAME : decrypt(PopWorkStaffList.value[i].STAFF_NAME),
        STAFF_INCHARGE_INSPECTION : false,
        STAFF_INCHARGE_PACKING : false,
        STAFF_INCHARGE_NORMAL : true
      })
    }  
    else 
    {
      InputData.value.push({
        STAFF_SID : decrypt(PopWorkStaffList.value[i].STAFF_SID),
        STAFF_ID : decrypt(PopWorkStaffList.value[i].STAFF_ID),
        STAFF_NAME : decrypt(PopWorkStaffList.value[i].STAFF_NAME),
        STAFF_INCHARGE_INSPECTION : false,
        STAFF_INCHARGE_PACKING : false,
        STAFF_INCHARGE_NOMARL : false
      })
    } 
  }
  resetFormData()
  PopWorkStaffList2.value = PopWorkStaffList.value

  isloading.isLoading = false
}

const Search = async () => {
  isloading.isLoading = true
  await fetchStaffList()
  resetPage() 
  isloading.isLoading = false
}

const ConfirmDialog = async () => {
  
  if(DIALOG_TYPE.value === 'SAVE')
  {
    formData.value.FLT_WORK_DATE = Workfilters.value.FLT_WORK_DATE_FROM

    const StaffList = ref([])
    const formData2 = ({
      STAFF_SID: '',
      STAFF_ID: '',
      STAFF_NAME: '',
      STAFF_INCHARGE_CODE: '',
    })

    for (let i = 0; i < PopWorkStaffList2.value.length; i++) 
    {
      formData2.STAFF_SID = PopWorkStaffList2.value[i].STAFF_SID
      formData2.STAFF_ID = PopWorkStaffList2.value[i].STAFF_ID
      formData2.STAFF_NAME = PopWorkStaffList2.value[i].STAFF_NAME    
      if (InputData.value[i].STAFF_INCHARGE_INSPECTION) { formData2.STAFF_INCHARGE_CODE = '0010'; }
      else if (InputData.value[i].STAFF_INCHARGE_PACKING) { formData2.STAFF_INCHARGE_CODE = '0020'; }
      else if (InputData.value[i].STAFF_INCHARGE_NORMAL) { formData2.STAFF_INCHARGE_CODE = '0030'; }
      else {formData2.STAFF_INCHARGE_CODE = '';}

      StaffList.value.push({
        STAFF_SID: formData2.STAFF_SID,
        STAFF_ID: formData2.STAFF_ID ,
        STAFF_NAME: formData2.STAFF_NAME,
        STAFF_INCHARGE_CODE: encrypt(formData2.STAFF_INCHARGE_CODE)
      })
    }

    formData.value.STAFF_LIST = StaffList.value
    toggleLoading()
    isloading.isLoading = true
    const { success } = await staffManagement.saveWorkStaff(formData.value)
    if (success) {
      await DateSearch() 

    }
    isloading.isLoading = false
    toggleLoading()
  }
  else if(DIALOG_TYPE.value === 'DELETE')
  {
    toggleLoading()
    isloading.isLoading = true
    const { success } = await staffManagement.DeleteWorkStaff(DeleteformData.value)
    if (success) {
      await DateSearch()    
    }
    isloading.isLoading = false
    toggleLoading()
  }
  openDialogModal.value = false
}

onMounted(async () => {
    isloading.isLoading = true
  //await pageLoader.fetchPageLoadData('POP00310')
  await commonData.fetchPOP00310CommonData();
  StaffType.value = {
    name: 'All',
    value: '',
  };
  UserStatus.value = {
    name: 'All',
    value: '',
  };
  Workfilters.value.FLT_WORK_DATE_FROM = decrypt(props.workdate) ===''  ? moment().format('YYYY-MM-DD') : decrypt(props.workdate)
  Workfilters.value.FLT_WORK_DATE_TO = decrypt(props.workdate) ===''  ? moment().format('YYYY-MM-DD') : decrypt(props.workdate) 

  DateSearch();
  isloading.isLoading = false

})
</script>

<template>
  <div class="relative space-y-3">
    <div class="grid grid-cols-4 px-3 gap-y-3 gap-x-12">       
      <FormGroup
        :label="getComponentData('POP00310_LBL00001', 'caption', 'Work Date')"
        label-id="POP00310_LBL00001"
        horizontal
      >
        <FormDatePicker
          id="POP00310_DAT00001"
          v-model.string="Workfilters.FLT_WORK_DATE_FROM"
          placeholder="Select a date"
          mode="date"
        />
      </FormGroup>      
    </div>
    <div class="grid grid-cols-6 gap-y-3 gap-x-6">
      <div class="col-span-3 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-2 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >      
          <div class="grid grid-cols-2 gap-y-3 gap-x-12">
            <FormGroup
              :label="getComponentData('POP00310_LBL00003', 'caption', 'Staff Type')"
              label-id="POP00310_LBL00003"
              label-for="POP00310_CMB00001"
              horizontal
            >
              <FormSelect
                id="POP00310_CMB00001"
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
            <FormGroup
              :label="getComponentData('POP00310_LBL00004', 'caption', 'Name')"
              label-id="POP00310_LBL00004"
              label-for="POP00310_TXT00001"
              horizontal
            >
              <FormTextInput
                id="POP00310_TXT00001"
                v-model="Stafffilters.FLT_KEY_WORD"
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('POP00310_LBL00005', 'caption', 'Status')"
              label-id="POP00310_LBL00005"
              label-for="POP00310_CMB00002"
              horizontal
            >
              <FormSelect
                id="POP00310_CMB00002"
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
            <div class="col-span-1 text-start">
              <Button
                id="POP00310_BTN00001"
                rounded
                variant="gray"
                :loading="loading"
                :disabled="loading"
                @click="Search"
              >
                {{ getComponentData('POP00310_BTN00001', 'caption', 'Search') }}
              </Button>
            </div>
          </div>   
          <p class="leading-6 py-4 font-medium text-gray-900">
            {{ getGridData('POP00310_GRD00001', 'caption','Staffs') }}
          </p>
          <Table
            id="POP00310_GRD00001"
            border
            clickable
            header-variant="secondary"
            :columns="[
              ...StaffListTableFields,
              {
                caption: 'ADD',
                dataFieldName: 'ACTION',
                display: 'Y'
              }
            ]" 
            :items="paginatedData"
          >
            <template #cell(ACTION)="{ item }">
              <span
                class=" cursor-pointer hover:font-bold hover:text-blue-700"
                @click="(e) => {
                  e.stopPropagation();
                  StaffADD(item)
                }"
              >
                <VueFeather
                  type="plus-circle"
                  class="h-5 w-5"
                />
              </span>
            </template>
          </Table>
          <!-- Pagination -->
          <div
            v-if="PopStaffList?.length"
            class="flex justify-between items-center"
          >
            <p class="text-sm text-gray-700">
              Showing
              <span class="mx-1">
                {{ (currentPage - 1) * perPage + 1 }}
              </span>
              to
              <span class="mx-1">
                {{ isLastPage ? PopStaffList?.length : currentPage * perPage }}
              </span>
              of
              <span class="mx-1">
                {{ PopStaffList?.length }}
              </span>
              results
            </p>

            <Pagination
              :total-items="PopStaffList?.length"
              :items-per-page="perPage"
              :current-page="currentPage"
              rounded
              active-variant="gray"
              @page-changed="currentPage = $event"
            />
          </div>             
        </Card> 
      </div>
      <div class="col-span-3 space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-2 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-3 space-y-3"
        >          
          <p class="leading-6 font-medium text-gray-900">
            {{ getGridData('POP00310_GRD00002', 'caption','Selected') }}
          </p>
          <Table
            id="POP00310_GRD00002"
            border
            clickable
            header-variant="secondary"            
          >
            <TableHead>              
              <TableHeadCell class="text-center">
                Type
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Name
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Status
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Inspection
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Packing
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Normal
              </TableHeadCell>
              <TableHeadCell class="text-center" />
            </TableHead>
            <TableBody>
              <TableRow
                v-for="(option, index) in paginatedData2"
                :key="index"
              >                          
                <TableCell class="text-center">
                  {{ decrypt(option.STAFF_TYPE_FNAME) }}
                </TableCell>
                <TableCell class="text-center">
                  {{ decrypt(option.STAFF_NAME) }}
                </TableCell> 
                <TableCell class="text-center">
                  {{ decrypt(option.STAFF_STATUS_FNAME) }}
                </TableCell>           
                <TableCell class="text-center">
                  <div>
                    <FormCheckbox 
                      v-model="InputData[index].STAFF_INCHARGE_INSPECTION"
                      :checked="InputData[index].STAFF_INCHARGE_INSPECTION"
                      @click="CheckedSetting('INSPECTION',index)"
                    /> 
                  </div>               
                </TableCell>
                <TableCell class="text-center">
                  <div>
                    <FormCheckbox 
                      v-model="InputData[index].STAFF_INCHARGE_PACKING"
                      :checked="InputData[index].STAFF_INCHARGE_PACKING"
                      @click="CheckedSetting('PACKING',index)"
                    /> 
                  </div>
                </TableCell>
                <TableCell class="text-center">
                  <div>
                    <FormCheckbox 
                      v-model="InputData[index].STAFF_INCHARGE_NORMAL"
                      :checked="InputData[index].STAFF_INCHARGE_NORMAL"
                      @click="CheckedSetting('NORMAL',index)"
                    /> 
                  </div>
                </TableCell>
                <TableCell class="text-center">
                  <span
                    class=" cursor-pointer hover:font-bold hover:text-blue-700"
                    @click="(e) => {
                      e.stopPropagation();
                      RemoteStaff(index)
                    }"
                  >
                    <VueFeather
                      type="minus-circle"
                      class="h-5 w-5"
                    />
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <!-- Pagination -->
          <div
            v-if="PopWorkStaffList?.length"
            class="flex justify-between items-center"
          >
            <p class="text-sm text-gray-700">
              Showing
              <span class="mx-1">
                {{ (currentPage2 - 1) * perPage2 + 1 }}
              </span>
              to
              <span class="mx-1">
                {{ isLastPage2 ? PopWorkStaffList?.length : currentPage2 * perPage2 }}
              </span>
              of
              <span class="mx-1">
                {{ PopWorkStaffList?.length }}
              </span>
              results
            </p>

            <Pagination
              :total-items="PopWorkStaffList?.length"
              :items-per-page="perPage2"
              :current-page="currentPage2"
              rounded
              active-variant="gray"
              @page-changed="currentPage2 = $event"
            />
          </div>             
        </Card> 
      </div>
    </div>      
    <div
      class="flex justify-end pb-1 space-x-2"
    >
      <Button
        variant="gray"
        rounded
        :disabled="DeleteformData.FLT_WORK_DATE_FROM == ''"
        size="sm"
        class="w-30"
        @click="removeWork"
      >
        {{ getComponentData('POP00310_BTN01002', 'caption', 'Delate') }}
      </Button>
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        @click="saveWorkStaff"
      >
        {{ getComponentData('POP00310_BTN01002', 'caption', 'Save') }}
      </Button>
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
          :dialog-title="DIALOG_TITLE"
          :dialog-text="DIALOG_TEXT"
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
