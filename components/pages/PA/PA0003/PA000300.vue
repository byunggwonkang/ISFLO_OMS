<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()
const warehouseSettings = useWarehouseSettingsStore()
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { warehouseList, brandList } = storeToRefs(warehouseSettings)

onBeforeMount(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await warehouseSettings.fetchWarehouseList()
  await warehouseSettings.fetchBrandList()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await commonData.fetchPA000300CommonData()

  brand.value = {
    name: decrypt(brandList.value[0]?.BRAND_FNAME) ?? '',
    value: parseInt(decrypt(brandList.value[0]?.BRAND_CODE)).toString() ?? '',
  }

  whGroup.value = commonData.getWearHouseGroups[0]

  StockType.value = commonData.getStockType[0]

  isloading.isLoading = false
  togglePageLoading()
})

const warehouseSettingsTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'PA000300_GRD00001')
})

const brand = ref({})
const whGroup = ref({})
const StockType= ref({})

const formData = ref({
  FLT_WH_CODE: '',
  FLT_WH_SNAME: '',
  FLT_WH_FNAME: '',
  FLT_WH_BRAND_CODE: '',
  FLT_WH_GROUP_CODE: '',
  FLT_WH_TYPE_CODE: '',
  FLT_WH_USED_ECOMM_YN: '',
  FLT_WH_USED_REGULAR_YN: '',
  FLT_WH_OPEN_DATE: '',
  FLT_WH_CLOSE_DATE: '',
  FLT_WH_ERP_CODE: '',
  FLT_WH_ACTIVE_YN: '',
  FLT_WH_REMARK: '',
})

const resetFormData = () => {
  formData.value = {
    FLT_WH_CODE: '',
    FLT_WH_SNAME: '',
    FLT_WH_FNAME: '',
    FLT_WH_BRAND_CODE: '',
    FLT_WH_GROUP_CODE: '',
    FLT_WH_OPEN_DATE: '',
    FLT_WH_CLOSE_DATE: '',
    FLT_WH_ERP_CODE: '',
    FLT_WH_ACTIVE_YN: '',
    FLT_WH_REMARK: '',
  }

  brand.value = {
    name: decrypt(brandList.value[0]?.BRAND_FNAME) ?? '',
    value: parseInt(decrypt(brandList.value[0]?.BRAND_CODE)).toString() ?? '',
  }

  whGroup.value = commonData.getWearHouseGroups[0]

  StockType.value = commonData.getStockType[0]
}

const onClickWarehouseListRow = (item) => {
  Object.entries(item).forEach(([key, value]) => {
    if (key === 'WH_ACTIVE_YN' || key === 'WH_USED_ECOMM_YN' || key === 'WH_USED_REGULAR_YN') {
      formData.value[`FLT_${key}`] = decrypt(value) === '1'
    } else {
      formData.value[`FLT_${key}`] = decrypt(value)
    }
  })

  const selectedBrand = brandList.value.find((brand) => brand.BRAND_CODE === item.WH_BRAND_CODE)
  brand.value = {
    name: decrypt(selectedBrand?.BRAND_FNAME) ?? '',
    value: parseInt(decrypt(selectedBrand?.BRAND_CODE)).toString() ?? '',
  }

  const selectedWHGroup = commonData.getWearHouseGroups.find((whGroup) => whGroup.value === decrypt(item.WH_GROUP_CODE))
  whGroup.value = {
    name: selectedWHGroup?.name ?? '',
    value: selectedWHGroup?.value ?? '',
  }

  const selectedStockType = commonData.getStockType.find((whGroup) => whGroup.value === decrypt(item.WH_TYPE_CODE))
  StockType.value = {
    name: selectedStockType?.name ?? '',
    value: selectedStockType?.value ?? '',
  }
}

