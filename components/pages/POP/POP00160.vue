<script setup>
import {PlusIcon} from "@heroicons/vue/24/solid/index.js";

const props = defineProps({
  noticeData: {
    type: Object,
    required: true,
    default: () => ({
      NOTICE_SID: '',
      NOTICE_STATUS_SNAME: ''
    })
  },
})

const notice = useNoticeStore()
const pageLoader = usePageLoaderStore()

const { userStoreList } = storeToRefs(notice)

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(userStoreList, perPage.value);
const { loading, toggleLoading } = useLoading()

const { getComponentData } = usePageLoaderComponent(['POP00160'])
const { getGridData } = usePageLoaderGrid(['POP00160'])

const emit = defineEmits(['noticeSaved'])

const formData = ref({
  FLT_NOTICE_SID: '',
  FLT_NOTICE_STATUS_CODE: '0020',
  FLT_NOTICE_TITLE: '',
  FLT_NOTICE_MESSAGE: '',
  FLT_NOTICE_USERS: [],
  FLT_NOTICE_FILES: []
})

const selectAll = ref(false);
watch(selectAll, (value) => {
  formData.value.FLT_NOTICE_USERS = value ? userStoreList.value.map((item) => ({ NOTICE_USER_SID: item.USER_SID })) : [];
})

const file = ref({
  NOTICE_FILE_NAME: '',
  NOTICE_FILE_URL: ''
})

const setFormData = async () => {
  const { data } = await notice.fetchNoticeDetail(props.noticeData.NOTICE_SID)

  formData.value = {
    FLT_NOTICE_SID: data.NOTICE_SID,
    FLT_NOTICE_STATUS_CODE: data.NOTICE_STATUS_CODE,
    FLT_NOTICE_TITLE: data.NOTICE_TITLE,
    FLT_NOTICE_MESSAGE: data.NOTICE_MESSAGE,
    FLT_NOTICE_USERS: data.NOTICE_USERS.map((item) => ({
      NOTICE_USER_SID: item.NOTICE_USER_SID
    })),
    FLT_NOTICE_FILES: data.NOTICE_FILES.map((item) => ({
      NOTICE_FILE_NAME: item.NOTICE_FILE_NAME,
      NOTICE_FILE_URL: item.NOTICE_FILE_URL
    }))
  }
}

const fetchUserStoreList = async () => {
  await notice.fetchUserStoreList()

  if (props.noticeData.NOTICE_SID) {
    setFormData()
  }
}

onBeforeMount(async () => {
  await fetchUserStoreList()
})

const userStoreListTableFields = computed(() => {
  return pageLoader.getTableData('POP00160', 'POP00160_GRD01002')
})

const onClickRefresh = async () => {
  toggleLoading()
  await fetchUserStoreList()
  toggleLoading()
  resetPage()
}

const noticeStatusButton = ref({
  loading: false,
  status: null,
})

const onClickChangeNoticeStatus = async (code) => {
  if (!formData.value.FLT_NOTICE_SID) {
    return
  }

  noticeStatusButton.value.loading = true
  noticeStatusButton.value.status = code

  formData.value.FLT_NOTICE_STATUS_CODE = code

  await notice.saveNoticeDetail(formData.value)

  noticeStatusButton.value.loading = false
  noticeStatusButton.value.status = null

  emit('noticeSaved')
}

const openFileModal = ref(false)

const addFile = () => {
  formData.value.FLT_NOTICE_FILES.push(file.value)
  openFileModal.value = false
  file.value = {
    NOTICE_FILE_NAME: '',
    NOTICE_FILE_URL: ''
  }
}

const saving = ref(false)
const onSaveNotice = async () => {
  saving.value = true
  await notice.saveNoticeDetail(formData.value)
  saving.value = false

  emit('noticeSaved')
}
</script>

