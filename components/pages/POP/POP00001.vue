<script setup>
const props = defineProps({
  dialogTitle: {
    type: String,
    default: '',
  },
  dialogText: {
    type: String,
    default: '',
  },
})
const PrintTitle = ref("")
const Message = ref("")
const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? ''])
const emits = defineEmits(['btn-confirm','btn-cancel'])

onMounted(async () => {
  PrintTitle.value = props.dialogTitle
  Message.value = props.dialogText
})

</script>

<template>
  <div class="relative">
    <div
      class="flex flex-col justify-center pb-5 pt-3 gap-y-4 border-b"
    >
      <span
        class="text-sm font-black text-gray-700"
      >
        {{ "["+props.dialogTitle+"]" }}
      </span>
      <span
        class="text-lg leading-6 font-medium text-gray-900"
        style="white-space: pre-line;"
      >
        {{ props.dialogText }}
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
            emits('btn-confirm')
          }"
        >
          {{ getComponentData('POP00001_BTN00001', 'caption', 'Confirm') }}
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
