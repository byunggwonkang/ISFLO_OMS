<script setup>
import { PlusIcon } from "@heroicons/vue/24/solid";
import VueFeather from "vue-feather";
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const userSettings = useUserSettingsStore()
const commonData = useCommonDataStore()
const pageLoader = usePageLoaderStore()

const { filters, savingUser, usersList, userGroupList } = storeToRefs(useUserSettingsStore())
const { currentTab } = storeToRefs(useTabsStore())
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component, 'POP00010']);
const { getGridData } = usePageLoaderGrid(currentTab.value?.component);

const perPage = ref(15)
const { currentPage, paginatedData, isLastPage, resetPage } = usePagination(usersList, perPage.value);
const { loading, toggleLoading } = useLoading()

const openNewUserModal = ref(false)
const openEditUserModal = ref(false)

const GROUP = ref({})

// watch(userGroupList, () => {
//   const firstGroup = userGroupList?.value[0]
//   if (firstGroup) {
//     filters.value.FLT_GROUP_CODE.value = firstGroup.GROUP_SID
//     filters.value.FLT_GROUP_CODE.name = firstGroup.GROUP_FNAME
//   }
// })

const search = async () => {
  toggleLoading()
  isloading.isLoading = true

  filters.value.FLT_GROUP_CODE = GROUP.value?.value ?? ''
  await userSettings.fetchUsersList()
  isloading.isLoading = false
  toggleLoading()

  resetPage()
}

const tableFields = computed(() => {
  return pageLoader.getTableData(currentTab.value?.component ?? '' , 'PA000700_GRD00001')
})

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await pageLoader.fetchPageLoadData('POP00010')
  //await commonData.fetchAllCommonData()
  await userSettings.fetchUserGroupList()

  GROUP.value = {
    name: 'All',
    value: '',
  }
  isloading.isLoading = false

  togglePageLoading()
})

const userFormData = ref({})

const addEditUserData = (data) => {
  userFormData.value = Object.entries(data).reduce((acc, [key, value]) => {
    acc[`FLT_${key}`] = decrypt(value);
    return acc;
  }, {});
  openEditUserModal.value = true
}

