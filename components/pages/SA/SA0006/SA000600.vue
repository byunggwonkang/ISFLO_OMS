<script setup>
import { PlusIcon } from "@heroicons/vue/24/solid";
import {DocumentDuplicateIcon} from "@heroicons/vue/24/solid/index.js";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const SAuserGroupSettings = SAuserGroupSettingsStore()
const pageLoader = usePageLoaderStore()
const userSettings = useUserSettingsStore()

const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())
const { userGroupList, menuList } = storeToRefs(SAuserGroupSettings)
const { loading, toggleLoading } = useLoading()

const whGroup = ref({})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await SAuserGroupSettings.fetchUserGroupList()
  await SAuserGroupSettings.fetchMenuList()
  await SAuserGroupSettings.fetchChannelList()
  await commonData.fetchSA000600CommonData()
  isloading.isLoading = false
  togglePageLoading()
})


const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const userGroupListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'SA000600_GRD00001')
})

const menuListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'SA000600_GRD00002')
})


const formData = ref({
  FLT_GROUP_SID: '',
  FLT_GROUP_SNAME: '',
  FLT_GROUP_FNAME: '',
  FLT_GROUP_ACTIVE_YN: '0',
  FLT_GROUP_SA_YN: '0',
  FLT_GROUP_OMS_ADMIN_YN: '0',
  FLT_GROUP_OMS_USER_YN: '0',
  FLT_GROUP_ESM_ADMIN_YN: '0',
  FLT_GROUP_ESM_USER_YN: '0',
  FLT_GROUP_WMS_ADMIN_YN: '0',
  FLT_GROUP_WMS_USER_YN: '0',
  FLT_GROUP_WH_GROUP_CODE: '',
  FLT_GROUP_REMARK: '',
  ACCESS_MENUS: [],
  ACCESS_MENUS_READABLE: [],
  ACCESS_MENUS_WRITABLE: [],
})

const onClickUserGroupListRow = async (userGroup) => {
  const { success, data } = await SAuserGroupSettings.fetchUserGroupDetail(decrypt(userGroup.GROUP_SID))

  if (success) {
    formData.value = {
      FLT_GROUP_SID: decrypt(data.GROUP_SID),
      FLT_GROUP_SNAME: decrypt(data.GROUP_SNAME),
      FLT_GROUP_FNAME: decrypt(data.GROUP_FNAME),
      FLT_GROUP_ACTIVE_YN: decrypt(data.GROUP_ACTIVE),
      FLT_GROUP_SA_YN: decrypt(data.GROUP_SYSADMIN),
      FLT_GROUP_OMS_ADMIN_YN: decrypt(data.GROUP_OMS_ADMIN_YN),
      FLT_GROUP_OMS_USER_YN: decrypt(data.GROUP_OMS_USER_YN),
      FLT_GROUP_ESM_ADMIN_YN: decrypt(data.GROUP_ESM_ADMIN_YN),
      FLT_GROUP_ESM_USER_YN: decrypt(data.GROUP_ESM_USER_YN),
      FLT_GROUP_WMS_ADMIN_YN: decrypt(data.GROUP_WMS_ADMIN_YN),
      FLT_GROUP_WMS_USER_YN: decrypt(data.GROUP_WMS_USER_YN),
      FLT_GROUP_WH_GROUP_CODE: decrypt(data.GROUP_WH_GROUP_CODE),
      FLT_GROUP_REMARK: decrypt(data.GROUP_DESCR),
      ACCESS_MENUS: data.ACCESS_MENUS.map((menu) => {
        return {
          SUB_MENU_CODE: decrypt(menu.SUB_MENU_CODE),
          READABLE: decrypt(menu.READABLE),
          WRITABLE: decrypt(menu.WRITABLE) === '0' || decrypt(menu.WRITABLE) === '' ? 'W' : 'W',
        }
      }),
      ACCESS_MENUS_READABLE: data.ACCESS_MENUS.map((menu) => {
        return {
          SUB_MENU_CODE: decrypt(menu.SUB_MENU_CODE),
          READABLE: decrypt(menu.READABLE)
        }
      }),
      ACCESS_MENUS_WRITABLE: data.ACCESS_MENUS.map((menu) => {
        return {
          SUB_MENU_CODE: decrypt(menu.SUB_MENU_CODE),
          WRITABLE: decrypt(menu.WRITABLE) === '0' || decrypt(menu.WRITABLE) === '' ? 'W' : 'W',
        }
      }),
    }
    whGroup.value = commonData.getWearHouseGroups.find((whGroup) => whGroup.value === decrypt(data.GROUP_WH_GROUP_CODE))
  }
}

  
const menuCount = (menu) => {
  let total = 0;
  menu.MAIN_MENUS.forEach((mainMenu) => {
    total += mainMenu.SUB_MENUS.length;
  });
  return total;
}

