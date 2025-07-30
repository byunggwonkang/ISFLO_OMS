<script setup>
// Importing necessary icons from Heroicons and moment for date manipulation
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/20/solid";
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()


const { pageLoading, togglePageLoading } = usePageLoading();

// Initializing stores
const pageLoader = usePageLoaderStore()
const holidaySettings = useHolidaySettingsStore()
const commonData = useCommonDataStore()

// Getting the current tab from the CS store
const { currentTab } = storeToRefs(useTabsStore())

// Getting component and grid data based on the current tab
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])

// Getting holiday list and filters from the holiday settings store
const { holidayList, filters } = storeToRefs(holidaySettings)

// Setting up pagination
const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(holidayList, perPage.value);

// Setting up loading state
const { loading, toggleLoading } = useLoading()

// Initializing date, holiday type and form data
const date = ref(moment().format('YYYY-MM-DD'))
const holidayType = ref({})
const formData = ref({
  FLT_HOLIDAY_YEAR: moment().format('YYYY'),
  FLT_HOLIDAY_MONTH: moment().format('MM'),
  FLT_HOLIDAY_DAY: moment().format('DD'),
  FLT_HOLIDAY_TYPE_CODE: '',
  FLT_HOLIDAY_TITLE: '',
  FLT_HOLIDAY_REMARK: '',
})

// Initializing deleting state, select all state and selected holiday
const deleting = ref(false);
const selectAll = ref(false);
const selectedHoliday = ref([]);

// Function to toggle deleting state
const toggleDeleting = () => {
  deleting.value = !deleting.value
}

// Watcher to update selected holidays when select all state changes
watch(selectAll, (value) => {
  selectedHoliday.value = value ? holidayList.value.map((item) => decrypt(item.HOLIDAY_DATE)) : [];
})

// Watcher to update holiday type in form data when holiday type changes
watch(holidayType, (value) => {
  formData.value.FLT_HOLIDAY_TYPE_CODE = value.value
}, {
  deep: true
})

// Watcher to update date in form data when date changes
watch(date, (value) => {
  formData.value.FLT_HOLIDAY_YEAR = moment(value).format('YYYY')
  formData.value.FLT_HOLIDAY_MONTH = moment(value).format('MM')
  formData.value.FLT_HOLIDAY_DAY = moment(value).format('DD')
}, {
  deep: true
})

// Functions to increment and decrement year in filters
const incrementYear = () => {
  filters.value.FLT_HOLIDAY_YEAR++
}
const decrementYear = () => {
  filters.value.FLT_HOLIDAY_YEAR--
}

// Watcher to fetch holiday list when filters change
watch(filters, async () => {
  isloading.isLoading = true
  await holidaySettings.fetchHolidayList()
  resetPage()
  isloading.isLoading = false
}, {
  deep: true
})

// Computed property to get holiday table fields
const holidayTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'PA010200_GRD00001');
})

// Lifecycle hook to fetch all common data, page load data and holiday list when the component is mounted
onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await commonData.fetchPA010200CommonData()

  holidayType.value = commonData.getHolidayTypeOptions[0]
  formData.value.FLT_HOLIDAY_TYPE_CODE = holidayType.value.value

  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await holidaySettings.fetchHolidayList()
  isloading.isLoading = false
  togglePageLoading()
})

// Function to save holiday
const saveHoliday = async () => {
  toggleLoading()
  isloading.isLoading = true
  const { success } = await holidaySettings.saveHolidaySettings(formData.value)
  if (success) {
    await holidaySettings.fetchHolidayList()
  }
  isloading.isLoading = false
  toggleLoading()
}

