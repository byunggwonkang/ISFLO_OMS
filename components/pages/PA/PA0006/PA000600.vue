<script setup>
import { ArrowPathIcon } from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const userGroupSettings = userGroupSettingsStore()
const pageLoader = usePageLoaderStore()
const userSettings = useUserSettingsStore()

const { currentTab } = storeToRefs(useTabsStore())
const { userGroupList, storeList, channelList } = storeToRefs(userGroupSettings)
const { loading, toggleLoading } = useLoading()

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await userGroupSettings.fetchUserGroupList()  
  await userGroupSettings.fetchChannelList()
  await userGroupSettings.fetchStoreList()
  isloading.isLoading = false
  togglePageLoading()
})


const onClickSearch = async () => {
  toggleLoading()
  isloading.isLoading = true
  await userGroupSettings.fetchUserGroupList()
  isloading.isLoading = false
  toggleLoading()
}
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const userGroupListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'PA000600_GRD00001')
})

const formData = ref({
  FLT_GROUP_SID: '',
  FLT_GROUP_SNAME: '',
  FLT_GROUP_FNAME: '',
  FLT_GROUP_ACTIVE_YN: false,
  FLT_GROUP_SA_YN: false,
  FLT_GROUP_OMS_ADMIN_YN: false,
  FLT_GROUP_OMS_USER_YN: false,
  FLT_GROUP_ESM_ADMIN_YN: false,
  FLT_GROUP_ESM_USER_YN: false,
  FLT_GROUP_WMS_ADMIN_YN: false,
  FLT_GROUP_WMS_USER_YN: false,
  FLT_GROUP_WH_GROUP_CODE: '',
  FLT_GROUP_WH_GROUP_FNAME: '',
  FLT_GROUP_REMARK: '',
  ACCESS_CHANNELS: [],
  ACCESS_STORES: [],
})

const onClickUserGroupListRow = async (userGroup) => {
  const { success, data } = await userGroupSettings.fetchUserGroupDetail(userGroup.GROUP_SID)

  if (success) {
    formData.value = {
      FLT_GROUP_SID: decrypt(data.GROUP_SID),
      FLT_GROUP_SNAME: decrypt(data.GROUP_SNAME),
      FLT_GROUP_FNAME: decrypt(data.GROUP_FNAME),
      FLT_GROUP_ACTIVE_YN: decrypt(data.GROUP_ACTIVE) === '1',
      FLT_GROUP_SA_YN: decrypt(data.GROUP_SYSADMIN) === '1',
      FLT_GROUP_OMS_ADMIN_YN: decrypt(data.GROUP_OMS_ADMIN_YN) === '1',
      FLT_GROUP_OMS_USER_YN: decrypt(data.GROUP_OMS_USER_YN) === '1',
      FLT_GROUP_ESM_ADMIN_YN: decrypt(data.GROUP_ESM_ADMIN_YN) === '1',
      FLT_GROUP_ESM_USER_YN: decrypt(data.GROUP_ESM_USER_YN) === '1',
      FLT_GROUP_WMS_ADMIN_YN: decrypt(data.GROUP_WMS_ADMIN_YN) === '1',
      FLT_GROUP_WMS_USER_YN: decrypt(data.GROUP_WMS_USER_YN) === '1',
      FLT_GROUP_WH_GROUP_CODE: decrypt(data.GROUP_WH_GROUP_CODE),
      FLT_GROUP_WH_GROUP_FNAME : decrypt(data.GROUP_WH_GROUP_FNAME),
      FLT_GROUP_REMARK: decrypt(data.GROUP_DESCR),
      ACCESS_CHANNELS: data.ACCESS_CHANNELS.map((channel) => {
        return {
          CHANNEL_CODE: decrypt(channel.CHANNEL_CODE),
          BRAND_CODE: parseInt(decrypt(channel.BRAND_CODE)).toString(),
        }
      }),
      ACCESS_STORES: data.ACCESS_STORES.map((store) => {
        return {
          STORE_CODE: decrypt(store.STORE_CODE),
          BRAND_CODE: parseInt(decrypt(store.BRAND_CODE)).toString(),
        }
      }),
    }
  }
}

const resetFormData = () => {
  formData.value = {
    FLT_GROUP_SID: '',
    FLT_GROUP_SNAME: '',
    FLT_GROUP_FNAME: '',
    FLT_GROUP_ACTIVE_YN: false,
    FLT_GROUP_SA_YN: false,
    FLT_GROUP_OMS_ADMIN_YN: false,
    FLT_GROUP_OMS_USER_YN: false,
    FLT_GROUP_ESM_ADMIN_YN: false,
    FLT_GROUP_ESM_USER_YN: false,
    FLT_GROUP_WMS_ADMIN_YN: false,
    FLT_GROUP_WMS_USER_YN: false,
    FLT_GROUP_WH_GROUP_CODE: '',
    FLT_GROUP_WH_GROUP_FNAME : '',
    FLT_GROUP_REMARK: '',
    ACCESS_CHANNELS: [],
    ACCESS_STORES: [],
  }
}


