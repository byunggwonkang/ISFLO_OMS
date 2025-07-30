<script setup>
import moment from "moment";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";
import Editor from 'primevue/editor';

const editor = ref(null)
const emits = defineEmits(['productCreated', 'onClickChannelRow'])

const props = defineProps({
  create: {
    type: Boolean,
    default: false,
  },
  productData: {
    type: Object,
    default: () => ({
      PRODUCT_SID: '',
      PRODUCT_BRAND_CODE: '',
      PRODUCT_NAME_LOC: '',
      PRODUCT_NAME_ENG: '',
      PRODUCT_CATEGORY_CODE: '',
      PRODUCT_SUB_CATEGORY_CODE: '',
      PRODUCT_SUB_SUBCATEGORY_CODE: '',
      PRODUCT_DEFUALT_CURRENCY: '',
      PRODUCT_DEFUALT_PRICE: '',
      PRODUCT_LAUNCH_DATE: moment().format('YYYY-MM-DD'),
      PRODUCT_MANUFACUTURER_CODE: '',
      PRODUCT_DESCRIPTION: '',
      PRODUCT_OPTION_YN: 'True',
      PRODUCT_ORIGIN_CODE: '',
    }),
  }
})

const commonData = useCommonDataStore();
const saleProducts = useSaleProductsStore()
const pageLoader = usePageLoaderStore()

const { currentTab } = storeToRefs(useTabsStore())

const { userGroupBrandList, productCategoryList, productSubCategoryList, productSubSubCategoryList } = storeToRefs(saleProducts)

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '', 'OU020100', 'POP00030', 'POP00040'])
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { loading, toggleLoading } = useLoading()

const isProductCreate = ref(props.create)
const selectedBrand = ref({})
const productCategory = ref({})
const productSubCategory = ref({})
const productSubSubCategory = ref({})
const productCurrency = ref({})
const productManufacturer = ref({})
const productCountry = ref({})
const productOptions = ref([])
const formData = ref({
  ...props.productData,
})
const defaultPrice = ref(0)

watch(productCategory, async (category) => {
  await saleProducts.fetchProductCategoryList({
    categoryCode: category?.value ?? '',
    subCategoryCode: '',
  })

  productSubCategory.value = isProductCreate.value ? {
    name: productSubCategoryList.value[0]?.CATEGORY_NAME ?? '',
    value: productSubCategoryList.value[0]?.CATEGORY_CODE ?? '',
  } ?? {} : {
    name: props.productData?.PRODUCT_SUB_CATEGORY_FNAME ?? '',
    value: props.productData?.PRODUCT_SUB_CATEGORY_CODE ?? '',
  }
})

watch(productSubCategory, async (subCategory) => {
  await saleProducts.fetchProductCategoryList({
    categoryCode: productCategory.value?.value ?? '',
    subCategoryCode: subCategory?.value ?? '',
  })

  productSubSubCategory.value = isProductCreate.value ? {
    name: productSubSubCategoryList.value[0]?.CATEGORY_NAME ?? '',
    value: productSubSubCategoryList.value[0]?.CATEGORY_CODE ?? '',
  } ?? {} : {
    name: props.productData?.PRODUCT_SUB_SUBCATEGORY_FNAME ?? '',
    value: props.productData?.PRODUCT_SUB_SUBCATEGORY_CODE ?? '',
  }
})

