<script setup>
import moment from "moment";
import { PlusIcon } from "@heroicons/vue/24/solid";

const { currentTab } = storeToRefs(useTabsStore())
const claimManagement = useClaimManagementStore()
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '', 'POP00240', 'POP00230', 'POP00020', 'POP00250'])
const { userGroupChannelList } = storeToRefs(useClaimManagementStore())
const commonData = useCommonDataStore()

const onClickItemRow = (item) => {
  csData.value = item
  informationForm.value = {
    FLT_CS_SID: item.CS_SID,
    FLT_CS_TYPE_CODE: item.CS_TYPE_CODE,
    FLT_CS_USER_SID: item.CS_USER_SID,
    FLT_CS_BRAND_CODE: item.CS_BRAND_CODE,
    FLT_CS_CHANNEL_CODE: item.CS_CHANNEL_CODE,
    FLT_CS_CUST_REGIST_YN: item.CS_CUST_REGIST_YN,
    FLT_CS_CUST_SID: item.CS_CUST_SID,
    FLT_CS_CUST_FNAME: item.CS_CUST_FNAME,
    FLT_CS_CUST_MOBILE_NO: item.CS_CUST_MOBILE_NO,
    FLT_CS_TRANSACTION_SID: item.CS_TRANSACTION_SID,
    FLT_CS_TRANSACTION_TYPE_CODE: item.CS_TRANSACTION_TYPE_CODE,
    FLT_CS_CATEGORY_CODE: item.CS_CATEGORY_CODE,
    FLT_CS_REGIST_DATE: item.CS_REGIST_DATE,
    FLT_CS_REGIST_TIME: item.CS_REGIST_TIME,
    FLT_CS_STATUS_CODE: item.CS_STATUS_CODE,
    FLT_CS_STATUS_FNAME: item.CS_STATUS_FNAME,
    FLT_CS_REPAIR_COST: item.CS_REPAIR_COST,
    FLT_CS_REPAIR_COST_CHARGE_YN: item.CS_REPAIR_COST_CHARGE_YN,
    FLT_CS_RETURN_ORDER_SID: item.CS_RETURN_ORDER_SID
  }

  date.value = item.CS_REGIST_DATE;
  time.value = item.CS_REGIST_TIME;
  userRegistered.value = item.CS_CUST_REGIST_YN === 'Y'

  const selectedChannel = userGroupChannelList.value.find((channel) => channel.USER_BRAND_CODE === item.CS_BRAND_CODE && channel.USER_CHANNEL_CODE === item.CS_CHANNEL_CODE)
  if (selectedChannel) {
    channel.value = {
      name: selectedChannel.USER_BRAND_FNAME + ' - ' + selectedChannel.USER_CHANNEL_FNAME,
      value: {
        BRAND_NAME: selectedChannel.USER_BRAND_FNAME,
        BRAND_CODE: selectedChannel.USER_BRAND_CODE,
        CHANNEL_NAME: selectedChannel.USER_CHANNEL_FNAME,
        CHANNEL_CODE: selectedChannel.USER_CHANNEL_CODE,
      }
    }
  }

  const selectedCategory = commonData.getCsCategoryRegularOptions.find((category) => category.value === item.CS_CATEGORY_CODE)
  if (selectedCategory) {
    category.value = selectedCategory
  }
}

const { loading, toggleLoading } = useLoading()

const csData = ref({})
const channel = ref({})
const category = ref({})
const date = ref(moment().format('YYYY-MM-DD'))
const time = ref(moment().format('HH:mm'))
const userRegistered = ref(false)
const chargeCustomer = ref(false)

watch(() => chargeCustomer.value, (value) => {
  informationForm.value.FLT_CS_REPAIR_COST_CHARGE_YN = value ? '1' : '0'
})

