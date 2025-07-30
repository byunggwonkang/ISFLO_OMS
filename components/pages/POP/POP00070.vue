<script setup>
const props = defineProps({
  channel: {
    type: Object,
    required: true,
    default: () => ({})
  },
  exitingProduct: {
    type: Array,
    required: true,
    default: () => []
  },
})

const { currentTab } = storeToRefs(useTabsStore())

const channelData = ref({
  BRAND_CODE: props.channel.BRAND_CODE,
  CHANNEL_CODE: props.channel.PRODUCT_CHANNEL_CODE,
  PRODUCT_SID: props.channel.PRODUCT_SID,
  FLT_MALL_ID: ''
})

const emits = defineEmits(['productAdded'])
const saleProducts = useSaleProductsStore()
const { productRelationalList } = storeToRefs(saleProducts)
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const selectAll = ref(false)
const selectedProduct = ref([
  ...props.exitingProduct
])

watch(selectAll, (value) => {
  if (value) {
    selectedProduct.value = productRelationalList.value
  } else {
    selectedProduct.value = []
  }
})

const fetchProductRelationalList = async () => {
  await saleProducts.fetchProductRelationalList(channelData.value)
}

onMounted(async () => {
  await fetchProductRelationalList()
})

const onClickSearch = async () => {
  toggleLoading()
  await fetchProductRelationalList()
  toggleLoading()
}

const onClickAddProduct = () => {
  emits('productAdded', selectedProduct.value)
}
</script>

<template>
  <div class="relative space-y-3">
    <div class="flex justify-between items-center space-x-3">
      <div class="w-2/3">
        <FormGroup
          :label="getComponentData('POP00070_LBL01002', 'caption', 'Mall ID')"
          label-id="POP00070_LBL01002"
          label-for="POP00070_TXT01001"
          horizontal
        >
          <FormTextInput
            id="POP00070_TXT01001"
            v-model="channelData.FLT_MALL_ID"
            type="search"
          />
        </FormGroup>
      </div>

      <div class="flex justify-end">
        <Button
          variant="gray"
          rounded
          size="sm"
          class="w-30"
          :loading="loading"
          :disabled="loading"
          @click="onClickSearch"
        >
          {{ getComponentData('POP00070_BTN01001', 'caption', 'Search') }}
        </Button>
      </div>
    </div>

    <Table
      id="POP00070_GRD01001"
      header-variant="secondary"
      checkable
      sticky
      class="overflow-y-auto max-h-96"
    >
      <TableHead>
        <template #checkbox>
          <FormCheckbox
            v-model="selectAll"
            :value="true"
          />
        </template>

        <TableHeadCell>
          Mall ID
        </TableHeadCell>

        <TableHeadCell>
          Product Name
        </TableHeadCell>
      </TableHead>

      <TableBody>
        <TableRow
          v-for="(product, index) in productRelationalList"
          :key="index"
        >
          <template #checkbox>
            <FormCheckbox
              v-model="selectedProduct"
              :value="product"
            />
          </template>

          <TableCell>
            {{ product.RELATIONAL_PRODUCT_MALL_ID }}
          </TableCell>

          <TableCell>
            {{ product.RELATIONAL_PRODUCT_NAME }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex justify-end pb-1">
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        @click="onClickAddProduct"
      >
        {{ getComponentData('POP00070_BTN01002', 'caption', 'Add') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
