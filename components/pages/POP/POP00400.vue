<script setup>

const { getComponentData } = usePageLoaderComponent(['POP00400'])

const shipmentInspection = useShipmentInspectionStore()
const { orderList } = storeToRefs(shipmentInspection)
const pageLoader = usePageLoaderStore()

const { loading, toggleLoading } = useLoading()

onMounted(() => {

})

const tableFields = computed(() => {
  return pageLoader.getTableData('POP00400', 'POP00400_GRD01001')
})

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(orderList, perPage.value);
const emit = defineEmits(['onRowClick', 'onRowDoubleClick'])

const onRowDoubleClick = (item) => {
  emit('onRowDoubleClick', item)
}
</script>

<template>
  <div class="space-y-3">
    <Table
      id="POP00400_GRD01001"
      class="overflow-x-auto"
      header-variant="secondary"
      :columns="tableFields"
      :items="paginatedData"
      clickable
      @on-row-double-click="onRowDoubleClick"
    />

    <!-- Pagination -->
    <div
      v-if="productList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? productList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ productList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="productList?.length"
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
