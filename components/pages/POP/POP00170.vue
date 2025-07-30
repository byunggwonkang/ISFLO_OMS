<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const { getComponentData } = usePageLoaderComponent(['POP00170'])
const { getGridData } = usePageLoaderGrid(['POP00170'])

const pageLoader = usePageLoaderStore()
const nonMerchandisingItems = useNonMerchandisingItemsStore();
const commonData = useCommonDataStore()

const props = defineProps({
  isCreate:{
    type: Boolean,
    default: true,
  },
  nmdDetailData: {
    type: Object,
    required: true,
    default: () => ({
      NMD_CODE: encrypt(''),
      NMD_STOCK_YN: encrypt('0'),
    })
  },
})

const { userGroupBrandList } = storeToRefs(nonMerchandisingItems);

const brand = ref({});
const prodType = ref({});
const stockType = ref({});
const status = ref({});

const emits = defineEmits(['nmdDetailSaved'])

const formData = ref({
  FLT_NMD_BRAND_CODE: '',
  FLT_NMD_CODE: '',
  FLT_NMD_ALU: '',
  FLT_NMD_EAN: '',
  FLT_NMD_SNAME: '',
  FLT_NMD_FNAME: '',
  FLT_NMD_STATUS_CODE: '',
  FLT_NMD_PRODUCT_TYPE: '',
  FLT_NMD_GROSS_WEIGHT: '',
  FLT_NMD_NET_WEIGHT: '',
  FLT_NMD_WEIGHT_UNIT: '',
  FLT_NMD_UNIT_NAME: '',
  FLT_NMD_SIZE_CODE: '',
  FLT_NMD_SIZE_NAME: '',
  FLT_NMD_COLOR_CODE: '',
  FLT_NMD_COLOR_NAME: '',
  FLT_NMD_SEASON_YEAR: '',
  FLT_NMD_SEASON_TYPE: '',
  FLT_NMD_SEASON_DATE: '',
  FLT_NMD_STOCK_YN: '',
  FLT_NMD_DESCR_1: '',
  FLT_NMD_DESCR_2: '',
  FLT_NMD_DESCR_3: '',
  FLT_NMD_DESCR_4: '',
  FLT_NMD_DESCR_5: '',
  FLT_NMD_DESCR_6: '',
  FLT_NMD_DESCR_7: '',
  FLT_NMD_DESCR_8: '',
  FLT_NMD_DESCR_9: '',
})

const setDefaultValue = () => {
  const stockTypeValue = decrypt(props.nmdDetailData?.NMD_STOCK_YN) === '1' ? '0010' : '0020';

  Object.entries(props.nmdDetailData).forEach(([key, value]) => {
    if (value != null && key != 'QUANTITIES')
      formData.value[`FLT_${key}`] = decrypt(value)    
  });

  const selectedBrand = props.isCreate ? userGroupBrandList.value[0] : userGroupBrandList.value.find((item) => item.USER_BRAND_CODE === props.nmdDetailData.NMD_BRAND_CODE);
  const selectedProdType = props.isCreate ? commonData.getNmdProductTypeOptions[0] : commonData.getNmdProductTypeOptions.find((item) => item.value === decrypt(props.nmdDetailData.NMD_PRODUCT_TYPE));
  const selectedStockType = props.isCreate ? commonData.getNmdStockTypeOptions[0] : commonData.getNmdStockTypeOptions.find((item) => item.value === stockTypeValue);
  const selectedStatus = props.isCreate ? commonData.getNmdStatusOptions[0] : commonData.getNmdStatusOptions.find((item) => item.value === decrypt(props.nmdDetailData.NMD_STATUS_CODE));

  brand.value = {
    name: decrypt(selectedBrand?.USER_BRAND_FNAME),
    value: parseInt(decrypt(selectedBrand?.USER_BRAND_CODE)).toString(),
  };

  prodType.value = selectedProdType;
  stockType.value = selectedStockType;
  status.value = selectedStatus;
};

onMounted(async () => {
  isloading.isLoading = true
  await commonData.fetchPOP00170CommonData();
  

  if (!props.isCreate) {
    setDefaultValue();
    await nonMerchandisingItems.fetchWarehouseList(
      props.nmdDetailData.NMD_BRAND_CODE
    );
  }
  isloading.isLoading = false
});

watch(() => stockType.value, () => {
  if (stockType.value?.value === '0010') {
    formData.value.FLT_NMD_STOCK_YN = '1';
  } else {
    formData.value.FLT_NMD_STOCK_YN = '0';
  }
}, {
  immediate: true,
  deep: true,
})

const showStockQuantitySection = computed(() => {
  return formData.value?.FLT_NMD_STOCK_YN === '1';
})

const isInsert = computed(() => {
  return decrypt(props.nmdDetailData.NMD_CODE) === '';
})

