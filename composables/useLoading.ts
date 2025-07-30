import { ref } from 'vue';

export const useLoading = () => {
  const loading = ref(false)

  const toggleLoading = () => {
    loading.value = !loading.value
  }

  return {
    loading,
    toggleLoading
  }
}