const resetFormData = () => {
  formData.value = {
    FLT_GROUP_SID: '',
    FLT_GROUP_SNAME: '',
    FLT_GROUP_FNAME: '',
    FLT_GROUP_ACTIVE_YN: '0',
    FLT_GROUP_SA_YN: '0',
    FLT_GROUP_OMS_ADMIN_YN: '0',
    FLT_GROUP_OMS_USER_YN: '0',
    FLT_GROUP_ESM_ADMIN_YN: '0',
    FLT_GROUP_ESM_USER_YN: '0',
    FLT_GROUP_WMS_ADMIN_YN: '0',
    FLT_GROUP_WMS_USER_YN: '0',
    FLT_GROUP_WH_GROUP_CODE: '',
    FLT_GROUP_REMARK: '',
    ACCESS_MENUS: [],
    ACCESS_MENUS_READABLE: [],
    ACCESS_MENUS_WRITABLE: [],
  }

  whGroup.value = commonData.getWearHouseGroups[0]

}


const copyUserGroupSetting = async () => {
  formData.value.FLT_GROUP_SID = ''
}

const CheckedSetting = async (CheckedID) => {
  
  if (CheckedID === "SA000600_CHK00002")
  {     
    formData.value.FLT_GROUP_OMS_USER_YN = false,
    formData.value.FLT_GROUP_ESM_ADMIN_YN = false,
    formData.value.FLT_GROUP_ESM_USER_YN = false,
    formData.value.FLT_GROUP_WMS_ADMIN_YN = false,
    formData.value.FLT_GROUP_WMS_USER_YN = false
    
  }
  else if (CheckedID === "SA000600_CHK00003")
  {
    formData.value.FLT_GROUP_OMS_ADMIN_YN = false,   
    formData.value.FLT_GROUP_ESM_ADMIN_YN = false,
    formData.value.FLT_GROUP_ESM_USER_YN = false,
    formData.value.FLT_GROUP_WMS_ADMIN_YN = false,
    formData.value.FLT_GROUP_WMS_USER_YN = false
  }
  else if (CheckedID === "SA000600_CHK00004")
  {
    formData.value.FLT_GROUP_OMS_ADMIN_YN = false,
    formData.value.FLT_GROUP_OMS_USER_YN = false, 
    formData.value.FLT_GROUP_ESM_USER_YN = false,
    formData.value.FLT_GROUP_WMS_ADMIN_YN = false,
    formData.value.FLT_GROUP_WMS_USER_YN = false
  }
  else if (CheckedID === "SA000600_CHK00005")
  {
    formData.value.FLT_GROUP_OMS_ADMIN_YN = false,
    formData.value.FLT_GROUP_OMS_USER_YN = false,
    formData.value.FLT_GROUP_ESM_ADMIN_YN = false,
    formData.value.FLT_GROUP_WMS_ADMIN_YN = false,
    formData.value.FLT_GROUP_WMS_USER_YN = false
  }
  else if (CheckedID === "SA000600_CHK00006")
  {
    formData.value.FLT_GROUP_OMS_ADMIN_YN = false,
    formData.value.FLT_GROUP_OMS_USER_YN = false,
    formData.value.FLT_GROUP_ESM_ADMIN_YN = false,
    formData.value.FLT_GROUP_ESM_USER_YN = false,
    formData.value.FLT_GROUP_WMS_USER_YN = false
  }
  else if (CheckedID === "SA000600_CHK00007")
  {
    formData.value.FLT_GROUP_OMS_ADMIN_YN = false,
    formData.value.FLT_GROUP_OMS_USER_YN = false,
    formData.value.FLT_GROUP_ESM_ADMIN_YN = false,
    formData.value.FLT_GROUP_ESM_USER_YN = false,
    formData.value.FLT_GROUP_WMS_ADMIN_YN = false
  }
}

