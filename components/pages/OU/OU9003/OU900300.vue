<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const pageLoader = usePageLoaderStore()
const salseProduct = useSalesProductStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const reportList = ref([])

const { filters, userGroupBrandList } = storeToRefs(salseProduct)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(reportList, perPage.value);
const { loading, toggleLoading } = useLoading()

const REQ_SALES_QTY = ref("0")
const SALES_INBOUND_QTY = ref("0")
const REMAIN_DIFF_QTY = ref("0")

const brand = ref({})
const ReportType = ref({})

const fetchReportSalesQtyList = async () => {
  filters.value.FLT_BRAND_CODE = brand.value?.value ?? ''
  filters.value.FLT_REPORT_TYPE = ReportType.value?.value ?? ''

  const { data } = await salseProduct.fetchReportSalesQtyList()

  reportList.value = []
  reportList.value = data
}

const onClickExportExcel = async () => {

  const { utils, write } = await import('xlsx')
  const { saveAs } = await import('file-saver')

  let table = null
  let fileName = ''

  if (filters.value.FLT_REPORT_TYPE === '0010') {
    table = document.getElementById('OU900300_GRD00003')
    fileName = 'Sales Report by Initial QTY vs Sales QTY_'
  } else {
    table = document.getElementById('OU900300_GRD00004')
    fileName = 'Sales Report by Sales QTY vs Inboud QTY_'
  }

  if (filters.value.FLT_ORDER_FROM_DATE == filters.value.FLT_ORDER_TO_DATE)
  {
      fileName = fileName + filters.value.FLT_ORDER_FROM_DATE.replaceAll('-','') +'.xlsx'
  }
  else
  {
      fileName = fileName + filters.value.FLT_ORDER_FROM_DATE.replaceAll('-','') + '_' + filters.value.FLT_ORDER_TO_DATE.replaceAll('-','') + '.xlsx'
  }

  if (!table) return

  // 워크북 생성 (변환 없이)
  const wb = utils.table_to_book(table, {
    sheet: 'Sheet1',
    raw: true
  })
  const ws = wb.Sheets['Sheet1']

  // 날짜를 문자열로 강제 고정
  const sheetRef = ws['!ref']
  if (sheetRef) {
    const range = utils.decode_range(sheetRef)

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const addr = utils.encode_cell({ r: R, c: C })
        const cell = ws[addr]
        if (!cell || cell.v == null) continue
        if (R === 0) continue // 헤더는 제외

        if (C === 10 || C === 11 || C === 12) {
          // 날짜 문자열로 그대로 저장 (변환 X)
          cell.t = 'n'               // number 형식
          cell.z = '#,##0'        // 소수점 둘째 자리까지 숫자 (예: 1,234.56)
          cell.v = Number(cell.v.replace(/,/g, ''))    // 문자열 → 숫자 변환
        }
        else
        {
          cell.t = 's'
          cell.z = '@'
          cell.v = String(cell.v)
        }
      }
    }
  }

  const wbout = write(wb, {
    bookType: 'xlsx',
    type: 'array'
  })
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
    
}

watch(() => reportList, async (value) => {
  if (value) {
    let ReqSalesQTY = 0
    let SalesInboundQTY = 0
    let RemainDiffQTY = 0
    for (let i = 0; i < value.value.length; i++) 
    {
      ReqSalesQTY = ReqSalesQTY + Number(decrypt(value.value[i].REQUEST_SALES_QTY))
      SalesInboundQTY = SalesInboundQTY + Number(decrypt(value.value[i].SALES_INBOUND_QTY))
      RemainDiffQTY = RemainDiffQTY + Number(decrypt(value.value[i].REMAIN_DIFF_QTY))
    }
    REQ_SALES_QTY.value = ReqSalesQTY.toLocaleString()
    SALES_INBOUND_QTY.value = SalesInboundQTY.toLocaleString()
    REMAIN_DIFF_QTY.value = RemainDiffQTY.toLocaleString()
  }
}, { deep: true })

