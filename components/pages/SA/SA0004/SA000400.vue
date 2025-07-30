<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const courierSettings = useCourierSettingsStore()

const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { courierList } = storeToRefs(courierSettings);

const formData = ref({
  FLT_SAVE_TYPE: 'INSERT',
  FLT_COURIER_SID: '',
  FLT_COURIER_SNAME_ENG: '',
  FLT_COURIER_FNAME_ENG: '',
  FLT_COURIER_SNAME_KOR: '',
  FLT_COURIER_FNAME_KOR: '',
  FLT_COURIER_SNAME_CHN: '',
  FLT_COURIER_FNAME_CHN: '',
  FLT_COURIER_SNAME_JPN: '',
  FLT_COURIER_FNAME_JPN: '',
  FLT_COURIER_ACTIVE_YN: '',
  FLT_COURIER_REMARK: ''
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')

  await fetchCourierList()
  isloading.isLoading = false
  togglePageLoading()
})

const courierListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'SA000400_GRD00001')
})

const fetchCourierList = async () => {
  await courierSettings.fetchCourierList()
}

const resetFormData = () => {
  formData.value = {
    FLT_SAVE_TYPE: 'INSERT',
    FLT_COURIER_SID: '',
    FLT_COURIER_SNAME_ENG: '',
    FLT_COURIER_FNAME_ENG: '',
    FLT_COURIER_SNAME_KOR: '',
    FLT_COURIER_FNAME_KOR: '',
    FLT_COURIER_SNAME_CHN: '',
    FLT_COURIER_FNAME_CHN: '',
    FLT_COURIER_SNAME_JPN: '',
    FLT_COURIER_FNAME_JPN: '',
    FLT_COURIER_ACTIVE_YN: '',
    FLT_COURIER_REMARK: ''
  }
}

const saveCourierDetail = async () => {
  toggleLoading()
  isloading.isLoading = true
  const { success } = await courierSettings.saveCourierDetail(formData.value)
  if (success) {
    await fetchCourierList()
    resetFormData()
  }
  isloading.isLoading = false
  toggleLoading()
}

const onClickCourierRow = (item) => {
  Object.keys(item).forEach((key) => {
    formData.value[`FLT_${key}`] = decrypt(item[key])
  })

  formData.value.FLT_SAVE_TYPE = 'UPDATE'
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
                {{ getGridData('SA000400_GRD00001', 'caption', 'List of Couriers') }}
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
            id="SA000400_GRD00001"
            class="overflow-x-auto mt-3"
            header-variant="secondary"
            clickable
            :columns="courierListTableColumns"
            :items="courierList"
            @on-row-click="onClickCourierRow"
          >
            <template #cell(COURIER_ACTIVE_YN)="{ value }">
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
              {{ getComponentData('SA000400_LBL00012', 'caption', 'Detail Of Courier') }}
            </p>
          </template>

          <FormGroup
            :label="getComponentData('SA000400_LBL00001', 'caption', 'Code')"
            label-id="SA000400_LBL00001"
            label-for="SA000400_TXT00001"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00001"
              v-model="formData.FLT_COURIER_SID"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000400_LBL00002', 'caption', 'Short Name (ENG)')"
            label-id="SA000400_LBL00002"
            label-for="SA000400_TXT00002"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00002"
              v-model="formData.FLT_COURIER_SNAME_ENG"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000400_LBL00003', 'caption', 'Full Name (ENG)')"
            label-id="SA000400_LBL00003"
            label-for="SA000400_TXT00003"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00003"
              v-model="formData.FLT_COURIER_FNAME_ENG"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000400_LBL00004', 'caption', 'Short Name (KOR)')"
            label-id="SA000400_LBL00004"
            label-for="SA000400_TXT00004"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00004"
              v-model="formData.FLT_COURIER_SNAME_KOR"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000400_LBL00005', 'caption', 'Full Name (KOR)')"
            label-id="SA000400_LBL00005"
            label-for="SA000400_TXT00005"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00005"
              v-model="formData.FLT_COURIER_FNAME_KOR"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000400_LBL00006', 'caption', 'Short Name (CHN)')"
            label-id="SA000400_LBL00006"
            label-for="SA000400_TXT00006"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00006"
              v-model="formData.FLT_COURIER_SNAME_CHN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000400_LBL00007', 'caption', 'Full Name (CHN)')"
            label-id="SA000400_LBL00007"
            label-for="SA000400_TXT00007"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00007"
              v-model="formData.FLT_COURIER_FNAME_CHN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000400_LBL00008', 'caption', 'Short Name (JPN)')"
            label-id="SA000400_LBL00008"
            label-for="SA000400_TXT00008"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00008"
              v-model="formData.FLT_COURIER_SNAME_JPN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000400_LBL00009', 'caption', 'Full Name (JPN)')"
            label-id="SA000400_LBL00009"
            label-for="SA000400_TXT00009"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00009"
              v-model="formData.FLT_COURIER_FNAME_JPN"
            />
          </FormGroup>

          <div>
            <FormCheckbox
              v-model="formData.FLT_COURIER_ACTIVE_YN"
              :label="getComponentData('SA000400_LBL00010', 'caption', 'Active')"
              label-id="SA000400_LBL00010"
              :checked="formData.FLT_COURIER_ACTIVE_YN === '1'"
            />
          </div>

          <FormGroup
            :label="getComponentData('SA000400_LBL00011', 'caption', 'Remark')"
            label-id="SA000400_LBL00011"
            label-for="SA000400_TXT00010"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000400_TXT00010"
              v-model="formData.FLT_COURIER_REMARK"
            />
          </FormGroup>

          <div class="text-end">
            <Button
              id="SA000400_BTN00002"
              class="w-30"
              rounded
              :disabled="loading"
              :loading="loading"
              @click="saveCourierDetail"
            >
              {{ getComponentData('SA000400_BTN00002', 'caption') }}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
