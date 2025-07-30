export const useGroupBy = (list: Array<{ [key: string]: any }>, key: string) => {
  return list.reduce((result: { [key: string]: any[] }, currentValue: { [key: string]: any }) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
}
