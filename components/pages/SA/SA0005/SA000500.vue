<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid/index.js";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const agencySettings = useAgencySettingsStore()

const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const { agencyList } = storeToRefs(agencySettings);

const formData = ref({
  FLT_SAVE_TYPE: 'INSERT',
  FLT_AGENCY_SID: '',
  FLT_AGENCY_SNAME_ENG: '',
  FLT_AGENCY_FNAME_ENG: '',
  FLT_AGENCY_SNAME_KOR: '',
  FLT_AGENCY_FNAME_KOR: '',
  FLT_AGENCY_SNAME_CHN: '',
  FLT_AGENCY_FNAME_CHN: '',
  FLT_AGENCY_SNAME_JPN: '',
  FLT_AGENCY_FNAME_JPN: '',
  FLT_AGENCY_VALUE_01: '',
  FLT_AGENCY_VALUE_02: '',
  FLT_AGENCY_VALUE_03: '',
  FLT_AGENCY_VALUE_04: '',
  FLT_AGENCY_VALUE_05: '',
  FLT_AGENCY_VALUE_06: '',
  FLT_AGENCY_VALUE_07: '',
  FLT_AGENCY_VALUE_08: '',
  FLT_AGENCY_VALUE_09: '',
  FLT_AGENCY_VALUE_10: '',
  FLT_AGENCY_ACTIVE_YN: '',
  FLT_AGENCY_REMARK: ''
})

const saveAgencyDetail = async () => {
  toggleLoading()
  isloading.isLoading = true
  const { success } = await agencySettings.saveAgencyDetail(formData.value)
  if (success) {
    await fetchAgencyList()
    resetFormData()
  }
  isloading.isLoading = false
  toggleLoading()
}

const agencyListTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'SA000500_GRD00001')
})

const fetchAgencyList = async () => {
  await agencySettings.fetchAgencyList()
}

const resetFormData = () => {
  formData.value = {
    FLT_SAVE_TYPE: 'INSERT',
    FLT_AGENCY_SID: '',
    FLT_AGENCY_SNAME_ENG: '',
    FLT_AGENCY_FNAME_ENG: '',
    FLT_AGENCY_SNAME_KOR: '',
    FLT_AGENCY_FNAME_KOR: '',
    FLT_AGENCY_SNAME_CHN: '',
    FLT_AGENCY_FNAME_CHN: '',
    FLT_AGENCY_SNAME_JPN: '',
    FLT_AGENCY_FNAME_JPN: '',
    FLT_AGENCY_VALUE_01: '',
    FLT_AGENCY_VALUE_02: '',
    FLT_AGENCY_VALUE_03: '',
    FLT_AGENCY_VALUE_04: '',
    FLT_AGENCY_VALUE_05: '',
    FLT_AGENCY_VALUE_06: '',
    FLT_AGENCY_VALUE_07: '',
    FLT_AGENCY_VALUE_08: '',
    FLT_AGENCY_VALUE_09: '',
    FLT_AGENCY_VALUE_10: '',
    FLT_AGENCY_ACTIVE_YN: '',
    FLT_AGENCY_REMARK: ''
  }
}

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')

  await fetchAgencyList()
  isloading.isLoading = false
  togglePageLoading()
})

const onClickAgencyRow = (item) => {
  Object.keys(item).forEach((key) => {
    formData.value[`FLT_${key}`] = decrypt(item[key])
  })

  formData.value.FLT_SAVE_TYPE = 'UPDATE'
}
</script>

