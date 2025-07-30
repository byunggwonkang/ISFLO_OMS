<script setup>
const { currentTab } = storeToRefs(useTabsStore())
const pageLoader = usePageLoaderStore()
const claimManagement = useClaimManagementStore()
const { commentList } = storeToRefs(useClaimManagementStore())

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(commentList, perPage.value);

const commentTableColumns = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '', 'OU040100_GRD02001')
})

onBeforeUnmount(() => {
  resetPage()
  claimManagement.resetCommentListFilters()
})

const emits = defineEmits(['onRowClick'])

const onClickItemRow = (item) => {
  emits('onRowClick', item)
}
</script>

<template>
  <div>
    <Table
      id="OU040100_GRD01002"
      header-variant="secondary"
      class="overflow-x-auto border-b"
      :columns="commentTableColumns"
      :items="paginatedData"
      @on-row-click="onClickItemRow"
    >
      <template #cell(CS_COMMENT_COUNT)="{ index }">
        {{ index + 1 }}
      </template>
    </Table>

    <!-- Pagination -->
    <div
      v-if="commentList?.length"
      class="flex justify-between items-center mt-3"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? commentList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ commentList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="commentList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