const tableId = computed(() => {
  return filters.value.FLT_REPORT_TYPE === '0010' ? 'OU900300_GRD00001' : 'OU900300_GRD00002'
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')  
  await salseProduct.fetchUserGroupBrandList()

  brand.value = {
    name: decrypt(userGroupBrandList.value[0]?.USER_BRAND_FNAME) ?? '',
    value: parseInt(decrypt(userGroupBrandList.value[0]?.USER_BRAND_CODE)).toString() ?? '',
  }

  ReportType.value = {
    name: 'Initial QTY vs Sales QTY',
    value: '0010',
  }
  isloading.isLoading = false
  togglePageLoading()
})


const onClickSearch = async () => {
  toggleLoading()
  isloading.isLoading = true
  await fetchReportSalesQtyList()
  isloading.isLoading = false
  toggleLoading()
  resetPage()
}

</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-6">
        <FormGroup
          :label="getComponentData('OU900300_LBL00001', 'caption','Brand')"
          label-id="OU900300_LBL00001"
          label-for="OU900300_CMB00001"
          horizontal
        >
          <FormSelect
            id="OU900300_CMB00001"
            v-model="brand"
            :options="userGroupBrandList.map((brand) => ({
              name: decrypt(brand.USER_BRAND_FNAME),
              value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
            }))"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU900300_LBL00002', 'caption', 'Order Date')"
          label-id="OU900300_LBL00002"
          horizontal
        >
          <div class="flex items-center sm:flex-col lg:flex-row sm:space-y-3 sm:space-x-0 lg:space-x-3 lg:space-y-0 w-full ml-3">
            <FormDatePicker
              v-model.string="filters.FLT_ORDER_FROM_DATE"
              placeholder="Select a date"
              mode="date"
            />

            <FormDatePicker
              v-model.string="filters.FLT_ORDER_TO_DATE"
              placeholder="Select a date"
              mode="date"
            />
          </div>
        </FormGroup>
        <FormGroup
          :label="getComponentData('OU900300_LBL00003', 'caption','Report Type')"
          label-id="OU900300_LBL00003"
          label-for="OU900300_CMB00002"
          horizontal
        >
          <FormSelect
            id="OU900300_CMB00002"
            v-model="ReportType"
            :options="[
              {
                name: 'Initial QTY vs Sales QTY',
                value: '0010',
              },
              {
                name: 'Sales QTY vs Inboud QTY',
                value: '0020',
              }
            ]"
          />
        </FormGroup>

        <div>
          <Button
            id="OU900300_BTN00001"
            variant="gray"
            rounded
            size="sm"
            :disabled="loading"
            :loading="loading"
            @click="onClickSearch"
          >
            {{ getComponentData ('OU900300_BTN00001', 'caption', 'Search') }}
          </Button>
        </div>   
        <div class="text-end">
          <Button
            id="OU030100_BTN03002"
            variant="gray"
            rounded
            size="sm"
            :disabled="loading || !reportList?.length"
            :loading="loading"
            @click="onClickExportExcel"
          > 
            {{ getComponentData ('OU900300_BTN00002', 'caption','EXCEL Export') }}
          </Button>
        </div>     
      </div>
    </template>

    <Table
      v-if="tableId === 'OU900300_GRD00001'"
      id="OU900300_GRD00001"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
    >      
      <TableHead>
        <TableHeadCell class="text-center">
          No.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Brand
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sub. Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Gender
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Item Code
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Product Name
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Product Description
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Color
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Size
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Request QTY.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sales QTY.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Remain QTY.
        </TableHeadCell>
      </TableHead>   
      <TableHead>
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell class="text-right">
          {{ REQ_SALES_QTY }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ SALES_INBOUND_QTY }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ REMAIN_DIFF_QTY }}
        </TableHeadCell>
      </TableHead>     
      <TableBody>
        <TableRow
          v-for="(option, index) in paginatedData"
          :key="index"
        >                          
          <TableCell class="text-center">
            {{ decrypt(option.NO) }}
          </TableCell>
          <TableCell class="text-center">
            {{ decrypt(option.BRAND_FNAME) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_L) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_S) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_M) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CD) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_NAME) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_DESCR2) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_COLOR) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_SIZE) }}
          </TableCell>   
          <TableCell class="text-right">
            {{ Number(decrypt(option.REQUEST_SALES_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.SALES_INBOUND_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.REMAIN_DIFF_QTY)).toLocaleString() }}
          </TableCell>         
        </TableRow>
      </TableBody>
    </Table>

    <Table
      v-if="tableId === 'OU900300_GRD00002'"
      id="OU900300_GRD00002"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
    >
      <TableHead>
        <TableHeadCell class="text-center">
          No.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Brand
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sub. Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Gender
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Item Code
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Product Name
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Product Description
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Color
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Size
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sales QTY.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Inbound QTY.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Diff QTY.
        </TableHeadCell>
      </TableHead>   
      <TableHead>
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell class="text-right">
          {{ REQ_SALES_QTY }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ SALES_INBOUND_QTY }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ REMAIN_DIFF_QTY }}
        </TableHeadCell>
      </TableHead>     
      <TableBody>
        <TableRow
          v-for="(option, index) in paginatedData"
          :key="index"
        >                          
          <TableCell class="text-center">
            {{ decrypt(option.NO) }}
          </TableCell>
          <TableCell class="text-center">
            {{ decrypt(option.BRAND_FNAME) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_L) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_S) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_M) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CD) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_NAME) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_DESCR2) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_COLOR) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_SIZE) }}
          </TableCell>   
          <TableCell class="text-right">
            {{ Number(decrypt(option.REQUEST_SALES_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.SALES_INBOUND_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.REMAIN_DIFF_QTY)).toLocaleString() }}
          </TableCell>         
        </TableRow>
      </TableBody>
    </Table>
    
    <Table
      v-if="tableId === 'OU900300_GRD00001'"
      v-show="false"
      id="OU900300_GRD00003"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
      clickable
    >
      <TableHead>
        <TableHeadCell class="text-center">
          No.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Brand
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sub. Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Gender
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Item Code
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Product Name
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Product Description
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Color
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Size
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Request QTY.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sales QTY.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Remain QTY.
        </TableHeadCell>
      </TableHead>   
      <TableHead>
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell class="text-right">
          {{ REQ_SALES_QTY }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ SALES_INBOUND_QTY }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ REMAIN_DIFF_QTY }}
        </TableHeadCell>
      </TableHead>     
      <TableBody>
        <TableRow
          v-for="(option, index) in reportList"
          :key="index"
        >                          
          <TableCell class="text-center">
            {{ decrypt(option.NO) }}
          </TableCell>
          <TableCell class="text-center">
            {{ decrypt(option.BRAND_FNAME) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_L) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_S) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_M) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CD) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_NAME) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_DESCR2) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_COLOR) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_SIZE) }}
          </TableCell>   
          <TableCell class="text-right">
            {{ Number(decrypt(option.REQUEST_SALES_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.SALES_INBOUND_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.REMAIN_DIFF_QTY)).toLocaleString() }}
          </TableCell>         
        </TableRow>
      </TableBody>
    </Table>

    <Table
      v-if="tableId === 'OU900300_GRD00002'"
      v-show="false"
      id="OU900300_GRD00004"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
    >
      <TableHead>
        <TableHeadCell class="text-center">
          No.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Brand
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sub. Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Gender
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Item Code
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Product Name
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Product Description
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Color
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Size
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sales QTY.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Inbound QTY.
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Diff QTY.
        </TableHeadCell>
      </TableHead>   
      <TableHead>
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell class="text-right">
          {{ REQ_SALES_QTY }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ SALES_INBOUND_QTY }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ REMAIN_DIFF_QTY }}
        </TableHeadCell>
      </TableHead>     
      <TableBody>
        <TableRow
          v-for="(option, index) in reportList"
          :key="index"
        >                          
          <TableCell class="text-center">
            {{ decrypt(option.NO) }}
          </TableCell>
          <TableCell class="text-center">
            {{ decrypt(option.BRAND_FNAME) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_L) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_S) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CATEGORY_M) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_CD) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_NAME) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_DESCR2) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_COLOR) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.ITEM_SIZE) }}
          </TableCell>   
          <TableCell class="text-right">
            {{ Number(decrypt(option.REQUEST_SALES_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.SALES_INBOUND_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.REMAIN_DIFF_QTY)).toLocaleString() }}
          </TableCell>         
        </TableRow>
      </TableBody>
    </Table>

    <!-- Pagination -->
    <div
      v-if="reportList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? reportList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ reportList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="reportList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>
  </AppContent>
</template>

<style scoped>

</style>