<template>
  <AppContent :loading="pageLoading">
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
                {{ getGridData('SA000500_GRD00001', 'caption', 'List of Agencies') }}
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
            id="SA000500_GRD00001"
            class="overflow-x-auto mt-3"
            header-variant="secondary"
            clickable
            :columns="agencyListTableColumns"
            :items="agencyList"
            @on-row-click="onClickAgencyRow"
          >
            <template #cell(AGENCY_ACTIVE_YN)="{ value }">
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
              {{ getComponentData('SA000500_LBL00022', 'caption') }}
            </p>
          </template>

          <FormGroup
            :label="getComponentData('SA000500_LBL00001', 'caption')"
            label-id="SA000500_LBL00001"
            label-for="SA000500_TXT00001"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00001"
              v-model="formData.FLT_AGENCY_SID"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00002', 'caption')"
            label-id="SA000500_LBL00002"
            label-for="SA000500_TXT00002"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00002"
              v-model="formData.FLT_AGENCY_SNAME_ENG"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00003', 'caption')"
            label-id="SA000500_LBL00003"
            label-for="SA000500_TXT00003"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00003"
              v-model="formData.FLT_AGENCY_FNAME_ENG"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00004', 'caption')"
            label-id="SA000500_LBL00004"
            label-for="SA000500_TXT00004"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00004"
              v-model="formData.FLT_AGENCY_SNAME_KOR"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00005', 'caption')"
            label-id="SA000500_LBL00005"
            label-for="SA000500_TXT00005"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00005"
              v-model="formData.FLT_AGENCY_FNAME_KOR"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00006', 'caption', 'Name(S)-Chn')"
            label-id="SA000500_LBL00006"
            label-for="SA000500_TXT00006"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00006"
              v-model="formData.FLT_AGENCY_SNAME_CHN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00007', 'caption')"
            label-id="SA000500_LBL00007"
            label-for="SA000500_TXT00007"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00007"
              v-model="formData.FLT_AGENCY_FNAME_CHN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00008', 'caption')"
            label-id="SA000500_LBL00008"
            label-for="SA000500_TXT00008"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00008"
              v-model="formData.FLT_AGENCY_SNAME_JPN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00009', 'caption')"
            label-id="SA000500_LBL00009"
            label-for="SA000500_TXT00009"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00009"
              v-model="formData.FLT_AGENCY_FNAME_JPN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00010', 'caption')"
            label-id="SA000500_LBL00010"
            label-for="SA000500_TXT00010"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00010"
              v-model="formData.FLT_AGENCY_VALUE_01"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00011', 'caption')"
            label-id="SA000500_LBL00011"
            label-for="SA000500_TXT00011"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00011"
              v-model="formData.FLT_AGENCY_VALUE_02"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00012', 'caption', 'Additional Value #3')"
            label-id="SA000500_LBL00012"
            label-for="SA000500_TXT00012"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00012"
              v-model="formData.FLT_AGENCY_VALUE_03"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00013', 'caption')"
            label-id="SA000500_LBL00013"
            label-for="SA000500_TXT00013"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00013"
              v-model="formData.FLT_AGENCY_VALUE_04"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00014', 'caption')"
            label-id="SA000500_LBL00014"
            label-for="SA000500_TXT00014"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00014"
              v-model="formData.FLT_AGENCY_VALUE_05"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00015', 'caption')"
            label-id="SA000500_LBL00015"
            label-for="SA000500_TXT00015"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00015"
              v-model="formData.FLT_AGENCY_VALUE_06"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00016', 'caption')"
            label-id="SA000500_LBL00016"
            label-for="SA000500_TXT00016"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00016"
              v-model="formData.FLT_AGENCY_VALUE_07"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00017', 'caption')"
            label-id="SA000500_LBL00017"
            label-for="SA000500_TXT00017"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00017"
              v-model="formData.FLT_AGENCY_VALUE_08"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00018', 'caption', 'Additional Value #9')"
            label-id="SA000500_LBL00018"
            label-for="SA000500_TXT00018"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00018"
              v-model="formData.FLT_AGENCY_VALUE_09"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('SA000500_LBL00019', 'caption')"
            label-id="SA000500_LBL00019"
            label-for="SA000500_TXT00019"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00019"
              v-model="formData.FLT_AGENCY_VALUE_10"
            />
          </FormGroup>

          <div>
            <FormCheckbox
              v-model="formData.FLT_AGENCY_ACTIVE_YN"
              :label="getComponentData('SA000500_LBL00020', 'caption')"
              label-id="SA000500_LBL00020"
              label-for="SA000500_CHK00001"
              :checked="formData.FLT_AGENCY_ACTIVE_YN === '1'"
            />
          </div>

          <FormGroup
            :label="getComponentData('SA000500_LBL00021', 'caption')"
            label-id="SA000500_LBL00021"
            label-for="SA000500_TXT00020"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="SA000500_TXT00020"
              v-model="formData.FLT_AGENCY_REMARK"
            />
          </FormGroup>

          <div class="flex justify-end space-x-3">
            <Button
              id="SA000500_BTN00002"
              class="w-30"
              rounded
              :disabled="loading"
              :loading="loading"
              @click="saveAgencyDetail"
            >
              {{ getComponentData('SA000500_BTN00002', 'caption') }}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