// Function to delete selected holidays
const deleteHoliday = async () => {
  toggleDeleting()
  isloading.isLoading = true
  for (const item of selectedHoliday.value) {
    await holidaySettings.deleteHolidaySettings(item)
  }
  await holidaySettings.fetchHolidayList()
  selectedHoliday.value = []
  isloading.isLoading = false
  toggleDeleting()
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-6">
        <div>
          <ButtonGroup
            rounded
          >
            <Button
              size="sm"
              variant="white"
              border
              @click="decrementYear"
            >
              <ChevronLeftIcon
                class="h-5 w-5"
                aria-hidden="true"
              />
            </Button>
            <input
              v-model="filters.FLT_HOLIDAY_YEAR"
              type="number"
              class="border-y border-x-0 border-gray-300 w-16 py-1.5 px-0 pl-3 text-sm text-center"
            >
            <Button
              size="sm"
              variant="white"
              border
              @click="incrementYear"
            >
              <ChevronRightIcon
                class="h-5 w-5"
                aria-hidden="true"
              />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </template>

    <div class="grid grid-cols-7 mt-3 gap-x-6">
      <div class="col-span-5 space-y-3">
        <div class="flex justify-between items-center">
          <p>
            {{ getGridData('PA010200_GRD00001', 'caption') }}
          </p>

          <Button
            rounded
            variant="danger"
            size="sm"
            :loading="deleting"
            :disabled="!selectedHoliday.length || deleting"
            class="w-30"
            @click="deleteHoliday"
          >
            {{ getComponentData('PA010200_BTN00003', 'caption') }}
          </Button>
        </div>

        <Table
          id="PA010200_GRD00001"
          class="overflow-x-auto"
          header-variant="secondary"
          :columns="holidayTableFields"
          :items="paginatedData"
          checkable
        >
          <template
            v-if="paginatedData.length"
            #header(CHECKBOX)
          >
            <FormCheckbox
              v-model="selectAll"
              :value="true"
            />
          </template>

          <template
            v-if="paginatedData.length"
            #cell(CHECKBOX)="{ item }"
          >
            <FormCheckbox
              v-model="selectedHoliday"
              :value="decrypt(item.HOLIDAY_DATE)"
            />
          </template>
        </Table>

        <!-- Pagination -->
        <div
          v-if="holidayList?.length"
          class="flex justify-between items-center"
        >
          <p class="text-sm text-gray-700">
            Showing
            <span class="mx-1">
              {{ (currentPage - 1) * perPage + 1 }}
            </span>
            to
            <span class="mx-1">
              {{ isLastPage ? holidayList?.length : currentPage * perPage }}
            </span>
            of
            <span class="mx-1">
              {{ holidayList?.length }}
            </span>
            results
          </p>

          <Pagination
            :total-items="holidayList?.length"
            :items-per-page="perPage"
            :current-page="currentPage"
            rounded
            active-variant="gray"
            @page-changed="currentPage = $event"
          />
        </div>
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
              {{ getComponentData('PA010200_LBL00003', 'caption') }}
            </p>
          </template>

          <FormGroup
            :label="getComponentData('PA010200_LBL00004', 'caption')"
            label-id="PA010200_LBL00004"
            label-for="PA010200_DAT00001"
            horizontal
          >
            <FormDatePicker
              id="PA010200_DAT00001"
              v-model="date"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010200_LBL00005', 'caption')"
            label-id="PA010200_LBL00005"
            label-for="PA010200_CMB00001"
            horizontal
          >
            <FormCombobox
              id="PA010200_CMB00001"
              v-model="holidayType"
              :options="commonData.getHolidayTypeOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010200_LBL00006', 'caption')"
            label-id="PA010200_LBL00006"
            label-for="PA010200_TXT00002"
            horizontal
          >
            <FormTextInput
              id="PA010200_TXT00002"
              v-model="formData.FLT_HOLIDAY_TITLE"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('PA010200_LBL00007', 'caption')"
            label-id="PA010200_LBL00007"
            label-for="PA010200_TXT00003"
            horizontal
          >
            <FormTextareaInput
              id="PA010200_TXT00003"
              v-model="formData.FLT_HOLIDAY_REMARK"
            />
          </FormGroup>
        </Card>

        <div class="text-end">
          <Button
            id="PA010200_BTN00004"
            rounded
            :loading="loading"
            :disabled="loading"
            class="w-30"
            size="sm"
            @click="saveHoliday"
          >
            {{ getComponentData('PA010200_BTN00004', 'caption') }}
          </Button>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