const disableOnUpdate = computed(() => {
  return props.nmdDetailData.NMD_CODE;
})

const listOfStockTableFields = computed(() => {
  return pageLoader.getTableData('POP00170', 'POP00170_GRD01001');
})

const saving = ref(false);

const save = async () => {
  formData.value.FLT_NMD_BRAND_CODE = brand.value?.value;
  formData.value.FLT_NMD_PRODUCT_TYPE = prodType.value?.value;
  formData.value.FLT_NMD_STOCK_TYPE = stockType.value?.value;
  formData.value.FLT_NMD_STATUS_CODE = status.value?.value;

  saving.value = true;
  isloading.isLoading = true
  const { success } = await nonMerchandisingItems.saveNonMerchandisingItemDetails(formData.value);
  if (success) {
    emits('nmdDetailSaved')
  }
  isloading.isLoading = false
  saving.value = false;
};

const openNmdStockInOutModal = ref(false);
</script>

<template>
  <div
    :class="{
      'divide-y space-y-6': showStockQuantitySection,
      'space-y-3' : !showStockQuantitySection
    }"
  >
    <div>
      <p class="mb-3">
        {{ getComponentData('POP00170_LBL01002', 'caption', 'Detail Information') }}
      </p>

      <div class="grid grid-cols-2 gap-x-3">
        <div class="space-y-3">
          <FormGroup
            :label="getComponentData('POP00170_LBL01003', 'caption', 'Brand')"
            label-id="POP00170_LBL01003"
            label-for="POP00170_CMB00001"
            horizontal
          >
            <FormSelect
              id="POP00170_CMB00001"
              v-model="brand"
              :disabled="disableOnUpdate"
              :options="userGroupBrandList.map((brand) => ({
                name: decrypt(brand.USER_BRAND_FNAME),
                value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01004', 'caption', 'Product Type')"
            label-id="POP00170_LBL01004"
            label-for="POP00170_CMB00002"
            horizontal
          >
            <FormSelect
              id="POP00170_CMB00002"
              v-model="prodType"
              :disabled="disableOnUpdate"
              :options="commonData.getNmdProductTypeOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01021', 'caption', 'Stock Type')"
            label-id="POP00170_LBL01021"
            label-for="POP00170_CMB00004"
            horizontal
          >
            <FormSelect
              id="POP00170_CMB00004"
              v-model="stockType"
              :options="commonData.getNmdStockTypeOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01005', 'caption', 'NMD Code')"
            label-id="POP00170_LBL01005"
            label-for="POP00170_TXT01001"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01001"
              v-model="formData.FLT_NMD_CODE"
              :disabled="disableOnUpdate"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01006', 'caption', 'ALU')"
            label-id="POP00170_LBL01006"
            label-for="POP00170_TXT01002"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01002"
              v-model="formData.FLT_NMD_ALU"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01007', 'caption', 'EAN')"
            label-id="POP00170_LBL01007"
            label-for="POP00170_TXT01003"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01003"
              v-model="formData.FLT_NMD_EAN"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01008', 'caption', 'Short Name')"
            label-id="POP00170_LBL01008"
            label-for="POP00170_TXT01004"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01004"
              v-model="formData.FLT_NMD_SNAME"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01009', 'caption', 'Full Name')"
            label-id="POP00170_LBL01009"
            label-for="POP00170_TXT01005"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01005"
              v-model="formData.FLT_NMD_FNAME"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01010', 'caption', 'Status')"
            label-id="POP00170_LBL01010"
            label-for="POP00170_CMB00003"
            horizontal
          >
            <FormSelect
              id="POP00170_CMB00003"
              v-model="status"
              :options="commonData.getNmdStatusOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01011', 'caption', 'Unit')"
            label-id="POP00170_LBL01011"
            label-for="POP00170_TXT01006"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01006"
              v-model="formData.FLT_NMD_UNIT_NAME"
            />
          </FormGroup>
        </div>
        <div class="space-y-3">
          <FormGroup
            :label="getComponentData('POP00170_LBL01012', 'caption', 'Size')"
            label-id="POP00170_LBL01012"
            horizontal
          >
            <div class="flex items-center space-x-6">
              <FormTextInput
                id="POP00170_TXT01007"
                v-model="formData.FLT_NMD_SIZE_CODE"
              />

              <FormTextInput
                id="POP00170_TXT01008"
                v-model="formData.FLT_NMD_SIZE_NAME"
              />
            </div>
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01013', 'caption', 'Color')"
            label-id="POP00170_LBL01013"
            horizontal
          >
            <div class="flex items-center space-x-6">
              <FormTextInput
                id="POP00170_TXT01009"
                v-model="formData.FLT_NMD_COLOR_CODE"
              />

              <FormTextInput
                id="POP00170_TXT01010"
                v-model="formData.FLT_NMD_COLOR_NAME"
              />
            </div>
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01014', 'caption', 'Gross Weight')"
            label-id="POP00170_LBL01014"
            horizontal
          >
            <div class="flex items-center space-x-6">
              <FormTextInput
                id="POP00170_TXT01011"
                v-model="formData.FLT_NMD_GROSS_WEIGHT"
              />

              <FormTextInput
                id="POP00170_TXT01012"
                v-model="formData.FLT_NMD_WEIGHT_UNIT"
              />
            </div>
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01015', 'caption', 'Net Weight')"
            label-id="POP00170_LBL01015"
            horizontal
          >
            <div class="flex items-center space-x-6">
              <FormTextInput
                id="POP00170_TXT01013"
                v-model="formData.FLT_NMD_NET_WEIGHT"
              />

              <FormTextInput
                id="POP00170_TXT01014"
                v-model="formData.FLT_NMD_WEIGHT_UNIT"
              />
            </div>
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01016', 'caption', 'Season')"
            label-id="POP00170_LBL01016"
            horizontal
          >
            <div class="flex items-center space-x-6">
              <FormTextInput
                id="POP00170_TXT01015"
                v-model="formData.FLT_NMD_SEASON_YEAR"
              />

              <FormTextInput
                id="POP00170_TXT01016"
                v-model="formData.FLT_NMD_SEASON_TYPE"
              />
            </div>
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01017', 'caption', 'Description')"
            label-id="POP00170_LBL01017"
            label-for="POP00170_TXT01017"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01017"
              v-model="formData.FLT_NMD_DESCR_1"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01018', 'caption', 'Description')"
            label-id="POP00170_LBL01018"
            label-for="POP00170_TXT01018"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01018"
              v-model="formData.FLT_NMD_DESCR_2"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01019', 'caption', 'Description')"
            label-id="POP00170_LBL01019"
            label-for="POP00170_TXT01019"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01019"
              v-model="formData.FLT_NMD_DESCR_3"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01020', 'caption', 'Description')"
            label-id="POP00170_LBL01020"
            label-for="POP00170_TXT01020"
            horizontal
          >
            <FormTextInput
              id="POP00170_TXT01020"
              v-model="formData.FLT_NMD_DESCR_4"
            />
          </FormGroup>

          <div class="text-end">
            <Button
              id="POP00170_BTN01001"
              rounded
              class="w-30"
              :disabled="saving"
              :loading="saving"
              @click="save"
            >
              {{ getComponentData('POP00170_BTN01001', 'caption', 'Save') }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showStockQuantitySection && !props.isCreate"
      class="pt-3"
    >
      <div class="grid grid-cols-2 gap-x-3">
        <div class="space-y-3">
          <p>
            {{ getComponentData('POP00170_LBL01022', 'caption', 'Stock Quantity') }}
          </p>

          <FormGroup
            :label="getComponentData('POP00170_LBL01023', 'caption', 'Available Total Quantity')"
            label-id="POP00170_LBL01023"
            label-for="POP00170_TXT01021"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="POP00170_TXT01021"
              disabled
              :model-value="nmdDetailData?.NMD_AVAILABLE_QTY"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('POP00170_LBL01024', 'caption', 'Unavailable Total Quantity')"
            label-id="POP00170_LBL01024"
            label-for="POP00170_TXT01022"
            horizontal
            label-width="w-2/4"
          >
            <FormTextInput
              id="POP00170_TXT01022"
              disabled
              :model-value="nmdDetailData?.NMD_UNAVAILABLE_QTY"
            />
          </FormGroup>

          <div class="text-end">
            <Button
              id="POP00170_BTN01002"
              rounded
              class="w-30"
              @click="openNmdStockInOutModal = true"
            >
              {{ getComponentData('POP00170_BTN01002', 'caption') }}
            </Button>
          </div>
        </div>
        <div class="space-y-3">
          <p>
            {{ getGridData('POP00170_GRD01001', 'caption') }}
          </p>

          <Table
            id="POP00170_GRD01001"
            class="overflow-x-auto"
            header-variant="secondary"
            condensed
            :columns="listOfStockTableFields"
            :items="nmdDetailData?.QUANTITIES ?? []"
          />
        </div>
      </div>

      <!--NMD Stock In Out Modal-->
      <Modal
        :show="openNmdStockInOutModal"
        divider
        size="4xl"
        @close="() => {
          openNmdStockInOutModal = false
          nonMerchandisingItems.resetInOutFilters()
        }"
      >
        <template #header>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            {{ getComponentData('POP00180_LBL01001', 'caption', 'None-merchandising  stock in & out') }}
          </h3>
        </template>

        <template #body>
          <component
            :is="'POP00180'"
            :nmd-detail-data="nmdDetailData"
            @ndm-in-out-detail-saved="openNmdStockInOutModal = false"
          />
        </template>
      </Modal>
    </div>
  </div>
</template>

<style scoped>

</style>
