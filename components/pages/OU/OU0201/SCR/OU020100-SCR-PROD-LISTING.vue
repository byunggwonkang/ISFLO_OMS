<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid";
import VueFeather from "vue-feather";
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const pageLoader = usePageLoaderStore()
const saleProducts = useSaleProductsStore()
const commonData = useCommonDataStore()

const { currentTab } = storeToRefs(useTabsStore())

const { filters, userGroupBrandList, productCategoryList, productSubCategoryList, productSubSubCategoryList, productList } = storeToRefs(saleProducts)
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(productList, perPage.value);
const { loading, toggleLoading } = useLoading()

const emits = defineEmits(['pageChanged', 'onAddEditProductData'])

const brandList = ref([])
const productCategory = ref({})
const productSubCategory = ref({})
const productSubSubCategory = ref({})
const goodsStatus = ref({})

watch(productCategory, async (category) => {
  await saleProducts.fetchProductCategoryList({
    categoryCode: category.value ?? '',
    subCategoryCode: '',
  })

  productSubCategory.value = {
    name: 'All',
    value: '',
  }

  // productSubCategory.value = category.value ? {
  //   name: productSubCategoryList.value[0]?.CATEGORY_NAME ?? 'All',
  //   value: productSubCategoryList.value[0]?.CATEGORY_CODE ?? '',
  // } : {
  //   name: 'All',
  //   value: '',
  // } ?? {}
})

watch(productSubCategory, async (subCategory) => {
  await saleProducts.fetchProductCategoryList({
    categoryCode: productCategory.value.value ?? '',
    subCategoryCode: subCategory.value ?? '',
  })
  productSubSubCategory.value = {
    name: 'All',
    value: '',
  } ?? {}

  // productSubSubCategory.value = subCategory.value ? {
  //   name: productSubSubCategoryList.value[0]?.CATEGORY_NAME ?? 'All',
  //   value: productSubSubCategoryList.value[0]?.CATEGORY_CODE ?? '',
  // } : {
  //   name: 'All',
  //   value: '',
  // } ?? {}
})

watch(() => brandList, (value) => {
  if (value.value.length === 0) {
    filters.value.FLT_DATE_CHECK = true    
  }
}, { deep: true })

onBeforeMount(async () => {
  await saleProducts.fetchProductList()
})

onMounted(async () => {
  isloading.isLoading = true
  productCategory.value = {
    name: 'All',
    value: '',
  } ?? {}

  goodsStatus.value = {
    name: 'All',
    value: '',
  } ?? {}

  await saleProducts.fetchProductCategoryList({
    categoryCode: '',
    subCategoryCode: '',
  })

  await saleProducts.fetchUserGroupBrandList()
  await commonData.fetchOU020100CommonData()
  isloading.isLoading = false
})

const productListTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU020100_GRD00002').filter((field) => field.display === 'Y')
})

const productChannelTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU020100_GRD00003')
})

const productItemsTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU020100_GRD00004')
})

