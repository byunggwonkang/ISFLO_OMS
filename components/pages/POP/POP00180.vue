<script setup>
import moment from "moment";

const { getComponentData } = usePageLoaderComponent(['POP00180'])
const { getGridData } = usePageLoaderGrid(['POP00180'])

const pageLoader = usePageLoaderStore()
const nonMerchandisingItems = useNonMerchandisingItemsStore();
const commonData = useCommonDataStore()

const { warehouseList, inOutFilters, nmdInOutList } = storeToRefs(nonMerchandisingItems);

const perPage = ref(5)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(nmdInOutList, perPage.value);
const { loading, toggleLoading } = useLoading()

const props = defineProps({
  nmdDetailData: {
    type: Object,
    required: true,
    default: () => ({
      NMD_CODE: '',
      NMD_STOCK_YN: '0',
    })
  },
})

const emits = defineEmits(['ndmInOutDetailSaved'])

const formData = ref({
  FLT_NMD_BRAND_CODE: props.nmdDetailData.NMD_BRAND_CODE,
  FLT_NMD_CODE: props.nmdDetailData.NMD_CODE,
  FLT_NMD_IO_WH_CODE: '',
  FLT_NMD_IO_STOCKTYPE_CODE: '',
  FLT_NMD_IO_FROM_TO: '',
  FLT_NMD_IO_TYPE_CODE: '',
  FLT_NMD_IO_QTY: '',
  FLT_NMD_IO_REMARK: '',
})

const stockType = ref({})
const warehouse = ref({})
const stockInOutType = ref({})

const filterStockInOutType = ref({
  name: 'All',
  value: '',
})

const saving = ref(false);

const save = async () => {
  saving.value = true;

  formData.value.FLT_NMD_IO_WH_CODE = warehouse.value?.value;
  formData.value.FLT_NMD_IO_STOCKTYPE_CODE = stockType.value?.value;
  formData.value.FLT_NMD_IO_TYPE_CODE = stockInOutType.value?.value;

  const { success } = await nonMerchandisingItems.saveNonInOutDetails(formData.value);

  if (success) {
    emits('ndmInOutDetailSaved')
  }

  saving.value = false;
}

onMounted(async () => {
  await commonData.fetchPOP00180CommonData();
  inOutFilters.value.FLT_NMD_BRAND_CODE = props.nmdDetailData.NMD_BRAND_CODE;
  inOutFilters.value.FLT_NMD_CODE = props.nmdDetailData.NMD_CODE;

  await nonMerchandisingItems.fetchNonMerchandisingItemInOutList();
})

const search = async () => {
  inOutFilters.value.FLT_NMD_IO_FROM_DATE = inOutFilters.value.FLT_NMD_IO_FROM_DATE
    ? moment(inOutFilters.value.FLT_NMD_IO_FROM_DATE).format('YYYY-MM-DD')
    : '';

  inOutFilters.value.FLT_NMD_IO_TO_DATE = inOutFilters.value.FLT_NMD_IO_TO_DATE
    ? moment(inOutFilters.value.FLT_NMD_IO_TO_DATE).format('YYYY-MM-DD')
    : '';

  inOutFilters.value.FLT_NMD_IO_TYPE_CODE = filterStockInOutType.value?.value;

  toggleLoading();
  await nonMerchandisingItems.fetchNonMerchandisingItemInOutList();
  toggleLoading();
  resetPage()
}

const nmdInOutTableFields = computed(() => {
  return pageLoader.getTableData('POP00180', 'POP00180_GRD01001');
})

const excelData = computed(() => {
  return nmdInOutList.value.map((item) => {
    const obj = {};

    nmdInOutTableFields.value.forEach((field) => {
      obj[field.caption] = item[field.dataFieldName];
    });

    return obj;
  })
});
</script>