const setDefaultValue = () => {
  productCategory.value = isProductCreate.value ? {
    name: productCategoryList.value[0]?.CATEGORY_NAME ?? '',
    value: productCategoryList.value[0]?.CATEGORY_CODE ?? '',
  } ?? {} : {
    name: props.productData?.PRODUCT_CATEGORY_FNAME ?? '',
    value: props.productData?.PRODUCT_CATEGORY_CODE ?? '',
  }

  selectedBrand.value = isProductCreate.value ? {
    name: userGroupBrandList.value[0]?.USER_BRAND_FNAME ?? '',
    value: userGroupBrandList.value[0]?.USER_BRAND_CODE ?? '',
  } ?? {} : {
    name: props.productData?.PRODUCT_BRAND_FNAME ?? '',
    value: props.productData?.PRODUCT_BRAND_CODE ?? '',
  }

  productCurrency.value = isProductCreate.value ? {
    name: commonData.getCurrencyOptions[0]?.name ?? '',
    value: commonData.getCurrencyOptions[0]?.value ?? '',
  } ?? {} : {
    name: commonData.getCurrencyOptions.find((currency) => currency.value === props.productData.PRODUCT_DEFAULT_CURRENCY)?.name ?? '',
    value: props.productData.PRODUCT_DEFAULT_CURRENCY ?? '',
  }

  productManufacturer.value = isProductCreate.value ? {
    name: commonData.getManufacturerOptions[0]?.name ?? '',
    value: commonData.getManufacturerOptions[0]?.value ?? '',
  } ?? {} : {
    name: commonData.getManufacturerOptions.find((manufacturer) => manufacturer.value === props.productData?.PRODUCT_MANUFACUTURER_CODE)?.name ?? '',
    value: props.productData?.PRODUCT_MANUFACUTURER_CODE ?? '',
  }

  productCountry.value = isProductCreate.value ? {
    name: commonData.getCountriesList[0]?.name ?? '',
    value: commonData.getCountriesList[0]?.value ?? '',
  } ?? {} : {
    name: commonData.getCountriesList.find((country) => country.value === props.productData?.PRODUCT_ORIGIN_CODE)?.name ?? '',
    value: props.productData?.PRODUCT_ORIGIN_CODE ?? '',
  }

  defaultPrice.value = isProductCreate.value ? 0 : parseInt(props.productData.PRODUCT_DEFAULT_PRICE);
}

const productChannelTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU020100_GRD01001')
})

const itemSettingTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU020100_GRD01002')
})

const categoryTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU020100_T001_GRD01001')
})

const mainImageTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU020100_T001_GRD01002')
})

const additionalImageTableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'OU020100_T001_GRD01003')
})

const fetchProductDetail = async (id) => {
  const { success, data } = await saleProducts.fetchProductDetail(id)
  if (success) {
    formData.value = {
      ...data
    }

    productOptions.value = useGroupBy(data?.PRODUCT_OPTIONS?.OPTIONS ?? [], 'PRODUCT_OPTION_TITLE')
  }
}

const savedData = async () => {
  await fetchProductDetail(props.productData.PRODUCT_SID)
}

onMounted(async () => {
  if (!isProductCreate.value) {
    await fetchProductDetail(props.productData.PRODUCT_SID)
  }
  setDefaultValue()
})

const saveProductDetails = async () => {
  formData.value = {
    ...formData.value,
    PRODUCT_DEFUALT_PRICE: defaultPrice.value.replace(',', '') ?? '',
    PRODUCT_BRAND_CODE: parseInt(selectedBrand.value?.value).toString() ?? '',
    PRODUCT_CATEGORY_CODE: productCategory.value?.value ?? '',
    PRODUCT_SUB_CATEGORY_CODE: productSubCategory.value?.value ?? '',
    PRODUCT_SUB_SUBCATEGORY_CODE: productSubSubCategory.value?.value ?? '',
    PRODUCT_DEFUALT_CURRENCY: productCurrency.value?.value ?? '',
    PRODUCT_MANUFACUTURER_CODE: productManufacturer.value?.value ?? '',
    PRODUCT_ORIGIN_CODE: productCountry.value?.value ?? '',
    PRODUCT_LAUNCH_DATE: moment(formData.value.PRODUCT_LAUNCH_DATE).format('YYYY-MM-DD'),
  }
  toggleLoading()
  const { success, data } = await saleProducts.saveProductDetail(formData.value)
  if (success) {
    formData.value.PRODUCT_SID = data.PRODUCT_SID
    await fetchProductDetail(data.PRODUCT_SID)
    isProductCreate.value = false

    emits('productCreated', {
      ...formData.value,
      PRODUCT_SID: data.PRODUCT_SID,
    })
  }
  toggleLoading()
}

