<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
const props = defineProps({
  comment: {
    type: String,
    default: '',
  },
  commentItem: {
    type: Object,
    default: () => {}
  },
})
const CommentData = ref("")
const CommentSKU = ref("")
const CommentBarcode = ref("")
const CommentDesc = ref("")
const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])
const emits = defineEmits(['btn-save','btn-cancel'])

onMounted(async () => {
  CommentData.value = props.comment
  CommentSKU.value = decrypt(props.commentItem.RETURN_INSPECTION_ITEM_CODE)
  CommentBarcode.value = decrypt(props.commentItem.RETURN_INSPECTION_ITEM_EAN)
  CommentDesc.value = decrypt(props.commentItem.RETURN_INSPECTION_ITEM_FNAME)
})

</script>

<template>
  <div class="relative">
    <div class="flex flex-col justify-center pb-5 pt-3 gap-y-4 border-b">
      <div class="grid grid-cols-2 gap-x-3 gap-y-3"> 
        <FormGroup
          :label="getComponentData('POP00420_LBL00011', 'caption', 'SKU')"
          label-id="POP00420_LBL00011"
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
        >
          <FormTextInput
            id="POP00420_TXT00007"
            v-model="CommentSKU"
            class="bg-gray-100"
            readonly
          />
        </FormGroup>
        <FormGroup
          :label="getComponentData('POP00420_LBL00011', 'caption', 'Barcode')"
          label-id="POP00420_LBL00011"
          horizontal
          label-width="w-1/3"
          input-width="w-2/3"
        >
          <FormTextInput
            id="POP00420_TXT00007"
            v-model="CommentBarcode"
            class="bg-gray-100"
            readonly
          />
        </FormGroup>
      </div>
      <FormGroup
          :label="getComponentData('POP00420_LBL00011', 'caption', 'Desc.')"
          label-id="POP00420_LBL00011"
          horizontal
          label-width="w-1/6"
          input-width="w-5/6"
        >
          <FormTextInput
            id="POP00420_TXT00007"
            v-model="CommentDesc"
            class="bg-gray-100"
            readonly
          />
        </FormGroup>
      <FormTextareaInput
        id="POP00420_TXT00006"
        v-model="CommentData"
        rows="10"
      />
    </div>
    
    <div class="grid grid-cols-2 gap-x-4 pt-3 pl-3 pr-3 items-center">
      <div class="col-span-1 text-start">
        <Button
          variant="gray"
          rounded
          size="sm"
          class="w-30"
          @click="() => {
            emits('btn-save',CommentData)
          }"
        >
          {{ getComponentData('POP00001_BTN00001', 'caption', 'Save') }}
        </Button>
      </div>
      <div class="col-span-1 text-end">
        <Button
          variant="gray"
          rounded
          size="sm"
          class="w-30"
          @click="() => {
            emits('btn-cancel')
          }"
        >
          {{ getComponentData('POP00001_BTN00002', 'caption', 'Cancel') }}
        </Button>
      </div>
    </div>    
  </div>
</template>

<style scoped>

</style>
