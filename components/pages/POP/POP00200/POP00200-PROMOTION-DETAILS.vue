<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
import {ChevronRightIcon} from "@heroicons/vue/20/solid/index.js";

const { getComponentData } = usePageLoaderComponent(['POP00200'])
const promotionManagement = usePromotionManagementStore()
const { brandList, filters } = storeToRefs(promotionManagement)

const props = defineProps({
  create: {
    type: Boolean,
    default: false,
  },
  promotionItemData: {
    type: Object,
    default: () => ({}),
  },
})

const pageLoader = usePageLoaderStore()

const formData = ref({
  FLT_PROM_SID: '',
  FLT_PROM_TITLE: '',
  FLT_PROM_DESCRIPTION: '',
  FLT_PROM_BRAND_CODE: '',
  FLT_PROM_STATUS_CODE: '0010',
  FLT_PROM_START_DATE: '',
  FLT_PROM_END_DATE: '',
  FLT_PROM_TEXT_NOTICE: '',
  FLT_PROM_REMARK: '',
  FLT_PROM_CONDITION_AMT_YN: '0',
  FLT_PROM_CONDITION_AMT_VALUE: '',
  FLT_PROM_CONDITION_PROD_YN: '1',
  FLT_PROM_CONDITION_ITEM_YN: '0',
  FLT_PROM_CONDITION_PROD_LIST: [],
  FLT_PROM_CONDITION_ITEM_LIST: [],
  FLT_PRODUCT_CHANNEL: [],
  FLT_PROM_ITEM_LIST: [],
})

const brand = ref({})
const channel = ref([])
const conditionAmtYn = ref(false)

watch(brand, async (newValue) => {
  filters.value.FLT_PROM_BRAND_CODE = newValue?.value ?? ''
  channel.value = [];
  await promotionManagement.fetchChannelList()
});

const fixedTypes = [
  {
    name: 'Products',
    value: 'PRODUCTS',
  },
  {
    name: 'Items',
    value: 'ITEMS',
  },
]

const selectFixedType = ref(fixedTypes[0])

const setDefaultValue = async () => {
  Object.entries(props.promotionItemData).forEach(([key, value]) => {
    if (key == 'PRODUCT_CHANNEL' || key == 'PROM_CONDITION_PROD_LIST' || key == 'PROM_CONDITION_ITEM_LIST' || key == 'PROM_ITEM_LIST')
    formData.value[`FLT_${key}`] = value
    else
    formData.value[`FLT_${key}`] = decrypt(value)
  });

  if (formData.value.FLT_PROM_CONDITION_PROD_YN === '0') {
    selectFixedType.value = fixedTypes[0]
  } else {
    selectFixedType.value = fixedTypes[1]
  }

  const selectBrand = brandList.value.find((item) => decrypt(item.BRAND_CODE) === formData.value.FLT_PROM_BRAND_CODE)

  brand.value = {
    name: decrypt(selectBrand?.BRAND_FNAME) ?? '',
    value: decrypt(selectBrand?.BRAND_CODE) ?? '',
  }

  filters.value.FLT_PROM_BRAND_CODE = formData.value.FLT_PROM_BRAND_CODE
  await promotionManagement.fetchChannelList()

  channel.value = formData.value.FLT_PRODUCT_CHANNEL.map((item) => ({
    name: item.PROM_CHANNEL_NAME,
    value: item.PROM_CHANNEL_CODE,
  }))

  conditionAmtYn.value = formData.value.FLT_PROM_CONDITION_AMT_YN === '1'

  containInOrder.value = formData.value.FLT_PROM_CONDITION_PROD_LIST.length > 0 || formData.value.FLT_PROM_CONDITION_ITEM_LIST.length > 0

  if (formData.value.FLT_PROM_CONDITION_PROD_YN === '1') {
    selectFixedType.value = fixedTypes[0]
  } else {
    selectFixedType.value = fixedTypes[1]
  }
}

onMounted(async () => {
  await promotionManagement.fetchBrandList();
  await pageLoader.fetchPageLoadData('POP00200')
  await setDefaultValue()
});

const productConditionTableFields = computed(() => {
  return pageLoader.getTableData('POP00200' , 'POP00200_GRD01002')
})

const itemConditionTableFields = computed(() => {
  return pageLoader.getTableData('POP00200' , 'POP00200_GRD01003')
})

