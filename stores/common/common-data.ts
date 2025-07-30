import { defineStore } from 'pinia'
import { encrypt, decrypt } from '@/stores/common/aes'

const { user } = storeToRefs(useAuthStore());

interface ResponseData {
  CODE: string;
  MTY: string;
  MSG: string;
  RESULT_DATA: any; // replace 'any' with the actual type of 'RESULT_DATA' if known
}

interface State {
  userGroupList: Array<{ GROUP_SID: string, GROUP_FNAME: string }>;
  genderList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  countriesList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  departmentsList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  positionsList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  languagesList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  orderViewOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  orderSplitOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  orderStatusList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  orderDateOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  goodsStatusOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  currencyOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  manufacturerOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  storeTypeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  departmentStoreOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  storeStatusOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  holidayTypeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  saleTypeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  returnStatusOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  exchangeStatusOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  nmdProductTypeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  nmdStockTypeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  nmdStatusOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  nmdIOTypeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  promotionTypeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  promotionStatusOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCategoryRegularOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCommentTypeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCategoryOrderOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCategoryReturnOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCategoryExchangeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  transactionTypeAllOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCategoryRepairOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCategoryNewOrderOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCategoryNewReturnOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  csCategoryNewExchangeOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  transactionTypeReturnOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  customerStatusOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  customerClassOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  returnViewOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  returnStatusList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  returnReasonOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  returnCancelStatusOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  returnDateOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  exchangeViewOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  exchangeStatusList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  exchangeReasonOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  exchangeDateOptions: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  WearHouseGroups: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  ESMJobTypes: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  WHJobTypes: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  StaffTypes: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  UserStatus: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  InboundStatus: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  OutboundStatus: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  StockType: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  AdjustIncReason: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  AdjustDecReason: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  returnInboundType: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  exchangeInboundType: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  CSStatus: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  CurriorList: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
  ReturnRequestType: Array<{ COMM_CODE: string, COMM_FNAME_ENG: string }>;
}

interface ListItem {
  value: string;
  name: string;
}

