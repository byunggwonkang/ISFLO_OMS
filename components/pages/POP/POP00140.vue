<script setup>
import moment from "moment";
import { encrypt, decrypt } from '@/stores/common/aes'

const channelSettings = useChannelSettingsStore()
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component, 'POP00140']);
const { loading, toggleLoading } = useLoading()

const { brandList, saChannelList } = storeToRefs(channelSettings);

const emits = defineEmits(['channelSaved'])

const props = defineProps({
  channelData: {
    type: Object,
    required: true,
    default: () => ({})
  },
})

const formData = ref({
  FLT_BRAND_CODE: '',
  FLT_CHANNEL_CODE: '',
  FLT_CHANNEL_DESCR_ENG: '',
  FLT_CHANNEL_DESCR_KOR: '',
  FLT_CHANNEL_DESCR_CHN: '',
  FLT_CHANNEL_DESCR_JPN: '',
  FLT_CHANNEL_STOCK_RATE: '',
  FLT_CHANNEL_ACTIVE_YN: '',
  FLT_CHANNEL_WMS_LINK_YN: '',
  FLT_CHANNEL_OPEN_DATE: '',
  FLT_CHANNEL_CLOSE_DATE: '',
  FLT_CHANNEL_ERP_LINK_YN: '',
  FLT_CHANNEL_ERP_CODE: '',
  FLT_CHANNEL_ERP_ORDER_TYPE: '',
  FLT_CHANNEL_ERP_ID_FROM: '',
  FLT_CHANNEL_ERP_ID_TO: '',
  FLT_CHANNEL_ERP_EXT_01: '',
  FLT_CHANNEL_ERP_EXT_02: '',
  FLT_CHANNEL_ERP_EXT_03: '',
  FLT_CHANNEL_API_URL: '',
  FLT_CHANNEL_API_REDIRECT_URL: '',
  FLT_CHANNEL_API_TOKEN_URL: '',
  FLT_CHANNEL_API_SECRET_KEY: '',
  FLT_CHANNEL_API_CLIENT_KEY: '',
  FLT_CHANNEL_API_EXT_01: '',
  FLT_CHANNEL_API_EXT_02: '',
  FLT_CHANNEL_API_EXT_03: '',
  FLT_CHANNEL_API_EXT_04: '',
  FLT_CHANNEL_API_EXT_05: '',
  FLT_CHANNEL_API_EXT_06: '',
  FLT_CHANNEL_API_EXT_07: '',
  FLT_CHANNEL_API_EXT_08: '',
  FLT_CHANNEL_API_EXT_09: '',
  FLT_CHANNEL_API_EXT_10: ''
})

const brandListOptions = computed(() => {
  return brandList.value.filter(item => item.BRAND_CODE !== '' && item.BRAND_FNAME !== 'All').map((brand) => ({
    name: decrypt(brand.BRAND_FNAME),
    value: parseInt(decrypt(brand.BRAND_CODE)).toString(),
  }))
})

const channelListOptions = computed(() => {
  return saChannelList.value.map((channel) => ({
    name: decrypt(channel.CHANNEL_FNAME),
    value: decrypt(channel.CHANNEL_CODE),
  }))
})

const setDefaultData = () => {
  if (Object.keys(props.channelData).length === 0) {

    brand.value = brandListOptions.value[0]

    channel.value = {
      name: decrypt(saChannelList.value[0]?.CHANNEL_FNAME) ?? '',
      value: decrypt(saChannelList.value[0]?.CHANNEL_CODE) ?? '',
    }

    channelActive.value = true
    wmsLinkActive.value = true
    erpLinkActive.value = true

    formData.value.FLT_CHANNEL_OPEN_DATE = moment().format('YYYY-MM-DD')
    formData.value.FLT_CHANNEL_CLOSE_DATE = moment().format('YYYY-MM-DD')
  } else {
    Object.entries(props.channelData).forEach(([key, value]) => {
      formData.value[`FLT_${key}`] = decrypt(value)
    })

    channelActive.value = formData.value.FLT_CHANNEL_ACTIVE_YN === '1';
    wmsLinkActive.value = formData.value.FLT_CHANNEL_WMS_LINK_YN === '1';
    erpLinkActive.value = formData.value.FLT_CHANNEL_ERP_LINK_YN === '1';

    const selectedBrand = brandList.value.find((brand) => brand.BRAND_CODE === props.channelData.BRAND_CODE)
    brand.value = {
      name: decrypt(selectedBrand?.BRAND_FNAME) ?? '',
      value: parseInt(decrypt(selectedBrand?.BRAND_CODE)).toString() ?? '',
    }

    const selectedChannel = saChannelList.value.find((channel) => channel.CHANNEL_CODE === props.channelData.CHANNEL_CODE)
    channel.value = {
      name: decrypt(selectedChannel?.CHANNEL_FNAME) ?? '',
      value: decrypt(selectedChannel?.CHANNEL_CODE) ?? '',
    }
  }
}