const openOptionSettingModal = ref(false)
const openItemSettingModal = ref(false)

</script>

<template>
  <AppContent>
    <div class="grid grid-cols-5 gap-x-6">
      <div class="space-y-3">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-2 py-1.5 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-2 space-y-1"
        >
          <template #header>
            <p class="leading-6 font-medium text-sm text-gray-900">
              {{ getComponentData('OU020100_LBL01015', 'caption','Prod. Information') }}
            </p>
          </template>

          <FormGroup
            :label="getComponentData('OU020100_LBL01001', 'caption','System SID')"
            horizontal
            label-id="OU020100_LBL01001"
            label-for="OU020100_TXT01001"
          >
            <FormTextInput
              id="OU020100_TXT01001"
              v-model="formData.PRODUCT_SID"
              disabled
              :placeholder="getComponentData('OU020100_TXT01001', 'placeholder')"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU020100_LBL01001', 'caption','Status')"
            horizontal
            label-id="OU020100_LBL01001"
            label-for="OU020100_TXT01001"
          >
            <FormTextInput
              id="OU020100_TXT01001"
              v-model="formData.PRODUCT_SID"
              disabled
              :placeholder="getComponentData('OU020100_TXT01001', 'placeholder')"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU020100_LBL01001', 'caption','Manage Code')"
            horizontal
            label-id="OU020100_LBL01001"
            label-for="OU020100_TXT01001"
          >
            <FormTextInput
              id="OU020100_TXT01001"
              v-model="formData.PRODUCT_SID"
              :placeholder="getComponentData('OU020100_TXT01001', 'placeholder')"
            />
          </FormGroup>
        </Card>

        <Card
          divider
          shadow-size="none"
          card-header-class="px-2 py-1.5 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-2 space-y-1"
        >
          <template #header>
            <p class="leading-6 font-medium text-sm text-gray-900">
              {{ getComponentData('OU020100_LBL01016', 'caption','General Information') }}
            </p>
          </template>

          <FormGroup
            :label="getComponentData('OU020100_LBL01002', 'caption','Brand')"
            horizontal
            label-id="OU020100_LBL01002"
            label-for="OU020100_CMB01001"
          >
            <FormSelect
              id="OU020100_CMB01001"
              v-model="selectedBrand"
              :disabled="!isProductCreate"
              :placeholder="getComponentData('OU020100_CMB01001', 'placeholder')"
              :options="userGroupBrandList.map((brand) => ({
                name: brand.USER_BRAND_FNAME,
                value: parseInt(brand.USER_BRAND_CODE).toString(),
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('OU020100_LBL01003', 'caption','Prod. Name(Loc)')"
            horizontal
            label-id="OU020100_LBL01003"
            label-for="OU020100_TXT01002"
          >
            <FormTextInput
              id="OU020100_TXT01002"
              v-model="formData.PRODUCT_NAME_LOC"
              :placeholder="getComponentData('OU020100_TXT01002', 'caption')"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('OU020100_LBL01004', 'caption','Prod. Name(Eng)')"
            horizontal
            label-id="OU020100_LBL01004"
            label-for="OU020100_TXT01003"
          >
            <FormTextInput
              id="OU020100_TXT01003"
              v-model="formData.PRODUCT_NAME_ENG"
              :placeholder="getComponentData('OU020100_TXT01003', 'caption')"
            />
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01008', 'caption','Default Currency')"
            label-id="OU020100_LBL01008"
            label-for="OU020100_CMB01005"
          >
            <FormCombobox
              id="OU020100_CMB01005"
              v-model="productCurrency"
              :options="commonData.getCurrencyOptions"
              :placeholder="getComponentData('OU020100_CMB01005', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01009', 'caption','Default Price')"
            label-id="OU020100_LBL01009"
            label-for="OU020100_TXT01004"
          >
            <FormTextInput
              id="OU020100_TXT01004"
              v-model="defaultPrice"
              mask="#,###,###,###"
              data-maska-reversed
            />
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01009', 'caption','Supply Price')"
            label-id="OU020100_LBL01009"
            label-for="OU020100_TXT01004"
          >
            <FormTextInput
              id="OU020100_TXT01004"
              v-model="defaultPrice"
              mask="#,###,###,###"
              data-maska-reversed
            />
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01009', 'caption','Retail Price')"
            label-id="OU020100_LBL01009"
            label-for="OU020100_TXT01004"
          >
            <FormTextInput
              id="OU020100_TXT01004"
              v-model="defaultPrice"
              mask="#,###,###,###"
              data-maska-reversed
            />
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01009', 'caption','Season')"
            label-id="OU020100_LBL01009"
            label-for="OU020100_TXT01004"
          >
            <div class="flex items-center sm:flex-col lg:flex-row sm:space-y-3 sm:space-x-0 lg:space-x-3 lg:space-y-0 w-full">
              <FormDatePicker
                id="OU020100_DAT00001"
                :placeholder="getComponentData('OU020100_DAT00001', 'placeholder')"
              />
              <FormCombobox
                id="OU020100_CMB01005"
                v-model="productCurrency"
                :options="commonData.getCurrencyOptions"
                :placeholder="getComponentData('OU020100_CMB01005', 'placeholder')"
              />
            </div>
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01011', 'caption','Manufacturer')"
            label-id="OU020100_LBL01011"
            label-for="OU020100_CMB01007"
          >
            <FormCombobox
              id="OU020100_CMB01007"
              v-model="productManufacturer"
              :options="commonData.getManufacturerOptions"
              :placeholder="getComponentData('OU020100_CMB01007', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01012', 'caption','Country of origin')"
            label-id="OU020100_LBL01012"
            label-for="OU020100_CMB01008"
          >
            <FormCombobox
              id="OU020100_CMB01008"
              v-model="productCountry"
              :options="commonData.getCountriesList"
              :placeholder="getComponentData('OU020100_CMB01008', 'placeholder')"
            />
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01011', 'caption','Importer')"
            label-id="OU020100_LBL01011"
            label-for="OU020100_CMB01007"
          >
            <FormCombobox
              id="OU020100_CMB01007"
              v-model="productManufacturer"
              :options="commonData.getManufacturerOptions"
              :placeholder="getComponentData('OU020100_CMB01007', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01012', 'caption','Gender')"
            label-id="OU020100_LBL01012"
            label-for="OU020100_CMB01008"
          >
            <FormCombobox
              id="OU020100_CMB01008"
              v-model="productCountry"
              :options="commonData.getCountriesList"
              :placeholder="getComponentData('OU020100_CMB01008', 'placeholder')"
            />
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01010', 'caption','Launch Date')"
            label-id="OU020100_LBL01010"
            label-for="OU020100_DAT01001"
          >
            <FormDatePicker
              id="OU020100_DAT01001"
              v-model="formData.PRODUCT_LAUNCH_DATE"
              :placeholder="getComponentData('OU020100_DAT01001', 'placeholder')"
            />
          </FormGroup>
        </Card>     
      </div>   
      <div class="space-y-3">      
        <Card
          divider
          shadow-size="none"
          card-header-class="px-2 py-1.5 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-2 space-y-1"
        >
          <template #header>
            <p class="leading-6 font-medium text-sm text-gray-900">
              {{ getComponentData('OU020100_LBL01016', 'caption','More Information') }}
            </p>
          </template>

          <FormGroup
            class="py-2"
            :label="getComponentData('OU020100_LBL01002', 'caption','Sale Period')"
            horizontal
            label-id="OU020100_LBL01002"
            label-for="OU020100_CMB01001"
          >
            <FormCheckbox
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('OU020100_LBL01003', 'caption','Sale Start Date')"
            horizontal
            label-id="OU020100_LBL01003"
            label-for="OU020100_TXT01002"
          >
            <FormDatePicker
              id="OU020100_DAT01001"
              v-model="formData.PRODUCT_LAUNCH_DATE"
              :placeholder="getComponentData('OU020100_DAT01001', 'placeholder')"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('OU020100_LBL01004', 'caption','Sale End Date')"
            horizontal
            label-id="OU020100_LBL01004"
            label-for="OU020100_TXT01003"
          >
            <FormDatePicker
              id="OU020100_DAT01001"
              v-model="formData.PRODUCT_LAUNCH_DATE"
              :placeholder="getComponentData('OU020100_DAT01001', 'placeholder')"
            />
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01008', 'caption','Min Qty/Order')"
            label-id="OU020100_LBL01008"
            label-for="OU020100_CMB01005"
          >
            <FormTextInput
              id="OU020100_TXT01004"
              v-model="defaultPrice"
              mask="#,###,###,###"
              data-maska-reversed
            />
          </FormGroup>

          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01009', 'caption','Max Qty/Order')"
            label-id="OU020100_LBL01009"
            label-for="OU020100_TXT01004"
          >
            <FormTextInput
              id="OU020100_TXT01004"
              v-model="defaultPrice"
              mask="#,###,###,###"
              data-maska-reversed
            />
          </FormGroup>
          <FormGroup
            horizontal
            :label="getComponentData('OU020100_LBL01009', 'caption','Max Qty/Day')"
            label-id="OU020100_LBL01009"
            label-for="OU020100_TXT01004"
          >
            <FormTextInput
              id="OU020100_TXT01004"
              v-model="defaultPrice"
              mask="#,###,###,###"
              data-maska-reversed
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU020100_LBL01003', 'caption','Material')"
            horizontal
            label-id="OU020100_LBL01003"
            label-for="OU020100_TXT01002"
          >
            <FormTextInput
              id="OU020100_TXT01002"
              v-model="formData.PRODUCT_NAME_LOC"
              :placeholder="getComponentData('OU020100_TXT01002', 'caption')"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU020100_LBL01003', 'caption','Keyword')"
            horizontal
            label-id="OU020100_LBL01003"
            label-for="OU020100_TXT01002"
          >
            <FormTextInput
              id="OU020100_TXT01002"
              v-model="formData.PRODUCT_NAME_LOC"
              :placeholder="getComponentData('OU020100_TXT01002', 'caption')"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU020100_LBL01003', 'caption','A/S Tel')"
            horizontal
            label-id="OU020100_LBL01003"
            label-for="OU020100_TXT01002"
          >
            <FormTextInput
              id="OU020100_TXT01002"
              v-model="formData.PRODUCT_NAME_LOC"
              :placeholder="getComponentData('OU020100_TXT01002', 'caption')"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU020100_LBL01010', 'caption','A/S Guide Content')"
            horizontal
            label-id="OU020100_T001_LBL01010"
            label-for="OU020100_T001_TXT01010"
          >
            <FormTextareaInput
              id="OU020100_T001_TXT01010"
              :mask="getComponentData('OU020100_T001_TXT01010', 'editMask')"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU020100_LBL01010', 'caption','Quality Assurance Standards')"
            horizontal
            label-id="OU020100_T001_LBL01010"
            label-for="OU020100_T001_TXT01010"
          >
            <FormTextareaInput
              id="OU020100_T001_TXT01010"
              :mask="getComponentData('OU020100_T001_TXT01010', 'editMask')"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU020100_LBL01010', 'caption','Caution When Handling')"
            horizontal
            label-id="OU020100_T001_LBL01010"
            label-for="OU020100_T001_TXT01010"
          >
            <FormTextareaInput
              id="OU020100_T001_TXT01010"
              :mask="getComponentData('OU020100_T001_TXT01010', 'editMask')"
            />
          </FormGroup>
        </Card>        
      
      </div>

      <div class="col-span-3">
        <div class="grid grid-cols-2 gap-x-6">
          <div class="space-y-3">
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-2 space-y-6"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('OU020100_LBL01019', 'caption','Items Information') }}
                </p>
              </template>

              <FormGroup
                horizontal
                :label="getComponentData('OU020100_LBL01014', 'caption','option')"
                label-id="OU020100_LBL01014"
              >
                <div class="flex space-x-6">
                  <FormRadio
                    id="OU020100_RAD01001"
                    v-model="formData.PRODUCT_OPTION_YN"
                    :label="getComponentData('OU020100_RDO01001', 'caption')"
                    :value="'True'"
                  />
                  <FormRadio
                    id="OU020100_RAD01002"
                    v-model="formData.PRODUCT_OPTION_YN"
                    :label="getComponentData('OU020100_RDO01002', 'caption')"
                    :value="'False'"
                  />
                </div>
              </FormGroup>

              <!-- Option Setting -->
              <div
                v-if="formData.PRODUCT_OPTION_YN === 'True'"
                class="space-y-3"
              >
                <div class="flex justify-end">
                  <Button
                    id="OU020100_BTN01003"
                    class="w-40"
                    rounded
                    variant="gray"
                    @click="openOptionSettingModal = true"
                  >
                    {{ getComponentData('OU020100_TRE01003', 'caption') }}
                  </Button>
                </div>
                <div
                  v-if="Object.keys(productOptions).length"
                  class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg p-1"
                >
                  <ul class="space-y-2">
                    <li
                      v-for="(option, optionIndex) in productOptions"
                      :key="optionIndex"
                      class="mb-3 mr-5 space-y-1 pt-1"
                    >
                      <span class="pr-2 space-x-1 flex items-center">
                        <ChevronRightIcon class="w-5 h-5" />
                        <span class="text-xs">
                          {{ optionIndex }}
                        </span>
                      </span>

                      <ul class="space-y-2 border-l-2 border-gray-200 ml-2">
                        <li
                          v-for="(item, itemIndex) in option"
                          :key="itemIndex"
                          class="shadow ring-1 ring-black ring-opacity-10 rounded pl-1 pr-5 pt-1 pb-2 space-y-1 ml-3 relative"
                        >
                          <div class="border-b-2 border-gray-200 w-3 absolute top-4 -left-3" />
                          <span class="pr-2 space-x-1 flex items-center">
                            <ChevronRightIcon class="w-5 h-5" />
                            <span class="text-xs">
                              {{ item.PRODUCT_OPTION_01 }}
                            </span>
                          </span>
                          <div class="border-b-2 border-gray-200 w-3 absolute top-11 left-3" />
                          <ul class="border-l-2 border-gray-200 ml-2">
                            <li class="shadow ring-1 ring-black ring-opacity-10 rounded p-1 ml-3">
                              <span class="text-xs px-2">SKU - {{ item.PRODUCT_OPTION_SKU }}</span>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <Modal
                  :show="openOptionSettingModal"
                  divider
                  size="2xl"
                  @close="openOptionSettingModal = false"
                >
                  <template #header>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      {{ getComponentData('POP00030_LBL01001', 'caption', 'Option Setting') }}
                    </h3>
                  </template>

                  <template #body>
                    <component
                      :is="`POP00030`"
                      :product-data="formData"
                      @saved="savedData"
                    />
                  </template>
                </Modal>
              </div>

              <!-- Item Setting -->
              <div
                v-if="formData.PRODUCT_OPTION_YN === 'False'"
                class="space-y-3"
              >
                <div class="flex justify-end">
                  <Button
                    id="OU020100_BTN01003"
                    class="w-40"
                    rounded
                    variant="gray"
                    @click="openItemSettingModal = true"
                  >
                    {{ getComponentData('OU020100_TRE01004', 'caption') }}
                  </Button>
                </div>

                <Modal
                  :show="openItemSettingModal"
                  divider
                  size="2xl"
                  @close="openItemSettingModal = false"
                >
                  <template #header>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                      {{ getComponentData('POP00040_LBL01001', 'caption', 'Items Setting') }}
                    </h3>
                  </template>

                  <template #body>
                    <component
                      :is="`POP00040`"
                      :product-data="formData"
                      @saved="savedData"
                    />
                  </template>
                </Modal>

                <Table
                  id="OU020100_GRD01002"
                  header-variant="secondary"
                  :columns="itemSettingTableFields"
                  :items="formData?.PRODUCT_OPTIONS?.NON_OPTIONS ?? []"
                  clickable
                />
              </div>
            </Card>
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-2 space-y-6"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getComponentData('OU020100_LBL01019', 'caption','Product Content') }}
                </p>
              </template>
              <Editor
                id="OU020100_T001_TXT01011"
                ref="editor"
                editor-style="height: 220px"
              />
              
            </Card>
            
          </div>

          <div class="space-y-3">
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-0"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <p
                    id="OU020100_T001_GRD01001"
                    class="leading-6 font-medium text-sm text-gray-900"
                  >
                    {{ getGridData('OU020100_GRD01001', 'caption','Category Information') }}
                  </p>

                  <Button
                    size="xs"
                    variant="gray"
                    rounded
                    class="w-6 h-6"
                    @click="openCategoryModal = true"
                  >
                    +
                  </Button>
                </div>
              </template>

              <Table
                id="OU020100_T001_GRD01001"
                header-variant="secondary"
                condensed
                :columns="categoryTableFields"
                :items="formData.CHANNEL_CATEGORY"
              />
            </Card>
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-0"
            >
              <template #header>
                <p class="leading-6 font-medium text-sm text-gray-900">
                  {{ getGridData('OU020100_GRD01001', 'caption') }}
                </p>
              </template>

              <Table
                id="OU020100_GRD01001"
                header-variant="secondary"
                :columns="productChannelTableFields"
                :items="formData?.PRODUCT_CHANNEL || []"
                clickable
                @on-row-click="$emit('onClickChannelRow', {
                  ...$event,
                  BRAND_CODE: selectedBrand.value ?? '',
                  BRAND_NAME: selectedBrand.name ?? '',
                  PRODUCT_SID: formData.PRODUCT_SID ?? '',
                })"
              >
                <template #cell(PRODUCT_CHANNEL_SETTING)="{ value }">
                  <div>
                    <StatusDot :active="value === 'True' || value === '1' || value === true || value === 1" />
                  </div>
                </template>
              </Table>
            </Card>
            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-0"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <p class="leading-6 font-medium text-sm text-gray-900">
                    {{ getGridData('OU020100_GRD01002', 'caption','Main Image') }}
                  </p>
                  <Button
                    size="xs"
                    variant="gray"
                    rounded
                    class="w-6 h-6"
                    @click="openMainImageUploadModal = true"
                  >
                    +
                  </Button>
                </div>
              </template>

              <Table
                id="OU020100_T001_GRD01002"
                header-variant="secondary"
                condensed
                :columns="[
                  ...mainImageTableFields,
                  {
                    caption: '',
                    dataFieldName: 'ACTION',
                    display: 'Y'
                  }
                ]"
                class="overflow-x-auto"
                :items="getMainImageData"
              >
                <template #cell(IMAGE_NAME)="{ value }">
                  <div class="w-44 cursor-pointer">
                    <p class="text-ellipsis truncate">
                      {{ value }}
                    </p>
                  </div>
                </template>

                <template #cell(IMAGE_URL)="{ value }">
                  <div
                    v-tooltip="{
                      content: `<img src='${value}' class='w-auto h-44' />`,
                      placement: 'top',
                      trigger: 'hover',
                      html: true
                    }"
                    class="w-44 cursor-pointer"
                  >
                    <p class="text-ellipsis truncate">
                      {{ value }}
                    </p>
                  </div>
                </template>

                <template #cell(ACTION)="{ item }">
                  <div class="text-end">
                    <Button
                      size="xs"
                      variant="danger"
                      rounded
                      class="w-6 h-6"
                      @click="removeImage(item, 'MAIN_IMAGE')"
                    >
                      x
                    </Button>
                  </div>
                </template>
              </Table>
            </Card>

            <Card
              divider
              shadow-size="none"
              card-header-class="px-2 py-1.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
              card-body-class="p-0"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <p class="leading-6 font-medium text-sm text-gray-900">
                    {{ getGridData('OU020100_GRD01003', 'caption','Additional Image') }}
                  </p>
                  <Button
                    size="xs"
                    variant="gray"
                    rounded
                    class="w-6 h-6"
                    @click="openAdditionalImageUploadModal = true"
                  >
                    +
                  </Button>
                </div>
              </template>

              <Table
                id="OU020100_T001_GRD01003"
                header-variant="secondary"
                condensed
                :columns="[
                  ...additionalImageTableFields,
                  {
                    caption: '',
                    dataFieldName: 'ACTION',
                    display: 'Y'
                  }
                ]"
                class="overflow-x-auto"
                :items="formData.ADDITIONAL_IMAGES"
              >
                <template #cell(IMAGE_NAME)="{ value }">
                  <div class="w-44 cursor-pointer">
                    <p class="text-ellipsis truncate">
                      {{ value }}
                    </p>
                  </div>
                </template>

                <template #cell(IMAGE_URL)="{ value }">
                  <div
                    v-tooltip="{
                      content: `<img src='${value}' class='w-auto h-44' />`,
                      placement: 'top',
                      trigger: 'hover',
                      html: true
                    }"
                    class="w-44 cursor-pointer"
                  >
                    <p class="text-ellipsis truncate">
                      {{ value }}
                    </p>
                  </div>
                </template>

                <template #cell(ACTION)="{ item }">
                  <div class="text-end">
                    <Button
                      size="xs"
                      variant="danger"
                      rounded
                      class="w-6 h-6"
                      @click="removeImage(item, 'ADDITIONAL_IMAGES')"
                    >
                      x
                    </Button>
                  </div>
                </template>
              </Table>
            </Card>
          </div>
        </div>
      </div>
      
      
    </div>
  </AppContent>
</template>

<style>
/*
.p-editor-container {
  transform: scale(0.7);
  transform-origin: top left;
  width: 142.857%;      
  margin-bottom: -12px;     
  height: 142.857%; 
}
*/

/*ql-formats
.ql-header {
  transform: scale(0.85);              
}
.ql-font {
  transform: scale(0.85);              
}
*/

.ql-toolbar .ql-link,
.ql-toolbar .ql-code-block,
.ql-toolbar .ql-clean,
.ql-toolbar .ql-header,
.ql-toolbar .ql-font {
  display: none !important;
}

.p-editor-content .ql-editor {
  font-size: 13px;       /* 글자 크기 조절 */
  padding: 6px 8px;      /* 위아래, 좌우 여백 조정 */
  line-height: 1.4;      /* 줄 간격도 필요시 조정 */
}

/*.ql-color {
  display: none !important;
}
.ql-background {
  display: none !important;
}
.p-editor-toolbar {
  font-size: 10px !important;
}
.ql-toolbar {
  font-size: 10px !important;
}
.ql-snow {
  font-size: 10px !important;
}
.ql-picker {
  font-size: 10px !important;
}
.ql-formats {
  font-size: 10px !important;
}*/
</style>