watch(() => channel.value, (value) => {
  if (value) {
    informationForm.value.FLT_CS_CHANNEL_CODE = value.value?.CHANNEL_CODE || ''
    informationForm.value.FLT_CS_BRAND_CODE = value.value?.BRAND_CODE || ''
  }
})

watch(() => category.value, (value) => {
  if (value) {
    informationForm.value.FLT_CS_CATEGORY_CODE = value.value
  }
})

watch(() => date.value, (value) => {
  if (value) {
    informationForm.value.FLT_CS_REGIST_DATE = moment(value).format('YYYY-MM-DD')
  }
})

watch(() => time.value, (value) => {
  if (value) {
    informationForm.value.FLT_CS_REGIST_TIME = value + ':00'
  }
})

watch(() => userRegistered.value, (value) => {
  informationForm.value.FLT_CS_CUST_REGIST_YN = value ? '1' : '0'
})

const defaultFormData = {
  FLT_CS_SID: '',
  FLT_CS_TYPE_CODE: '',
  FLT_CS_USER_SID: '',
  FLT_CS_BRAND_CODE: '',
  FLT_CS_CHANNEL_CODE: '',
  FLT_CS_CUST_REGIST_YN: '',
  FLT_CS_CUST_SID: '',
  FLT_CS_CUST_FNAME: '',
  FLT_CS_CUST_MOBILE_NO: '',
  FLT_CS_TRANSACTION_SID: '',
  FLT_CS_TRANSACTION_TYPE_CODE: '',
  FLT_CS_CATEGORY_CODE: '',
  FLT_CS_REGIST_DATE: '',
  FLT_CS_REGIST_TIME: '',
  FLT_CS_STATUS_CODE: '',
  FLT_CS_REPAIR_COST: '',
  FLT_CS_STATUS_FNAME: '',
  FLT_CS_REPAIR_COST_CHARGE_YN: '',
  FLT_CS_RETURN_ORDER_SID: ''
}

const informationForm = ref(defaultFormData);

const resetFormData = () => {
  informationForm.value = {
    ...defaultFormData,
    FLT_CS_CUST_SID: '',
    FLT_CS_CUST_FNAME: '',
    FLT_CS_CUST_MOBILE_NO: '',
  }
  date.value = moment().format('YYYY-MM-DD')
  time.value = moment().format('HH:mm')
  csData.value = {}
  channel.value = {}
  category.value = {}

  userRegistered.value = false
  chargeCustomer.value = false
}

const isCreateMode = computed(() => {
  return !informationForm.value.FLT_CS_SID
})

onBeforeMount(async () => {
  await claimManagement.fetchUserGroupChannelList()
})

const save = async () => {
  toggleLoading()

  informationForm.value.FLT_CS_REGIST_DATE = moment(date.value).format('YYYY-MM-DD')
  informationForm.value.FLT_CS_REGIST_TIME = time.value ? time.value + ':00' : moment().format('HH:mm') + ':00'

  const{ success, data } = await claimManagement.saveCSDetail(informationForm.value, isCreateMode.value)
  if (success) {
    onClickItemRow(data)
  }
  await claimManagement.fetchSummaryList()
  toggleLoading()
}

const openOrderDetailModal = ref(false)
const openCommentModal = ref(false)
const openCustomerModal = ref(false)

const orderDetailData = ref({})
const openOrderDetail = async () => {
  const { success, data } = await claimManagement.fetchOrderDetail({
    ORDER_SID: informationForm.value.FLT_CS_TRANSACTION_SID,
    CHANNEL_CODE: informationForm.value.FLT_CS_CHANNEL_CODE,
  })

  if (success) {
    orderDetailData.value = data
    openOrderDetailModal.value = true
  }
}

const onSaveComment = async () => {
  openCommentModal.value = false
  await claimManagement.fetchCommentList()
}

