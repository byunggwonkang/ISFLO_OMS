export const usePageLoaderGrid = (codes: string | string[]) => {
  const pageLoader = usePageLoaderStore();

  const currentPageGrids = computed(() => {
    if (typeof codes === 'string') {
      return pageLoader.getGridProperties(codes);
    } else if (Array.isArray(codes)) {
      return codes.reduce((acc: Record<string, any>, code) => {
        const gridProperties = pageLoader.getGridProperties(code) || {};
        return { ...acc, ...gridProperties };
      }, {});
    }
  });

  const getGridData = (key: string, attribute: string, defaultValue: string = '') => {
    return currentPageGrids.value?.[key]?.[attribute] || defaultValue;
  }

  return {
    currentPageGrids,
    getGridData
  }
}