const saveUserGroupDetail = async () => {
  formData.value.FLT_GROUP_WH_GROUP_CODE = whGroup.value?.value
  formData.value.ACCESS_MENUS = mergedMenus.value
  formData.value.FLT_GROUP_SA_YN = false

  toggleLoading()
  isloading.isLoading = true
  const { success } = await SAuserGroupSettings.saveUserGroupDetail(formData.value)
  if (success) {
    await SAuserGroupSettings.fetchUserGroupList()
    await userSettings.fetchUserGroupList()
    resetFormData()
  }
  isloading.isLoading = false
  toggleLoading()
}

const mergedMenus = computed(() => {
  return mergeObjects([
    ...formData.value.ACCESS_MENUS_READABLE,
    ...formData.value.ACCESS_MENUS_WRITABLE
  ])
})

const mergeObjects = (arr) => {
  return arr.reduce((acc, obj) => {
    const existingObj = acc.find(item => item.SUB_MENU_CODE === obj.SUB_MENU_CODE);
    if (existingObj) {
      existingObj.READABLE = existingObj.READABLE || obj.READABLE || '0';
      existingObj.WRITABLE = existingObj.WRITABLE || obj.WRITABLE || '';
    } else {
      acc.push({
        SUB_MENU_CODE: obj.SUB_MENU_CODE,
        READABLE: obj.READABLE || '0',
        WRITABLE: obj.WRITABLE || ''
      });
    }
    return acc;
  }, []);
}
</script>