const saveWarehouseDetail = async () => {
  formData.value.FLT_WH_BRAND_CODE = brand.value?.value
  formData.value.FLT_WH_GROUP_CODE = whGroup.value?.value
  formData.value.FLT_WH_TYPE_CODE = StockType.value?.value
  toggleLoading()
  isloading.isLoading = true
  const { success } = await warehouseSettings.saveWarehouseDetail(formData.value)
  if (success) {
    await warehouseSettings.fetchWarehouseList()
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
            {{ getGridData('PA000300_GRD00001', 'caption') }}
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
          id="PA000300_GRD00001"
          header-variant="secondary"
          clickable
          :columns="warehouseSettingsTableFields"
          :items="warehouseList"
          @on-row-click="onClickWarehouseListRow"
        >
          <template #cell(WH_ACTIVE_YN)="{ value }">
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
              {{ getComponentData('PA000300_LBL00001', 'caption') }}
            </p>
          </template>

          <FormGroup
            :label="getComponentData('PA000300_LBL00002', 'caption')"
            label-width="w-1/3"
            label-id="PA000300_LBL00002"
            label-for="PA000300_TXT00001"
            horizontal
          >
            <FormTextInput
              id="PA000300_TXT00001"
              v-model="formData.FLT_WH_CODE"
              :placeholder="getComponentData('PA000300_TXT00001', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA000300_LBL00003', 'caption')"
            label-width="w-1/3"
            label-id="PA000300_LBL00003"
            label-for="PA000300_CMB00001"
            horizontal
          >
            <FormCombobox
              id="PA000300_CMB00001"
              v-model="brand"
              :options="brandList.map((item) => ({
                name: decrypt(item.BRAND_FNAME),
                value: decrypt(item.BRAND_CODE),
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA000300_LBL00008', 'caption','WH Group')"
            label-width="w-1/3"
            label-id="PA000300_LBL00008"
            label-for="PA000300_CMB00002"
            horizontal
          >
            <FormCombobox
              id="PA000300_CMB00002"
              v-model="whGroup"
              :options="commonData.getWearHouseGroups" 
            />
          </FormGroup>


          <FormGroup
            :label="getComponentData('PA000300_LBL00004', 'caption')"
            label-width="w-1/3"
            label-id="PA000300_LBL00004"
            label-for="PA000300_TXT00002"
            horizontal
          >
            <FormTextInput
              id="PA000300_TXT00002"
              v-model="formData.FLT_WH_SNAME"
              :placeholder="getComponentData('PA000300_TXT00002', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA000300_LBL00005', 'caption')"
            label-width="w-1/3"
            label-id="PA000300_LBL00005"
            label-for="PA000300_TXT00003"
            horizontal
          >
            <FormTextInput
              id="PA000300_TXT00003"
              v-model="formData.FLT_WH_FNAME"
              :placeholder="getComponentData('PA000300_TXT00003', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA000300_LBL00008', 'caption','WH Type')"
            label-width="w-1/3"
            label-id="PA000300_LBL00008"
            label-for="PA000300_CMB00002"
            horizontal
          >
            <FormCombobox
              id="PA000300_CMB00002"
              v-model="StockType"
              :options="commonData.getStockType" 
            />
          </FormGroup>
          <div class="py-1">
            <FormGroup
              :label="getComponentData('PA000300_LBL00008', 'caption','e-Commerce WH')"
              label-id="PA000300_LBL00008"
              label-for="PA000300_CHK00001"
              label-width="w-1/3"
              horizontal
            >
              <FormCheckbox
                id="PA000300_CHK00001"
                v-model="formData.FLT_WH_USED_ECOMM_YN"
                value="1"
                :checked="formData.FLT_WH_USED_ECOMM_YN === '1'"
              />
            </FormGroup>
          </div> 
          <div class="py-1">
            <FormGroup
              :label="getComponentData('PA000300_LBL00009', 'caption','Regular WH')"
              label-id="PA000300_LBL00009"
              label-for="PA000300_CHK00002"
              label-width="w-1/3"
              horizontal
            >
              <FormCheckbox
                id="PA000300_CHK00002"
                v-model="formData.FLT_WH_USED_REGULAR_YN"
                value="1"
                :checked="formData.FLT_WH_USED_REGULAR_YN === '1'"
              />
            </FormGroup>
          </div> 
          <div class="py-1">
            <FormGroup
              :label="getComponentData('PA000300_LBL00010', 'caption','Active')"
              label-id="PA000300_LBL00010"
              label-for="PA000300_CHK00003"
              label-width="w-1/3"
              horizontal
            >
              <FormCheckbox
                id="PA000300_CHK00003"
                v-model="formData.FLT_WH_ACTIVE_YN"
                value="1"
                :checked="formData.FLT_WH_ACTIVE_YN === '1'"
              />
            </FormGroup>
          </div>
          <FormGroup
            :label="getComponentData('PA000300_LBL00007', 'caption')"
            label-width="w-1/3"
            label-id="PA000300_LBL00007"
            label-for="PA000300_TXT00004"
            horizontal
          >
            <FormTextareaInput
              id="PA000300_TXT00004"
              v-model="formData.FLT_WH_REMARK"
              :placeholder="getComponentData('PA000300_TXT00004', 'placeholder')"
            />
          </FormGroup>
        </Card>

        <div class="text-end">
          <Button
            id="PA000300_BTN00002"
            class="w-30"
            rounded
            :disabled="loading"
            :loading="loading"
            @click="saveWarehouseDetail"
          >
            {{ getComponentData('PA000300_BTN00002', 'caption') }}
          </Button>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
