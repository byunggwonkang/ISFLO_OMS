<script setup>
const pageLoader = usePageLoaderStore()
const { getComponentData } = usePageLoaderComponent('POP00090')
const { getGridData } = usePageLoaderGrid('POP00090')
import { encrypt, decrypt } from '@/stores/common/aes'

const props = defineProps({
  itemDetailData: {
    type: Object,
    required: true,
    default: () => ({})
  },
})

const openStockDetailsModal = ref(false)
const StockDetailData = ref({
  FLT_BRAND_CODE : "",
  FLT_WH_CODE : "",
  FLT_ITEM_CODE : ""
})

const stockListTableFields = computed(() => {
  return pageLoader.getTableData('POP00090', 'POP00090_GRD01001')
})

const onClickStockDetailRow = (item) => {

  StockDetailData.value = {
    FLT_BRAND_CODE: encrypt(props.itemDetailData?.ITEM_BRAND_CODE),
    FLT_WH_CODE: item.STOCK_WH_CODE,
    FLT_ITEM_CODE: encrypt(props.itemDetailData?.ITEM_CODE),
  }
  openStockDetailsModal.value = true
}

onMounted(async () => {
  await pageLoader.fetchPageLoadData('POP00090')
  await pageLoader.fetchPageLoadData('POP00380')
})

</script>



<template>
  <div class="grid grid-cols-2 gap-x-6">
    <div class="space-y-3">
      <FormGroup
        :label="getComponentData('POP00090_LBL01002', 'caption', 'Brand')"
        label-id="POP00090_LBL01002"
        label-for="POP00090_TXT01001"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01001"
          :value="itemDetailData.ITEM_BRAND_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01003', 'caption', 'Item Code')"
        label-id="POP00090_LBL01003"
        label-for="POP00090_TXT01002"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01002"
          :value="itemDetailData.ITEM_CODE"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01004', 'caption', 'ALU')"
        label-id="POP00090_LBL01004"
        label-for="POP00090_TXT01003"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01003"
          :value="itemDetailData.ITEM_ALU"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01005', 'caption', 'EAN')"
        label-id="POP00090_LBL01005"
        label-for="POP00090_TXT01004"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01004"
          :value="itemDetailData.ITEM_EAN"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01006', 'caption', 'Short Name')"
        label-id="POP00090_LBL01006"
        label-for="POP00090_TXT01005"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01005"
          :value="itemDetailData.ITEM_SNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01007', 'caption', 'Full Name')"
        label-id="POP00090_LBL01007"
        label-for="POP00090_TXT01006"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01006"
          :value="itemDetailData.ITEM_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01008', 'caption', 'Category')"
        label-id="POP00090_LBL01008"
        label-for="POP00090_TXT01007"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01007"
          :value="itemDetailData.ITEM_CATEGORY_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01009', 'caption', 'Sub Category')"
        label-id="POP00090_LBL01009"
        label-for="POP00090_TXT01008"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01008"
          :value="itemDetailData.ITEM_SUB_CATEGORY_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01010', 'caption', 'Sub-Sub Category')"
        label-id="POP00090_LBL01010"
        label-for="POP00090_TXT01009"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01009"
          :value="itemDetailData.ITEM_SUB_SUBCATEGORY_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01011', 'caption', 'Status')"
        label-id="POP00090_LBL01011"
        label-for="POP00090_TXT01010"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01010"
          :value="itemDetailData.ITEM_STATUS_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01012', 'caption', 'Product Type')"
        label-id="POP00090_LBL01012"
        label-for="POP00090_TXT01011"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01011"
          :value="itemDetailData.ITEM_PRODUCT_TYPE"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01013', 'caption', 'Material Code')"
        label-id="POP00090_LBL01013"
        label-for="POP00090_TXT01012"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01012"
          :value="itemDetailData.ITEM_MATERIAL_CODE"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01014', 'caption', 'Size')"
        label-id="POP00090_LBL01014"
        horizontal
      >
        <div class="flex items-center space-x-3">
          <FormTextInput
            id="POP00090_TXT01013"
            :value="itemDetailData.ITEM_SIZE_CODE"
            readonly
          />

          <FormTextInput
            id="POP00090_TXT01014"
            :value="itemDetailData.ITEM_SIZE_NAME"
            readonly
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01015', 'caption', 'Color')"
        label-id="POP00090_LBL01015"
        horizontal
      >
        <div class="flex items-center space-x-3">
          <FormTextInput
            id="POP00090_TXT01015"
            :value="itemDetailData.ITEM_COLOR_CODE"
            readonly
          />

          <FormTextInput
            id="POP00090_TXT01016"
            :value="itemDetailData.ITEM_COLOR_NAME"
            readonly
          />
        </div>
      </FormGroup>
    </div>
    <div class="space-y-3">
      <FormGroup
        :label="getComponentData('POP00090_LBL01016', 'caption', 'Available Total Quantity')"
        label-id="POP00090_LBL01016"
        label-for="POP00090_TXT01017"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01017"
          :value="itemDetailData.ITEM_AVAILABLE_QTY"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00090_LBL01017', 'caption', 'Unavailable Total Quantity')"
        label-id="POP00090_LBL01017"
        label-for="POP00090_TXT01018"
        horizontal
      >
        <FormTextInput
          id="POP00090_TXT01018"
          :value="itemDetailData.ITEM_UNAVAILABLE_QTY"
          readonly
        />
      </FormGroup>

      <Card
        divider
        shadow-size="none"
        class="ring-1 ring-black ring-opacity-10 sm:rounded-lg"
        card-header-class="px-2 py-1.5 space-y-3"
        card-body-class="space-y-1"
      >
        <template #header>
          <p class="leading-6 font-medium text-sm text-gray-900">
            {{ getGridData('POP00090_GRD01001', 'caption', 'List Of Stock') }}
          </p>
        </template>

        <Table
          id="POP00090_GRD01001"
          header-variant="secondary"
          clickable
          :columns="stockListTableFields"
          :items="itemDetailData.QUANTITIES"      
          @on-row-click="onClickStockDetailRow"    
        />       
      </Card>
    </div>
    <!-- Item Details Modal -->
    <Modal
      :show="openStockDetailsModal"
      size="8xl"
      divider
      @close="() => {
        openStockDetailsModal = false;
        StockDetailData = {};
      }"  
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00380_LBL01001', 'caption', 'Item Stock Detail') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00380`"
          :item-detail-data="StockDetailData"
        />
      </template>
    </Modal>
  </div>  
</template>

<style scoped>

</style>