const brand = ref({})
const channel = ref({})

const channelActive = ref(false)
const wmsLinkActive = ref(false)
const erpLinkActive = ref(false)

const resetFormData = () => {
  formData.value = {
    FLT_BRAND_CODE: '',
    FLT_CHANNEL_CODE: '',
    FLT_CHANNEL_DESCR_ENG: '',
    FLT_CHANNEL_DESCR_KOR: '',
    FLT_CHANNEL_DESCR_CHN: '',
    FLT_CHANNEL_DESCR_JPN: '',
    FLT_CHANNEL_STOCK_RATE: '',
    FLT_CHANNEL_ACTIVE_YN: '',
    FLT_CHANNEL_WMS_LINK_YN: '',
    FLT_CHANNEL_OPEN_DATE: '',
    FLT_CHANNEL_CLOSE_DATE: '',
    FLT_CHANNEL_ERP_LINK_YN: '',
    FLT_CHANNEL_ERP_CODE: '',
    FLT_CHANNEL_ERP_ORDER_TYPE: '',
    FLT_CHANNEL_ERP_ID_FROM: '',
    FLT_CHANNEL_ERP_ID_TO: '',
    FLT_CHANNEL_ERP_EXT_01: '',
    FLT_CHANNEL_ERP_EXT_02: '',
    FLT_CHANNEL_ERP_EXT_03: '',
    FLT_CHANNEL_API_URL: '',
    FLT_CHANNEL_API_REDIRECT_URL: '',
    FLT_CHANNEL_API_TOKEN_URL: '',
    FLT_CHANNEL_API_SECRET_KEY: '',
    FLT_CHANNEL_API_CLIENT_KEY: '',
    FLT_CHANNEL_API_EXT_01: '',
    FLT_CHANNEL_API_EXT_02: '',
    FLT_CHANNEL_API_EXT_03: '',
    FLT_CHANNEL_API_EXT_04: '',
    FLT_CHANNEL_API_EXT_05: '',
    FLT_CHANNEL_API_EXT_06: '',
    FLT_CHANNEL_API_EXT_07: '',
    FLT_CHANNEL_API_EXT_08: '',
    FLT_CHANNEL_API_EXT_09: '',
    FLT_CHANNEL_API_EXT_10: ''
  }
}

onMounted(() => {
  setDefaultData()
})

const onClickSave = async () => {
  formData.value.FLT_BRAND_CODE = brand.value?.value
  formData.value.FLT_CHANNEL_CODE = channel.value?.value
  formData.value.FLT_CHANNEL_ACTIVE_YN = channelActive.value === true ? '1' : '0'
  formData.value.FLT_CHANNEL_WMS_LINK_YN = wmsLinkActive.value === true ? '1' : '0'
  formData.value.FLT_CHANNEL_ERP_LINK_YN = erpLinkActive.value === true ? '1' : '0'

  formData.value.FLT_CHANNEL_ERP_ID_FROM = formData.value.FLT_CHANNEL_ERP_ID_FROM ? formData.value.FLT_CHANNEL_ERP_ID_FROM : '0'
  formData.value.FLT_CHANNEL_ERP_ID_TO = formData.value.FLT_CHANNEL_ERP_ID_TO ? formData.value.FLT_CHANNEL_ERP_ID_TO : '0'

  formData.value.FLT_CHANNEL_OPEN_DATE = formData.value.FLT_CHANNEL_OPEN_DATE ? moment(formData.value.FLT_CHANNEL_OPEN_DATE).format('YYYY-MM-DD') : ''
  formData.value.FLT_CHANNEL_CLOSE_DATE = formData.value.FLT_CHANNEL_CLOSE_DATE ? moment(formData.value.FLT_CHANNEL_CLOSE_DATE).format('YYYY-MM-DD') : ''

  toggleLoading()
  const { success } = await channelSettings.saveChannelDetail(formData.value)
  if (success) {
    await channelSettings.fetchChannelList()
    emits('channelSaved')
    resetFormData()
  }
  toggleLoading()
}
</script>

