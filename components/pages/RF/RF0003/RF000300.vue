<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid/index.js";
import moment from "moment";
import VueFeather from "vue-feather";

const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const notice = useNoticeStore()
const { currentTab } = storeToRefs(useTabsStore())

const { noticeList, filters } = storeToRefs(notice)
const { user } = storeToRefs(useAuthStore());

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(noticeList, perPage.value);
const { loading, toggleLoading } = useLoading()

const fetchNoticeList = async () => {
  await notice.fetchNoticeList()
}

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

onBeforeMount(async () => {
  togglePageLoading()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00150');
  await pageLoader.fetchPageLoadData('POP00160');

  await fetchNoticeList()
  togglePageLoading()
})

const noticeListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'RF000300_GRD00001')
})


const newNotice = ref(false)

const onClickSearch = async () => {
  filters.value.FLT_NOTICE_DATE_FROM = moment(filters.value.FLT_NOTICE_DATE_FROM).format('YYYY-MM-DD')
  filters.value.FLT_NOTICE_DATE_TO = moment(filters.value.FLT_NOTICE_DATE_TO).format('YYYY-MM-DD')
  filters.value.FLT_NOTICE_NEW_YN = newNotice.value ? '1' : '0'

  toggleLoading()
  await fetchNoticeList()
  toggleLoading()
  resetPage()
}

const isSystemAdmin = computed(() => {
  return user.value?.USER_SYSADMIN_YN === '1'
})

const openNoticeDetailsFormModal = ref(false)
const openNoticeDetailsModal = ref(false)

const selectedNotice = ref({})

const onClickNoticeDetails = (notice) => {
  selectedNotice.value = notice
  openNoticeDetailsModal.value = true
}

const onClickEdit = (notice) => {
  selectedNotice.value = notice
  openNoticeDetailsFormModal.value = true
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-12 items-center">
        <FormGroup
          :label="getComponentData('RF000300_LBL00003', 'caption')"
          label-id="RF000300_LBL00003"
          label-for="RF000300_TXT00001"
          horizontal
        >
          <FormTextInput
            id="RF000300_TXT00001"
            v-model="filters.FLT_NOTICE_KEYWORD"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000300_LBL00002', 'caption')"
          label-id="RF000300_LBL00002"
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
        >
          <div class="flex items-center space-x-3">
            <FormDatePicker
              v-model="filters.FLT_NOTICE_DATE_FROM"
              :disabled="newNotice"
            />
            <FormDatePicker
              v-model="filters.FLT_NOTICE_DATE_TO"
              :disabled="newNotice"
            />
          </div>
        </FormGroup>

        <div class="inline-flex space-x-6 items-center">
          <FormCheckbox
            v-model="newNotice"
            :label="getComponentData('RF000300_LBL00001', 'caption')"
          />

          <Button
            id="RF000300_BTN00001"
            rounded
            :loading="loading"
            :disabled="loading"
            @click="onClickSearch"
          >
            {{ getComponentData('RF000300_BTN00001', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-2">
      <p>
        {{ getGridData('RF000300_GRD00001', 'caption') }}
      </p>

      <Button
        v-if="isSystemAdmin"
        v-tooltip="{
          content: getComponentData('RF000300_BTN00002', 'caption'),
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
        @click="openNoticeDetailsFormModal = true"
      >
        <PlusIcon class="w-5 h-5" />
      </Button>
    </div>

    <Table
      id="PA000400_GRD00001"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
      clickable
      :columns="[
        ...noticeListTableFields,
        {
          caption: 'Action',
          dataFieldName: 'ACTION',
          display: 'Y'
        }
      ]"
      :items="paginatedData"
      @on-row-click="onClickNoticeDetails"
    >
      <template #cell(NOTICE_READ_YN)="{ value }">
        <div>
          <StatusDot :active="value === 'True' || value === '1' || value === true || value === 1" />
        </div>
      </template>

      <template #cell(NOTICE_MESSAGE)="{ value }">
        <div>
          {{ value.substring(0, 50) }}{{ value.length > 50 ? '...' : '' }}
        </div>
      </template>

      <template #cell(ACTION)="{ item }">
        <span
          v-if="item.NOTICE_OWNER_YN === '1'"
          class=" cursor-pointer hover:font-bold hover:text-blue-700"
          @click="(e) => {
            e.stopPropagation();
            onClickEdit(item)
          }"
        >
          <VueFeather
            type="edit"
            class="h-5 w-5"
          />
        </span>
      </template>
    </Table>

    <!-- Pagination -->
    <div
      v-if="noticeList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? noticeList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ noticeList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="noticeList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <Modal
      :show="openNoticeDetailsModal"
      divider
      size="4xl"
      @close="() => {
        fetchNoticeList()
        openNoticeDetailsModal = false
        selectedNotice = {}
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP000150_LBL01001', 'caption', 'Notice') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00150'"
          :notice-data="selectedNotice"
        />
      </template>
    </Modal>

    <Modal
      v-if="isSystemAdmin"
      :show="openNoticeDetailsFormModal"
      divider
      size="4xl"
      @close="() => {
        openNoticeDetailsFormModal = false
        selectedNotice = {}
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP000160_LBL01001', 'caption', 'Notice') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00160'"
          :notice-data="selectedNotice"
          @notice-saved="() => {
            fetchNoticeList()
            openNoticeDetailsFormModal = false
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