<template>
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-x-6">
      <div class="space-y-3">
        <FormGroup
          :label="getComponentData('POP00160_LBL01002', 'caption')"
          label-id="POP00160_LBL01002"
          label-for="POP00160_TXT01001"
          horizontal
        >
          <FormTextInput
            id="POP00160_TXT01001"
            v-model="formData.FLT_NOTICE_SID"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('POP00160_LBL01003', 'caption')"
          label-id="POP00160_LBL01003"
          label-for="POP00160_TXT01002"
          horizontal
        >
          <FormTextInput
            id="POP00160_TXT01002"
            v-model="formData.FLT_NOTICE_TITLE"
          />
        </FormGroup>

        <div>
          <FormTextareaInput
            v-model="formData.FLT_NOTICE_MESSAGE"
            rows="7"
          />
        </div>

        <Card
          divider
          shadow-size="none"
          class="ring-1 ring-black ring-opacity-10 sm:rounded-lg min-h-[220px]"
          card-header-class="px-2 py-1.5 space-y-3"
          card-body-class="px-2 space-y-1 overflow-y-auto"
        >
          <template #header>
            <div class="flex justify-between items-center">
              <p class="leading-6 font-medium text-sm text-gray-900">
                {{ getGridData('POP00160_GRD01001', 'caption') }}
              </p>

              <Button
                v-tooltip="{
                  content: getComponentData('POP00160_BTN01003', 'caption'),
                  placement: 'left',
                  trigger: 'hover',
                  distance: 10,
                  delay: 100,
                  popperClass: 'bg-black text-white rounded-md'
                }"
                rounded
                variant="white"
                border
                size="xs"
                @click="openFileModal = true"
              >
                <PlusIcon class="w-4 h-4" />
              </Button>
            </div>
          </template>

          <div class="space-y-3 py-1">
            <div
              v-for="(item, index) in formData.FLT_NOTICE_FILES"
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
              <div>
                <Button
                  rounded
                  variant="danger"
                  border
                  size="xs"
                  class="w-5 h-5"
                  @click="formData.FLT_NOTICE_FILES.splice(index, 1)"
                >
                  x
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div class="space-y-3">
        <div class="border-b border-gray-300 pb-2">
          <p class="font-bold uppercase">
            {{ noticeData.NOTICE_STATUS_SNAME || 'POSTING' }}
          </p>
        </div>

        <div class="flex justify-between items-center">
          <p class="leading-6 font-medium text-sm text-gray-900">
            {{ getGridData('POP00160_GRD01002', 'caption') }}
          </p>

          <Button
            id="POP00160_BTN01001"
            rounded
            :disabled="loading"
            :loading="loading"
            @click="onClickRefresh"
          >
            {{ getComponentData('POP00160_BTN01001', 'caption') }}
          </Button>
        </div>

        <Table
          id="POP00160_GRD01002"
          class="overflow-x-auto mt-3 h-96"
          header-variant="secondary"
          :columns="userStoreListTableFields"
          :items="paginatedData"
          checkable
        >
          <template
            v-if="paginatedData.length"
            #header(CHECKBOX)
          >
            <FormCheckbox
              v-model="selectAll"
              :value="true"
            />
          </template>

          <template
            v-if="paginatedData.length"
            #cell(CHECKBOX)="{ item }"
          >
            <FormCheckbox
              v-model="formData.FLT_NOTICE_USERS"
              :value="{ NOTICE_USER_SID: item.USER_SID }"
            />
          </template>
        </Table>

        <!-- Pagination -->
        <div
          v-if="userStoreList?.length"
          class="flex justify-between items-center"
        >
          <p class="text-sm text-gray-700">
            Showing
            <span class="mx-1">
              {{ (currentPage - 1) * perPage + 1 }}
            </span>
            to
            <span class="mx-1">
              {{ isLastPage ? userStoreList?.length : currentPage * perPage }}
            </span>
            of
            <span class="mx-1">
              {{ userStoreList?.length }}
            </span>
            results
          </p>

          <Pagination
            :total-items="userStoreList?.length"
            :items-per-page="perPage"
            :current-page="currentPage"
            rounded
            active-variant="gray"
            @page-changed="currentPage = $event"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-7 items-center">
      <Button
        id="POP00160_BTN01004"
        rounded
        class="w-30"
        :loading="noticeStatusButton.loading && noticeStatusButton.status === '0030'"
        :disabled="formData.FLT_NOTICE_SID === '' || noticeStatusButton.loading && noticeStatusButton.status === '0030'"
        @click="onClickChangeNoticeStatus('0030')"
      >
        {{ getComponentData('POP00160_BTN01004', 'caption') }}
      </Button>

      <Button
        id="POP00160_BTN01005"
        rounded
        class="w-30"
        :loading="noticeStatusButton.loading && noticeStatusButton.status === '0020'"
        :disabled="formData.FLT_NOTICE_SID === '' || noticeStatusButton.loading && noticeStatusButton.status === '0020'"
        @click="onClickChangeNoticeStatus('0020')"
      >
        {{ getComponentData('POP00160_BTN01005', 'caption') }}
      </Button>

      <Button
        id="POP00160_BTN01006"
        rounded
        class="w-30"
        :loading="noticeStatusButton.loading && noticeStatusButton.status === '0010'"
        :disabled="formData.FLT_NOTICE_SID === '' || noticeStatusButton.loading && noticeStatusButton.status === '0010'"
        @click="onClickChangeNoticeStatus('0010')"
      >
        {{ getComponentData('POP00160_BTN01006', 'caption') }}
      </Button>

      <div class="col-span-4 text-end">
        <Button
          id="POP00160_BTN01007"
          rounded
          class="w-30"
          :loading="saving"
          :disabled="saving"
          @click="onSaveNotice"
        >
          {{ getComponentData('POP00160_BTN01007', 'caption') }}
        </Button>
      </div>
    </div>

    <Modal
      :show="openFileModal"
      divider
      @close="openFileModal = false"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          File Upload
        </h3>
      </template>

      <template #body>
        <div class="space-y-3">
          <FormGroup
            label="File Name"
            horizontal
          >
            <FormTextInput
              v-model="file.NOTICE_FILE_NAME"
            />
          </FormGroup>

          <FormGroup
            label="File URL"
            horizontal
          >
            <FormTextInput
              v-model="file.NOTICE_FILE_URL"
            />
          </FormGroup>

          <div class="mt-6 text-end">
            <Button
              rounded
              class="w-30"
              :disabled="!file.NOTICE_FILE_NAME || !file.NOTICE_FILE_URL"
              @click="addFile"
            >
              Add File
            </Button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<style scoped>

</style>
