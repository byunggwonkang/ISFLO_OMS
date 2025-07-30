<script setup>
const props = defineProps({
  brand: {
    type: Object,
    default: () => {}
  },
})

const { getComponentData } = usePageLoaderComponent(['POP00210'])

const promotionManagement = usePromotionManagementStore()
const { nmdFilters, originalItemFilters } = storeToRefs(promotionManagement)
const pageLoader = usePageLoaderStore()

const { loading, toggleLoading } = useLoading()

const itemsTypes = [
  {
    name: 'Items',
    value: 'ITEMS'
  },
  {
    name: 'Non MD',
    value: 'NON_ITEMS'
  }
]

const selectedType = ref(itemsTypes[0])
const keyword = ref('')

const setDefaultValue = () => {
  nmdFilters.value.FLT_NMD_BRAND_CODE = props.brand.value
  originalItemFilters.value.FLT_BRAND_CODE = props.brand.value
}

onMounted(() => {
  setDefaultValue()
})

watch(keyword, (newValue) => {
  nmdFilters.value.FLT_NMD_KEY_WORD = newValue
  originalItemFilters.value.FLT_KEY_WORD = newValue
})

const search = async () => {
  toggleLoading()
  await promotionManagement.fetchItemList()
  await promotionManagement.fetchNonMerchandisingItemList()
  toggleLoading()
}

const originalTableFields = computed(() => {
  return pageLoader.getTableData('POP00210', 'POP00210_GRD01001')
})

const nmdTableFields = computed(() => {
  return pageLoader.getTableData('POP00210', 'POP00210_GRD01002')
})

const emit = defineEmits(['onRowClick', 'onRowDoubleClick'])

const onRowDoubleClick = (item) => {
  emit('onRowDoubleClick', {
    type: selectedType.value.value,
    data: item
  })
}

onBeforeUnmount(() => {
  nmdFilters.value.FLT_NMD_BRAND_CODE = ''
  nmdFilters.value.FLT_NMD_KEY_WORD = ''
  promotionManagement.clearNmdItemList()
});
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-5 items-center gap-x-3">
      <FormGroup
        :label="getComponentData('POP00210_LBL01002', 'caption', 'Brand')"
        label-id="POP00210_LBL01002"
        horizontal
      >
        <span class="text-xs">
          {{ brand.name }}
        </span>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00210_LBL01003', 'caption', 'Item Type')"
        label-id="POP00210_LBL01003"
        horizontal
        label-width="w-1/2"
        input-width="w-2/3"
      >
        <FormCombobox
          v-model="selectedType"
          :options="itemsTypes"
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00210_LBL01004', 'caption', 'Keyword')"
        label-id="POP00210_LBL01004"
        horizontal
        label-width="w-2/4"
        input-width="w-2/3"
      >
        <FormTextInput
          v-model="keyword"
        />
      </FormGroup>

      <div>
        <Button
          rounded
          :loading="loading"
          :disabled="loading"
          @click="search"
        >
          {{ getComponentData('POP00210_BTN01001', 'caption', 'Search') }}
        </Button>
      </div>
    </div>

    <component
      :is="'POP00210-ITEMS'"
      v-if="selectedType.value === 'ITEMS'"
      :columns="originalTableFields"
      @on-row-double-click="onRowDoubleClick"
    />

    <component
      :is="'POP00210-NON-ITEMS'"
      v-if="selectedType.value === 'NON_ITEMS'"
      :columns="nmdTableFields"
      @on-row-double-click="onRowDoubleClick"
    />
  </div>
</template>

<style scoped>

</style>
