<script setup>
const props = defineProps({
  productData: {
    type: Object,
    required: true,
  },
})

const emits = defineEmits(['saved'])

const saleProducts = useSaleProductsStore()

const { currentTab } = storeToRefs(useTabsStore())
const { productItemsList } = storeToRefs(saleProducts)

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const sapCode = ref('')
const qty = ref(0)

const createProductItem = () => {
  return {
    PRODUCT_ITEMS_CODE: sapCode.value,
    PRODUCT_ITEMS_NAME: props.productData.PRODUCT_NAME_ENG,
    PRODUCT_ITEMS_QTY: qty.value,
  };
};

const updateProductItemQty = (index) => {
  const currentQty = parseInt(productItemsList.value[index].PRODUCT_ITEMS_QTY);
  const additionalQty = parseInt(qty.value);
  productItemsList.value[index].PRODUCT_ITEMS_QTY = (currentQty + additionalQty).toString();
};

const onClickAddProductItem = () => {
  if (sapCode.value) {
    const index = productItemsList.value.findIndex((item) => item.PRODUCT_ITEMS_CODE === sapCode.value);
    if (index === -1) {
      productItemsList.value.push(createProductItem());
    } else {
      updateProductItemQty(index);
    }
  }

  sapCode.value = '';
  qty.value = 0;
};

const fetchProductItemsList = async () => {
  await saleProducts.fetchProductItemsList(props.productData.PRODUCT_SID)
}

const saveItemsSetting = async () => {
  toggleLoading()
  const { success } = await saleProducts.saveProductItemsList({
    PRODUCT_SID: props.productData.PRODUCT_SID,
    ITEMS: productItemsList.value,
  })
  if (success) {
    await fetchProductItemsList()
    emits('saved')
  }
  toggleLoading()
}

onMounted(async () => {
  await fetchProductItemsList()
})
</script>

<template>
  <div class="relative space-y-3">
    <div class="flex justify-between items-center space-x-12">
      <div class="w-1/2 space-y-3">
        <FormGroup
          :label="getComponentData('POP00040_LBL01002', 'caption', 'SAP Code')"
          label-id="POP00040_LBL01002"
          label-for="POP00040_TXT01001"
          horizontal
        >
          <FormTextInput
            id="POP00040_TXT01001"
            v-model="sapCode"
            :mask="getComponentData('POP00040_TXT01001', 'editMask')"
            :placeholder="getComponentData('POP00040_TXT01001', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00040_LBL01004', 'caption', 'Item Qty')"
          label-id="POP00040_LBL01004"
          label-for="POP00040_TXT01003"
          horizontal
        >
          <FormTextInput
            id="POP00040_TXT01003"
            v-model="qty"
            type="number"
          />
        </FormGroup>
      </div>
      <div class="w-1/2 space-y-3">
        <FormGroup
          :label="getComponentData('POP00040_LBL01003', 'caption', 'Item Name')"
          label-id="POP00040_LBL01003"
          label-for="POP00040_TXT01002"
          horizontal
        >
          <FormTextInput
            id="POP00040_TXT01002"
            disabled
            :model-value="productData?.PRODUCT_NAME_ENG"
            readonly
          />
        </FormGroup>

        <div class="text-right">
          <Button
            variant="gray"
            rounded
            size="sm"
            class="w-30"
            @click="onClickAddProductItem"
          >
            {{ getComponentData('POP00040_BTN01002', 'caption', 'Add Item') }}
          </Button>
        </div>
      </div>
    </div>

    <Table
      id="POP00040_GRD01001"
      header-variant="secondary"
      sticky
      class="overflow-y-auto max-h-96"
    >
      <TableHead>
        <TableHeadCell>
          SAP Code
        </TableHeadCell>

        <TableHeadCell>
          Item Name
        </TableHeadCell>

        <TableHeadCell class="text-right w-40">
          Item Qty
        </TableHeadCell>
      </TableHead>

      <TableBody>
        <TableRow
          v-for="(item, index) in productItemsList"
          :key="index"
        >
          <TableCell>
            {{ item.PRODUCT_ITEMS_CODE }}
          </TableCell>

          <TableCell>
            {{ item.PRODUCT_ITEMS_NAME }}
          </TableCell>

          <TableCell class="text-right">
            <ButtonGroup
              rounded
              border
              class="ring-1 rounded-md ring-gray-200"
            >
              <Button
                variant="light"
                size="sm"
                class="w-8"
                @click="item.PRODUCT_ITEMS_QTY--"
              >
                -
              </Button>

              <Button
                variant="light"
                class="w-8"
                size="sm"
              >
                {{ item.PRODUCT_ITEMS_QTY }}
              </Button>

              <Button
                variant="light"
                size="sm"
                class="w-8"
                @click="item.PRODUCT_ITEMS_QTY++"
              >
                +
              </Button>
            </ButtonGroup>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div
      v-if="productItemsList.length > 0"
      class="flex justify-end pb-1"
    >
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        :loading="loading"
        :disabled="loading"
        @click="saveItemsSetting"
      >
        {{ getComponentData('POP00040_BTN01003', 'caption', 'Save') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
