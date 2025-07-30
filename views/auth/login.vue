<script setup>
import VueFeather from 'vue-feather';
import { encrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { login } = useAuthStore();
const form = ref({
  USER_ID: '',
  USER_PW: '',
});
const error = ref('');
const loading = ref(false);

const submit = async () => {
  loading.value = true;
  isloading.isLoading = true
  const { success, message } = await login({
    USER_ID: encrypt(form.value.USER_ID),
    USER_PW: encrypt(form.value.USER_PW),
  });

  if (success) {
    await navigateTo('/app/');
  } else {
    error.value = message;
  }
  isloading.isLoading = false

  loading.value = false;
};

const canLogin = computed(() => {
  return (form.value.USER_ID && form.value.USER_PW);
});

definePageMeta({
  layout: 'guest',
});
</script>

<template>
  <div
    class="flex h-screen min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 space-y-20"
  >
    <div class="flex justify-center">
      <img
        alt="Logo"
        class="h-16"
        src="~/assets/img/logo/ISFLO.svg"
      >
    </div>

    <Card
      class="sm:mx-auto sm:w-full sm:max-w-md py-10 rounded-md"
      card-body-class="p-0"
    >
      <div>
        <p
          class="text-center text-lg font-bold leading-6 tracking-tight text-gray-500"
        >
          <span class="isac-text-blue">Automate</span> the rest, Get <span class="isac-text-blue">more</span> done
        </p>
      </div>
      <div class="mt-10 px-9">
        <form
          class="space-y-4"
          @submit.prevent="submit"
        >
          <div>
            <FormGroup>
              <template #prefix>
                <VueFeather
                  type="user"
                  class="h-5 w-5 text-gray-400"
                />
              </template>
              <FormTextInput
                v-model="form.USER_ID"
                class="block w-full"
                size="xl"
                :placeholder="$t('page.auth.form.userID')"
              />
            </FormGroup>
          </div>

          <div>
            <FormGroup :error-text="error">
              <template #prefix>
                <VueFeather
                  type="eye"
                  class="h-5 w-5 text-gray-400"
                />
              </template>
              <FormTextInput
                v-model="form.USER_PW"
                type="password"
                class="block w-full"
                size="xl"
                :placeholder="$t('page.auth.form.password')"
                keyup.enter="submit"
              />
            </FormGroup>
          </div>

          <div>
            <Button
              size="xl"
              class="w-full"
              rounded
              variant="gray"
              :loading="loading"
              :disabled="!canLogin || loading"
              type="submit"
            >
              {{ $t('button.login') }}
            </Button>
          </div>
        </form>
      </div>

      <div class="mt-10">
        <p class="text-center text-sm">
          {{ $t('page.auth.title') }}
        </p>
      </div>
    </Card>

    <div class="flex justify-center">
      <img
        alt="Logo"
        src="~/assets/img/logo/isac-with-power-by.svg"
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
