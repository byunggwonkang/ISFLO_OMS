<script setup>
import { decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const { pageLoading, togglePageLoading } = usePageLoading();
const pageLoader = usePageLoaderStore()
const { getComponentData } = usePageLoaderComponent('POP00380')
const { getGridData } = usePageLoaderGrid('POP00380')
const { loading, toggleLoading } = useLoading()
const StockDetail = useStockDetail()


const { StockDetailData } = storeToRefs(StockDetail)

const props = defineProps({
  itemDetailData: {
    type: Object,
    required: true,
    default: () => ({})
  },
})

const fetchStockDetail = async () => {
  await StockDetail.fetchStockDetail(props.itemDetailData)
}

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await fetchStockDetail()
  //await pageLoader.fetchPageLoadData('POP00380')  
  isloading.isLoading = false
  togglePageLoading()
})

const search = async (showLoading = true) => {

if (showLoading) toggleLoading()
  isloading.isLoading = true
await fetchStockDetail()
  isloading.isLoading = false
if (showLoading) toggleLoading()
}

</script>



<template>
  <div class="space-y-3">
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <h3 class="text-md leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00380_LBL00002', 'caption', 'Item Information') }}
        </h3>
      </template>
      <div class="grid grid-cols-3 gap-y-3 gap-x-6">
        <FormGroup
          :label="getComponentData('POP00380_LBL00003', 'caption', 'Brand Code')"
          label-id="POP00380_LBL00003"
          label-for="POP00380_TXT00001"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00001"
            :value="decrypt(StockDetailData.ITEM_BRAND_CODE)"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('POP00380_LBL00004', 'caption', 'Brand Name')"
          label-id="POP00380_LBL00004"
          label-for="POP00380_TXT00002"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00002"
            :value="decrypt(StockDetailData.ITEM_BRAND_FNAME)"
            readonly
          />
        </FormGroup>
        <FormGroup />
        <FormGroup
          :label="getComponentData('POP00380_LBL00005', 'caption', 'Item Code(SKU)')"
          label-id="POP00380_LBL00005"
          label-for="POP00380_TXT00003"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00003"
            :value="decrypt(StockDetailData.ITEM_CODE)"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('POP00380_LBL00006', 'caption', 'ALU')"
          label-id="POP00380_LBL00006"
          label-for="POP00380_TXT00004"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00004"
            :value="decrypt(StockDetailData.ITEM_ALU)"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('POP00380_LBL00007', 'caption', 'EAN')"
          label-id="POP00380_LBL00007"
          label-for="POP00380_TXT00005"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00005"
            :value="decrypt(StockDetailData.ITEM_EAN)"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('POP00380_LBL00008', 'caption', 'Item Name')"
          label-id="POP00380_LBL00008"
          label-for="POP00380_TXT00006"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00006"
            :value="decrypt(StockDetailData.ITEM_SNAME)"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('POP00380_LBL00009', 'caption', 'Item Full Name')"
          label-id="POP00380_LBL00009"
          label-for="POP00380_TXT00007"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00007"
            :value="decrypt(StockDetailData.ITEM_FNAME)"
            readonly
          />
        </FormGroup>
        <FormGroup />
        <FormGroup
          :label="getComponentData('POP00380_LBL00010', 'caption', 'Warehouse')"
          label-id="POP00380_LBL00010"
          label-for="POP00380_TXT00008"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00008"
            :value="decrypt(StockDetailData.STOCK_WH_FNAME)"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('POP00380_LBL00011', 'caption', 'Warehouse Type')"
          label-id="POP00380_LBL00011"
          label-for="POP00380_TXT00009"
          horizontal
        >
          <FormTextInput
            id="POP00380_TXT00009"
            :value="decrypt(StockDetailData.STOCK_WH_TYPE_FNAME)"
            readonly
          />
        </FormGroup>
      </div>
    </Card>
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-3 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <h3 class="text-md leading-6 font-medium text-gray-900 ">
          {{ getComponentData('POP00380_LBL00012', 'caption', 'Stock Quantity Information') }}
        </h3>
        <div class="grid grid-cols-3 gap-y-3 gap-x-6  py-2">
          <FormGroup
            :label="getComponentData('POP00380_LBL00013', 'caption', 'Actual Available QTY (A+B+C)')"
            label-id="POP00380_LBL00013"
            label-for="POP00380_TXT00010"
            horizontal
          >
            <FormTextInput
              id="POP00380_TXT00010"
              :value="decrypt(StockDetailData.STOCK_ACTUAL_AVILABLE_QTY)"
              readonly
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('POP00380_LBL00014', 'caption', 'Expect Available QTY (A+B+C+D+E)')"
            label-id="POP00380_LBL00014"
            label-for="POP00380_TXT00011"
            horizontal
          >
            <FormTextInput
              id="POP00380_TXT00011"
              :value="decrypt(StockDetailData.STOCK_EXPACTED_AVILABLE_QTY)"
              readonly
            />
          </FormGroup>
          <div class="col-span-1 text-end">
            <Button
              id="POP00380_BTN00001"
              rounded
              variant="gray"
              :loading="loading"
              :disabled="loading"
              @click="search"
            >
              {{ getComponentData('POP00380_BTN00001', 'caption', 'Refresh') }}
            </Button>
          </div>
        </div>
      </template>
      <div class="grid grid-cols-6 gap-y-3 gap-x-6">
        <FormGroup
          :label="getComponentData('POP00380_LBL00015', 'caption', 'A. Previous Closing QTY')"
          label-id="POP00380_LBL00015"
          label-for="POP00380_TXT00012"
        >
          <FormTextInput
            id="POP00380_TXT00012"
            :value="decrypt(StockDetailData.STOCK_CLOSED_QTY)"
            readonly
          />  
        </FormGroup>
        <div class="col-span-5" />
        <FormGroup
          :label="getComponentData('POP00380_LBL00016', 'caption', 'B. Increased QTY')"
          label-id="POP00380_LBL00016"
          label-for="POP00380_TXT00013"
        >
          <FormTextInput
            id="POP00380_TXT00013"
            :value="decrypt(StockDetailData.STOCK_INC_QTY)"
            readonly
          />
        </FormGroup>
        <div class="col-span-2">
          <Table
            id="POP00380_GRD00001"              
            border          
          >
            <TableBody>
              <TableRow
                v-for="(option, index) in StockDetailData.INCREASED_LIST"
                :key="index"
              >                          
                <TableCell>
                  {{ decrypt(option.TRANSACTION_FNAME) }}
                </TableCell>
                <TableCell class="text-center">
                  {{ decrypt(option.TRANSACTION_QTY) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <FormGroup
          :label="getComponentData('POP00380_LBL00017', 'caption', 'C. Decreased QTY')"
          label-id="POP00380_LBL00017"
          label-for="POP00380_TXT00014"
        >
          <FormTextInput
            id="POP00380_TXT00014"
            :value="decrypt(StockDetailData.STOCK_DEC_QTY)"
            readonly
          />
        </FormGroup>
        <div class="col-span-2">
          <Table
            id="POP00380_GRD00002"
            border
          >
            <TableBody>
              <TableRow
                v-for="(option, index) in StockDetailData.DECREASED_LIST"
                :key="index"
              >                          
                <TableCell>
                  {{ decrypt(option.TRANSACTION_FNAME) }}
                </TableCell>
                <TableCell class="text-center">
                  {{ decrypt(option.TRANSACTION_QTY) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <FormGroup
          :label="getComponentData('POP00380_LBL00018', 'caption', 'D. To be increased QTY')"
          label-id="POP00380_LBL00018"
          label-for="POP00380_TXT00015"
        >
          <FormTextInput
            id="POP00380_TXT00015"
            :value="decrypt(StockDetailData.STOCK_TOBE_INC_QTY)"
            readonly
          />
        </FormGroup>
        <div class="col-span-2">
          <Table
            id="POP00380_GRD00003"
            border
          >
            <TableBody>
              <TableRow
                v-for="(option, index) in StockDetailData.TO_BE_INCREASED_LIST"
                :key="index"
              >                          
                <TableCell>
                  {{ decrypt(option.TRANSACTION_FNAME) }}
                </TableCell>
                <TableCell class="text-center">
                  {{ decrypt(option.TRANSACTION_QTY) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <FormGroup
          :label="getComponentData('POP00380_LBL00019', 'caption', 'E. To be decreased QTY')"
          label-id="POP00380_LBL00019"
          label-for="POP00380_TXT00016"
        >
          <FormTextInput
            id="POP00380_TXT00016"
            :value="decrypt(StockDetailData.STOCK_TOBE_DEC_QTY)"
            readonly
          />
        </FormGroup>
        <div class="col-span-2">
          <Table
            id="POP00380_GRD00004"
            border           
          >
            <TableBody>
              <TableRow
                v-for="(option, index) in StockDetailData.TO_BE_DECREASED_LIST"
                :key="index"
              >                          
                <TableCell>
                  {{ decrypt(option.TRANSACTION_FNAME) }}
                </TableCell>
                <TableCell class="text-center">
                  {{ decrypt(option.TRANSACTION_QTY) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  </div>  
</template>

<style scoped>

</style>
