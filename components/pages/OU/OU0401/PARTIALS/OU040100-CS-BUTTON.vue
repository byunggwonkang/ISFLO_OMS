<script setup>
const props = defineProps({
  informationForm: {
    type: Object,
    default: () => {}
  },
})

const claimManagement = useClaimManagementStore()
const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '', 'POP00240', 'POP00230'])
const { loading, toggleLoading } = useLoading()
const actionType = ref('')

const formData = ref({
  ...props.informationForm
})

const onClickChangeStatus = async (type, code, comment) => {
  actionType.value = type
  formData.value.FLT_CS_TYPE_CODE = code
  toggleLoading()
  const { success } = await claimManagement.saveCSDetail(formData.value)
  if (success) {
    await claimManagement.saveComment({
      FLT_CS_SID: formData.value.FLT_CS_SID,
      FLT_COMMENT_TYPE_CODE: '0010',
      FLT_COMMENT: comment
    })
  }
  toggleLoading()
}
</script>

<template>
  <div>
    <div class="grid-cols-5 grid gap-x-3">
      <Button
        id="OU040100_BTN01003"
        variant="gray"
        rounded
        size="lg"
        :disabled="loading"
        :loading="loading && actionType === 'NEW_ORDER'"
      >
        {{ getComponentData('OU040100_BTN01003', 'caption') }}
      </Button>

      <Button
        id="OU040100_BTN01004"
        variant="gray"
        rounded
        size="lg"
        :disabled="loading"
        :loading="loading && actionType === 'REPAIR'"
        @click="onClickChangeStatus('REPAIR', formData.FLT_CS_TYPE_CODE, 'Change to Repair')"
      >
        {{ getComponentData('OU040100_BTN01004', 'caption') }}
      </Button>

      <Button
        id="OU040100_BTN01005"
        variant="gray"
        rounded
        size="lg"
        :disabled="loading"
        :loading="loading && actionType === 'RETURN'"
      >
        {{ getComponentData('OU040100_BTN01005', 'caption') }}
      </Button>

      <Button
        id="OU040100_BTN01006"
        variant="gray"
        rounded
        size="lg"
        :disabled="loading"
        :loading="loading && actionType === 'EXCHANGE'"
      >
        {{ getComponentData('OU040100_BTN01006', 'caption') }}
      </Button>

      <Button
        id="OU040100_BTN01007"
        variant="gray"
        rounded
        size="lg"
        :disabled="loading"
        :loading="loading && actionType === 'CLOSE'"
        @click="onClickChangeStatus('CLOSE', '0030', 'Closed')"
      >
        {{ getComponentData('OU040100_BTN01007', 'caption') }}
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
