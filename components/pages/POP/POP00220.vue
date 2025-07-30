<script setup>
const props = defineProps({
  brand: {
    type: Object,
    default: () => {}
  },
})

const { getComponentData } = usePageLoaderComponent(['POP00210'])

const promotionManagement = usePromotionManagementStore()
const { productListFilters, productList } = storeToRefs(promotionManagement)
const pageLoader = usePageLoaderStore()

const { loading, toggleLoading } = useLoading()

const setDefaultValue = () => {
  productListFilters.value.FLT_BRAND_CODE = [
    props.brand.value
  ]
}

onMounted(() => {
  setDefaultValue()
})

const search = async () => {
  toggleLoading()
  resetPage()
  await promotionManagement.fetchProductList()
  toggleLoading()
}

const tableFields = computed(() => {
  return pageLoader.getTableData('POP00220', 'POP00220_GRD01001')
})

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(productList, perPage.value);
const emit = defineEmits(['onRowClick', 'onRowDoubleClick'])

const onRowDoubleClick = (item) => {
  emit('onRowDoubleClick', item)
}
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 items-center gap-x-3">
      <FormGroup
        :label="getComponentData('POP00220_LBL01002', 'caption', 'Brand :')"
        label-id="POP00210_LBL01002"
        horizontal
      >
        <span class="text-xs">
          {{ brand.name }}
        </span>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00220_LBL01004', 'caption', 'Product Name')"
        label-id="POP00210_LBL01004"
        horizontal
        label-width="w-2/4"
        input-width="w-2/3"
      >
        <FormTextInput
          v-model="productListFilters.FLT_PRODUCT_NAME"
        />
      </FormGroup>

      <div>
        <Button
          rounded
          :loading="loading"
          :disabled="loading"
          @click="search"
        >
          {{ getComponentData('POP00220_BTN01001', 'caption', 'Search') }}
        </Button>
      </div>
    </div>

    <Table
      id="POP00220_GRD01001"
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
