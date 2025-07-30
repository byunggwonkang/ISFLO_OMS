<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
const props = defineProps({
  channeldata: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const InputData = ref([])
const selectAll = ref(false)

watch(selectAll, (value) => {
  if (value) {
    ChannelDatas.value = ChannelDatasSetting.value
  } else {
    ChannelDatas.value = []
  }
})
const emits = defineEmits(['dataChanged'])
const success = ref(false)

const pageLoader = usePageLoaderStore()

const ChannelDatas = ref([
  ...props.channeldata.STATION_CHANNEL_LIST  
])

const stationsSettings = stationsSettingsStore()

const { currentTab } = storeToRefs(useTabsStore())
const { ChannelList } = storeToRefs(stationsSettings)

const { getComponentData } = usePageLoaderComponent(['POP00350'])
const { getGridData } = usePageLoaderGrid(['POP00350'])
const { loading, toggleLoading } = useLoading()

const onClickAdd = async () => {  
  
  if (success){
    for (let i = 0; i < ChannelDatas.value.length; i++) 
    {  
      for (let j = 0; j < InputData.value.length; j++) 
      {
        if (ChannelDatas.value[i].CHANNEL_CODE == InputData.value[j].CHANNEL_CODE)
        {
          if (InputData.value[j].CHANNEL_BILLNO_TYPE)
          {
            ChannelDatas.value[i].CHANNEL_BILLNO_BEGIN = ''
            ChannelDatas.value[i].CHANNEL_BILLNO_END = ''
            ChannelDatas.value[i].CHANNEL_BILLNO_CURRENT = ''
          }
          else 
          {
            ChannelDatas.value[i].CHANNEL_BILLNO_BEGIN = InputData.value[j].CHANNEL_BILLNO_BEGIN
            ChannelDatas.value[i].CHANNEL_BILLNO_END = InputData.value[j].CHANNEL_BILLNO_END
            ChannelDatas.value[i].CHANNEL_BILLNO_CURRENT = InputData.value[j].CHANNEL_BILLNO_CURRENT
          }
          ChannelDatas.value[i].CHANNEL_BILLNO_TYPE = InputData.value[j].CHANNEL_BILLNO_TYPE
          break
        }
      }

         
    }

    emits('dataChanged', {
      ChannelDatas,
    });
  }
};


const ChannelDatasSetting = computed(() => {
  const ChannelDatas2 = [];
  for (let i = 0; i < ChannelList.value.length; i++) {  
    
    const Channel = ref({})    
    Channel.value[`CHANNEL_BRAND_CODE`] = decrypt(ChannelList.value[i].BRAND_CODE);
    Channel.value[`CHANNEL_BRAND_SNAME`] = decrypt(ChannelList.value[i].BRAND_SNAME);    
    Channel.value[`CHANNEL_CODE`] = decrypt(ChannelList.value[i].CHANNEL_CODE);
    Channel.value[`CHANNEL_COURIER_FNAME`] = decrypt(ChannelList.value[i].COURIER_FNAME);
    Channel.value[`CHANNEL_COURIER_SID`] = decrypt(ChannelList.value[i].COURIER_SID);
    Channel.value[`CHANNEL_COURIER_SNAME`] = decrypt(ChannelList.value[i].COURIER_SNAME);
    Channel.value[`CHANNEL_DESCR`] = decrypt(ChannelList.value[i].CHANNEL_DESCR);
    Channel.value[`CHANNEL_ACTIVE_YN`] = decrypt(ChannelList.value[i].CHANNEL_ACTIVE_YN);
    Channel.value[`CHANNEL_BILLNO_TYPE`] = false;
    Channel.value[`CHANNEL_BILLNO_BEGIN`] = '0';
    Channel.value[`CHANNEL_BILLNO_END`] = '0';
    Channel.value[`CHANNEL_BILLNO_CURRENT`] = '0';

    for (let j = 0; j < props.channeldata.STATION_CHANNEL_LIST.length; j++) {
      if (decrypt(ChannelList.value[i].CHANNEL_CODE) === props.channeldata.STATION_CHANNEL_LIST[j].CHANNEL_CODE)
      {                
        Channel.value[`CHANNEL_BILLNO_TYPE`] = props.channeldata.STATION_CHANNEL_LIST[j].CHANNEL_BILLNO_TYPE;        
        Channel.value[`CHANNEL_BILLNO_BEGIN`] = props.channeldata.STATION_CHANNEL_LIST[j].CHANNEL_BILLNO_BEGIN;
        Channel.value[`CHANNEL_BILLNO_END`] = props.channeldata.STATION_CHANNEL_LIST[j].CHANNEL_BILLNO_END;
        Channel.value[`CHANNEL_BILLNO_CURRENT`] = props.channeldata.STATION_CHANNEL_LIST[j].CHANNEL_BILLNO_CURRENT;
        break;
      }      
    }
    InputData.value.push({
      CHANNEL_CODE : Channel.value.CHANNEL_CODE,
      CHANNEL_BILLNO_TYPE : Channel.value.CHANNEL_BILLNO_TYPE,
      CHANNEL_BILLNO_BEGIN : Channel.value.CHANNEL_BILLNO_BEGIN,
      CHANNEL_BILLNO_END : Channel.value.CHANNEL_BILLNO_END,
      CHANNEL_BILLNO_CURRENT : Channel.value.CHANNEL_BILLNO_CURRENT
    })

    ChannelDatas2.push(Channel.value)
  }

  return ChannelDatas2;
})


onMounted(async () => {
  //await pageLoader.fetchPageLoadData('POP00350')
  await stationsSettings.fetchChannelList(props.channeldata.STATION_WH_CODE)
  success.value = false
  //ChannelDatasSetting()
})
</script>

<template>
  <div class="relative space-y-3">
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>            
        <p class="leading-6 font-medium text-sm text-gray-900">
          {{ getGridData('POP00350_LBL00002', 'caption', 'Detail Of Station') }}
        </p>
      </template>
      <div class="grid grid-cols-4 gap-y-3 gap-x-12">
        <FormGroup
          :label="getComponentData('POP00350_LBL00003', 'caption', 'User ID')"
          label-id="POP00350_LBL00003"
          label-for="POP00350_TXT00001"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="POP00350_TXT00001"        
            :value="props.channeldata.USER_SID"    
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00350_LBL00004', 'caption', 'User Code')"
          label-id="POP00350_LBL00004"
          label-for="POP00350_TXT00002"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="POP00350_TXT00002"
            :value="props.channeldata.USER_CODE"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00350_LBL00005', 'caption', 'User Name')"
          label-id="POP00350_LBL00005"
          label-for="POP00350_TXT00003"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="POP00350_TXT00003"
            :value="props.channeldata.USER_FNAME"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00350_LBL00006', 'caption', 'Group')"
          label-id="POP00350_LBL00006"
          label-for="POP00350_TXT00004"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="POP00350_TXT00004"
            :value="props.channeldata.USER_GROUP_FNAME"         
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00350_LBL00007', 'caption', 'Station No')"
          label-id="POP00350_LBL00007"
          label-for="POP00350_TXT00005"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="POP00350_TXT00005"
            :value="props.channeldata.STATION_ID"
            disabled         
          />
        </FormGroup>
        
        <FormGroup
          :label="getComponentData('POP00350_LBL00008', 'caption', 'Warehouse')"
          label-id="POP00350_LBL00008"
          label-for="POP00350_TXT00006"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="POP00350_TXT00006"
            :value="props.channeldata.STATION_WH_FNAME"                
            disabled        
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00350_LBL00009', 'caption', 'Brand')"
          label-id="POP00350_LBL00009"
          label-for="POP00350_TXT00007"
          horizontal
          label-width="w-2/4"
        >
          <FormTextInput
            id="POP00350_TXT00007"
            :value="props.channeldata.STATION_WH_BRAND_FNAME"
            disabled
          />
        </FormGroup>    
      </div>                
    </Card>    
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >
      <template #header>
        <p class="leading-6 font-medium text-sm text-gray-900">
          {{ getGridData('POP00350_GRD00001', 'caption', 'Channels') }}
        </p>
      </template>     
      <Table
        id="POP00350_GRD00001"
        header-variant="secondary"
        checkable
      >
        <TableHead>
          <template #checkbox>
            <FormCheckbox
              v-model="selectAll"
              :value="true"
            />
          </template>
          <TableHeadCell class="text-center">
            Channel
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Courier
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Tracking No
            via API
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Begin No
          </TableHeadCell>
          <TableHeadCell class="text-center">
            End No
          </TableHeadCell>
          <TableHeadCell class="text-center">
            Current No
          </TableHeadCell>
        </TableHead>
        <TableBody>
          <TableRow
            v-for="(option, index) in ChannelDatasSetting"
            :key="index"
          >
            <template #checkbox>
              <FormCheckbox
                v-model="ChannelDatas"
                :value="option"
              />
            </template>            
            <TableCell make-condensed>
              {{ option.CHANNEL_DESCR }}
            </TableCell>
            <TableCell>
              {{ option.CHANNEL_COURIER_FNAME }}
            </TableCell>            
            <TableCell class="text-center">
              <div>
                <FormCheckbox 
                  v-model="InputData[index].CHANNEL_BILLNO_TYPE"
                  :checked="InputData[index].CHANNEL_BILLNO_TYPE"
                /> 
              </div>               
            </TableCell>
            <TableCell make-condensed>
              <FormTextInput 
                v-model="InputData[index].CHANNEL_BILLNO_BEGIN"
                :value="InputData[index].CHANNEL_BILLNO_BEGIN"
                type="number"
              />
            </TableCell>
            <TableCell make-condensed>
              <FormTextInput 
                v-model="InputData[index].CHANNEL_BILLNO_END"               
                :value="InputData[index].CHANNEL_BILLNO_END"
                type="number"
              />
            </TableCell>
            <TableCell make-condensed>
              <FormTextInput 
                v-model="InputData[index].CHANNEL_BILLNO_CURRENT"
                :value="InputData[index].CHANNEL_BILLNO_CURRENT"
                type="number"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>   
    </Card>   
    <div
      class="flex justify-end pb-1"
    >
      <Button
        variant="gray"
        rounded
        size="sm"
        class="w-30"
        @click="() => {
          success = true,
          onClickAdd()
        }"
      >
        {{ getComponentData('POP00060_BTN01001', 'caption', 'Add') }}
      </Button>
    </div> 
  </div>
</template>

<style scoped>

</style>