const search = async () => {
  filters.value.FLT_STATUS_CODE = goodsStatus.value.value ?? ''
  filters.value.FLT_BRAND_CODE = brandList.value.map((brand) => brand.value) ?? []

  filters.value.FLT_SUB_CATEGORY_CODE = productSubCategory.value.value ?? ''
  filters.value.FLT_SUB_SUB_CATEGORY_CODE = productSubSubCategory.value.value ?? ''

  filters.value.FLT_REGIST_START_DATE = moment(filters.value.FLT_REGIST_START_DATE).format('YYYY-MM-DD')
  filters.value.FLT_REGIST_END_DATE = moment(filters.value.FLT_REGIST_END_DATE).format('YYYY-MM-DD')

  toggleLoading()
  isloading.isLoading = true
  await saleProducts.fetchProductList()
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const addEditProductData = (product) => {
  emits('onAddEditProductData', product)
}


const { getMaskedValue } = useMasked();
</script>

<template>
  <AppContent
    divider
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-12 gap-y-3">
        <FormGroup
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
          label-id="OU020100_GRD00001"
          :label="getGridData('OU020100_GRD00001', 'caption')"
        >
          <FormSelect
            v-model="brandList"
            multiple
            placeholder="Select Brand"
            :max-items="4"
            :options="userGroupBrandList.map((brand) => ({
              name: decrypt(brand.USER_BRAND_FNAME),
              value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
            }))"
          />
        </FormGroup>
        <FormGroup
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
          :label="getComponentData('OU020100_LBL00001', 'caption')"
          label-id="OU020100_LBL00001"
          label-for="OU020100_CMB00001"
        >
          <FormCombobox
            id="OU020100_CMB00001"
            v-model="productCategory"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...productCategoryList.map((category) => ({
                name: decrypt(category.CATEGORY_NAME),
                value: decrypt(category.CATEGORY_CODE),
              }))
            ]"
            :placeholder="getComponentData('OU020100_CMB00001', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
          :label="getComponentData('OU020100_LBL00002', 'caption')"
          label-id="OU020100_LBL00002"
          label-for="OU020100_CMB00002"
        >
          <FormCombobox
            id="OU020100_CMB00002"
            v-model="productSubCategory"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...productSubCategoryList.map((category) => ({
                name: decrypt(category.CATEGORY_NAME),
                value: decrypt(category.CATEGORY_CODE),
              }))
            ]"
            :placeholder="getComponentData('OU020100_CMB00002', 'placeholder')"
          />
        </FormGroup>

        <FormGroup
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
          :label="getComponentData('OU020100_LBL00003', 'caption')"
          label-id="OU020100_LBL00003"
          label-for="OU020100_CMB00003"
        >
          <FormCombobox
            id="OU020100_CMB00003"
            v-model="productSubSubCategory"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...productSubSubCategoryList.map((category) => ({
                name: decrypt(category.CATEGORY_NAME),
                value: decrypt(category.CATEGORY_CODE),
              }))
            ]"
            :placeholder="getComponentData('OU020100_CMB00003', 'placeholder')"
          />
        </FormGroup>
        <FormGroup />
        <FormGroup
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
          :label="getComponentData('OU020100_LBL00006', 'caption')"
          label-id="OU020100_LBL00006"
        >
          <FormTextInput
            id="OU020100_TXT00001"
            v-model="filters.FLT_PRODUCT_NAME"
            :placeholder="getComponentData('OU020100_TXT00001', 'placeholder')"
          />
        </FormGroup>
        <FormGroup
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
          :label="getComponentData('OU020100_LBL00004', 'caption')"
          label-id="OU020100_LBL00004"
        >
          <div class="flex items-center sm:flex-col lg:flex-row sm:space-y-3 sm:space-x-0 lg:space-x-3 lg:space-y-0 w-full">
            <FormCheckbox
              v-model="filters.FLT_DATE_CHECK"
              :disabled="brandList.length === 0"
            />
            <FormDatePicker
              id="OU020100_DAT00001"
              v-model="filters.FLT_REGIST_START_DATE"
              :placeholder="getComponentData('OU020100_DAT00001', 'placeholder')"
              :disabled="!filters.FLT_DATE_CHECK"
            />
            <FormDatePicker
              id="OU020100_DAT00002"
              v-model="filters.FLT_REGIST_END_DATE"
              :placeholder="getComponentData('OU020100_DAT00002', 'placeholder')"
              :disabled="!filters.FLT_DATE_CHECK"
            />
          </div>
        </FormGroup>
        <FormGroup
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
          :label="getComponentData('OU020100_LBL00005', 'caption')"
          label-id="OU020100_LBL00005"
          label-for="OU020100_CMB00004"
        >
          <FormCombobox
            id="OU020100_CMB00004"
            v-model="goodsStatus"
            :placeholder="getComponentData('OU020100_CMB00004', 'placeholder')"
            :options="[
              {
                name: 'All',
                value: '',
              },
              ...commonData.getGoodsStatusOptions
            ]"
          />
        </FormGroup>

        <div>
          <Button
            id="OU020100_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('OU020100_BTN00001', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-2 py-1">
      <p>
        {{ getGridData('OU020100_GRD00002', 'caption') }}
      </p>
    </div>

    <Table
      id="OU020100_GRD00002"
      class="overflow-x-auto"
      header-variant="secondary"
      clickable
      :columns="[
        ...productListTableFields
      ]"
      :items="paginatedData"
    >
      <template #row="{ item, columns }">
        <TableRow @click="item.showSubTable = !item.showSubTable">
          <TableCell
            v-for="(column, columnIndex) in columns"
            :key="columnIndex"
          >
            <span v-if="column.dataFieldName === 'PRODUCT_DESCRIPTION'">
              <div
                v-if="decrypt(item[column.dataFieldName]) > 10"
                v-tooltip="{
                  content: `<div class='p-2 border border-gray-300 rounded bg-gray-50 text-gray-700 font-mono text-md'
                          style='max-width: 300px; white-space: pre-wrap; word-break: break-all; overflow-wrap: break-word;'
                          >${decrypt(item[column.dataFieldName])}</div>`,
                  placement: 'top',
                  trigger: 'hover',
                  html: true
                }"
              >
                {{ truncateText(decrypt(item[column.dataFieldName]), 10) }}
              </div> 
              <div v-else-if="decrypt(item[column.dataFieldName]).length <= 10">
                {{ decrypt(item[column.dataFieldName]) }}
              </div>
            </span>
            <div v-else-if="column.caption !== 'Action'">
              <span v-if="column.editMask">
                {{ item[column.dataFieldName] ? getMaskedValue(decrypt(item[column.dataFieldName]), column.editMask) : '-' }}
              </span>              
              <span v-else>
                {{ item[column.dataFieldName] ? decrypt(item[column.dataFieldName]) : '-' }}
              </span>
            </div>

            <span
              v-if="column.caption === 'Action1'"
              class=" cursor-pointer hover:font-bold hover:text-blue-700"
              @click="(e) => {
                e.stopPropagation()
                addEditProductData(item)
              }"
            >
              <VueFeather
                type="edit"
                class="h-5 w-5"
              />
            </span>
          </TableCell>
        </TableRow>
        <TableRow
          v-if="item.showSubTable"
          disable-clickable
        >
          <TableCell />
          <TableCell
            :colspan="5"
            class-name="p-3"
          >
            <Table
              id="OU020100_GRD00004"
              header-variant="secondary"
              :columns="productItemsTableFields"
              :items="item?.PRODUCT_ITEMS || []"
            />
          </TableCell>
        </TableRow>
      </template>
    </Table>

    <!-- Pagination -->
    <div
      v-if="productList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? productList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ productList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="productList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>
  </AppContent>
</template>
<script>
function truncateText(text, length) {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}
</script>
<style scoped>

</style>
