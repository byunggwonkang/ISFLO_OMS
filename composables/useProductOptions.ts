import { ref, reactive } from 'vue';

interface ProductOption {
  PRODUCT_OPTION_TITLE: string;
  PRODUCT_OPTION_TITLES: Record<string, string>;
  PRODUCT_OPTIONS: Record<string, string>[];
}

interface InputData {
  title: string;
  value: string;
}

export function useProductOptions(inputData: InputData[]): { input: Ref<InputData[]>; productOptions: ProductOption; generateProductOptions: () => void } {
  const input = ref(inputData);
  const productOptions = reactive<ProductOption>({
    PRODUCT_OPTION_TITLE: "",
    PRODUCT_OPTION_TITLES: {},
    PRODUCT_OPTIONS: []
  });

  const generateProductOptions = () => {
    const options: Record<string, string>[] = [];
    const titles: Record<string, string> = {
      PRODUCT_OPTION_01_TITLE: "",
      PRODUCT_OPTION_02_TITLE: "",
      PRODUCT_OPTION_03_TITLE: "",
      PRODUCT_OPTION_04_TITLE: "",
      PRODUCT_OPTION_05_TITLE: ""
    };
    const optionTitle: string[] = [];

    const combinations = (arrays: string[][], result: Record<string, string>, index: number) => {
      if (index === arrays.length) {
        options.push({
          ...result,
          ITEMS_CODE: "",
          ITEMS_QTY: "1",
          ITEMS_ADDITIONAL_PRICE: "0.000"
        });
        return;
      }

      const array = arrays[index];
      for (let i = 0; i < array.length; i++) {
        result[`PRODUCT_OPTION_0${index + 1}_VALUE`] = array[i];
        combinations(arrays, { ...result }, index + 1);
      }
    };

    const arrays = input.value.map((item, index) => {
      titles[`PRODUCT_OPTION_0${index + 1}_TITLE`] = item.title;
      if (item.title) optionTitle.push(item.title);
      return item?.value?.split(",");
    });

    combinations(arrays, {}, 0);

    productOptions.PRODUCT_OPTION_TITLE = optionTitle.join(" > ");
    productOptions.PRODUCT_OPTION_TITLES = titles;
    productOptions.PRODUCT_OPTIONS = options;
  };

  return { input, productOptions, generateProductOptions };
}
