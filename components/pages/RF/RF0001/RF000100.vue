<script setup>

const pageLoader = usePageLoaderStore()
const profile = useProfileStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const { currentTab } = storeToRefs(useTabsStore())
const { user } = storeToRefs(useAuthStore());

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component ?? '']);
const { loading, toggleLoading } = useLoading()

onMounted(async () => {
  togglePageLoading()
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')
  await profile.fetchUserProfile()
  togglePageLoading()
})

const changingPassword = ref(false)

const formData = ref({
  FLT_USER_SID: user.value.USER_SID,
  FLT_USER_CODE: user.value.USER_CODE,
  FLT_USER_SNAME: user.value.USER_SNAME,
  FLT_USER_FNAME: user.value.USER_FNAME,
  FLT_USER_DNAME: user.value.USER_DISP_NAME,
  FLT_USER_LOGIN_ID: user.value.USER_LOGIN_ID,
  FLT_USER_EMAIL: '',
  FLT_USER_MOBILE: '',
  FLT_USER_JOIN_DATE: user.value.USER_JOIN_DATE,
  FLT_USER_STATUS_CODE: '',
  FLT_USER_GROUP_CODE: '',
})

const passwordFormData = ref({
  FLT_USER_CURRENT_PW : '',
  FLT_USER_NEW_PW: '',
  FLT_USER_CONFIRM_PW: ''
})

const changePassword = ref(false)

const handlePasswordChange = async () => {
  changingPassword.value = true
  await profile.changePassword(passwordFormData.value)
  resetPasswordFormData()
  changingPassword.value = false
}

const onClickChangePassword = () => {
  changePassword.value = true
}

const onClickCancelChangePassword = () => {
  changePassword.value = false
  resetPasswordFormData()
}

const resetPasswordFormData = () => {
  passwordFormData.value = {
    FLT_USER_CURRENT_PW : '',
    FLT_USER_NEW_PW: '',
    FLT_USER_CONFIRM_PW: ''
  }
}

const onClickSave = async () => {
  toggleLoading()
  await profile.updateUserProfile(formData.value)
  toggleLoading()
}
</script>