const saveUserGroupDetail = async () => {
  
  formData.value.FLT_GROUP_SA_YN = false

  toggleLoading()
  isloading.isLoading = true
  const { success } = await userGroupSettings.saveUserGroupDetail(formData.value)
  if (success) {
    await userGroupSettings.fetchUserGroupList()
    await userSettings.fetchUserGroupList()
  isloading.isLoading = false
    resetFormData()
  }
  toggleLoading()
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
            {{ getGridData('PA000600_GRD00001', 'caption','List of User Groups') }}       
          </p>
          <Button
            id="PA000600_BTN00001"
            v-tooltip="{
              content: getComponentData('PA000600_BTN00001', 'caption'),
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
            {{ getComponentData('PA000600_LBL00001', 'caption','Details of User Group') }}          
          </p>
        </div>        
      </template>
      <div class="grid grid-cols-5 gap-y-3 gap-x-12">
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('PA000600_LBL00002', 'caption','System ID')"
            label-id="PA000600_LBL00002"
            label-for="PA000600_TXT00001"
            horizontal
          >
            <FormTextInput
              id="PA000600_TXT00001"
              v-model="formData.FLT_GROUP_SID"
              disabled
            />
          </FormGroup> 
        </div> 
        <div class="py-1">
          <FormGroup
            :label="getComponentData('PA000600_LBL00003', 'caption','Active')"
            label-id="PA000600_LBL00003"
            label-for="PA000600_CHK00001"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="PA000600_CHK00001"
              v-model="formData.FLT_GROUP_ACTIVE_YN"
              value="1"
              :checked="formData.FLT_GROUP_ACTIVE_YN === '1'"
              disabled
            />
          </FormGroup>           
        </div>   
        <div class="py-1">
          <FormGroup
            :label="getComponentData('PA000600_LBL00004', 'caption','OMS Administrator')"
            label-id="PA000600_LBL00004"
            label-for="PA000600_CHK00002"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="PA000600_CHK00002"
              v-model="formData.FLT_GROUP_OMS_ADMIN_YN"
              value="1"
              :checked="formData.FLT_GROUP_OMS_ADMIN_YN === '1'"
              disabled
            />
          </FormGroup> 
        </div>
        <div class="py-1">
          <FormGroup
            :label="getComponentData('PA000600_LBL00005', 'caption','OMS Users')"
            label-id="PA000600_LBL00005"
            label-for="PA000600_CHK00003"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="PA000600_CHK00003"
              v-model="formData.FLT_GROUP_OMS_USER_YN"
              value="1"
              :checked="formData.FLT_GROUP_OMS_USER_YN === '1'"
              disabled
            />
          </FormGroup> 
        </div>    
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('PA000600_LBL00006', 'caption','Group Name')"
            label-id="PA000600_LBL00006"
            label-for="PA000600_TXT00002"
            horizontal
          >
            <FormTextInput
              id="PA000600_TXT00002"
              v-model="formData.FLT_GROUP_SNAME"
              disabled
            />
          </FormGroup> 
        </div>  
        <FormGroup />
        <div class="py-1">
          <FormGroup
            :label="getComponentData('PA000600_LBL00007', 'caption','ESM Administrator')"
            label-id="PA000600_LBL00007"
            label-for="PA000600_CHK00004"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="PA000600_CHK00004"
              v-model="formData.FLT_GROUP_ESM_ADMIN_YN"
              value="1"
              :checked="formData.FLT_GROUP_ESM_ADMIN_YN === '1'"
              disabled
            />
          </FormGroup>
        </div>
        <div class="py-1">
          <FormGroup
            :label="getComponentData('PA000600_LBL00008', 'caption','ESM Users')"
            label-id="PA000600_LBL00008"
            label-for="PA000600_CHK00005"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="PA000600_CHK00005"
              v-model="formData.FLT_GROUP_ESM_USER_YN"
              value="1"
              :checked="formData.FLT_GROUP_ESM_USER_YN === '1'"
              disabled
            />
          </FormGroup>
        </div> 
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('PA000600_LBL00009', 'caption','Group Full Name')"
            label-id="PA000600_LBL00009"
            label-for="PA000600_TXT00003"
            horizontal
          >
            <FormTextInput
              id="PA000600_TXT00003"
              v-model="formData.FLT_GROUP_FNAME"
              disabled
            />
          </FormGroup> 
        </div>  
        <FormGroup />
        <div class="py-1">
          <FormGroup
            :label="getComponentData('PA000600_LBL00010', 'caption','WMS Administrator')"
            label-id="PA000600_LBL00010"
            label-for="PA000600_CHK00006"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="PA000600_CHK00006"
              v-model="formData.FLT_GROUP_WMS_ADMIN_YN"
              value="1"
              :checked="formData.FLT_GROUP_WMS_ADMIN_YN === '1'"
              disabled
            />
          </FormGroup>
        </div>
        <div class="py-1">
          <FormGroup
            :label="getComponentData('PA000600_LBL00011', 'caption','WMS Users')"
            label-id="PA000600_LBL00011"
            label-for="PA000600_CHK00007"
            label-width="w-1/3"
            horizontal
          >
            <FormCheckbox
              id="PA000600_CHK00007"
              v-model="formData.FLT_GROUP_WMS_USER_YN"
              value="1"
              :checked="formData.FLT_GROUP_WMS_USER_YN === '1'"
              disabled
            />
          </FormGroup>
        </div> 
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('PA000600_LBL00012', 'caption','Remark')"
            label-id="PA000600_LBL00012"
            label-for="PA000600_TXT00004"
            horizontal
          >
            <FormTextareaInput
              id="PA000600_TXT00004"
              v-model="formData.FLT_GROUP_REMARK"
              disabled
            />
          </FormGroup> 
        </div>  
        <FormGroup />
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('PA000600_LBL00013', 'caption','WH Group')"
            label-id="PA000600_LBL00013"
            label-for="PA000600_TXT00005"
            horizontal
          >
            <FormTextInput
              id="PA000600_TXT00005"
              v-model="formData.FLT_GROUP_WH_GROUP_FNAME"
              disabled
            />
          </FormGroup> 
        </div> 
      </div>
    </Card>
    <div>
      <div class="grid grid-cols-4 gap-x-6 mt-6">
        <div class="col-span-2 space-y-3">          
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-2 space-y-1"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-1 space-y-3"
          >
            <template #header>
              <p class="leading-6 font-medium text-gray-900">
                {{ getGridData('PA000600_GRD00003', 'caption') }}
              </p>
            </template>

            <Table
              id="PA000600_GRD00003"
              checkable
              condensed
              :divider="false"
              class="max-h-52 overflow-y-auto"
            >
              <TableRow
                v-for="(channel, index) in channelList"
                :key="index"
              >
                <template #checkbox>
                  <FormCheckbox
                    v-model="formData.ACCESS_CHANNELS"
                    :value="{
                      CHANNEL_CODE: decrypt(channel.CHANNEL_CODE),
                      BRAND_CODE: parseInt(decrypt(channel.BRAND_CODE)).toString(),
                    }"
                  />
                </template>
                <TableCell>
                  {{ decrypt(channel.CHANNEL_FNAME) }}
                </TableCell>
                <TableCell>
                  {{ decrypt(channel.BRAND_FNAME) }}
                </TableCell>
              </TableRow>
            </Table>
          </Card>
        </div>
        <div class="col-span-2 space-y-3">
          <Card
            divider
            shadow-size="none"
            card-header-class="px-3 py-2 space-y-1"
            class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
            card-body-class="p-1 space-y-3"
          >
            <template #header>
              <p class="leading-6 font-medium text-gray-900">
                {{ getGridData('PA000600_GRD00004', 'caption') }}
              </p>
            </template>

            <Table
              id="PA000600_GRD00004"
              checkable
              condensed
              :divider="false"
              class="max-h-52 overflow-y-auto"
            >
              <TableRow
                v-for="(store, index) in storeList"
                :key="index"
              >
                <template #checkbox>
                  <FormCheckbox
                    v-model="formData.ACCESS_STORES"
                    :value="{
                      STORE_CODE: decrypt(store.STORE_CODE),
                      BRAND_CODE: parseInt(decrypt(store.BRAND_CODE)).toString(),
                    }"
                  />
                </template>
                <TableCell>
                  {{ decrypt(store.STORE_DNAME) }}
                </TableCell>
                <TableCell>
                  {{ decrypt(store.STORE_TYPE_FNAME) }}
                </TableCell>
                <TableCell>
                  {{ decrypt(store.BRAND_FNAME) }}
                </TableCell>
              </TableRow>
            </Table>
          </Card>
        </div>
      </div>
    </div>
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
              {{ getComponentData('PA000600_BTN00002', 'caption','SAVE') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
