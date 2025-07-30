export const usePageLoaderComponent = (codes: string | string[]) => {
  const pageLoader = usePageLoaderStore();

  const currentPageComponents = computed(() => {
    if (typeof codes === 'string') {
      return pageLoader.getComponentProperties(codes);
    } else if (Array.isArray(codes)) {
      return codes.reduce((acc: Record<string, any>, code) => {
        const componentProperties = pageLoader.getComponentProperties(code) || {};
        return { ...acc, ...componentProperties };
      }, {});
    }
  });

  const getComponentData = (key: string, attribute: string, defaultValue: string = '') => {
    return currentPageComponents.value?.[key]?.[attribute] || defaultValue;
  }
  const getComponentData2 = (key: string, attribute: string, defaultValue: string = '') => {
    return currentPageComponents.value?.[key]?.[attribute] || defaultValue;
  }


  return {
    currentPageComponents,
    getComponentData,
    getComponentData2
  }
}
