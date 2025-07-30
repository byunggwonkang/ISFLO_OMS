<script setup>
const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  perPage: {
    type: Number,
    default: 10
  }
})

const promotionManagement = usePromotionManagementStore()
const { itemList } = storeToRefs(promotionManagement)
const { currentPage, paginatedData, isLastPage } = usePagination(itemList, props.perPage);
const emit = defineEmits(['onRowClick', 'onRowDoubleClick'])

const onRowDoubleClick = (item) => {
  emit('onRowDoubleClick', item)
}
</script>

<template>
  <div class="space-y-3">
    <Table
      class="overflow-x-auto"
      header-variant="secondary"
      :columns="columns"
      :items="paginatedData"
      clickable
      @on-row-double-click="onRowDoubleClick"
    />

    <!-- Pagination -->
    <div
      v-if="itemList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? itemList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ itemList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="itemList?.length"
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
