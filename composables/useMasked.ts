import { Mask } from "maska"

export const useMasked = () => {
  const isNumberString = (str: string) => {
    const numberPattern = /^\d+(\.\d+)?$/; // This pattern matches any string of one or more digits
    return numberPattern.test(str);
  }

  const convertToFormattedNumber = (value: any) => {
    if (isNumberString(value)) {
      return parseInt(value).toLocaleString();
    }
  }

  const getMaskedValue = (value: any, mask: string) => {
    if (!value) {
      return "";
    }

    if (isNumberString(value)) {
      return parseInt(value).toLocaleString();
    }

    if (!mask) {
      return value;
    }

    const maska = new Mask({
      mask: mask
    })

    return maska.masked(value);
  }

  return {
    getMaskedValue,
    convertToFormattedNumber
  }
}