<template>
  <div class="space-y-3 divider divide-y">
    <div class="grid grid-cols-2 gap-x-4">
      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00140_LBL00002', 'caption', 'Brand')"
          label-id="POP00140_LBL00001"
          label-for="POP00140_CMB00001"
          horizontal
        >
          <FormCombobox
            id="POP00140_CMB00001"
            v-model="brand"
            :options="brandListOptions"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00004', 'caption', 'Description (ENG)')"
          label-id="POP00140_LBL00004"
          label-for="POP00140_TXT00001"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00001"
            v-model="formData.FLT_CHANNEL_DESCR_ENG"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00005', 'caption', 'Description (KOR)')"
          label-id="POP00140_LBL00005"
          label-for="POP00140_TXT00002"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00002"
            v-model="formData.FLT_CHANNEL_DESCR_KOR"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00006', 'caption', 'Description (CHN)')"
          label-id="POP00140_LBL00006"
          label-for="POP00140_TXT00003"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00003"
            v-model="formData.FLT_CHANNEL_DESCR_CHN"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00007', 'caption', 'Description (JPN)')"
          label-id="POP00140_LBL00007"
          label-for="POP00140_TXT00004"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00004"
            v-model="formData.FLT_CHANNEL_DESCR_JPN"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00008', 'caption', 'Stock Rate')"
          label-id="POP00140_LBL00008"
          label-for="POP00140_TXT00005"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00005"
            v-model="formData.FLT_CHANNEL_STOCK_RATE"
          />
        </FormGroup>
      </div>

      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00140_LBL00003', 'caption', 'Channel')"
          label-id="POP00140_LBL00002"
          label-for="POP00140_CMB00002"
          horizontal
        >
          <FormCombobox
            id="POP00140_CMB00002"
            v-model="channel"
            :options="channelListOptions"
          />
        </FormGroup>

        <div class="w-max">
          <FormCheckbox
            v-model="channelActive"
            value="1"
            :label="getComponentData('POP00140_LBL00009', 'caption', 'Active')"
            label-id="POP00140_CHK00001"
          />
        </div>

        <div class="w-max">
          <FormCheckbox
            v-model="wmsLinkActive"
            value="1"
            :label="getComponentData('POP00140_LBL00010', 'caption', 'WMS Link')"
            label-id="POP00140_CHK00002"
          />
        </div>

        <FormGroup
          :label="getComponentData('POP00140_LBL00011', 'caption', 'Open Date')"
          label-id="POP00140_LBL00011"
          label-for="POP00140_DAT00001"
          horizontal
        >
          <FormDatePicker
            id="POP00140_DAT00001"
            v-model="formData.FLT_CHANNEL_OPEN_DATE"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00012', 'caption', 'Close Date')"
          label-id="POP00140_LBL00012"
          label-for="POP00140_DAT00002"
          horizontal
        >
          <FormDatePicker
            id="POP00140_DAT00002"
            v-model="formData.FLT_CHANNEL_CLOSE_DATE"
          />
        </FormGroup>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-y-3 gap-x-4">
      <div class="col-span-2 mt-3">
        <p class="text-sm">
          {{ getComponentData('POP00140_LBL00013', 'caption', 'ERP Setting') }}
        </p>
      </div>

      <div class="col-span-2">
        <div class="w-max">
          <FormCheckbox
            v-model="erpLinkActive"
            value="1"
            :label="getComponentData('POP00140_LBL00014', 'caption', 'ERP Link')"
            label-id="POP00140_CHK00003"
          />
        </div>
      </div>

      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00140_LBL00015', 'caption', 'ERP Code')"
          label-id="POP00140_LBL00015"
          label-for="POP00140_TXT00006"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00006"
            v-model="formData.FLT_CHANNEL_ERP_CODE"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00016', 'caption', 'ERP Order Type')"
          label-id="POP00140_LBL00016"
          label-for="POP00140_TXT00007"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00007"
            v-model="formData.FLT_CHANNEL_ERP_ORDER_TYPE"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00017', 'caption', 'ERP ID From - To')"
          label-id="POP00140_LBL00017"
          horizontal
        >
          <div class="flex items-center justify-between space-x-3">
            <FormTextInput
              id="POP00140_TXT00008"
              v-model="formData.FLT_CHANNEL_ERP_ID_FROM"
            />

            <FormTextInput
              id="POP00140_TXT00009"
              v-model="formData.FLT_CHANNEL_ERP_ID_TO"
            />
          </div>
        </FormGroup>
      </div>

      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00140_LBL00018', 'caption', 'ERP Ext Data 01')"
          label-id="POP00140_LBL00018"
          label-for="POP00140_TXT00010"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00010"
            v-model="formData.FLT_CHANNEL_ERP_EXT_01"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00019', 'caption', 'ERP Ext Data 02')"
          label-id="POP00140_LBL00019"
          label-for="POP00140_TXT00011"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00011"
            v-model="formData.FLT_CHANNEL_ERP_EXT_02"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00020', 'caption', 'ERP Ext Data 03')"
          label-id="POP00140_LBL00020"
          label-for="POP00140_TXT00012"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00012"
            v-model="formData.FLT_CHANNEL_ERP_EXT_03"
          />
        </FormGroup>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-y-3 gap-x-4">
      <div class="col-span-2 mt-3">
        <p class="text-sm">
          {{ getComponentData('POP00140_LBL00021', 'caption', 'Channel API Setting') }}
        </p>
      </div>

      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00140_LBL00022', 'caption', 'API URL')"
          label-id="POP00140_LBL00022"
          label-for="POP00140_TXT00013"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00013"
            v-model="formData.FLT_CHANNEL_API_URL"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00023', 'caption', 'API Redirect URL')"
          label-id="POP00140_LBL00023"
          label-for="POP00140_TXT00014"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00014"
            v-model="formData.FLT_CHANNEL_API_REDIRECT_URL"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00024', 'caption', 'API Secret Key')"
          label-id="POP00140_LBL00024"
          label-for="POP00140_TXT00015"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00015"
            v-model="formData.FLT_CHANNEL_API_SECRET_KEY"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00027', 'caption', 'API Ext Data 01')"
          label-id="POP00140_LBL00027"
          label-for="POP00140_TXT00018"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00018"
            v-model="formData.FLT_CHANNEL_API_EXT_01"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00028', 'caption', 'API Ext Data 02')"
          label-id="POP00140_LBL00028"
          label-for="POP00140_TXT00019"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00019"
            v-model="formData.FLT_CHANNEL_API_EXT_02"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00029', 'caption', 'API Ext Data 03')"
          label-id="POP00140_LBL00029"
          label-for="POP00140_TXT00020"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00020"
            v-model="formData.FLT_CHANNEL_API_EXT_03"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00030', 'caption', 'API Ext Data 04')"
          label-id="POP00140_LBL00030"
          label-for="POP00140_TXT00021"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00021"
            v-model="formData.FLT_CHANNEL_API_EXT_04"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00031', 'caption', 'API Ext Data 05')"
          label-id="POP00140_LBL00031"
          label-for="POP00140_TXT00022"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00022"
            v-model="formData.FLT_CHANNEL_API_EXT_05"
          />
        </FormGroup>
      </div>

      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00140_LBL00025', 'caption', 'API Token URL')"
          label-id="POP00140_LBL00025"
          label-for="POP00140_TXT00016"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00016"
            v-model="formData.FLT_CHANNEL_API_TOKEN_URL"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00026', 'caption', 'API Client Key')"
          label-id="POP00140_LBL00026"
          label-for="POP00140_TXT00017"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00017"
            v-model="formData.FLT_CHANNEL_API_CLIENT_KEY"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00032', 'caption', 'API Ext Data 06')"
          label-id="POP00140_LBL00032"
          label-for="POP00140_TXT00023"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00023"
            v-model="formData.FLT_CHANNEL_API_EXT_06"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00033', 'caption', 'API Ext Data 07')"
          label-id="POP00140_LBL00033"
          label-for="POP00140_TXT00024"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00024"
            v-model="formData.FLT_CHANNEL_API_EXT_07"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00034', 'caption', 'API Ext Data 08')"
          label-id="POP00140_LBL00034"
          label-for="POP00140_TXT00025"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00025"
            v-model="formData.FLT_CHANNEL_API_EXT_08"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00035', 'caption', 'API Ext Data 09')"
          label-id="POP00140_LBL00035"
          label-for="POP00140_TXT00026"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00026"
            v-model="formData.FLT_CHANNEL_API_EXT_09"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00140_LBL00036', 'caption', 'API Ext Data 10')"
          label-id="POP00140_LBL00036"
          label-for="POP00140_TXT00027"
          horizontal
        >
          <FormTextInput
            id="POP00140_TXT00027"
            v-model="formData.FLT_CHANNEL_API_EXT_10"
          />
        </FormGroup>
      </div>
    </div>

    <div class="text-end pt-3">
      <Button
        id="POP00140_BTN00001"
        rounded
        variant="gray"
        :loading="loading"
        :disabled="loading"
        class="w-30"
        size="sm"
        @click="onClickSave"
      >
        {{ getComponentData('POP00140_BTN00001', 'caption', 'Save') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