const onDoubleClickCustomer = (customer) => {
  informationForm.value.FLT_CS_CUST_SID = customer.CUST_SID
  informationForm.value.FLT_CS_CUST_FNAME = customer.CUST_FULL_NAME
  informationForm.value.FLT_CS_CUST_MOBILE_NO = customer.CUST_MOBILE
  openCustomerModal.value = false
}
</script>

<template>
  <div class="space-y-3">
    <component
      :is="`OU040100CSTABLE`"
      @on-row-click="onClickItemRow"
    />

    <Card
      shadow-size="none"
      card-header-class="p-3"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg space-y-3"
    >
      <div class="grid grid-cols-5 mb-3">
        <p class="font-normal text-gray-700 text-sm uppercase">
          {{ getComponentData('OU040100_LBL03001', 'caption') }}
        </p>

        <div class="text-end col-span-4">
          <Button
            rounded
            variant="white"
            border
            size="xs"
            @click="resetFormData"
          >
            <PlusIcon class="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div>
        <div class="grid grid-cols-4 space-x-6 mb-3">
          <FormGroup
            label-id="OU040100_LBL02002"
            :label="getComponentData('OU040100_LBL02002', 'caption')"
            label-for="OU040100_TXT02001"
            horizontal
          >
            <FormTextInput
              v-model="informationForm.FLT_CS_SID"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('OU040100_LBL02003', 'caption')"
            label-id="OU040100_LBL02003"
            label-for="OU040100_TXT02002"
            horizontal
          >
            <FormTextInput
              v-model="informationForm.FLT_CS_STATUS_FNAME"
              disabled
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('OU040100_LBL02004', 'caption')"
            label-id="OU040100_LBL02004"
            label-for="OU040100_CMB02001"
            horizontal
          >
            <FormSelect
              id="OU040100_CMB02001"
              v-model="channel"
              :disabled="!isCreateMode"
              :options="userGroupChannelList.map((channel) => ({
                name: channel.USER_BRAND_FNAME + ' - ' + channel.USER_CHANNEL_FNAME,
                value: {
                  BRAND_NAME: channel.USER_BRAND_FNAME,
                  BRAND_CODE: channel.USER_BRAND_CODE,
                  CHANNEL_NAME: channel.USER_CHANNEL_FNAME,
                  CHANNEL_CODE: channel.USER_CHANNEL_CODE,
                },
              }))"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('OU040100_LBL02005', 'caption')"
            horizontal
          >
            <div class="flex items-center gap-x-3">
              <FormDatePicker
                v-model="date"
                :disabled="!isCreateMode"
                mode="date"
              />

              <FormTextInput
                v-model="time"
                :disabled="!isCreateMode"
                type="time"
              />
            </div>
          </FormGroup>
        </div>
        <div class="grid grid-cols-4 space-x-6 mb-3">
          <FormGroup
            class="col-span-1"
            horizontal
            label-width="w-1/4"
            input-width="w-3/4"
            :label="getComponentData('OU040100_LBL05006', 'caption')"
          >
            <FormSelect
              v-model="category"
              :options="commonData.getCsCategoryNewOrderOptions"
            />
          </FormGroup>

          <FormGroup
            :label="getComponentData('OU040100_LBL02007', 'caption')"
            label-id="OU040100_LBL02007"
            label-for="OU040100_TXT02003"
            horizontal
          >
            <div class="flex items-center gap-x-3">
              <FormTextInput
                id="OU040100_TXT02003"
                v-model="informationForm.FLT_CS_CUST_SID"
                disabled
              />

              <Button
                rounded
                :variant="informationForm.FLT_CS_BRAND_CODE !== '' && informationForm.FLT_CS_CHANNEL_CODE !== '' ? 'white' : 'secondary'"
                border
                :disabled="informationForm.FLT_CS_BRAND_CODE === '' && informationForm.FLT_CS_CHANNEL_CODE === ''"
                @click="openCustomerModal = true"
              >
                ...
              </Button>
            </div>
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU040100_LBL02009', 'caption')"
            label-id="OU040100_LBL02009"
            label-for="OU040100_TXT02005"
            horizontal
          >
            <FormTextInput
              id="OU040100_TXT02004"
              v-model="informationForm.FLT_CS_CUST_FNAME"
              :disabled="!isCreateMode"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('OU040100_LBL02010', 'caption')"
            label-id="OU040100_LBL02010"
            label-for="OU040100_TXT02006"
            horizontal
          >
            <FormTextInput
              id="OU040100_TXT02006"
              v-model="informationForm.FLT_CS_CUST_MOBILE_NO"
              :disabled="!isCreateMode"
            />
          </FormGroup>
        </div>
        <div class="grid grid-cols-4 space-x-6 items-center border-b mb-6 pb-3">
          <FormGroup
            :label="getComponentData('OU040100_LBL04011', 'caption')"
            label-id="OU040100_LBL04011"
            label-for="OU040100_TXT03006"
            horizontal
          >
            <div class="flex items-center gap-x-3">
              <FormTextInput
                id="OU040100_TXT03006"
                v-model="informationForm.FLT_CS_RETURN_ORDER_SID"
                disabled
              />

              <Button
                id="OU040100_BTN03002"
                rounded
                variant="white"
                border
                @click="openOrderDetail"
              >
                {{ getComponentData('OU040100_BTN03002', 'caption') }}
              </Button>
            </div>
          </FormGroup>

          <div class="flex items-center gap-x-3">
            <FormCheckbox
              id="OU040100_CHK02001"
              v-model="userRegistered"
              :disabled="!isCreateMode"
              :label="getComponentData('OU040100_LBL02008', 'caption')"
            />
          </div>

          <div class="text-end col-span-2">
            <Button
              rounded
              variant="gray"
              :loading="loading"
              :disabled="loading"
              @click="save"
            >
              {{ getComponentData('OU040100_BTN02001', 'caption') }}
            </Button>
          </div>
        </div>
      </div>

      <div
        v-if="!isCreateMode"
        class="grid grid-cols-5 mb-3"
      >
        <p class="font-normal text-gray-700 text-sm uppercase">
          {{ getComponentData('OU040100_LBL02011', 'caption') }}
        </p>

        <div class="text-end col-span-4">
          <Button
            v-if="!isCreateMode"
            rounded
            variant="white"
            border
            size="xs"
            @click="openCommentModal = true"
          >
            <PlusIcon class="w-5 h-5" />
          </Button>
        </div>
      </div>
      <component
        :is="`OU040100CSCOMMENTTABLE`"
        v-if="!isCreateMode"
      />
    </Card>

    <component
      :is="'OU040100CSBUTTON'"
      v-if="!isCreateMode"
      :information-form="informationForm"
    />

    <Modal
      :show="openCustomerModal"
      divider
      size="6xl"
      @close="openCustomerModal = false"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00250_LBL01001', 'caption') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00250'"
          :brand="{
            name: channel.value.BRAND_NAME,
            code: channel.value.BRAND_CODE,
          }"
          :channel="{
            name: channel.value.CHANNEL_NAME,
            code: channel.value.CHANNEL_CODE,
          }"
          @on-row-double-click="onDoubleClickCustomer"
        />
      </template>
    </Modal>

    <Modal
      :show="openCommentModal"
      divider
      @close="openCommentModal = false"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00230_LBL01001', 'caption') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00230'"
          :cs-id="csData.CS_SID"
          @save-comment="onSaveComment"
        />
      </template>
    </Modal>

    <Modal
      :show="openOrderDetailModal"
      size="11xl"
      divider
      body-class="p-0"
      @close="() => {
        openOrderDetailModal = false;
        orderDetailData = {};
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00020_LBL01001', 'caption') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00020`"
          :order-detail-data="orderDetailData"
        />
      </template>
    </Modal>
  </div>
</template>

<style scoped>

</style>
