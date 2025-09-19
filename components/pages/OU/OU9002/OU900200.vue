<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const pageLoader = usePageLoaderStore()
const salseRank = useSalesRankStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent(currentTab.value?.component);

const reportList = ref([])

const { filters, userGroupBrandList } = storeToRefs(salseRank)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(reportList, perPage.value);
const { loading, toggleLoading } = useLoading()

const ProductQty = ref("0")
const SalseAmount = ref("0")

const brand = ref({})
const ReportType = ref({})

const fetchReportRankList = async () => {
  filters.value.FLT_BRAND_CODE = brand.value?.value ?? ''
  filters.value.FLT_REPORT_TYPE = ReportType.value?.value ?? ''

  const { data } = await salseRank.fetchReportRankList()

  reportList.value = []
  reportList.value = data
}

const onClickExportExcel = async () => {

  const { utils, write } = await import('xlsx')
  const { saveAs } = await import('file-saver')

  let table = null
  let fileName = ''

  if (filters.value.FLT_REPORT_TYPE === '0010') {
    table = document.getElementById('OU900200_GRD00003')
    fileName = 'Product Ranking by QTY_'
  } else if (filters.value.FLT_REPORT_TYPE === '0020') {
    table = document.getElementById('OU900200_GRD00003')
    fileName = 'Product Ranking by Amount_'
  } 
  else if (filters.value.FLT_REPORT_TYPE === '0030') {
    table = document.getElementById('OU900200_GRD00004')
    fileName = 'Customer Ranking by QTY_'
  } 
  else {
    table = document.getElementById('OU900200_GRD00004')
    fileName = 'Customer Ranking by Amount_'
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

        if (filters.value.FLT_REPORT_TYPE === '0010' || filters.value.FLT_REPORT_TYPE === '0020') {
            if (C === 6 || C === 7) {
              // 날짜 문자열로 그대로 저장 (변환 X)
              cell.t = 'n'               // number 형식
              cell.z = '#,###'        // 소수점 둘째 자리까지 숫자 (예: 1,234.56)
              cell.v = Number(cell.v.replace(/,/g, ''))    // 문자열 → 숫자 변환
            }
            else
            {
              cell.t = 's'
              cell.z = '@'
              cell.v = String(cell.v)
            }
          } else {
            if (C === 3 || C === 4) {
              // 날짜 문자열로 그대로 저장 (변환 X)
              cell.t = 'n'               // number 형식
              cell.z = '#,###'        // 소수점 둘째 자리까지 숫자 (예: 1,234.56)
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
  }

  const wbout = write(wb, {
    bookType: 'xlsx',
    type: 'array'
  })
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName)
    
}

watch(() => reportList, async (value) => {
  if (value) {
    let Product_Qty = 0
    let Salse_Amount = 0
    for (let i = 0; i < value.value.length; i++) 
    {
      Product_Qty = Product_Qty + Number(decrypt(value.value[i].ORDER_ITEM_QTY))
      Salse_Amount = Salse_Amount + Number(decrypt(value.value[i].ORDER_ITEM_SALES_AMT))
    }
    ProductQty.value = Product_Qty.toLocaleString()
    SalseAmount.value = Salse_Amount.toLocaleString()
  }
}, { deep: true })

const tableId = computed(() => {
  return (filters.value.FLT_REPORT_TYPE === '0010' || filters.value.FLT_REPORT_TYPE === '0020') ? 'OU900200_GRD00001' : 'OU900200_GRD00002'
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')  
  await salseRank.fetchUserGroupBrandList()

  brand.value = {
    name: decrypt(userGroupBrandList.value[0]?.USER_BRAND_FNAME) ?? '',
    value: parseInt(decrypt(userGroupBrandList.value[0]?.USER_BRAND_CODE)).toString() ?? '',
  }

  ReportType.value = {
    name: 'Product Rank By Qty',
    value: '0010',
  }
  isloading.isLoading = false
  togglePageLoading()
})


const onClickSearch = async () => {
  toggleLoading()
  isloading.isLoading = true
  await fetchReportRankList()
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
          :label="getComponentData('OU900200_LBL00001', 'caption','Brand')"
          label-id="OU900200_LBL00001"
          label-for="OU900200_CMB00001"
          horizontal
        >
          <FormSelect
            id="OU900200_CMB00001"
            v-model="brand"
            :options="userGroupBrandList.map((brand) => ({
              name: decrypt(brand.USER_BRAND_FNAME),
              value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
            }))"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('OU900200_LBL00002', 'caption', 'Order Date')"
          label-id="OU900200_LBL00002"
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
          :label="getComponentData('OU900200_LBL00003', 'caption','Report Type')"
          label-id="OU900200_LBL00003"
          label-for="OU900200_CMB00002"
          horizontal
        >
          <FormSelect
            id="OU900200_CMB00002"
            v-model="ReportType"
            :options="[
              {
                name: 'Product Rank By Qty',
                value: '0010',
              },
              {
                name: 'Product Rank By Amount',
                value: '0020',
              },
              {
                name: 'Customer Rank By Qty',
                value: '0030',
              },
              {
                name: 'Customer Rank By Amount',
                value: '0040',
              }
            ]"
          />
        </FormGroup>

        <div>
          <Button
            id="OU900200_BTN00001"
            variant="gray"
            rounded
            size="sm"
            :disabled="loading"
            :loading="loading"
            @click="onClickSearch"
          >
            {{ getComponentData ('OU900200_BTN00001', 'caption', 'Search') }}
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
            {{ getComponentData ('OU900200_BTN00002', 'caption','EXCEL Export') }}
          </Button>
        </div>     
      </div>
    </template>

    <Table
      v-if="tableId === 'OU900200_GRD00001'"
      id="OU900200_GRD00001"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
    >      
      <TableHead>
        <TableHeadCell class="text-center">
          Rank
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Brand
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Model Code
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Model Name
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Gender
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sub. Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          QTY
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Amount
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
        <TableHeadCell class="text-right"> 
          {{ ProductQty }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ SalseAmount }}
        </TableHeadCell>
      </TableHead>     
      <TableBody>
        <TableRow
          v-for="(option, index) in paginatedData"
          :key="index"
        >                          
          <TableCell class="text-center">
            {{ decrypt(option.RANK_NO) }}
          </TableCell>
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_BRAND) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_CODE) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_NAME) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_GENDER) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_CATEGORY) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_SUB_CATEGORY) }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.ORDER_ITEM_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.ORDER_ITEM_SALES_AMT)).toLocaleString() }}
          </TableCell>         
        </TableRow>
      </TableBody>
    </Table>

    <Table
      v-if="tableId === 'OU900200_GRD00002'"
      id="OU900200_GRD00002"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
    >
      <TableHead>
        <TableHeadCell class="text-center">
          Rank
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Customer Name
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Customer Mobile
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Qty
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Amount
        </TableHeadCell>
      </TableHead>   
      <TableHead>
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell class="text-right"> 
          {{ ProductQty }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ SalseAmount }}
        </TableHeadCell>
      </TableHead>     
      <TableBody>
        <TableRow
          v-for="(option, index) in paginatedData"
          :key="index"
        >                          
          <TableCell class="text-center">
            {{ decrypt(option.RANK_NO) }}
          </TableCell>
          <TableCell class="text-center">
            {{ decrypt(option.CUST_MANE_M) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.CUST_MOBILE_M) }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.ORDER_ITEM_QTY)).toLocaleString() }}
          </TableCell>    
          <TableCell class="text-right">
            {{ Number(decrypt(option.ORDER_ITEM_SALES_AMT)).toLocaleString() }}
          </TableCell>         
        </TableRow>
      </TableBody>
    </Table>
    
    <Table
      v-if="tableId === 'OU900200_GRD00001'"
      v-show="false"
      id="OU900200_GRD00003"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
      clickable
    >
      <TableHead>
        <TableHeadCell class="text-center">
          Rank
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Brand
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Model Code
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Model Name
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Gender
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Sub. Category
        </TableHeadCell>
        <TableHeadCell class="text-center">
          QTY
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Amount
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
        <TableHeadCell class="text-right"> 
          {{ ProductQty }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ SalseAmount }}
        </TableHeadCell>
      </TableHead>     
      <TableBody>
        <TableRow
          v-for="(option, index) in reportList"
          :key="index"
        >                          
          <TableCell class="text-center">
            {{ decrypt(option.RANK_NO) }}
          </TableCell>
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_BRAND) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_CODE) }}
          </TableCell> 
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_NAME) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_GENDER) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_CATEGORY) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.PRODUCT_SUB_CATEGORY) }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.ORDER_ITEM_QTY)).toLocaleString() }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.ORDER_ITEM_SALES_AMT)).toLocaleString() }}
          </TableCell>         
        </TableRow>
      </TableBody>
    </Table>

    <Table
      v-if="tableId === 'OU900200_GRD00002'"
      v-show="false"
      id="OU900200_GRD00004"
      class="overflow-x-auto mt-3"
      header-variant="secondary"
    >
      <TableHead>
        <TableHeadCell class="text-center">
          Rank
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Customer Name
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Customer Mobile
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Qty
        </TableHeadCell>
        <TableHeadCell class="text-center">
          Amount
        </TableHeadCell>
      </TableHead>   
      <TableHead>
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell />
        <TableHeadCell class="text-right"> 
          {{ ProductQty }}
        </TableHeadCell>
        <TableHeadCell class="text-right">
          {{ SalseAmount }}
        </TableHeadCell>
      </TableHead>     
      <TableBody>
        <TableRow
          v-for="(option, index) in reportList"
          :key="index"
        >                          
          <TableCell class="text-center">
            {{ decrypt(option.RANK_NO) }}
          </TableCell>
          <TableCell class="text-center">
            {{ decrypt(option.CUST_MANE_M) }}
          </TableCell>  
          <TableCell class="text-center">
            {{ decrypt(option.CUST_MOBILE_M) }}
          </TableCell>  
          <TableCell class="text-right">
            {{ Number(decrypt(option.ORDER_ITEM_QTY)).toLocaleString() }}
          </TableCell>    
          <TableCell class="text-right">
            {{ Number(decrypt(option.ORDER_ITEM_SALES_AMT)).toLocaleString() }}
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
