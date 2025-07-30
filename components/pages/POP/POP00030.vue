<script setup>
const props = defineProps({
  productData: {
    type: Object,
    required: true,
  },
})

const { getComponentData } = usePageLoaderComponent('POP00030')

const emits = defineEmits(['saved'])
const saleProducts = useSaleProductsStore()

const productOptionSetting = ref([])

const optionInputLength = ref(5)
const { loading, toggleLoading } = useLoading()

const defaultInputData = [
  {
    title: '',
    value: '',
  },
  {
    title: '',
    value: '',
  },
  {
    title: '',
    value: '',
  },
  {
    title: '',
    value: '',
  },
  {
    title: '',
    value: '',
  },
];

const { input, productOptions, generateProductOptions } = useProductOptions(defaultInputData)

const fetchProductOptionSetting = async () => {
  const { data, success } = await saleProducts.fetchProductOptionSetting(props.productData.PRODUCT_SID)
  if (success) {
    productOptionSetting.value = data
  }
}

onMounted(async () => {
  await fetchProductOptionSetting()
})

const onClickAddOption = () => {
  generateProductOptions()
  productOptionSetting.value.push(productOptions)
  input.value = defaultInputData
}

const defaultTableHeader = computed(() => ({
  ITEMS_CODE: "SAP Code",
  ITEMS_QTY: "Qty",
  ITEMS_ADDITIONAL_PRICE: "Additional Price"
}))

const removeProductOptionSetting = (item) => {
  productOptionSetting.value = productOptionSetting.value.filter((option) => option !== item)
}

const saveProductOptionSetting = async () => {
  toggleLoading()
  const { success } = await saleProducts.saveProductOptionSetting({
    PRODUCT_SID: props.productData.PRODUCT_SID,
    OPTIONS: productOptionSetting.value.map((option) => ({
      PRODUCT_OPTION_TITLES: {
        ...option.PRODUCT_OPTION_TITLES
      },
      PRODUCT_OPTIONS: option.PRODUCT_OPTIONS.map((item) => ({
        ...item,
        ITEMS_CODE: item.ITEMS_CODE ?? '',
        ITEMS_QTY: item.ITEMS_QTY ?? '',
        ITEMS_ADDITIONAL_PRICE: item.ITEMS_ADDITIONAL_PRICE ?? ''
      }))
    }))
  })
  if (success) {
    await fetchProductOptionSetting()
    emits('saved')
  }
  toggleLoading()
}
</script>

<template>
  <div class="space-y-3">
    <Table
      v-if="input.length > 3"
      id="POP00030_GRD01001"
      header-variant="secondary"
    >
      <TableHead>
        <TableHeadCell>
          Option Type
        </TableHeadCell>
        <TableHeadCell class="w-32">
          Option Title
        </TableHeadCell>
        <TableHeadCell>
          Option Value ( Please use comma to separate each value )
        </TableHeadCell>
      </TableHead>
      <TableBody>
        <TableRow
          v-for="(option, index) in optionInputLength"
          :key="option"
        >
          <TableCell make-condensed>
            Option {{ option }}
          </TableCell>
          <TableCell make-condensed>
            <FormTextInput v-model="input[index].title" />
          </TableCell>
          <TableCell make-condensed>
            <FormTextInput v-model="input[index].value" />
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableCell
            colspan="3"
            class="text-end"
          >
            <Button
              id="POP00030_BTN01001"
              variant="gray"
              rounded
              size="sm"
              class="w-30"
              @click="onClickAddOption"
            >
              Add Option
            </Button>
          </TableCell>
        </TableRow>
      </TableFoot>
    </Table>

    <Table
      id="POP00030_GRD01002"
      header-variant="secondary"
      clickable
      :columns="[
        {
          caption: 'Option Title',
          dataFieldName: 'PRODUCT_OPTION_TITLE',
          display: 'Y'
        }
      ]"
      :items="productOptionSetting"
    >
      <template #header(PRODUCT_OPTION_TITLE)="{ column }">
        <TableHeadCell colspan="2">
          {{ column.caption }}
        </TableHeadCell>
      </template>

      <template #row="{ item, columns }">
        <TableRow @click="item.showSubTable = !item.showSubTable">
          <TableCell
            v-for="(column, columnIndex) in columns.filter((column) => column.display === 'Y')"
            :key="columnIndex"
          >
            <span v-if="column.caption !== 'Action'">
              {{ item[column.dataFieldName] ?? '-' }}
            </span>
          </TableCell>

          <TableCell class="text-end">
            <Button
              id="POP00030_BTN01002"
              variant="danger"
              size="xs"
              rounded
              class="w-6 h-6"
              @click="removeProductOptionSetting(item)"
            >
              x
            </Button>
          </TableCell>
        </TableRow>

        <TableRow
          v-if="item.showSubTable"
          disable-clickable
        >
          <TableCell
            :colspan="2"
            class-name="p-1"
          >
            <Table
              id="POP00030_GRD01002"
              header-variant="secondary"
              class="overflow-x-auto max-w-4xl"
              condensed
            >
              <TableHead>
                <TableHeadCell
                  v-for="(label, key) in Object.keys({
                    ...item.PRODUCT_OPTION_TITLES,
                    ITEMS_CODE: 'SAP Code',
                    ITEMS_QTY: 'Qty',
                    ITEMS_ADDITIONAL_PRICE: 'Additional Price'
                  })"
                  :key="key"
                >
                  {{ item.PRODUCT_OPTION_TITLES[label] ?? defaultTableHeader[label] }}
                </TableHeadCell>
              </TableHead>
              <TableRow
                v-for="(option, key) in item.PRODUCT_OPTIONS"
                :key="key"
              >
                <TableCell
                  v-for="(label, labelKey) in Object.keys({
                    ...item.PRODUCT_OPTION_TITLES,
                    ITEMS_CODE: 'SAP Code',
                    ITEMS_QTY: 'Qty',
                    ITEMS_ADDITIONAL_PRICE: 'Additional Price'
                  })"
                  :key="labelKey"
                  make-condensed
                >
                  <span v-if="!['ITEMS_CODE', 'ITEMS_QTY', 'ITEMS_ADDITIONAL_PRICE'].includes(label)">
                    {{ option[label.replace('_TITLE', '_VALUE')] }}
                  </span>
                  <FormTextInput
                    v-else
                    v-model="option[label]"
                  />
                </TableCell>
              </TableRow>
            </Table>
          </TableCell>
        </TableRow>
      </template>

      <TableFoot v-if="productOptionSetting.length">
        <TableRow>
          <TableCell
            colspan="2"
            class="text-end"
          >
            <Button
              id="POP00030_BTN01002"
              variant="gray"
              rounded
              size="sm"
              class="w-30"
              :disabled="loading"
              :loading="loading"
              @click="saveProductOptionSetting"
            >
              {{ getComponentData('POP00030_BTN01002', 'caption', 'Save') }}
            </Button>
          </TableCell>
        </TableRow>
      </TableFoot>
    </Table>
  </div>
</template>

<style scoped>

</style>
