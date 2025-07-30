<script setup>
const { currentTab } = storeToRefs(useTabsStore())
const pageLoader = usePageLoaderStore()
const claimManagement = useClaimManagementStore()
const { csList, commentListFilters } = storeToRefs(useClaimManagementStore())

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(csList, perPage.value);

const csTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '', 'OU040100_GRD01002')
})

onBeforeUnmount(() => {
  resetPage()
})

const emits = defineEmits(['onRowClick'])

const onClickItemRow = async (item) => {
  emits('onRowClick', item)
  commentListFilters.value.FLT_CS_SID = item.CS_SID
  claimManagement.clearCommentList()
  await claimManagement.fetchCommentList()
}
</script>

<template>
  <Card
    shadow-size="none"
    card-header-class="p-3 space-y-3"
    class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg"
  >
    <Table
      id="OU040100_GRD01002"
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="csTableColumns"
      :items="paginatedData"
      clickable
      @on-row-click="onClickItemRow"
    />

    <!-- Pagination -->
    <div
      v-if="csList?.length"
      class="flex justify-between items-center mt-3"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? csList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ csList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="csList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>
  </Card>
</template>

<style scoped>

</style>
