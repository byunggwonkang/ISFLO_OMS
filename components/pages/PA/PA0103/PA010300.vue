<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/20/solid";

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const retailCalenderSettings = useRetailCalenderSettingsStore()

const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])

const { retailCalenderList, filters } = storeToRefs(retailCalenderSettings)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(retailCalenderList, perPage.value);

const incrementYear = () => {
  filters.value.FLT_CALENDAR_YEAR++
}

const decrementYear = () => {
  filters.value.FLT_CALENDAR_YEAR--
}

watch(filters, async () => {
  isloading.isLoading = true
  await retailCalenderSettings.fetchRetailCalenderList();
  isloading.isLoading = false
  resetPage()
}, {
  deep: true
})

const retailCalenderTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component, 'PA010300_GRD00001');
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00100')

  await retailCalenderSettings.fetchRetailCalenderList()
  isloading.isLoading = false
  togglePageLoading()
})

const openFileUploadModal = ref(false)
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="flex justify-between">
        <div class="w-1/2">
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
              v-model="filters.FLT_CALENDAR_YEAR"
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
        <div class="w-1/2 my-auto inline-flex justify-end">
          <Button
            rounded
            size="sm"
            class="w-30"
            @click="openFileUploadModal = true"
          >
            {{ getComponentData('PA010300_BTN00003', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <Table
      id="PA010300_GRD00001"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
      :columns="retailCalenderTableFields"
      :items="paginatedData"
    />

    <!-- Pagination -->
    <div
      v-if="retailCalenderList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? retailCalenderList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ retailCalenderList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="retailCalenderList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <Modal
      :show="openFileUploadModal"
      divider
      @close="() => {
        openFileUploadModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00100_LBL01001', 'caption', 'Excel File Upload') }} : WIP
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00100'"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
