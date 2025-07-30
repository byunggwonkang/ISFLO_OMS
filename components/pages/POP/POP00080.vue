<script setup>
const { getComponentData } = usePageLoaderComponent('POP00080')

defineProps({
  itemDetailData: {
    type: Object,
    required: true,
    default: () => ({})
  },
})

const { getMaskedValue } = useMasked();
</script>

<template>
  <div class="grid grid-cols-2 gap-x-6">
    <div class="space-y-3">
      <FormGroup
        :label="getComponentData('POP00080_LBL01002', 'caption', 'Brand')"
        label-id="POP00080_LBL01002"
        label-for="POP00080_TXT01001"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01001"
          :value="itemDetailData.ITEM_BRAND_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01003', 'caption', 'Item Code')"
        label-id="POP00080_LBL01003"
        label-for="POP00080_TXT01002"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01002"
          :value="itemDetailData.ITEM_CODE"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01004', 'caption', 'ALU')"
        label-id="POP00080_LBL01004"
        label-for="POP00080_TXT01003"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01003"
          :value="itemDetailData.ITEM_ALU"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01005', 'caption', 'EAN')"
        label-id="POP00080_LBL01005"
        label-for="POP00080_TXT01004"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01004"
          :value="itemDetailData.ITEM_EAN"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01006', 'caption', 'Short Name')"
        label-id="POP00080_LBL01006"
        label-for="POP00080_TXT01005"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01005"
          :value="itemDetailData.ITEM_SNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01007', 'caption', 'Full Name')"
        label-id="POP00080_LBL01007"
        label-for="POP00080_TXT01006"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01006"
          :value="itemDetailData.ITEM_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01008', 'caption', 'Category')"
        label-id="POP00080_LBL01008"
        label-for="POP00080_TXT01007"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01007"
          :value="itemDetailData.ITEM_CATEGORY_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01009', 'caption', 'Sub Category')"
        label-id="POP00080_LBL01009"
        label-for="POP00080_TXT01008"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01008"
          :value="itemDetailData.ITEM_SUB_CATEGORY_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01010', 'caption', 'Sub-Sub Category')"
        label-id="POP00080_LBL01010"
        label-for="POP00080_TXT01009"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01009"
          :value="itemDetailData.ITEM_SUB_SUBCATEGORY_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01011', 'caption', 'Status')"
        label-id="POP00080_LBL01011"
        label-for="POP00080_TXT01010"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01010"
          :value="itemDetailData.ITEM_STATUS_FNAME"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01012', 'caption', 'Product Type')"
        label-id="POP00080_LBL01012"
        label-for="POP00080_TXT01011"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01011"
          :value="itemDetailData.ITEM_PRODUCT_TYPE"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01013', 'caption', 'Material Code')"
        label-id="POP00080_LBL01013"
        label-for="POP00080_TXT01012"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01012"
          :value="itemDetailData.ITEM_MATERIAL_CODE"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01014', 'caption', 'Size')"
        label-id="POP00080_LBL01014"
        horizontal
      >
        <div class="flex items-center space-x-3">
          <FormTextInput
            id="POP00080_TXT01013"
            :value="itemDetailData.ITEM_SIZE_CODE"
            readonly
          />

          <FormTextInput
            id="POP00080_TXT01014"
            :value="itemDetailData.ITEM_SIZE_NAME"
            readonly
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01015', 'caption', 'Color')"
        label-id="POP00080_LBL01015"
        horizontal
      >
        <div class="flex items-center space-x-3">
          <FormTextInput
            id="POP00080_TXT01015"
            :value="itemDetailData.ITEM_COLOR_CODE"
            readonly
          />

          <FormTextInput
            id="POP00080_TXT01016"
            :value="itemDetailData.ITEM_COLOR_NAME"
            readonly
          />
        </div>
      </FormGroup>
    </div>
    <div class="space-y-3">
      <FormGroup
        :label="getComponentData('POP00080_LBL01016', 'caption', 'Gross Weight')"
        label-id="POP00080_LBL01016"
        horizontal
      >
        <div class="flex items-center space-x-3">
          <FormTextInput
            id="POP00080_TXT01017"
            :value="itemDetailData.ITEM_GROSS_WEIGHT"
            readonly
          />

          <FormTextInput
            id="POP00080_TXT01018"
            :value="itemDetailData.ITEM_WEIGHT_UNIT"
            readonly
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01017', 'caption', 'Net Weight')"
        label-id="POP00080_LBL01017"
        horizontal
      >
        <div class="flex items-center space-x-3">
          <FormTextInput
            id="POP00080_TXT01019"
            :value="itemDetailData.ITEM_NET_WEIGHT"
            readonly
          />

          <FormTextInput
            id="POP00080_TXT01020"
            :value="itemDetailData.ITEM_WEIGHT_UNIT"
            readonly
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01018', 'caption', 'Season')"
        label-id="POP00080_LBL01018"
        horizontal
      >
        <div class="flex items-center space-x-3">
          <FormTextInput
            id="POP00080_TXT01021"
            :value="itemDetailData.ITEM_SEASON_YEAR"
            readonly
          />

          <FormTextInput
            id="POP00080_TXT01022"
            :value="itemDetailData.ITEM_SEASON_TYPE"
            readonly
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01019', 'caption', 'Original Price')"
        label-id="POP00080_LBL01019"
        horizontal
      >
        <div class="flex items-center space-x-3">
          <FormTextInput
            id="POP00080_TXT01023"
            :value="getMaskedValue(itemDetailData.ITEM_SALES_ORG_PRICE, '#,###,###,###,###')"
            readonly
          />

          <FormTextInput
            id="POP00080_TXT01024"
            :value="itemDetailData.ITEM_SALES_CURRENCY_SNAME"
            readonly
          />
        </div>
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01020', 'caption', 'Description')"
        label-id="POP00080_LBL01020"
        label-for="POP00080_TXT01025"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01025"
          :value="itemDetailData.ITEM_DESCR_1"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01021', 'caption', 'Description')"
        label-id="POP00080_LBL01021"
        label-for="POP00080_TXT01026"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01026"
          :value="itemDetailData.ITEM_DESCR_2"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01022', 'caption', 'Description')"
        label-id="POP00080_LBL01022"
        label-for="POP00080_TXT01027"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01027"
          :value="itemDetailData.ITEM_DESCR_3"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01023', 'caption', 'Description')"
        label-id="POP00080_LBL01023"
        label-for="POP00080_TXT01028"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01028"
          :value="itemDetailData.ITEM_DESCR_4"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01024', 'caption', 'Description')"
        label-id="POP00080_LBL01024"
        label-for="POP00080_TXT01029"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01029"
          :value="itemDetailData.ITEM_DESCR_5"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01025', 'caption', 'Description')"
        label-id="POP00080_LBL01025"
        label-for="POP00080_TXT01030"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01030"
          :value="itemDetailData.ITEM_DESCR_6"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01026', 'caption', 'Description')"
        label-id="POP00080_LBL01026"
        label-for="POP00080_TXT01031"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01031"
          :value="itemDetailData.ITEM_DESCR_7"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01027', 'caption', 'Description')"
        label-id="POP00080_LBL01027"
        label-for="POP00080_TXT01032"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01032"
          :value="itemDetailData.ITEM_DESCR_8"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01028', 'caption', 'Description')"
        label-id="POP00080_LBL01028"
        label-for="POP00080_TXT01033"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01033"
          :value="itemDetailData.ITEM_DESCR_9"
          readonly
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00080_LBL01029', 'caption', 'Created Date')"
        label-id="POP00080_LBL01029"
        label-for="POP00080_TXT01034"
        horizontal
      >
        <FormTextInput
          id="POP00080_TXT01034"
          :value="itemDetailData.ITEM_CREATE_DATE"
          readonly
        />
      </FormGroup>
    </div>
  </div>
</template>

<style scoped>

</style>
