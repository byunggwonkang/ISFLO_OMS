<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import moment from 'moment';
const { getComponentData } = usePageLoaderComponent('POP00010')

const props = defineProps({
  create: {
    type: Boolean,
    default: false,
  },
  userData: {
    type: Object,
    default: () => ({
      FLT_USER_SID: "",
      FLT_USER_CODE: "",
      FLT_USER_DNAME: "",
      FLT_USER_SNAME: "",
      FLT_USER_FNAME: "",
      FLT_USER_LOGIN_ID: "",
      FLT_USER_LOGIN_PW: "",
      FLT_USER_GENDER_CODE: "",
      FLT_USER_EMAIL: "",
      FLT_USER_TEL: "",
      FLT_USER_MOBILE: "",
      FLT_USER_ACTIVE_YN: true,
      FLT_USER_GROUP_CODE: "",
      FLT_USER_COUNTRY_CODE: "",
      FLT_USER_DEPARTMENT_CODE: "",
      FLT_USER_POSITION_CODE: "",
      FLT_USER_LANGUAGE: "",
      FLT_USER_STATUS_CODE: "0010",
      FLT_USER_STATUS_FNAME: "",
      FLT_USER_JOIN_DATE: "",
      FLT_USER_RESIGN_DATE: "",
      FLT_USER_IS_RESIGNED: false,
      FLT_USER_REMARK: "",
      FLT_USER_UPDATE_USER: "",
      FLT_USER_UPDATE_DATE: "",
      FLT_USER_CREATE_USER: "",
      FLT_USER_CREATE_DATE: ""
    }),
  },
});

const commonData = useCommonDataStore();
const userSettings = useUserSettingsStore();
const { savingPassword, userGroupList } = storeToRefs(userSettings);

const emit = defineEmits(["dataChanged"]);

const formData = reactive({
  ...props.userData
});

// Password Reset Data
const canChangePassword = ref(false);
const passwordPayload = ref({
  FLT_USER_SID: props.userData.FLT_USER_SID,
  FLT_USER_CURRENT_PW: '',
  FLT_USER_NEW_PW: '',
});
const passwordError = ref('');

const savePassword = async () => {
  passwordError.value = null;
  const { success, message } = await userSettings.changePassword(passwordPayload.value);
  if (success) {
    canChangePassword.value = false;
    passwordPayload.value.USER_NEW_PW = '';
  } else {
    passwordError.value = message;
  }
};

watch(() => formData.FLT_USER_IS_RESIGNED, (newValue) => {
  newValue
      ? (formData.FLT_USER_RESIGN_DATE = moment().format("YYYY-MM-DD"))
      : (formData.FLT_USER_RESIGN_DATE = "");
});

watch(formData, () => {
  emit("dataChanged", {
    ...formData,
    FLT_USER_ACTIVE_YN: formData.FLT_USER_ACTIVE_YN ? "1" : "0",
    FLT_USER_GENDER_CODE: formData.FLT_USER_GENDER_CODE?.value ?? "",
    FLT_USER_COUNTRY_CODE: formData.FLT_USER_COUNTRY_CODE?.value ?? "",
    FLT_USER_DEPARTMENT_CODE: formData.FLT_USER_DEPARTMENT_CODE?.value ?? "",
    FLT_USER_POSITION_CODE: formData.FLT_USER_POSITION_CODE?.value ?? "",
    FLT_USER_LANGUAGE: formData.FLT_USER_LANGUAGE?.value ?? "",
    FLT_USER_GROUP_CODE: formData.FLT_USER_GROUP_CODE?.value ?? "",
    FLT_USER_JOIN_DATE: formData.FLT_USER_JOIN_DATE ? moment(formData.FLT_USER_JOIN_DATE).format("YYYY-MM-DD") : "",
    FLT_USER_RESIGN_DATE: formData.FLT_USER_RESIGN_DATE ? moment(formData.FLT_USER_RESIGN_DATE).format("YYYY-MM-DD") : "",
  });
});

const setDefaultValue = () => {
  const setFormDataField = (field, list) => {
    formData[field] = props.create ? {
      name: list[0]?.name,
      value: list[0]?.value,
    } : list.find((item) => item.value === formData[field]);
  };

  setFormDataField("FLT_USER_GENDER_CODE", commonData.getGenderList);
  setFormDataField("FLT_USER_COUNTRY_CODE", commonData.getCountriesList);
  setFormDataField("FLT_USER_LANGUAGE", commonData.getLanguagesList);
  setFormDataField("FLT_USER_DEPARTMENT_CODE", commonData.getDepartmentsList);
  setFormDataField("FLT_USER_POSITION_CODE", commonData.getPositionsList);
  setFormDataField("FLT_USER_GROUP_CODE", userGroupList.value.map((item) => ({
    name: decrypt(item.GROUP_FNAME),
    value: decrypt(item.GROUP_SID),
  })));

  if (!props.create) {
    formData.FLT_USER_ACTIVE_YN = formData.FLT_USER_ACTIVE_YN === "1";
    formData.FLT_USER_IS_RESIGNED = formData.FLT_USER_RESIGN_DATE !== "";
    return;
  }

  formData.FLT_USER_ACTIVE_YN = true;
  formData.FLT_USER_JOIN_DATE = moment().format("YYYY-MM-DD");
};

