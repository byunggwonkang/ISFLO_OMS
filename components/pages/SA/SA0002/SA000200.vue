<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();

const pageLoader = usePageLoaderStore()
const systemCodeSetting = useSystemCodeSettingStore()
const { currentTab } = storeToRefs(useTabsStore())

const { commonGroupList, commonList, filters } = storeToRefs(systemCodeSetting)

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component, 'POP00110']);

const group = ref({})

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(commonList, perPage.value);

const fetchCommonList = async () => {
  isloading.isLoading = true
  await systemCodeSetting.fetchCommonList()
  isloading.isLoading = false
}

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await systemCodeSetting.fetchCommonGroupList()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00110')

  group.value = {
    name: decrypt(commonGroupList.value[0]?.GROUP_NAME) ?? '',
    value: decrypt(commonGroupList.value[0]?.GROUP_CODE) ?? '',
  }

  filters.value.FLT_GROUP_CODE = group.value?.value

  isloading.isLoading = false
  togglePageLoading()
})

watch(group, async (value) => {
  filters.value.FLT_GROUP_CODE = value?.value
  await fetchCommonList()
  resetPage()
})

const commonListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'SA000200_GRD00001')
})

const openCommonCodeModal = ref(false)

const commonFormData = ref({
  SAVE_TYPE: encrypt('INSERT'),
})

const onClickCommonCodeRow = (item) => {
  commonFormData.value = {
    ...item,
    SAVE_TYPE: encrypt('UPDATE'),
  }
  openCommonCodeModal.value = true
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
      card-header-class="px-3 py-3 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-2 space-y-3"
    >
      <template #header>
        <div class="grid grid-cols-5 gap-6">
          <FormGroup
            :label="getComponentData('SA000200_LBL00001', 'caption', 'Category')"
            label-id="SA000200_LBL00001"
            label-for="SA000200_CMB00001"
            horizontal
          >
            <FormSelect
              id="SA000200_CMB00001"
              v-model="group"
              :options="commonGroupList.map((group) => ({
                name: decrypt(group.GROUP_NAME),
                value: decrypt(group.GROUP_CODE),
              }))"
            />
          </FormGroup>
          <div class="col-span-1 col-start-5 text-end">
            <Button
              rounded
              variant="white"
              border
              size="xs"
              @click="() => {
                commonFormData.GROUP_CODE = encrypt(group.value)
                openCommonCodeModal = true
              }"
            >
              <PlusIcon class="w-5 h-5" />
            </Button>
          </div>
        </div>
      </template>
      <Table
        id="SA000200_GRD00001"
        class="overflow-x-auto mt-3"
        header-variant="secondary"
        clickable
        :columns="commonListTableFields"
        :items="paginatedData"
        @on-row-click="onClickCommonCodeRow"
      >
        <template #cell(COMM_ACTIVE)="{ value }">
          <div>
            <StatusDot :active="decrypt(value) === 'True' || decrypt(value) === '1' || decrypt(value) === true || decrypt(value) === 1" />
          </div>
        </template>
      </Table>
    </Card>
    <!-- Pagination -->
    <div
      v-if="commonList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? commonList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ commonList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="commonList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <Modal
      :show="openCommonCodeModal"
      size="4xl"
      divider
      @close="() => {
        commonFormData = {
          SAVE_TYPE: 'INSERT',
          GROUP_CODE: group.value,
        }
        openCommonCodeModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00110_LBL01001', 'caption', 'Common Code For [PA,SA]') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00110`"
          :common-data="commonFormData"
          :common-data-store="systemCodeSetting"
          @common-data-saved="() => {
            openCommonCodeModal = false
            fetchCommonList()
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
