<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()
const props = defineProps({
  printtype: {
    type: String,
    default: '',
  },
  OrderData: {
    type: Array,
    required: true,
    default: () => ([])
  },
  OrgWayBill: {
    type: String,
    default: '',
  },
  StationSID: {
    type: String,
    default: '',
  },
  CourierSID: {
    type: String,
    default: '',
  },
})
const PrintTitle = ref("")

const PrintCount = ref("0")
const TotalCount = ref("0")

const PrintDetail = usePrintDetail()

const Message = ref("")
const { currentTab } = storeToRefs(useTabsStore())

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])
const emits = defineEmits(['btn-print','btn-cancel'])

onMounted(async () => {
  PrintTitle.value = props.printtype == 'WAYBILL'  ? 'Waybill Printing' : 'Invoice Printing'
  TotalCount.value = props.OrderData.length

  //Message.value = props.OrgWayBill + '/' + props.StationSID + '/' + props.CourierSID 
})

const onClickPrint = async () => {
  
  if (props.printtype == 'WAYBILL')
  {
    const INPUT_DATA = ref({
      FLT_STATION_USER_SID: props.StationSID,
      FLT_BRAND_CODE: props.OrderData[0].BRAND_CODE,
      FLT_CHANNEL_CODE: props.OrderData[0].CHANNEL_CODE,
      FLT_COURIER_SID: props.CourierSID,
      FLT_REQUEST_COUNT: TotalCount.value+"",
    })

    const { data, success } = await PrintDetail.fetchWaybillGet(INPUT_DATA.value)

    if(success)
    {
      if (decrypt(data.WAYBILL_STAUS_ID) === '1')
      {
        const WAYBILL_START_NO = decrypt(data.WAYBILL_START_NO)
        const WAYBILL_END_NO = decrypt(data.WAYBILL_END_NO)

        //Message.value = WAYBILL_START_NO + ' ' + WAYBILL_END_NO
        const TEST_DATA = ''
        const FLT_ORDERS = []
        let OrderDataCnt = 0

        if (decrypt(props.OrgWayBill) == '' )
        {
          for (let i = Number(WAYBILL_START_NO); i <= Number(WAYBILL_END_NO); i++)
          {
            FLT_ORDERS.push({
              ORDER_SID : props.OrderData[OrderDataCnt].ORD_SID,
              BRAND_CODE : props.OrderData[OrderDataCnt].BRAND_CODE,
              CHANNEL_CODE : props.OrderData[OrderDataCnt].CHANNEL_CODE,
              COURIER_SID : props.CourierSID,
              REQUEST_DATETIME : data.WAYBILL_REQUEST_DATETIME,
              WAYBILL_NO : encrypt(i.toString())
            })
            OrderDataCnt = OrderDataCnt + 1
          }
          
          const WAYBILL_SET_DATA = {
            FLT_ORDERS: FLT_ORDERS,
          }

          await PrintDetail.fetchWaybillAddSet(WAYBILL_SET_DATA)
        }
        else
        {
          for (let i = Number(WAYBILL_START_NO); i <= Number(WAYBILL_END_NO); i++)
          {
            FLT_ORDERS.push({
              ORDER_SID : props.OrderData[OrderDataCnt].ORD_SID,
              BRAND_CODE : props.OrderData[OrderDataCnt].BRAND_CODE,
              CHANNEL_CODE : props.OrderData[OrderDataCnt].CHANNEL_CODE,
              COURIER_SID : props.CourierSID,
              REQUEST_DATETIME : data.WAYBILL_REQUEST_DATETIME,
              WAYBILL_NO : encrypt(i.toString()),
              NEW_WAYBILL_NO : props.OrgWayBill
            })
            OrderDataCnt = OrderDataCnt + 1
          }
          
          const WAYBILL_SET_DATA = {
            FLT_ORDERS: FLT_ORDERS,
          }

          await PrintDetail.fetchWaybillChange(WAYBILL_SET_DATA)
        }

      }
      else
      {
        Message.value = decrypt(data.WAYBILL_REMARK)
      }
    }
  }

  emits('btn-print')
}

</script>

<template>
  <div class="relative">
    <div
      class="flex flex-col justify-center pb-5 pt-3 gap-y-4 border-b"
    >
      <span
        class="text-lg leading-6 font-medium text-gray-900"
      >
        {{ PrintTitle }}
      </span>
      <span
        class="text-lg leading-6 font-medium text-gray-900"
      >
        {{ 'Print Count : ' + PrintCount +'/'+ TotalCount}}
      </span>
      <span
        class="text-lg leading-6 font-medium text-gray-900"
      >
        {{ Message }}
      </span>
    </div>

    
    <div class="grid grid-cols-2 gap-x-4 pt-3 pl-3 pr-3 items-center">
      <div class="col-span-1 text-start">
        <Button
          variant="gray"
          rounded
          size="sm"
          class="w-30"
          @click="() => {
            emits('btn-cancel')
          }"
        >
          {{ getComponentData('POP00390_BTN00001', 'caption', 'Cancel') }}
        </Button>
      </div>
      <div class="col-span-1 text-end">
        <Button
          variant="gray"
          rounded
          size="sm"
          class="w-30"
          @click="onClickPrint"
        >
          {{ getComponentData('POP00390_BTN00002', 'caption', 'Print') }}
        </Button>
      </div>
    </div>    
  </div>
</template>

<style scoped>

</style>
