<script setup>
const props = defineProps({
  channel: {
    type: Object,
    required: true,
    default: () => ({})
  },
  existingCategory: {
    type: Array,
    required: true,
    default: () => []
  },
})

const { currentTab } = storeToRefs(useTabsStore())
const emits = defineEmits(['categoryAdded'])
const saleProducts = useSaleProductsStore()
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])

const { productChannelCategoryList } = storeToRefs(saleProducts)

const selectAll = ref(false)
const selectedCategory = ref([
  ...props.existingCategory,
])

watch(selectAll, (value) => {
  if (value) {
    selectedCategory.value = productChannelCategoryList.value
  } else {
    selectedCategory.value = []
  }
})

onMounted(async () => {
  await saleProducts.fetchProductChannelCategoryList({
    BRAND_CODE: props.channel.BRAND_CODE,
    CHANNEL_CODE: props.channel.PRODUCT_CHANNEL_CODE,
  })
})

const onClickAddCategory = () => {
  emits('categoryAdded', selectedCategory.value)
}

</script>

<template>
  <div class="relative space-y-3">
    <Table
      id="POP00050_GRD01001"
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
          Category Name
        </TableHeadCell>
      </TableHead>

      <TableBody>
        <TableRow
          v-for="item in productChannelCategoryList"
          :key="item.CATEGORY_CODE"
        >
          <template #checkbox>
            <FormCheckbox
              v-model="selectedCategory"
              :value="item"
            />
          </template>

          <TableCell>
            {{ item.CATEGORY_NAME }}
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
        @click="onClickAddCategory"
      >
        {{ getComponentData('POP00050_BTN01001', 'caption', 'Add') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
