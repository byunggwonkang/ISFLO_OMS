import { ref, computed } from 'vue';

export const usePagination = (data: any, perPage: number = 10) => {
  const currentPage = ref(1);

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    const end = start + perPage;

    return data.value?.slice(start, end) || [];
  });

  const isLastPage = computed(() => {
    return currentPage.value * perPage >= data.value?.length;
  })

  const nextPage = () => {
    if (currentPage.value * perPage < data.value?.length) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= Math.ceil(data.value?.length / perPage)) {
      currentPage.value = page;
    }
  }

  const resetPage = () => {
    currentPage.value = 1;
  }

  const currentPage2 = ref(1);

  const paginatedData2 = computed(() => {
    const start = (currentPage2.value - 1) * perPage;
    const end = start + perPage;

    return data.value?.slice(start, end) || [];
  });

  const isLastPage2 = computed(() => {
    return currentPage2.value * perPage >= data.value?.length;
  })

  const nextPage2 = () => {
    if (currentPage2.value * perPage < data.value?.length) {
      currentPage2.value++;
    }
  };

  const prevPage2 = () => {
    if (currentPage2.value > 1) {
      currentPage2.value--;
    }
  };

  const goToPage2 = (page: number) => {
    if (page >= 1 && page <= Math.ceil(data.value?.length / perPage)) {
      currentPage2.value = page;
    }
  }

  const resetPage2 = () => {
    currentPage2.value = 1;
  }

  return {
    currentPage,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
    isLastPage,
    resetPage,
    currentPage2,
    paginatedData2,
    nextPage2,
    prevPage2,
    goToPage2,
    isLastPage2,
    resetPage2
  };
}
