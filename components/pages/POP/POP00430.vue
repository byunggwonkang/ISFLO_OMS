<script setup>

const { getComponentData } = usePageLoaderComponent(['POP00430'])

const ReturnInspection = useReturnInspectionStore()
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()

const { userGroupBrandList } = storeToRefs(ReturnInspection)

const { loading, toggleLoading } = useLoading()
const emits = defineEmits(['btn-save','btn-cancel'])
const brand = ref({})
const courier = ref({})

const formData = ref({
  FLT_RETURN_SID: '',
  FLT_RETURN_BRAND: '',
  FLT_RETURN_TYPE: 'U',
  FLT_RETURN_REASON: '',
  FLT_RETURN_SENDER_FULL_NAME: '',
  FLT_RETURN_SENDER_MOBILE: '',
  FLT_RETURN_SENDER_TEL: '',
  FLT_RETURN_SENDER_POST: '',
  FLT_RETURN_SENDER_ADDR1: '',
  FLT_RETURN_SENDER_ADDR2: '',
  FLT_RETURN_CURRIOR: '',
  FLT_RETURN_TRACKING_NO: '',
})

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

function formatPhone(event) {
  let value = event.target.value.replace(/\D/g, '') // 숫자만 남김

  if (value.length < 4) { /* empty */ } 
  else if (value.length < 8) {
    value = `${value.slice(0, 3)}-${value.slice(3)}`
  } else if (value.length == 9) {
    value = `${value.slice(0, 2)}-${value.slice(2, 5)}-${value.slice(5, 9)}`
  } else if (value.length == 10) {
    value = `${value.slice(0, 2)}-${value.slice(2, 6)}-${value.slice(6, 10)}`
  } else {
    value = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
  }

  event.target.value = value
}

function formatTraking(event) {
  const value = event.target.value.replace(/[^0-9-]/g, '');
  event.target.value = value
}

onMounted(async () => {
  await ReturnInspection.fetchUserGroupBrandList()
  await commonData.fetchPOP00430CommonData()

 
  brand.value= {
    name: 'Unverified brand',
    value: '',
  }

  courier.value= {
    name: commonData.getCurriorList[0].name,
    value: commonData.getCurriorList[0].value,
  }
})

const CreateUnverifiedReturn = async () => {
  
  DIALOG_TYPE.value = 'CREATE'
  DIALOG_TITLE.value = 'Unverified Return Create'
  DIALOG_TEXT.value = 'Do you want to create an Unverified Return?'

  openDialogModal.value = true
}

const ConfirmDialog = async () => {

  if(DIALOG_TYPE.value == 'CREATE')
  {
    formData.value.FLT_RETURN_BRAND = brand?.value.value ?? '';
    formData.value.FLT_RETURN_CURRIOR = courier?.value.value ?? '';
    const { success,RETURN_SID } = await ReturnInspection.fetchReturnInspectionHstSet(formData.value)
    
    if (success) {emits('btn-save',{
      RET_SID : RETURN_SID,
      RET_TYPE_CODE : encrypt(formData.FLT_RETURN_TYPE),
    })}
  }

  openDialogModal.value = false
}

</script>