<template>
  <AppContent :loading="pageLoading">
    <div class="grid grid-cols-6 space-x-3">
      <div class="col-span-3 space-y-3">
        <FormGroup
          :label="getComponentData('RF000100_LBL00001', 'caption', 'System ID')"
          label-id="RF000100_LBL00001"
          label-for="RF000100_TXT00001"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00001"
            :value="user.USER_SID"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00002', 'caption', 'User ID')"
          label-id="RF000100_LBL00002"
          label-for="RF000100_TXT00002"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00002"
            v-model="formData.FLT_USER_CODE"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00003', 'caption', 'User Short Name')"
          label-id="RF000100_LBL00003"
          label-for="RF000100_TXT00003"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00003"
            v-model="formData.FLT_USER_SNAME"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00004', 'caption', 'User Full Name')"
          label-id="RF000100_LBL00004"
          label-for="RF000100_TXT00004"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00004"
            v-model="formData.FLT_USER_FNAME"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00005', 'caption', 'User Display Name')"
          label-id="RF000100_LBL00005"
          label-for="RF000100_TXT00005"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00005"
            v-model="formData.FLT_USER_LOGIN_ID"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00006', 'caption', 'User Login ID')"
          label-id="RF000100_LBL00006"
          label-for="RF000100_TXT00006"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00006"
            type="password"
            disabled
          />
        </FormGroup>

        <div class="text-end">
          <Button
            id="RF000100_BTN00001"
            rounded
            variant="gray"
            @click="onClickChangePassword"
          >
            {{ getComponentData('RF000100_BTN00001', 'caption') }}
          </Button>
        </div>

        <Transition name="fade">
          <div
            v-if="changePassword"
            class="space-y-3"
          >
            <FormGroup
              :label="getComponentData('RF000100_LBL00012', 'caption', 'Current Password')"
              label-id="RF000100_LBL00012"
              label-for="RF000100_TXT00012"
              horizontal
            >
              <FormTextInput
                id="RF000100_TXT00012"
                v-model="passwordFormData.FLT_USER_CURRENT_PW"
                type="password"
              />
            </FormGroup>

            <FormGroup
              :label="getComponentData('RF000100_LBL00013', 'caption', 'New Password')"
              label-id="RF000100_LBL00013"
              label-for="RF000100_TXT00013"
              horizontal
            >
              <FormTextInput
                id="RF000100_TXT00013"
                v-model="passwordFormData.FLT_USER_NEW_PW"
                type="password"
              />
            </FormGroup>

            <FormGroup
              :label="getComponentData('RF000100_LBL00014', 'caption', 'Confirm Password')"
              label-id="RF000100_LBL00014"
              label-for="RF000100_TXT00014"
              horizontal
              :error-text="passwordFormData.FLT_USER_NEW_PW !== passwordFormData.FLT_USER_CONFIRM_PW ? 'Password does not match with new password' : ''"
            >
              <FormTextInput
                id="RF000100_TXT00014"
                v-model="passwordFormData.FLT_USER_CONFIRM_PW"
                type="password"
              />
            </FormGroup>

            <div class="text-end space-x-3">
              <Button
                id="RF000100_BTN00004"
                rounded
                variant="gray"
                class="w-36"
                @click="onClickCancelChangePassword"
              >
                {{ getComponentData('RF000100_BTN00004', 'caption', 'Close') }}
              </Button>

              <Button
                id="RF000100_BTN00003"
                rounded
                variant="gray"
                :loading="changingPassword"
                :disabled="changingPassword || !passwordFormData.FLT_USER_CURRENT_PW || !passwordFormData.FLT_USER_NEW_PW || !passwordFormData.FLT_USER_CONFIRM_PW || passwordFormData.FLT_USER_NEW_PW !== passwordFormData.FLT_USER_CONFIRM_PW"
                class="w-36"
                @click="handlePasswordChange"
              >
                {{ getComponentData('RF000100_BTN00003', 'caption', 'Change') }}
              </Button>
            </div>
          </div>
        </Transition>

        <FormGroup
          :label="getComponentData('RF000100_LBL00007', 'caption', 'User Email')"
          label-id="RF000100_LBL00007"
          label-for="RF000100_TXT00007"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00007"
            v-model="formData.FLT_USER_EMAIL"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00008', 'caption', 'User Mobile')"
          label-id="RF000100_LBL00008"
          label-for="RF000100_TXT00008"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00008"
            v-model="formData.FLT_USER_MOBILE"
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00009', 'caption', 'User Join Date')"
          label-id="RF000100_LBL00009"
          label-for="RF000100_TXT00009"
          horizontal
        >
          <FormTextInput
            id="RF000100_TXT00009"
            v-model="formData.FLT_USER_JOIN_DATE"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00010', 'caption', 'User Status')"
          label-id="RF000100_LBL00010"
          label-for="RF000100_LBL00010"
          horizontal
        >
          <FormTextInput
            id="RF000100_LBL00010"
            v-model="formData.FLT_USER_STATUS_CODE"
            disabled
          />
        </FormGroup>

        <FormGroup
          :label="getComponentData('RF000100_LBL00011', 'caption', 'User Group')"
          label-id="RF000100_LBL00011"
          label-for="RF000100_LBL00011"
          horizontal
        >
          <FormTextInput
            id="RF000100_LBL00011"
            v-model="formData.FLT_USER_GROUP_CODE"
            disabled
          />
        </FormGroup>

        <div class="text-end">
          <Button
            id="RF000100_BTN00002"
            rounded
            variant="gray"
            :loading="loading"
            :disabled="loading"
            class="w-36"
            @click="onClickSave"
          >
            {{ getComponentData('RF000100_BTN00002', 'caption') }}
          </Button>
        </div>
      </div>
    </div>
  </AppContent>
</template>

<style scoped>

</style>