const saveUserData = async () => {
  isloading.isLoading = true
  const { success } = await userSettings.saveUserData(userFormData.value)
  if (success) {
    await userSettings.fetchUsersList()
    openNewUserModal.value = false
    openEditUserModal.value = false
    userFormData.value = {}
  }
  isloading.isLoading = false
}
</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-x-12 items-center">
        <div>
          <FormGroup
            :label="getComponentData('PA000700_LBL00001', 'caption')"
            label-id="PA000700_LBL00001"
            horizontal
          >
            <FormCombobox
              v-model="GROUP"
              :options="[
                {
                  name: 'All',
                  value: '',
                },
                ...userGroupList.map((item) => ({
                  name: decrypt(item.GROUP_FNAME),
                  value: decrypt(item.GROUP_SID),
                }))
              ]"
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup
            :label="getComponentData('PA000700_LBL00002', 'caption')"
            label-id="PA000700_LBL00002"
            horizontal
          >
            <FormTextInput
              v-model="filters.FLT_USER_DNAME"
              type="text"
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup
            :label="getComponentData('PA000700_LBL00004', 'caption')"
            label-id="PA000700_LBL00004"
            horizontal
            :label-left="false"
          >
            <div class="flex items-center sm:flex-col lg:flex-row sm:space-y-3 sm:space-x-0 lg:space-x-3 lg:space-y-0 w-full ml-3">
              <FormCheckbox
                v-model="filters.FLT_DATE_CHECK"
              />
              <FormDatePicker
                v-model.string="filters.FLT_JOIN_FROM_DATE"
                placeholder="Select a date"
                mode="date"
                :disabled="!filters.FLT_DATE_CHECK"
              />

              <FormDatePicker
                v-model.string="filters.FLT_JOIN_TO_DATE"
                placeholder="Select a date"
                mode="date"
                :disabled="!filters.FLT_DATE_CHECK"
              />
            </div>
          </FormGroup>
        </div>
        <div class="flex items-center space-x-6">
          <FormCheckbox
            id="PA000700_LBL00003"
            v-model="filters.FLT_INCLUDE_INACTIVE"
            :label="getComponentData('PA000700_LBL00003', 'caption')"
            :value="'0'"
          />

          <Button
            id="PA000700_BTN00002"
            :disabled="loading"
            :loading="loading"
            variant="gray"
            rounded
            size="sm"
            @click="search"
          >
            {{ getComponentData('PA000700_BTN00002', 'caption') }}
          </Button>
        </div>
      </div>
    </template>

    <div class="flex justify-between items-center mt-2">
      <p>
        {{ getGridData('PA000700_GRD00001', 'caption') }}
      </p>

      <Button
        v-tooltip="{
          content: getComponentData('PA000700_BTN00001', 'caption'),
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
        @click="openNewUserModal = true"
      >
        <PlusIcon class="w-5 h-5" />
      </Button>

      <!-- New User Modal -->
      <Modal
        :show="openNewUserModal"
        size="3xl"
        divider
        @close="openNewUserModal = false"
      >
        <template #header>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            New User
          </h3>
        </template>

        <template #body>
          <component
            :is="`POP00010`"
            create
            @data-changed="userFormData = $event"
          />
        </template>

        <template #footer>
          <div class="flex justify-end">
            <Button
              rounded
              class="w-40"
              :disabled="savingUser"
              :loading="savingUser"
              @click="saveUserData"
            >
              {{ getComponentData('POP00010_BTN01002', 'caption') }}
            </Button>
          </div>
        </template>
      </Modal>
    </div>

    <Table
      id="PA000700_GRD00001"
      class="overflow-x-auto"
      header-variant="secondary"
      :columns="[
        ...tableFields,
        {
          caption: 'Action',
          dataFieldName: 'ACTION',
          display: 'Y'
        }
      ]"
      :items="paginatedData"
      clickable
    >
      <template #cell(USER_ACTIVE_YN)="{ value }">
        <StatusDot
          :active="decrypt(value) === '1'"
        />
      </template>

      <template #cell(ACTION)="{ item }">
        <span
          class=" cursor-pointer hover:font-bold hover:text-blue-700"
          @click="addEditUserData(item)"
        >
          <VueFeather
            type="edit"
            class="h-5 w-5"
          />
        </span>
      </template>
    </Table>

    <!-- Pagination -->
    <div
      v-if="usersList?.length"
      class="flex justify-between items-center"
    >
      <p class="text-sm text-gray-700">
        Showing
        <span class="mx-1">
          {{ (currentPage - 1) * perPage + 1 }}
        </span>
        to
        <span class="mx-1">
          {{ isLastPage ? usersList?.length : currentPage * perPage }}
        </span>
        of
        <span class="mx-1">
          {{ usersList?.length }}
        </span>
        results
      </p>

      <Pagination
        :total-items="usersList?.length"
        :items-per-page="perPage"
        :current-page="currentPage"
        rounded
        active-variant="gray"
        @page-changed="currentPage = $event"
      />
    </div>

    <!-- Edit User Modal -->
    <Modal
      :show="openEditUserModal"
      size="3xl"
      divider
      @close="() => {
        openEditUserModal = false
        userFormData = {}
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00010_LBL01001', 'caption') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="`POP00010`"
          :user-data="userFormData"
          @data-changed="userFormData = $event"
        />
      </template>

      <template #footer>
        <div class="flex justify-end">
          <Button
            id="POP00010_BTN01002"
            rounded
            class="w-40"
            :disabled="savingUser"
            :loading="savingUser"
            @click="saveUserData"
          >
            {{ getComponentData('POP00010_BTN01002', 'caption') }}
          </Button>
        </div>
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
