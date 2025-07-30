<script setup>
const props = defineProps({
  csId: {
    type: String,
    default: ''
  },
})

const commonData = useCommonDataStore()
const { getComponentData } = usePageLoaderComponent(['POP00240', 'POP00230'])

const claimManagement = useClaimManagementStore()

const commentType = ref(null)

watch(() => commentType.value, (value) => {
  commentFormData.value.FLT_COMMENT_TYPE_CODE = value.value
})

const defaultFormData = {
  FLT_CS_SID: props.csId,
  FLT_COMMENT_TYPE_CODE: '',
  FLT_COMMENT: '',
}
const { loading, toggleLoading } = useLoading()
const commentFormData = ref(defaultFormData)

const resetForm = () => {
  commentFormData.value = defaultFormData
}

const emits = defineEmits(['saveComment'])

const saveComment = async () => {
  toggleLoading()
  await claimManagement.saveComment(commentFormData.value)
  toggleLoading()
  emits('saveComment')
  resetForm()
}

const commentTypeOptions = computed(() => {
  return commonData.getCsCommentTypeOptions.filter((item) => item.name !== 'System')
})

onMounted(async () => {
  await commonData.fetchPOP00230CommonData();
  const filtered = commonData.getCsCommentTypeOptions.filter((item) => item.name !== 'System');
  commentType.value = filtered[0] ?? {};
})
</script>

<template>
  <div class="space-y-3">
    <div>
      <FormGroup
        :label="getComponentData('POP00230_LBL01001', 'caption')"
        horizontal
      >
        <FormSelect
          v-model="commentType"
          :options="commentTypeOptions"
        />
      </FormGroup>
    </div>
    <div>
      <FormTextareaInput
        v-model="commentFormData.FLT_COMMENT"
        :rows="10"
      />
    </div>
    <div class="text-end">
      <Button
        variant="gray"
        rounded
        size="sm"
        :disabled="loading"
        :loading="loading"
        @click="saveComment"
      >
        {{ getComponentData('POP00230_BTN01001', 'caption') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
