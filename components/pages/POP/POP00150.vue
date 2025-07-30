<script setup>
const notice = useNoticeStore()

const props = defineProps({
  noticeData: {
    type: Object,
    required: true,
  },
})

const noticeDetail = ref({
  NOTICE_SID: '',
  NOTICE_DATE: '',
  NOTICE_TIME: '',
  NOTICE_STATUS_CODE: '',
  NOTICE_STATUS_SNAME: '',
  NOTICE_STATUS_FNAME: '',
  NOTICE_USER_SID: '',
  NOTICE_USER_NAME: '',
  NOTICE_TITLE: '',
  NOTICE_MESSAGE: '',
  NOTICE_READ_YN: '',
  NOTICE_READ_DATE: '',
  NOTICE_READ_TIME: '',
  NOTICE_FILE_COUNT: '',
  NOTICE_USER_COUNT: '',
  NOTICE_USERS: [],
  NOTICE_FILES: []
})

const { getComponentData } = usePageLoaderComponent(['POP00150'])
const { getGridData } = usePageLoaderGrid(['POP00150'])

const fetchNoticeDetail = async () => {
  const { data, success } = await notice.fetchNoticeDetail(props.noticeData.NOTICE_SID)
  if (success) {
    noticeDetail.value = data
    await notice.setAsReadNotice(props.noticeData.NOTICE_SID)
  }
}

onBeforeMount(async () => {
  await fetchNoticeDetail()
})
</script>

<template>
  <div class="grid grid-cols-5 gap-x-3">
    <div class="col-span-3">
      <Card
        divider
        shadow-size="none"
        class="ring-1 ring-black ring-opacity-10 min-h-full"
        card-header-class="px-2 py-1.5 space-y-3"
        card-body-class="px-2 space-y-1 overflow-y-auto"
      >
        <template #header>
          <p class="leading-6 font-medium text-sm text-gray-900">
            {{ noticeDetail.NOTICE_TITLE }}
          </p>
        </template>

        <div class="py-1">
          <p class="text-sm text-gray-500 text-justify">
            {{ noticeDetail.NOTICE_MESSAGE }}
          </p>
        </div>
      </Card>
    </div>

    <div class="col-span-2 space-y-3">
      <FormGroup
        :label="getComponentData('POP00150_LBL01003', 'caption')"
        label-id="POP00150_LBL01002"
        label-for="POP00150_TXT01001"
        horizontal
        label-width="w-2/4"
      >
        <FormTextInput
          id="POP00150_TXT01001"
          v-model="noticeDetail.NOTICE_USER_NAME"
          disabled
        />
      </FormGroup>

      <FormGroup
        :label="getComponentData('POP00150_LBL01004', 'caption')"
        label-id="POP00150_LBL01004"
        label-for="POP00150_TXT01002"
        horizontal
        label-width="w-2/4"
      >
        <FormTextInput
          id="POP00150_TXT01002"
          disabled
          :model-value="`${noticeDetail.NOTICE_DATE} ${noticeDetail.NOTICE_TIME}`"
        />
      </FormGroup>

      <Card
        divider
        shadow-size="none"
        class="ring-1 ring-black ring-opacity-10 sm:rounded-lg min-h-[220px]"
        card-header-class="px-2 py-1.5 space-y-3"
        card-body-class="px-2 space-y-1 overflow-y-auto"
      >
        <template #header>
          <p class="leading-6 font-medium text-sm text-gray-900">
            {{ getGridData('POP00150_GRD01001', 'caption') }}
          </p>
        </template>

        <div class="space-y-3 py-1">
          <div
            v-for="(item, index) in noticeDetail.NOTICE_FILES"
            :key="index"
            class="flex justify-between items-center"
          >
            <div>
              <a
                :href="item.NOTICE_FILE_URL"
                target="_blank"
                class="text-sm text-gray-700 underline underline-offset-2"
              >
                {{ item.NOTICE_FILE_NAME }}
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>

</style>