<template>
  <div class="relative space-y-3">
    <div class="grid grid-cols-3 gap-x-2">
      <Card
        divider
        shadow-size="none"
              card-header-class="px-3 py-2.5 space-y-1"
              class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
        card-body-class="p-2 space-y-3"
      >
        <template #header>                      
          <p>
            {{ getComponentData('EU040300_LBL00007', 'caption', 'Return Information') }}
          </p>        
        </template>
        <FormGroup
          :label="getComponentData('EU040300_LBL00008', 'caption', 'Brand')"
          label-id="EU040300_LBL00008"
          horizontal
          label-width="w-1/4"
          input-width="w-3/4"
        >
          <FormSelect
            id="EU040300_CMB00002"
            v-model="brand"
            :options="[
              {
                name: 'Unverified brand',
                value: '',
              },
              ...userGroupBrandList.map((brand) => ({
                name: decrypt(brand.USER_BRAND_FNAME),
                value: parseInt(decrypt(brand.USER_BRAND_CODE)).toString(),
              }))
            ]"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU040300_LBL00020', 'caption', 'Courier')"
          label-id="EU040300_LBL00020"
          horizontal                      
          label-width="w-1/4"
          input-width="w-3/4"
        >
          <FormSelect
            id="EU040300_CMB00002"
            v-model="courier"
            :options="commonData.getCurriorList"
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('EU040300_LBL00021', 'caption', 'Tracking No.')"
          label-id="EU040300_LBL00021"
          horizontal
          label-width="w-1/4"
          input-width="w-3/4"
        >
          <FormTextInput
            id="EU040300_TXT00016"
            v-model="formData.FLT_RETURN_TRACKING_NO"
            autocomplete="off"
            @input="formatTraking"
          />                       
        </FormGroup>  
      </Card> 
      <div class="col-span-2">
        <Card
          divider
          shadow-size="none"
          card-header-class="px-3 py-2.5 space-y-1"
          class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
          card-body-class="p-2 space-y-3"
        >
          <template #header>                      
            <p>
              {{ getComponentData('EU040300_LBL00007', 'caption', 'Sender Information') }}
            </p>        
          </template>
          <div class="grid grid-cols-2 gap-x-3 gap-y-3">                 
            <FormGroup
              :label="getComponentData('EU040300_LBL00015', 'caption', 'Sender Name')"
              label-id="EU040300_LBL00015"
              horizontal
              label-width="w-1/3"
              input-width="w-2/3"
            >
              <FormTextInput
                id="EU040300_TXT00011"
                v-model="formData.FLT_RETURN_SENDER_FULL_NAME"
                autocomplete="off"
              />
            </FormGroup>
            <FormGroup />
            <FormGroup
              :label="getComponentData('EU040300_LBL00016', 'caption', 'Sender Mobile')"
              label-id="EU040300_LBL00016"
              horizontal
              label-width="w-1/3"
              input-width="w-2/3"
            >
              <FormTextInput
                id="EU040300_TXT00012"
                v-model="formData.FLT_RETURN_SENDER_MOBILE"
                autocomplete="off"
                maxlength="13"
                @input="formatPhone"
              />
            </FormGroup>
            <FormGroup
              :label="getComponentData('EU040300_LBL00016', 'caption', 'Sender Tel')"
              label-id="EU040300_LBL00016"
              horizontal
              label-width="w-1/3"
              input-width="w-2/3"
            >
              <FormTextInput
                id="EU040300_TXT00012"
                v-model="formData.FLT_RETURN_SENDER_TEL"
                autocomplete="off"
                maxlength="13"
                @input="formatPhone"
              />
            </FormGroup>                                  
          </div>          
          <FormGroup
            :label="getComponentData('EU040300_LBL00017', 'caption', 'Sender Address')"
            label-id="EU040300_LBL00017"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="EU040300_TXT00013"
              v-model="formData.FLT_RETURN_SENDER_ADDR1"
              autocomplete="off"
            />
          </FormGroup>
          <FormGroup
            :label="getComponentData('EU040300_LBL00017', 'caption', 'Sender Address2')"
            label-id="EU040300_LBL00017"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="EU040300_TXT00013"
              v-model="formData.FLT_RETURN_SENDER_ADDR2"
              autocomplete="off"
            />
          </FormGroup>
        </Card> 
      </div>   
    </div>    
    <div class="flex space-x-6 items-center justify-end">
      <Button
        id="EU040300_BTN00002"
        rounded
        class="w-32"
        variant="gray"
        :loading="loading"
        @click="CreateUnverifiedReturn"
      >
        {{ getComponentData('EU040300_BTN00002', 'caption', 'SAVE') }}
      </Button>  
      <Button
        id="EU040300_BTN00003"
        rounded
        class="w-32"
        variant="gray"
        :loading="loading"
        @click="() => {
          emits('btn-cancel')
        }"
      >
        {{ getComponentData('EU040300_BTN00003', 'caption', 'CANCEL') }}
      </Button>  
    </div>
    <!-- Dialog Modal -->
    <Modal
      :show="openDialogModal"
      divider
      @close="() => {
        openDialogModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00001_LBL00001', 'caption', 'Information') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00001'"
          :dialog-title="DIALOG_TITLE"
          :dialog-text="DIALOG_TEXT"
          @btn-confirm="ConfirmDialog"
          @btn-cancel="() => {
            openDialogModal = false
          }"
        />
      </template>
    </Modal>  
  </div>
</template>
<style scoped>

</style>
