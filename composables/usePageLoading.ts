import { ref } from 'vue';

export const usePageLoading = () => {
  const pageLoading = ref(false)

  const togglePageLoading = () => {
    pageLoading.value = !pageLoading.value
  }

  return {
    pageLoading,
    togglePageLoading
  }
}
