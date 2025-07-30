<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const brandSettings = useBrandSettingsStore()
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { brandList } = storeToRefs(brandSettings)

const formData = ref({
  FLT_SAVE_TYPE: 'INSERT',
  FLT_BRAND_CODE: '',
  FLT_BRAND_SNAME_ENG: '',
  FLT_BRAND_FNAME_ENG: '',
  FLT_BRAND_SNAME_KOR: '',
  FLT_BRAND_FNAME_KOR: '',
  FLT_BRAND_SNAME_CHN: '',
  FLT_BRAND_FNAME_CHN: '',
  FLT_BRAND_SNAME_JPN: '',
  FLT_BRAND_FNAME_JPN: '',
  FLT_GLOBAL_CODE: '',
  FLT_BRAND_ACTIVE_YN: '',
  FLT_BRAND_REMARK: ''
})

onBeforeMount(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await brandSettings.fetchBrandList()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  isloading.isLoading = false
  togglePageLoading()
})

const brandListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'PA000200_GRD00001')
})

const resetFormData = () => {
  formData.value = {
    FLT_SAVE_TYPE: 'INSERT',
    FLT_BRAND_CODE: '',
    FLT_BRAND_SNAME_ENG: '',
    FLT_BRAND_FNAME_ENG: '',
    FLT_BRAND_SNAME_KOR: '',
    FLT_BRAND_FNAME_KOR: '',
    FLT_BRAND_SNAME_CHN: '',
    FLT_BRAND_FNAME_CHN: '',
    FLT_BRAND_SNAME_JPN: '',
    FLT_BRAND_FNAME_JPN: '',
    FLT_GLOBAL_CODE: '',
    FLT_BRAND_ACTIVE_YN: '',
    FLT_BRAND_REMARK: ''
  }
}

const saveBrandDetail = async () => {
  toggleLoading()
  isloading.isLoading = true
  const { success } = await brandSettings.saveBrandDetail(formData.value)
  if (success) {
    await brandSettings.fetchBrandList()
    resetFormData()
  }
  isloading.isLoading = false
  toggleLoading()
}

const onClickBrandListRow = (item) => {
  Object.keys(item).forEach((key) => {
    formData.value[`FLT_${key}`] = decrypt(item[key])
  })

  formData.value.FLT_GLOBAL_CODE = decrypt(item.BRAND_ERP_CODE)
  formData.value.FLT_SAVE_TYPE = 'UPDATE'
}
</script>

<template>
  <AppContent :loading="pageLoading">
    <div class="grid grid-cols-7 gap-x-6">
      <div class="col-span-5 space-y-3">
        <div class="flex justify-between items-center">
          <p>
            {{ getGridData('PA000200_GRD00001', 'caption', 'List of Brands') }}
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
          id="PA000200_GRD00001"
          header-variant="secondary"
          class="overflow-x-auto"
          clickable
          :columns="brandListTableColumns"
          :items="brandList"
          @on-row-click="onClickBrandListRow"
        >
          <template #cell(BRAND_ACTIVE_YN)="{ value }">
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
              {{ getComponentData('PA000200_LBL00013', 'caption') }}
            </p>
          </template>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00001', 'caption')"
            label-id="PA000200_LBL00001"
            label-for="PA000200_TXT00001"
          >
            <FormTextInput
              id="PA000200_TXT00001"
              v-model="formData.FLT_BRAND_CODE"
              type="number"
              :disabled="formData.FLT_SAVE_TYPE === 'UPDATE'"
              :placeholder="getComponentData('PA000200_TXT00001', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00002', 'caption')"
            label-id="PA000200_LBL00002"
            label-for="PA000200_TXT00002"
          >
            <FormTextInput
              id="PA000200_TXT00002"
              v-model="formData.FLT_BRAND_SNAME_ENG"
              :placeholder="getComponentData('PA000200_TXT00002', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00003', 'caption')"
            label-id="PA000200_LBL00003"
            label-for="PA000200_TXT00003"
          >
            <FormTextInput
              id="PA000200_TXT00003"
              v-model="formData.FLT_BRAND_FNAME_ENG"
              :placeholder="getComponentData('PA000200_TXT00003', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00004', 'caption')"
            label-id="PA000200_LBL00004"
            label-for="PA000200_TXT00004"
          >
            <FormTextInput
              id="PA000200_TXT00004"
              v-model="formData.FLT_BRAND_SNAME_KOR"
              :placeholder="getComponentData('PA000200_TXT00004', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00005', 'caption')"
            label-id="PA000200_LBL00005"
            label-for="PA000200_TXT00005"
          >
            <FormTextInput
              id="PA000200_TXT00005"
              v-model="formData.FLT_BRAND_FNAME_KOR"
              :placeholder="getComponentData('PA000200_TXT00005', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00006', 'caption')"
            label-id="PA000200_LBL00006"
            label-for="PA000200_TXT00006"
          >
            <FormTextInput
              id="PA000200_TXT00006"
              v-model="formData.FLT_BRAND_SNAME_CHN"
              :placeholder="getComponentData('PA000200_TXT00006', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00007', 'caption')"
            label-id="PA000200_LBL00007"
            label-for="PA000200_TXT00007"
          >
            <FormTextInput
              id="PA000200_TXT00007"
              v-model="formData.FLT_BRAND_FNAME_CHN"
              :placeholder="getComponentData('PA000200_TXT00007', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00008', 'caption')"
            label-id="PA000200_LBL00008"
            label-for="PA000200_TXT00008"
          >
            <FormTextInput
              id="PA000200_TXT00008"
              v-model="formData.FLT_BRAND_SNAME_JPN"
              :placeholder="getComponentData('PA000200_TXT00008', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00009', 'caption')"
            label-id="PA000200_LBL00009"
            label-for="PA000200_TXT00009"
          >
            <FormTextInput
              id="PA000200_TXT00009"
              v-model="formData.FLT_BRAND_FNAME_JPN"
              :placeholder="getComponentData('PA000200_TXT00009', 'placeholder')"
            />
          </FormGroup>

          <div>
            <FormCheckbox
              id="PA000200_CHK00001"
              v-model="formData.FLT_BRAND_ACTIVE_YN"
              :label="getComponentData('PA000200_LBL00010', 'caption')"
              label-id="PA000200_CHK00001"
              :checked="formData.FLT_BRAND_ACTIVE_YN === '1'"
            />
          </div>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00011', 'caption')"
            label-id="PA000200_LBL00011"
            label-for="PA000200_TXT00010"
          >
            <FormTextInput
              id="PA000200_TXT00010"
              v-model="formData.FLT_GLOBAL_CODE"
              :placeholder="getComponentData('PA000200_TXT00010', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            label-width="w-1/3"
            :label="getComponentData('PA000200_LBL00012', 'caption', 'Remark')"
            label-id="PA000200_LBL00012"
            label-for="PA000200_TXT00011"
          >
            <FormTextareaInput
              id="PA000200_TXT00011"
              v-model="formData.FLT_BRAND_REMARK"
            />
          </FormGroup>
        </Card>

        <div class="text-end">
          <Button
            id="PA000200_BTN00001"
            class="w-30"
            rounded
            :disabled="loading"
            :loading="loading"
            @click="saveBrandDetail"
          >
            {{ getComponentData('PA000200_BTN00002', 'caption') }}
          </Button>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