<template>
  <div class="divide-y space-y-6">
    <div>
      <p class="mb-3">
        {{ getComponentData('POP00180_LBL01002', 'caption') }}
      </p>

      <div class="grid grid-cols-2 gap-x-3">
        <div class="space-y-3">
          <FormGroup
            :label="getComponentData('POP00180_LBL01003', 'caption', 'Brand')"
            label-id="POP00180_LBL01003"
            label-for="POP00180_TXT01001"
            horizontal
          >
            <FormTextInput
              id="POP00180_TXT01001"
              :value="nmdDetailData.NMD_BRAND_SNAME"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01004', 'caption', 'Product Type')"
            label-id="POP00180_LBL01004"
            label-for="POP00180_TXT01002"
            horizontal
          >
            <FormTextInput
              id="POP00180_TXT01002"
              :value="nmdDetailData.NMD_PRODUCT_SNAME"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01005', 'caption', 'NMD Code')"
            label-id="POP00180_LBL01005"
            label-for="POP00180_TXT01003"
            horizontal
          >
            <FormTextInput
              id="POP00180_TXT01003"
              :value="nmdDetailData.NMD_CODE"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01006', 'caption', 'EAN')"
            label-id="POP00180_LBL01006"
            label-for="POP00180_TXT01004"
            horizontal
          >
            <FormTextInput
              id="POP00180_TXT01004"
              :value="nmdDetailData.NMD_ALU"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01007', 'caption', 'Short Name')"
            label-id="POP00180_LBL01007"
            label-for="POP00180_TXT01005"
            horizontal
          >
            <FormTextInput
              id="POP00180_TXT01005"
              :value="nmdDetailData.NMD_SNAME"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01008', 'caption', 'Full Name')"
            label-id="POP00180_LBL01008"
            label-for="POP00180_TXT01006"
            horizontal
          >
            <FormTextInput
              id="POP00180_TXT01006"
              :value="nmdDetailData.NMD_FNAME"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01009', 'caption', 'Available Total Quantity')"
            label-id="POP00180_LBL01009"
            label-for="POP00180_TXT01007"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="POP00180_TXT01007"
              :value="nmdDetailData.NMD_AVAILABLE_QTY"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01010', 'caption', 'Available Total Value')"
            label-id="POP00180_LBL01010"
            label-for="POP00180_TXT01008"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="POP00180_TXT01008"
              :value="nmdDetailData.NMD_UNAVAILABLE_QTY"
              disabled
            />
          </FormGroup>
        </div>

        <div class="space-y-3">
          <FormGroup
            :label="getComponentData('POP00180_LBL01011', 'caption', 'Stock Type')"
            label-id="POP00180_LBL01011"
            label-for="POP00180_CMB00001"
            horizontal
          >
            <FormCombobox
              id="POP00180_CMB00001"
              v-model="warehouse"
              :options="warehouseList.map((warehouse) => ({
                name: warehouse.WH_FNAME,
                value: parseInt(warehouse.WH_CODE).toString(),
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01012', 'caption', 'Stock Type')"
            label-id="POP00180_LBL01012"
            label-for="POP00180_CMB00002"
            horizontal
          >
            <FormCombobox
              id="POP00180_CMB00002"
              v-model="stockType"
              :options="commonData.getNmdStockTypeOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01013', 'caption', 'Stock In/Out Type')"
            label-id="POP00180_LBL01013"
            label-for="POP00180_TXT01009"
            horizontal
          >
            <FormTextInput
              id="POP00180_TXT01009"
              v-model="formData.FLT_NMD_IO_FROM_TO"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01014', 'caption', 'Stock In/Out Type')"
            label-id="POP00180_LBL01014"
            label-for="POP00180_CMB00003"
            horizontal
          >
            <FormCombobox
              id="POP00180_CMB00003"
              v-model="stockInOutType"
              :options="commonData.getNmdIOTypeOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01015', 'caption', 'Quantity')"
            label-id="POP00180_LBL01015"
            horizontal
          >
            <div class="flex items-center space-x-3">
              <FormTextInput
                id="POP00180_TXT01010"
                v-model="formData.FLT_NMD_IO_QTY"
              />

              <FormTextInput
                id="POP00180_TXT01011"
                :model-value="nmdDetailData.NMD_UNIT_NAME"
                disabled
              />
            </div>
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00180_LBL01016', 'caption', 'Remark')"
            label-id="POP00180_LBL01016"
            label-for="POP00180_TXT01012"
            horizontal
          >
            <FormTextareaInput
              id="POP00180_TXT01012"
              v-model="formData.FLT_NMD_IO_REMARK"
            />
          </FormGroup>

          <div class="text-end">
            <Button
              id="POP00180_BTN01001"
              rounded
              :disabled="saving"
              :loading="saving"
              @click="save"
            >
              {{ getComponentData('POP00180_BTN01001', 'caption') }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="pt-3 space-y-3">
      <p>
        {{ getGridData('POP00180_LBL01017', 'caption', 'History of In & Out') }}
      </p>

      <div class="grid grid-cols-5 border-b pb-3 items-center gap-x-3">
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('POP00180_LBL01018', 'caption')"
            label-id="POP00180_LBL01018"
            horizontal
          >
            <div class="flex items-center space-x-3">
              <FormDatePicker
                id="POP00180_DAT00001"
                v-model="inOutFilters.FLT_NMD_IO_FROM_DATE"
              />

              <FormDatePicker
                id="POP00180_DAT00002"
                v-model="inOutFilters.FLT_NMD_IO_TO_DATE"
              />
            </div>
          </FormGroup>
        </div>

        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('POP00180_LBL01019', 'caption')"
            label-id="POP00180_LBL01019"
            label-for="POP00180_CMB00004"
            horizontal
          >
            <FormCombobox
              id="POP00180_CMB00004"
              v-model="filterStockInOutType"
              :options="[
                {
                  name: 'All',
                  value: '',
                },
                ...commonData.getNmdIOTypeOptions
              ]"
            />
          </FormGroup>
        </div>

        <div>
          <Button
            id="POP00180_BTN00001"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            @click="search"
          >
            {{ getComponentData('POP00180_BTN01002', 'caption') }}
          </Button>
        </div>
      </div>

      <div
        class="flex items-center justify-between"
      >
        <p>
          {{ getGridData('POP00180_GRD01001', 'caption') }}
        </p>

        <DownloadExcel
          v-if="nmdInOutList?.length"
          id="POP00180_BTN01003"
          class="px-3 w-fit py-2 text-sm leading-4 rounded text-white isac-bg-gray hover:bg-gray-600 focus:ring-gray-400 cursor-pointer disabled:opacity-50"
          :data="excelData"
        >
          {{ getComponentData('POP00180_BTN01003', 'caption') }}
        </DownloadExcel>
      </div>

      <Table
        id="POP00180_GRD01001"
        class="overflow-x-auto"
        header-variant="secondary"
        :columns="nmdInOutTableFields"
        :items="paginatedData"
      />

      <!-- Pagination -->
      <div
        v-if="nmdInOutList?.length"
        class="flex justify-between items-center"
      >
        <p class="text-sm text-gray-700">
          Showing
          <span class="mx-1">
            {{ (currentPage - 1) * perPage + 1 }}
          </span>
          to
          <span class="mx-1">
            {{ isLastPage ? nmdInOutList?.length : currentPage * perPage }}
          </span>
          of
          <span class="mx-1">
            {{ nmdInOutList?.length }}
          </span>
          results
        </p>

        <Pagination
          :total-items="nmdInOutList?.length"
          :items-per-page="perPage"
          :current-page="currentPage"
          rounded
          active-variant="gray"
          @page-changed="currentPage = $event"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
