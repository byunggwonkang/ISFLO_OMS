<script setup>
const props = defineProps({
  brand: {
    type: Object,
    default: () => {
      return {
        code: '',
        name: ''
      }
    }
  },
  channel: {
    type: Object,
    default: () => {
      return {
        code: '',
        name: ''
      }
    }
  },
})

const pageLoader = usePageLoaderStore()
const { getComponentData } = usePageLoaderComponent(['POP00250'])
const claimManagement = useClaimManagementStore()
const { customerListFilters, customerList } = storeToRefs(claimManagement)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(customerList, props.perPage);
const emits = defineEmits(['onRowClick', 'onRowDoubleClick'])

const { loading, toggleLoading } = useLoading();

const setDefaultValue = () => {
  customerListFilters.value.FLT_REGIST_BRAND_CODE = [
    props.brand.code
  ]

  customerListFilters.value.FLT_REGIST_CHANNEL_CODE = [
    props.channel.code
  ]
}

onMounted(() => {
  setDefaultValue()
})

const search = async () => {
  toggleLoading()
  resetPage()
  await claimManagement.fetchCustomerList()
  toggleLoading()
}

const tableFields = computed(() => {
  return pageLoader.getTableData('POP00250', 'POP00250_GRD01001')
})

const onRowDoubleClick = (item) => {
  emits('onRowDoubleClick', item)
}
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 items-center gap-x-3">
      <FormGroup
        :label="getComponentData('POP00210_LBL01002', 'caption', 'Brand :')"
        label-id="POP00210_LBL01002"
        horizontal
      >
        <span class="text-xs">
          {{ brand.name }}
        </span>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00250_LBL01004', 'caption', 'Brand :')"
        label-id="POP00250_LBL01004"
        horizontal
      >
        <span class="text-xs">
          {{ channel.name }}
        </span>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00250_LBL01006', 'caption', 'Customer Name')"
        label-id="POP00250_LBL01006"
        horizontal
        class="col-span-2"
      >
        <FormTextInput
          v-model="customerListFilters.FLT_CUST_KEYWORD"
        />
      </FormGroup>

      <div>
        <Button
          rounded
          :loading="loading"
          :disabled="loading"
          @click="search"
        >
          {{ getComponentData('POP00250_BTN01001', 'caption', '') }}
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
      v-if="customerList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? customerList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ customerList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="customerList?.length"
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