<template>
  <AppContent
    divider
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
          <p class="leading-6 font-medium text-gray-900">
            {{ getGridData('SA000600_GRD00001', 'caption','List of User Groups') }}       
          </p>
          <Button
            id="SA000600_BTN00001"
            v-tooltip="{
              content: getComponentData('SA000600_BTN00001', 'caption'),
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
        id="PA000600_GRD00001"
        class="overflow-x-auto border-b"
        header-variant="secondary"
        :columns="userGroupListTableFields"
        :items="userGroupList"
        clickable
        condensed
        @on-row-click="onClickUserGroupListRow"
      >
        <template #cell(GROUP_ACTIVE)="{ value }">
          <div>
            <StatusDot :active="decrypt(value) === '1'" />
          </div>
        </template>

        <template #cell(GROUP_SYSADMIN)="{ value }">
          <div>
            <StatusDot :active="decrypt(value) === '1'" />
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
        <div class="flex justify-between items-center">
          <p class="leading-6 font-medium text-gray-900">
            {{ getComponentData('SA000600_LBL00001', 'caption','Details of User Group') }}          
          </p>
          <Button
            id="SA000600_BTN00002"
            v-tooltip="{
              content: getComponentData('SA000600_BTN00002', 'caption'),
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
            @click="copyUserGroupSetting"
          >
            <DocumentDuplicateIcon class="w-5 h-5" />
          </Button>
        </div>        
      </template>
      <div class="grid grid-cols-5 gap-y-3 gap-x-12">
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('SA000600_LBL00002', 'caption','System ID')"
            label-id="SA000600_LBL00002"
            label-for="SA000600_TXT00001"
            horizontal
          >
            <FormTextInput
              id="SA000600_TXT00001"
              v-model="formData.FLT_GROUP_SID"
              disabled
            />
          </FormGroup> 
        </div> 
        <div class="py-1">
          <FormGroup
            :label="getComponentData('SA000600_LBL00003', 'caption','Active')"
            label-id="SA000600_LBL00003"
            label-for="SA000600_CHK00001"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="SA000600_CHK00001"
              v-model="formData.FLT_GROUP_ACTIVE_YN"
              value="1"
              :checked="formData.FLT_GROUP_ACTIVE_YN === '1'"
            />
          </FormGroup>           
        </div>   
        <div class="py-1">
          <FormGroup
            :label="getComponentData('SA000600_LBL00004', 'caption','OMS Administrator')"
            label-id="SA000600_LBL00004"
            label-for="SA000600_CHK00002"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="SA000600_CHK00002"
              v-model="formData.FLT_GROUP_OMS_ADMIN_YN"
              value="1"
              :checked="formData.FLT_GROUP_OMS_ADMIN_YN === '1'"
              @click="CheckedSetting('SA000600_CHK00002')"
            />
          </FormGroup>           
        </div>
        <div class="py-1">
          <FormGroup
            :label="getComponentData('SA000600_LBL00005', 'caption','OMS Users')"
            label-id="SA000600_LBL00005"
            label-for="SA000600_CHK00003"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="SA000600_CHK00003"
              v-model="formData.FLT_GROUP_OMS_USER_YN"
              value="1"
              :checked="formData.FLT_GROUP_OMS_USER_YN === '1'"
              @click="CheckedSetting('SA000600_CHK00003')"
            />
          </FormGroup>           
        </div>    
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('SA000600_LBL00006', 'caption','Group Name')"
            label-id="SA000600_LBL00006"
            label-for="SA000600_TXT00002"
            horizontal
          >
            <FormTextInput
              id="SA000600_TXT00002"
              v-model="formData.FLT_GROUP_SNAME"
            />
          </FormGroup> 
        </div>  
        <FormGroup />
        <div class="py-1">
          <FormGroup
            :label="getComponentData('SA000600_LBL00007', 'caption','ESM Administrator')"
            label-id="SA000600_LBL00007"
            label-for="SA000600_CHK00004"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="SA000600_CHK00004"
              v-model="formData.FLT_GROUP_ESM_ADMIN_YN"
              value="1"
              :checked="formData.FLT_GROUP_ESM_ADMIN_YN === '1'"
              @click="CheckedSetting('SA000600_CHK00004')"
            />
          </FormGroup>           
        </div>
        <div class="py-1">
          <FormGroup
            :label="getComponentData('SA000600_LBL00008', 'caption','ESM Users')"
            label-id="SA000600_LBL00008"
            label-for="SA000600_CHK00005"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="SA000600_CHK00005"
              v-model="formData.FLT_GROUP_ESM_USER_YN"
              value="1"
              :checked="formData.FLT_GROUP_ESM_USER_YN === '1'"
              @click="CheckedSetting('SA000600_CHK00005')"
            />
          </FormGroup>           
        </div>
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('SA000600_LBL00009', 'caption','Group Full Name')"
            label-id="SA000600_LBL00009"
            label-for="SA000600_TXT00003"
            horizontal
          >
            <FormTextInput
              id="SA000600_TXT00003"
              v-model="formData.FLT_GROUP_FNAME"
            />
          </FormGroup> 
        </div>  
        <FormGroup />
        <div class="py-1">
          <FormGroup
            :label="getComponentData('SA000600_LBL00010', 'caption','WMS Administrator')"
            label-id="SA000600_LBL00010"
            label-for="SA000600_CHK00006"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="SA000600_CHK00006"
              v-model="formData.FLT_GROUP_WMS_ADMIN_YN"
              value="1"
              :checked="formData.FLT_GROUP_WMS_ADMIN_YN === '1'"
              @click="CheckedSetting('SA000600_CHK00006')"
            />
          </FormGroup>           
        </div>
        <div class="py-1">
          <FormGroup
            :label="getComponentData('SA000600_LBL00011', 'caption','WMS Users')"
            label-id="SA000600_LBL00011"
            label-for="SA000600_CHK00007"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="SA000600_CHK00007"
              v-model="formData.FLT_GROUP_WMS_USER_YN"
              value="1"
              :checked="formData.FLT_GROUP_WMS_USER_YN === '1'"
              @click="CheckedSetting('SA000600_CHK00007')"
            />
          </FormGroup>           
        </div>
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('SA000600_LBL00012', 'caption','Remark')"
            label-id="SA000600_LBL00012"
            label-for="SA000600_TXT00004"
            horizontal
          >
            <FormTextareaInput
              id="SA000600_TXT00004"
              v-model="formData.FLT_GROUP_REMARK"
            />
          </FormGroup> 
        </div>  
        <FormGroup />
        <div class="col-span-2">
          <FormGroup            
            :label="getComponentData('SA000600_LBL00013', 'caption','WH Group')"
            label-id="SA000600_LBL00013"
            label-for="SA000600_CMB00001"
            horizontal
          >
            <FormCombobox              
              id="SA000600_CMB00001"
              v-model="whGroup"
              :disabled="formData.FLT_GROUP_OMS_ADMIN_YN == '1' || formData.FLT_GROUP_OMS_USER_YN == '1'"  
              :options="commonData.getWearHouseGroups"                          
            />
          </FormGroup> 
        </div> 
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
        <div class="flex justify-between items-center">
          <p class="leading-6 font-medium text-gray-900">
            {{ getGridData('SA000600_GRD00002', 'caption','Accessible Menu') }}
          </p>
        </div>        
      </template>
      <Table
        id="SA000600_GRD00002"
        header-variant="secondary"
        class="w-auto h-2/5 overflow-y-auto"
        sticky
        border
        condensed
      >
        <TableHead>
          <TableHeadCell
            v-for="(column, index) in menuListTableFields.filter((item) => item.display === 'Y')"
            :key="index"
            :class="{
              'border-l border-gray-300': index !== 0
            }"
          >
            {{ column.caption }}
          </TableHeadCell>
          <TableHeadCell
            class="border-l border-gray-300 text-center"
          >
            R
          </TableHeadCell>
          <TableHeadCell
            class="border-l border-gray-300 text-center"
          >
            W
          </TableHeadCell>
        </TableHead>

        <TableBody>
          <template
            v-for="(systemMenu, systemMenuIndex) in menuList"
            :key="systemMenuIndex"
          >
            <template
              v-for="(mainMenu, mainMenuIndex) in systemMenu.MAIN_MENUS"
              :key="mainMenuIndex"
            >
              <template
                v-for="(subMenu, subMenuIndex) in mainMenu.SUB_MENUS"
                :key="subMenuIndex"
              >
                <TableRow>
                  <!-- System Menu -->
                  <TableCell
                    v-if="mainMenuIndex === 0 && subMenuIndex === 0"
                    :rowspan="menuCount(systemMenu)"
                  >
                    {{ decrypt(systemMenu.SYSTEM_MENU) }}
                  </TableCell>

                  <!-- Menu Name -->
                  <TableCell
                    v-if="subMenuIndex === 0"
                    :rowspan="mainMenu.SUB_MENUS.length"
                    class="border-l"
                  >
                    {{ decrypt(mainMenu.MENU_NAME) }}
                  </TableCell>

                  <!-- Sub Menu -->
                  <TableCell
                    class="border-l"
                  >
                    {{ decrypt(subMenu.SUB_NAME) }}
                  </TableCell>

                  <!-- Readable -->
                  <TableCell
                    class="border-l text-center"
                  >
                    <FormCheckbox
                      v-model="formData.ACCESS_MENUS_READABLE"
                      :value="{
                        SUB_MENU_CODE: decrypt(subMenu.SUB_CODE),
                        READABLE: '1'
                      }"
                    />
                  </TableCell>

                  <!-- Writable -->
                  <TableCell
                    class="border-l text-center"
                  >
                    <FormCheckbox
                      v-model="formData.ACCESS_MENUS_WRITABLE"
                      :value="{
                        SUB_MENU_CODE: decrypt(subMenu.SUB_CODE),
                        WRITABLE: 'W'
                      }"
                    />
                  </TableCell>
                </TableRow>
              </template>
            </template>
          </template>
        </TableBody>
      </Table>
    </Card>  
    <div>
      <div class="grid grid-cols-6 gap-x-6 mt-6">
        <div class="col-span-4 space-y-3 relative" />
        <div class="col-span-2 space-y-3">          
          <div class="text-end">
            <Button
              rounded
              class="w-30"
              :loading="loading"
              :disabled="loading"
              size="sm"
              @click="saveUserGroupDetail"
            >
              {{ getComponentData('SA000600_BTN00003', 'caption','SAVE') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