export const useCommonDataStore = defineStore('common-data', {
  state: (): State => ({
    userGroupList: [],
    genderList: [],
    countriesList: [],
    departmentsList: [],
    positionsList: [],
    languagesList: [],
    orderStatusList: [],
    orderViewOptions: [],
    orderSplitOptions: [],
    orderDateOptions: [],
    goodsStatusOptions: [],
    currencyOptions: [],
    manufacturerOptions: [],
    storeTypeOptions: [],
    departmentStoreOptions: [],
    storeStatusOptions: [],
    holidayTypeOptions: [],
    saleTypeOptions: [],
    returnStatusOptions: [],
    exchangeStatusOptions: [],
    nmdProductTypeOptions: [],
    nmdStockTypeOptions: [],
    nmdStatusOptions: [],
    nmdIOTypeOptions: [],
    promotionTypeOptions: [],
    promotionStatusOptions: [],
    csCategoryRegularOptions: [],
    csCommentTypeOptions: [],
    csCategoryOrderOptions: [],
    csCategoryReturnOptions: [],
    csCategoryExchangeOptions: [],
    transactionTypeAllOptions: [],
    csCategoryRepairOptions: [],
    csCategoryNewOrderOptions: [],
    csCategoryNewReturnOptions: [],
    csCategoryNewExchangeOptions: [],
    transactionTypeReturnOptions: [],
    customerStatusOptions: [],
    customerClassOptions: [],
    returnViewOptions: [],
    returnStatusList: [],
    returnReasonOptions: [],
    returnCancelStatusOptions: [],
    returnDateOptions: [],
    exchangeViewOptions: [],
    exchangeStatusList: [],
    exchangeReasonOptions: [],
    exchangeDateOptions: [],
    WearHouseGroups: [],
    ESMJobTypes: [],
    WHJobTypes: [],
    StaffTypes: [],
    UserStatus: [],
    InboundStatus: [],
    OutboundStatus: [],
    StockType: [],
    AdjustIncReason: [],
    AdjustDecReason: [],
    returnInboundType: [],
    exchangeInboundType: [],
    CSStatus: [],
    CurriorList: [],
    ReturnRequestType: [],
  }),
  getters: {
    getUserGroupList: (state): ListItem[] => state.userGroupList.map(({ GROUP_SID , GROUP_FNAME }) => ({ value: decrypt(GROUP_SID), name: decrypt(GROUP_FNAME) })),
    getGenderList: (state): ListItem[] => state.genderList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCountriesList: (state): ListItem[] => state.countriesList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getDepartmentsList: (state): ListItem[] => state.departmentsList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getPositionsList: (state): ListItem[] => state.positionsList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getLanguagesList: (state): ListItem[] => state.languagesList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getOrderViewOptions: (state): ListItem[] => state.orderViewOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getOrderSplitOptions: (state): ListItem[] => state.orderSplitOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getOrderStatusList: (state): ListItem[] => state.orderStatusList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getOrderDateOptions: (state): ListItem[] => state.orderDateOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getGoodsStatusOptions: (state): ListItem[] => state.goodsStatusOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCurrencyOptions: (state): ListItem[] => state.currencyOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getManufacturerOptions: (state): ListItem[] => state.manufacturerOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getStoreTypeOptions: (state): ListItem[] => state.storeTypeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getDepartmentStoreOptions: (state): ListItem[] => state.departmentStoreOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getStoreStatusOptions: (state): ListItem[] => state.storeStatusOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getHolidayTypeOptions: (state): ListItem[] => state.holidayTypeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getSaleTypeOptions: (state): ListItem[] => state.saleTypeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getReturnStatusOptions: (state): ListItem[] => state.returnStatusOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getExchangeStatusOptions: (state): ListItem[] => state.exchangeStatusOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getNmdProductTypeOptions: (state): ListItem[] => state.nmdProductTypeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getNmdStockTypeOptions: (state): ListItem[] => state.nmdStockTypeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getNmdStatusOptions: (state): ListItem[] => state.nmdStatusOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getNmdIOTypeOptions: (state): ListItem[] => state.nmdIOTypeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getPromotionTypeOptions: (state): ListItem[] => state.promotionTypeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getPromotionStatusOptions: (state): ListItem[] => state.promotionStatusOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCategoryRegularOptions: (state): ListItem[] => state.csCategoryRegularOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCommentTypeOptions: (state): ListItem[] => state.csCommentTypeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCategoryOrderOptions: (state): ListItem[] => state.csCategoryOrderOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCategoryReturnOptions: (state): ListItem[] => state.csCategoryReturnOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCategoryExchangeOptions: (state): ListItem[] => state.csCategoryExchangeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getTransactionTypeAllOptions: (state): ListItem[] => state.transactionTypeAllOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCategoryRepairOptions: (state): ListItem[] => state.csCategoryRepairOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCategoryNewOrderOptions: (state): ListItem[] => state.csCategoryNewOrderOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCategoryNewReturnOptions: (state): ListItem[] => state.csCategoryNewReturnOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCsCategoryNewExchangeOptions: (state): ListItem[] => state.csCategoryNewExchangeOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getTransactionTypeReturnOptions: (state): ListItem[] => state.transactionTypeReturnOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCustomerStatusOptions: (state): ListItem[] => state.customerStatusOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCustomerClassOptions: (state): ListItem[] => state.customerClassOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getReturnViewOptions: (state): ListItem[] => state.returnViewOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getReturnStatusList: (state): ListItem[] => state.returnStatusList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getReturnReasonOptions: (state): ListItem[] => state.returnReasonOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getReturnCancelStatusOptions: (state): ListItem[] => state.returnCancelStatusOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getReturnDateOptions: (state): ListItem[] => state.returnDateOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getExchangeViewOptions: (state): ListItem[] => state.exchangeViewOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getExchangeStatusList: (state): ListItem[] => state.exchangeStatusList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getExchangeReasonOptions: (state): ListItem[] => state.exchangeReasonOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getExchangeDateOptions: (state): ListItem[] => state.exchangeDateOptions.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getWearHouseGroups: (state): ListItem[] => state.WearHouseGroups.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getESMJobTypes: (state): ListItem[] => state.ESMJobTypes.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getWHJobTypes: (state): ListItem[] => state.WHJobTypes.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getStaffTypes: (state): ListItem[] => state.StaffTypes.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getUserStatus: (state): ListItem[] => state.UserStatus.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getInboundStatus: (state): ListItem[] => state.InboundStatus.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getOutboundStatus: (state): ListItem[] => state.OutboundStatus.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getStockType: (state): ListItem[] => state.StockType.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getAdjustIncReason: (state): ListItem[] => state.AdjustIncReason.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getAdjustDecReason: (state): ListItem[] => state.AdjustDecReason.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getReturnInboundType: (state): ListItem[] => state.returnInboundType.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getExchangeInboundType: (state): ListItem[] => state.exchangeInboundType.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCSStatus: (state): ListItem[] => state.CSStatus.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getCurriorList: (state): ListItem[] => state.CurriorList.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
    getReturnRequestType: (state): ListItem[] => state.ReturnRequestType.map(({ COMM_CODE, COMM_FNAME_ENG }) => ({ value: decrypt(COMM_CODE), name: decrypt(COMM_FNAME_ENG) })),
  },
  actions: {
    async fetchData(endpoint: string, type: string, stateProp: string) {
      const data = await useFetchWithCache(endpoint, {
        method: 'post',
        body: {
          USER_SID: encrypt(user.value?.USER_SID),
          FLT_GROUP_CODE: encrypt(type),
          FLT_INCLUDE_INACTIVE : encrypt("0")
        }
      }, false);

      const dataValue: ResponseData = data as ResponseData;

      if (dataValue?.MTY === 'FAIL' || dataValue?.MTY === 'ERROR') {
        return {
          success: false,
          message: dataValue?.MSG
        }
      }

      (this as any)[stateProp] = dataValue?.RESULT_DATA;

      return {
        success: true,
        message: dataValue?.MSG
      };
    },
    async fetchSA000300CommonData() {
      const dataMap = {
        countriesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_COUNTRY' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchSA000600CommonData() {
      const dataMap = {
        WearHouseGroups: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_GROUP' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPA000300CommonData() {
      const dataMap = {
        WearHouseGroups: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_GROUP' },
        StockType: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_STOCK_TYPE' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPA010200CommonData() {
      const dataMap = {
        holidayTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_HOLIDAY_TYPE' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPA010400CommonData() {
      const dataMap = {
        orderStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_STATUS' },
        returnStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_STATUS' },
        exchangeStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_STATUS' },
        saleTypeOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_SALES_TYPE' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU010200CommonData() {
      const dataMap = {
        nmdProductTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_PROD_TYPE' },
        nmdStockTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_STOCK_TYPE' },
        nmdStatusOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU020100CommonData() {
      const dataMap = {
        currencyOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_CURRENCY' },
        manufacturerOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_MANUFACTURER' },
        countriesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_COUNTRY' },
        goodsStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_GOODS_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU030100CommonData() {
      const dataMap = {
        orderViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_VIEW_OPT' },
        orderSplitOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_SPLIT_OPT' },
        orderStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_STATUS' },
        orderDateOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_DATE_OPT' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU030200CommonData() {
      const dataMap = {
        returnStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_STATUS' },
        returnViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_VIEW_OPT' },
        returnStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_STATUS' },
        returnReasonOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_REASON' },
        returnCancelStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_CANCEL_STATUS' },
        returnDateOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_DATE_OPT' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU030300CommonData() {
      const dataMap = {
        exchangeViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_VIEW_OPT' },
        exchangeStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_STATUS' },
        exchangeReasonOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_REASON' },
        exchangeDateOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_DATE_OPT' },
        exchangeStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU040100CommonData() {
      const dataMap = {
        csCategoryRegularOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_REGULAR' },
        csCategoryOrderOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_ORDER' },
        csCategoryReturnOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_RETURN' },
        csCategoryExchangeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_EXCHANGE' },
        transactionTypeAllOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_TRANSACTION_TYPE_ALL' },
        csCategoryRepairOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_REPAIR' },
        csCategoryNewOrderOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_NEWORDER' },
        csCategoryNewReturnOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_NEWRETURN' },
        csCategoryNewExchangeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_NEWEXCHANGE' },
        transactionTypeReturnOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_TRANSACTION_TYPE_RETURN' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU050100CommonData() {
      const dataMap = {
        customerStatusOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CUSTOMER_STATUS' },
        customerClassOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CUSTOMER_CLASS' },
        countriesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_COUNTRY' },
        genderList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_GENDER' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU060100CommonData() {
      const dataMap = {
        promotionTypeOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_PROMOTION_TYPE' },
        promotionStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_PROMOTION_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchOU060200CommonData() {
      const dataMap = {
        promotionTypeOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_PROMOTION_TYPE' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchEU010200CommonData() {
      const dataMap = {
        WearHouseGroups: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_GROUP' },
        ESMJobTypes: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_ESM_JOB_TYPE' },
        StaffTypes: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_STAFF_TYPE' },
        UserStatus: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_USER_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchEU020400CommonData() {
      const dataMap = {
        AdjustIncReason: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_WH_STOCK_ADJUST_INC_REASON' },
        AdjustDecReason: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_WH_STOCK_ADJUST_DEC_REASON' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchEU040100CommonData() {
      const dataMap = {
        returnStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_STATUS' },
        returnViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_VIEW_OPT' },
        returnStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_STATUS' },
        returnReasonOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_REASON' },
        returnCancelStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_CANCEL_STATUS' },
        returnDateOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_DATE_OPT' },
        returnInboundType: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_INBOUND_TYPE' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchEU050100CommonData() {
      const dataMap = {
        exchangeViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_VIEW_OPT' },
        exchangeStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_STATUS' },
        exchangeReasonOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_REASON' },
        exchangeDateOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_DATE_OPT' },
        exchangeStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_STATUS' },
        exchangeInboundType: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_INBOUND_TYPE' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchEU060100CommonData() {
      const dataMap = {
        CSStatus: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_CS_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00010CommonData() {
      const dataMap = {
        genderList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_GENDER' },
        countriesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_COUNTRY' },
        languagesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_LANGUAGE' },
        departmentsList: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_DEPARTMENT' },
        positionsList: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_POSITION' },
        userGroupList: { endpoint: '/IS_SA_USERGROUP_LIST_GET', type: '' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00120CommonData() {
      const dataMap = {
        languagesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_LANGUAGE' },
        storeTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_STORE_TYPE' },
        departmentStoreOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_DEPARTMENT_STORE' },
        storeStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_STORE_STATUS' },
        countriesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_COUNTRY' },
        userGroupList: { endpoint: '/IS_SA_USERGROUP_LIST_GET', type: '' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00170CommonData() {
      const dataMap = {
        nmdProductTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_PROD_TYPE' },
        nmdStockTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_STOCK_TYPE' },
        nmdStatusOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_STATUS' },
        
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00180CommonData() {
      const dataMap = {
        nmdStockTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_STOCK_TYPE' },
        nmdIOTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_IO_TYPE' },        
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00200CommonData() {
      const dataMap = {
        orderViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_VIEW_OPT' },
        orderSplitOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_SPLIT_OPT' },
        orderStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00230CommonData() {
      const dataMap = {
        csCommentTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_COMMENT_TYPE' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00310CommonData() {
      const dataMap = {
        StaffTypes: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_STAFF_TYPE' },
        UserStatus: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_USER_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00360CommonData() {
      const dataMap = {
        StaffTypes: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_STAFF_TYPE' },
        UserStatus: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_USER_STATUS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00370CommonData() {
      const dataMap = {
        AdjustIncReason: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_WH_STOCK_ADJUST_INC_REASON' },
        AdjustDecReason: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_WH_STOCK_ADJUST_DEC_REASON' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00420CommonData() {
      const dataMap = {
        ReturnRequestType: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_REQUEST_RETURN_TYPE' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },
    async fetchPOP00430CommonData() {
      const dataMap = {
        CurriorList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_CURRIORS' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    },


    
    async fetchAllCommonData() {
      const dataMap = {
        userGroupList: { endpoint: '/IS_SA_USERGROUP_LIST_GET', type: '' },
        departmentsList: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_DEPARTMENT' },
        positionsList: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_POSITION' },
        countriesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_COUNTRY' },
        genderList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_GENDER' },
        languagesList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_LANGUAGE' },
        orderViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_VIEW_OPT' },
        orderSplitOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_SPLIT_OPT' },
        orderStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_STATUS' },
        orderDateOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ORDER_DATE_OPT' },
        goodsStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_GOODS_STATUS' },
        currencyOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_CURRENCY' },
        manufacturerOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_MANUFACTURER' },
        storeTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_STORE_TYPE' },
        departmentStoreOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_DEPARTMENT_STORE' },
        storeStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_STORE_STATUS' },
        holidayTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_HOLIDAY_TYPE' },
        saleTypeOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_SALES_TYPE' },
        returnStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_STATUS' },
        exchangeStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_STATUS' },
        nmdProductTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_PROD_TYPE' },
        nmdStockTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_STOCK_TYPE' },
        nmdStatusOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_STATUS' },
        nmdIOTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_NMD_IO_TYPE' },
        promotionTypeOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_PROMOTION_TYPE' },
        promotionStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_PROMOTION_STATUS' },
        csCategoryRegularOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_REGULAR' },
        csCommentTypeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_COMMENT_TYPE' },
        csCategoryOrderOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_ORDER' },
        csCategoryReturnOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_RETURN' },
        csCategoryExchangeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_EXCHANGE' },
        transactionTypeAllOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_TRANSACTION_TYPE_ALL' },
        csCategoryRepairOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_REPAIR' },
        csCategoryNewOrderOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_NEWORDER' },
        csCategoryNewReturnOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_NEWRETURN' },
        csCategoryNewExchangeOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CS_CATEGORY_NEWEXCHANGE' },
        transactionTypeReturnOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_TRANSACTION_TYPE_RETURN' },
        customerStatusOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CUSTOMER_STATUS' },
        customerClassOptions: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_CUSTOMER_CLASS' },
        returnViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_VIEW_OPT' },
        returnStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_STATUS' },
        returnReasonOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_REASON' },
        returnCancelStatusOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_CANCEL_STATUS' },
        returnDateOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_RETURN_DATE_OPT' },
        exchangeViewOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_VIEW_OPT' },
        exchangeStatusList: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_STATUS' },
        exchangeReasonOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_REASON' },
        exchangeDateOptions: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_EXCHANGE_DATE_OPT' },
        WearHouseGroups: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_GROUP' },
        ESMJobTypes: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_ESM_JOB_TYPE' },
        WHJobTypes: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_JOB_TYPE' },
        StaffTypes: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_STAFF_TYPE' },
        UserStatus: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_USER_STATUS' },
        InboundStatus: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_INBOUND_STATUS' },
        OutboundStatus: { endpoint: '/IS_SA_COMMON_GET', type: 'SA_WH_OUTBOUND_STATUS' },
        StockType: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_STOCK_TYPE' },
        AdjustIncReason: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_WH_STOCK_ADJUST_INC_REASON' },
        AdjustDecReason: { endpoint: '/IS_PA_COMMON_GET', type: 'PA_WH_STOCK_ADJUST_DEC_REASON' },
      };

      for (const [stateProp, { endpoint, type }] of Object.entries(dataMap)) {
        await this.fetchData(endpoint, type, stateProp);
      }
    }
  }
});