const groupedPromotionItemList = computed(() => {
  return formData.value.FLT_PROM_ITEM_LIST.reduce((acc, item) => {
    const seq = numberToOrdinal(item.PROM_ITEM_NO)

    if (!acc[seq]) {
      acc[seq] = []
    }

    acc[seq].push(item)

    return acc
  }, {})
})

const numberToOrdinal = (n) => {
  const s = ['TH', 'ST', 'ND', 'RD']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

const getOrdinalFullText = (index) => {
  switch (index) {
    case '1':
      return 'First';
    case '2':
      return 'Second';
    case '3':
      return 'Third';
    default:
      return `${index}th`;
  }
}

const containInOrder = ref(false)
</script>

<template>
  <div class="space-y-6">
    <div>
      <div class="mb-3">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00200_LBL01002', 'caption', 'Information') }}
        </h3>
      </div>
      <div class="grid grid-cols-4 gap-3">
        <FormGroup
          :label="getComponentData('POP00200_LBL01003', 'caption', 'ID/Title')"
          label-id="POP00200_LBL01003"
          label-for="POP00200_TXT01001"
          horizontal
        >
          <FormTextInput
            id="POP00200_TXT01001"
            v-model="formData.FLT_PROM_SID"
            disabled
          />
        </FormGroup>

        <FormGroup>
          <FormTextInput
            id="POP00200_TXT01002"
            v-model="formData.FLT_PROM_TITLE"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00200_LBL01004', 'caption', 'Status')"
          label-id="POP00200_LBL01004"
          label-for="POP00200_TXT01003"
          horizontal
        >
          <FormTextInput
            id="POP00200_TXT01002"
            v-model="formData.FLT_PROM_STATUS_FNAME"
            disabled
          />
        </FormGroup>

        <div class="col-span-1 mr-1">
          <FormGroup
            :label="getComponentData('POP00200_LBL01005', 'caption', 'Apply Datw')"
            label-id="POP00200_LBL01005"
            horizontal
          >
            <div class="flex items-center sm:flex-col lg:flex-row sm:space-y-3 sm:space-x-0 lg:space-x-3 lg:space-y-0 w-full ml-3">
              <FormDatePicker
                v-model.string="formData.FLT_PROM_START_DATE"
                placeholder="Select a date"
                mode="date"
                disabled
              />

              <FormDatePicker
                v-model.string="formData.FLT_PROM_END_DATE"
                placeholder="Select a date"
                mode="date"
                disabled
              />
            </div>
          </FormGroup>
        </div>

        <FormGroup
          :label="getComponentData('POP00200_LBL01012', 'caption', 'Select Brand')"
          label-id="POP00200_LBL01012"
          label-for="POP00200_CMB01002"
          horizontal
        >
          <FormCombobox
            id="POP00200_CMB01002"
            v-model="brand"
            :disabled="!props.create"
            :options="brandList.map((item) => ({
              name: decrypt(item.BRAND_FNAME),
              value: decrypt(item.BRAND_CODE),
            }))"
          />
        </FormGroup>

        <FormGroup
          label="Select Channel"
          label-width="w-1/3"
          input-width="w-2/3"
          horizontal
        >
          <div class="flex items-center gap-1 flex-wrap">
            <Button
              v-for="(c, cIndex) in formData.FLT_PRODUCT_CHANNEL"
              :key="cIndex"
              size="xs"
              rounded
              variant="white"
              border
            >
              {{ decrypt(c.PROM_CHANNEL_NAME) }}
            </Button>
          </div>
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00200_LBL01006', 'caption', 'Description')"
          label-id="POP00200_LBL01006"
          label-for="POP00200_TXT01004"
          horizontal
        >
          <FormTextareaInput
            id="POP00200_TXT01004"
            v-model="formData.FLT_PROM_DESCRIPTION"
            disabled
          />
        </FormGroup>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00200_LBL01007', 'caption', 'Conditions') }}
        </h3>
      </div>

      <div>
        <div class="grid grid-cols-4 gap-3">
          <div>
            <FormCheckbox
              id="POP00200_CHK01001"
              v-model="conditionAmtYn"
              disabled
              :label="getComponentData('POP00200_LBL01008', 'caption', 'Amount')"
            />
          </div>

          <div>
            <FormTextInput
              id="POP00200_TXT01005"
              v-model="formData.FLT_PROM_CONDITION_AMT_VALUE"
              disabled
              type="number"
            />
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div class="grid grid-cols-2 items-center">
          <div class="flex items-center gap-x-3">
            <FormCheckbox
              id="POP00200_CHK01001"
              v-model="containInOrder"
              disabled
              :label="getComponentData('POP00200_LBL01009', 'caption', '')"
            />

            <FormCombobox
              v-if="containInOrder"
              v-model="selectFixedType"
              disabled
              :options="fixedTypes"
            />
          </div>
        </div>

        <Table
          v-if="formData.FLT_PROM_CONDITION_PROD_YN === '1' && containInOrder"
          id="POP00200_GRD01002"
          border
          condensed
          class="overflow-x-auto"
          header-variant="secondary"
          :columns="productConditionTableFields"
          :items="formData.FLT_PROM_CONDITION_PROD_LIST"
        />

        <Table
          v-if="formData.FLT_PROM_CONDITION_ITEM_YN === '1' && containInOrder"
          id="POP00200_GRD01003"
          border
          condensed
          class="overflow-x-auto"
          header-variant="secondary"
          :columns="itemConditionTableFields"
          :items="formData.FLT_PROM_CONDITION_ITEM_LIST"
        />
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00200_LBL01010', 'caption', 'Conditions') }}
        </h3>
      </div>

      <div>
        <div class="grid grid-cols-4 gap-3">
          <div class="col-span-3">
            <div
              v-if="formData.FLT_PROM_ITEM_LIST.length"
            >
              <ul class="space-y-2">
                <li
                  v-for="(items, optionIndex) in groupedPromotionItemList"
                  :key="optionIndex"
                  class="mb-3 mr-5 space-y-2 shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg py-3 pr-3 pl-1"
                >
                  <span class="pr-2 space-x-1 flex items-center">
                    <ChevronRightIcon class="w-5 h-5" />
                    <span class="text-md">
                      {{ getOrdinalFullText(decrypt(optionIndex)) }} Original Items or None-MD Items
                    </span>
                  </span>

                  <ul class="space-y-2 border-l-2 border-gray-200 ml-2">
                    <li
                      v-for="(item, itemIndex) in items"
                      :key="itemIndex"
                      class="shadow ring-1 ring-black ring-opacity-10 rounded pl-1 pr-2 pt-1 pb-2 space-y-1 ml-3 relative"
                    >
                      <div class="border-b-2 border-gray-200 w-3 absolute top-4 -left-3" />
                      <div class="space-x-1 flex items-center">
                        <ChevronRightIcon class="w-5 h-5" />
                        <div class="grid grid-cols-6 gap-x-3 w-full items-center">
                          <div class="text-xs">
                            {{ decrypt(item.PROM_ITEM_TYPE) }}
                          </div>
                          <div class="text-xs">
                            {{ decrypt(item.PROM_ITEM_CODE) }}
                          </div>
                          <div class="text-xs">
                            {{ decrypt(item.PROM_ITEM_FANME) }}
                          </div>
                          <div class="text-xs">
                            <Button
                              rounded
                              variant="info"
                              border
                              size="xs"
                              class="w-full flex justify-center items-center space-x-6"
                            >
                              <span>QTY</span>
                              <div class="rounded bg-white text-black px-2 h-5 pt-0.5">
                                {{ decrypt(item.PROM_ITEM_QTY) || 0 }}
                              </div>
                            </Button>
                          </div>
                          <div class="text-xs">
                            <Button
                              rounded
                              variant="success"
                              border
                              size="xs"
                              class="w-full flex justify-center items-center space-x-6"
                            >
                              <span>Shipped</span>
                              <div class="rounded bg-white text-black px-2 h-5 pt-0.5">
                                {{ decrypt(item.PROM_ITEM_SHIPPED_QTY) || 0 }}
                              </div>
                            </Button>
                          </div>
                          <div class="text-xs">
                            <Button
                              rounded
                              variant="warning"
                              border
                              size="xs"
                              class="w-full flex justify-center items-center space-x-6"
                            >
                              <span>Limit</span>
                              <div class="rounded bg-white text-black px-2 h-5 pt-0.5">
                                {{ decrypt(item.PROM_ITEM_LIMIT_QTY) || 0 }}
                              </div>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <FormGroup
              :label="getComponentData('POP00200_LBL01011', 'caption', 'Text Notice')"
              label-id="POP00200_LBL01011"
              label-for="POP00200_TXT01006"
            >
              <FormTextareaInput
                id="POP00200_TXT01006"
                v-model="formData.FLT_PROM_TEXT_NOTICE"
                disabled
                rows="10"
              />
            </FormGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