onMounted(async () => {
  await commonData.fetchPOP00010CommonData()
  setDefaultValue();
});
</script>

<template>
  <div class="grid grid-cols-2 gap-y-4 gap-x-8">
    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01002', 'caption')"
        label-id="POP00010_LBL01002"
        label-for="POP00010_TXT01001"
        horizontal
      >
        <FormTextInput
          id="POP00010_TXT01001"
          v-model="formData.FLT_USER_SID"
          :mask="getComponentData('POP00010_TXT01001', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01001', 'placeholder')"
          type="text"
          disabled
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01003', 'caption')"
        label-id="POP00010_LBL01003"
        label-for="POP00010_TXT01002"
        horizontal
      >
        <FormTextInput
          v-model="formData.FLT_USER_CODE"
          type="text"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01004', 'caption')"
        label-id="POP00010_LBL01004"
        label-for="POP00010_TXT01003"
        horizontal
      >
        <FormTextInput
          id="POP00010_TXT01003"
          v-model="formData.FLT_USER_SNAME"
          :mask="getComponentData('POP00010_TXT01003', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01003', 'placeholder')"
          type="text"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01005', 'caption')"
        label-id="POP00010_LBL01005"
        label-for="POP00010_TXT01004"
        horizontal
      >
        <FormTextInput
          id="POP00010_TXT01004"
          v-model="formData.FLT_USER_FNAME"
          :mask="getComponentData('POP00010_TXT01004', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01004', 'placeholder')"
          type="text"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        label="Display Name"
        horizontal
      >
        <FormTextInput
          v-model="formData.FLT_USER_DNAME"
          type="text"
        />
      </FormGroup>
    </div>

    <div class="col-span-1" />

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01006', 'caption')"
        label-id="POP00010_LBL01006"
        label-for="POP00010_TXT01005"
        horizontal
      >
        <FormTextInput
          id="POP00010_TXT01005"
          v-model="formData.FLT_USER_LOGIN_ID"
          :mask="getComponentData('POP00010_TXT01005', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01005', 'placeholder')"
          type="text"
        />
      </FormGroup>
    </div>

    <div class="space-y-2">
      <FormGroup
        :label="getComponentData('POP00010_LBL01007', 'caption')"
        label-id="POP00010_LBL01007"
        label-for="POP00010_TXT01006"
        horizontal
        :error-text="passwordError"
      >
        <FormTextInput
          id="POP00010_TXT01006"
          v-model="formData.FLT_USER_LOGIN_PW"
          type="password"
          :disabled="!create"
        />
      </FormGroup>

      <div
        v-if="!create"
        class="inline-flex items-center justify-end space-x-2 w-full"
      >
        <Button
          id="POP00010_BTN01001"
          rounded
          variant="gray"
          :loading="savingPassword"
          :disabled="savingPassword"
          @click="savePassword"
        >
          {{ getComponentData('POP00010_BTN01001', 'caption') }}
        </Button>
      </div>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01008', 'caption')"
        label-id="POP00010_LBL01008"
        label-for="POP00010_CMB01001"
        horizontal
      >
        <FormCombobox
          id="POP00010_CMB01001"
          v-model="formData.FLT_USER_GENDER_CODE"
          :placeholder="getComponentData('POP00010_CMB01001', 'placeholder')"
          :options="commonData.getGenderList"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01009', 'caption')"
        label-id="POP00010_LBL01009"
        label-for="POP00010_TXT01007"
        horizontal
      >
        <FormTextInput
          id="POP00010_TXT01007"
          v-model="formData.FLT_USER_EMAIL"
          :mask="getComponentData('POP00010_TXT01007', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01007', 'placeholder')"
          type="email"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01010', 'caption')"
        label-id="POP00010_LBL01010"
        label-for="POP00010_TXT01008"
        horizontal
      >
        <FormTextInput
          id="POP00010_TXT01008"
          v-model="formData.FLT_USER_TEL"
          :mask="getComponentData('POP00010_TXT01008', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01008', 'placeholder')"
          type="text"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01011', 'caption')"
        label-id="POP00010_LBL01011"
        label-for="POP00010_TXT01009"
        horizontal
      >
        <FormTextInput
          id="POP00010_TXT01009"
          v-model="formData.FLT_USER_MOBILE"
          :mask="getComponentData('POP00010_TXT01009', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01009', 'placeholder')"
          type="text"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01012', 'caption')"
        label-id="POP00010_LBL01012"
        label-for="POP00010_CMB01002"
        horizontal
      >
        <FormCombobox
          id="POP00010_CMB01002"
          v-model="formData.FLT_USER_COUNTRY_CODE"
          :placeholder="getComponentData('POP00010_CMB01002', 'placeholder')"
          :options="commonData.getCountriesList"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01013', 'caption')"
        label-id="POP00010_LBL01013"
        label-for="POP00010_CMB01003"
        horizontal
      >
        <FormCombobox
          id="POP00010_CMB01003"
          v-model="formData.FLT_USER_LANGUAGE"
          :placeholder="getComponentData('POP00010_CMB01003', 'placeholder')"
          :options="commonData.getLanguagesList"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01014', 'caption')"
        label-id="POP00010_LBL01014"
        label-for="POP00010_CMB01004"
        horizontal
      >
        <FormCombobox
          id="POP00010_CMB01004"
          v-model="formData.FLT_USER_DEPARTMENT_CODE"
          :placeholder="getComponentData('POP00010_CMB01004', 'placeholder')"
          :options="commonData.getDepartmentsList"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01015', 'caption')"
        label-id="POP00010_LBL01015"
        label-for="POP00010_CMB01005"
        horizontal
      >
        <FormCombobox
          id="POP00010_CMB01005"
          v-model="formData.FLT_USER_POSITION_CODE"
          :placeholder="getComponentData('POP00010_CMB01005', 'placeholder')"
          :options="commonData.getPositionsList"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01016', 'caption')"
        label-id="POP00010_LBL01016"
        label-for="POP00010_CMB01006"
        horizontal
      >
        <FormDatePicker
          id="POP00010_DAT01001"
          v-model="formData.FLT_USER_JOIN_DATE"
          :placeholder="getComponentData('POP00010_DAT01001', 'placeholder')"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01017', 'caption')"
        label-id="POP00010_LBL01017"
        label-for="POP00010_DAT01002"
        horizontal
        prefix-class="z-10"
      >
        <template #prefix>
          <FormCheckbox
            v-model="formData.FLT_USER_IS_RESIGNED"
          />
        </template>
        <FormDatePicker
          id="POP00010_DAT01002"
          v-model="formData.FLT_USER_RESIGN_DATE"
          :disabled="!formData.FLT_USER_IS_RESIGNED"
          :label="getComponentData('POP00010_DAT01002', 'placeholder')"
        />
      </FormGroup>
    </div>

    <div class="inline-flex items-center">
      <FormCheckbox
        id="POP00010_LBL01018"
        v-model="formData.FLT_USER_ACTIVE_YN"
        :label="getComponentData('POP00010_LBL01018', 'caption', 'Active')"
      />
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01019', 'caption')"
        label-id="POP00010_LBL01019"
        label-for="POP00010_CMB01007"
        horizontal
      >
        <FormCombobox
          id="POP00010_CMB01007"
          v-model="formData.FLT_USER_GROUP_CODE"
          :placeholder="getComponentData('POP00010_CMB01007', 'placeholder')"
          :options="userGroupList.map((item) => ({
            name: decrypt(item.GROUP_FNAME),
            value: decrypt(item.GROUP_SID),
          }))"
        />
      </FormGroup>
    </div>

    <div class="col-span-2">
      <FormGroup
        :label="getComponentData('POP00010_LBL01020', 'caption')"
        label-id="POP00010_LBL01020"
        label-for="POP00010_TXT01010"
      >
        <FormTextareaInput
          id="POP00010_TXT01010"
          v-model="formData.FLT_USER_REMARK"
          :mask="getComponentData('POP00010_TXT01010', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01010', 'placeholder')"
          rows="3"
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01021', 'caption')"
        label-id="POP00010_LBL01021"
        label-for="POP00010_TXT01011"
        horizontal
      >
        <FormTextInput
          id="POP00010_TXT01011"
          v-model="formData.FLT_USER_STATUS_FNAME"
          :mask="getComponentData('POP00010_TXT01011', 'editMask')"
          :placeholder="getComponentData('POP00010_TXT01011', 'placeholder')"
          type="text"
          disabled
        />
      </FormGroup>
    </div>

    <div class="col-span-1" />

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01022', 'caption')"
        label-id="POP00010_LBL01022"
        horizontal
      >
        <FormTextInput
          v-model="formData.FLT_USER_CREATE_DATE"
          type="text"
          disabled
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01024', 'caption')"
        label-id="POP00010_LBL01024"
        horizontal
      >
        <FormTextInput
          v-model="formData.FLT_USER_UPDATE_DATE"
          type="text"
          disabled
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01023', 'caption')"
        label-id="POP00010_LBL01023"
        disabled
        horizontal
      >
        <FormTextInput
          v-model="formData.FLT_USER_CREATE_USER"
          type="text"
          disabled
        />
      </FormGroup>
    </div>

    <div>
      <FormGroup
        :label="getComponentData('POP00010_LBL01025', 'caption')"
        label-id="POP00010_LBL01025"
        horizontal
      >
        <FormTextInput
          v-model="formData.FLT_USER_UPDATE_USER"
          type="text"
          disabled
        />
      </FormGroup>
    </div>
  </div>
</template>

<style scoped>

</style>
