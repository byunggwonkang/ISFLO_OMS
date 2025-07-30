<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();

const pageLoader = usePageLoaderStore()
const ProductImageViewer = useProductImageViewer()
const { currentTab } = storeToRefs(useTabsStore())
const isCreate = ref(false)
const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);
const { getGridData } = usePageLoaderGrid([currentTab.value?.component ?? ''])
const { toggleLoading } = useLoading()

const { ViewerList } = storeToRefs(ProductImageViewer);

/* Dialog Modal */
const openDialogModal = ref(false)

const DIALOG_TYPE = ref("")
const DIALOG_TITLE = ref("")
const DIALOG_TEXT = ref("")

////////////////////////////////

const Viewer = ref({})

const DataField01 = ref({})
const DataField02 = ref({})
const DataField03 = ref({})
const DataField04 = ref({})

const InputData = ref([{
  FLT_ENABLE: false,
  FLT_WORKS: 'Shipment',
  FLT_DISPLAY: {
    name: '',
    value: '',
  },
  FLT_FLAME: {
    name: '',
    value: '',
  },
  FLT_CLOSE: {
    name: '',
    value: '',
  }
},{
  FLT_ENABLE: false,
  FLT_WORKS: 'Return',
  FLT_DISPLAY: {
    name: '',
    value: '',
  },
  FLT_FLAME: {
    name: '',
    value: '',
  },
  FLT_CLOSE: {
    name: '',
    value: '',
  }
},{
  FLT_ENABLE: false,
  FLT_WORKS: 'Exchange',
  FLT_DISPLAY: {
    name: '',
    value: '',
  },
  FLT_FLAME: {
    name: '',
    value: '',
  },
  FLT_CLOSE: {
    name: '',
    value: '',
  }
},{
  FLT_ENABLE: false,
  FLT_WORKS: 'Stock',
  FLT_DISPLAY: {
    name: '',
    value: '',
  },
  FLT_FLAME: {
    name: '',
    value: '',
  },
  FLT_CLOSE: {
    name: '',
    value: '',
  }
},])
const DisplayCommon = ref([{
  name: '',
  value: '',
},{
  name: 'Automatic',
  value: '01',
},{
  name: 'User Click',
  value: '02',
}])
const FlameCommon = ref([{
  name: '',
  value: '',
},{
  name: 'New Browser',
  value: '01',
},{
  name: 'New Tab',
  value: '02',
},{
  name: 'Popup',
  value: '03',
}])
const CloseCommon = ref([{
  name: '',
  value: '',
},{
  name: 'User Click',
  value: '01',
},{
  name: 'In 1 Sec.',
  value: '02',
},{
  name: 'In 2 Sec.',
  value: '03',
},{
  name: 'In 3 Sec.',
  value: '04',
},{
  name: 'In 4 Sec.',
  value: '05',
},{
  name: 'In 5 Sec.',
  value: '06',
},{
  name: 'In 6 Sec.',
  value: '07',
},{
  name: 'In 7 Sec.',
  value: '08',
},{
  name: 'In 8 Sec.',
  value: '09',
},{
  name: 'In 9 Sec.',
  value: '10',
},{
  name: 'In 10 Sec.',
  value: '11',
}])
const DataCommon = ref([{
  name: 'None',
  value: '00',
},{
  name: 'Brand Name',
  value: '01',
},{
  name: 'Brand Code',
  value: '02',
},{
  name: 'SKU',
  value: '03',
},{
  name: 'ALU',
  value: '04',
},{
  name: 'EAN',
  value: '05',
},{
  name: 'Style(Material)',
  value: '06',
},{
  name: 'Category Name',
  value: '07',
},{
  name: 'Category Code',
  value: '08',
},{
  name: 'Color Code',
  value: '09',
},{
  name: 'Color Name',
  value: '10',
},{
  name: 'Size Name',
  value: '11',
}])
const formData = ref({
  FLT_IMGV_SET_NAME: '',
  FLT_IMGV_SET_ACTIVE_YN: true,
  FLT_IMGV_SET_PREFIX_URL: '',
  FLT_IMGV_SET_FILENAME: '',
  FLT_IMGV_SET_FILENAME_PREFIX_YN: false,
  FLT_IMGV_SET_FILENAME_PREFIX: '',
  FLT_IMGV_SET_FILENAME_PREFIX_SEP: '',
  FLT_IMGV_SET_FILENAME_DATA01_CODE: '',
  FLT_IMGV_SET_FILENAME_DATA01_NAME: '',
  FLT_IMGV_SET_FILENAME_DATA01_SEP: '',
  FLT_IMGV_SET_FILENAME_DATA02_YN: false,
  FLT_IMGV_SET_FILENAME_DATA02_CODE: '',
  FLT_IMGV_SET_FILENAME_DATA02_NAME: '',
  FLT_IMGV_SET_FILENAME_DATA02_SEP: '',
  FLT_IMGV_SET_FILENAME_DATA03_YN: false,
  FLT_IMGV_SET_FILENAME_DATA03_CODE: '',
  FLT_IMGV_SET_FILENAME_DATA03_NAME: '',
  FLT_IMGV_SET_FILENAME_DATA03_SEP: '',
  FLT_IMGV_SET_FILENAME_DATA04_YN: false,
  FLT_IMGV_SET_FILENAME_DATA04_CODE: '',
  FLT_IMGV_SET_FILENAME_DATA04_NAME: '',
  FLT_IMGV_SET_FILENAME_DATA04_SEP: '',
  FLT_IMGV_SET_FILENAME_DATA05_YN: false,
  FLT_IMGV_SET_FILENAME_DATA05_CODE: '',
  FLT_IMGV_SET_FILENAME_DATA05_NAME: '',
  FLT_IMGV_SET_FILENAME_DATA05_SEP: '',
  FLT_IMGV_SET_FILENAME_SUFFIX_YN: false,
  FLT_IMGV_SET_FILENAME_SUFFIX: '',
  FLT_IMGV_SET_FILENAME_EXT: '',
  FLT_IMGV_SET_EVENT_SHIP_YN: '',
  FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_RETURN_YN: '',
  FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_EXCHANGE_YN: '',
  FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_STOCK_YN: '',
  FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_NAME: '',
  FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_CODE: '',
  FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_NAME: ''
})

watch(() => Viewer.value, async () => {
  if (Viewer.value?.value === '') {
    resetFormData()
  } else {

    for (let i = 0; i < ViewerList.value.length; i++) 
    {
      if(Viewer.value?.value === decrypt(ViewerList.value[i].WH_GROUP_FNAME) + ' - ' + decrypt(ViewerList.value[i].IMGV_SET_NAME))
      {
        ViewerDataSet(i)
        break        
      }
    }
  }
}, {
  immediate: true,
  deep: true,
})

const ViewerDataSet = async (Index) => {
  formData.value.FLT_IMGV_SET_NAME = decrypt(ViewerList.value[Index].IMGV_SET_NAME)
  formData.value.FLT_IMGV_SET_ACTIVE_YN = decrypt(ViewerList.value[Index].IMGV_SET_ACTIVE_YN) === '1'
  formData.value.FLT_IMGV_SET_PREFIX_URL = decrypt(ViewerList.value[Index].IMGV_SET_PREFIX_URL)
  formData.value.FLT_IMGV_SET_FILENAME = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME)
  formData.value.FLT_IMGV_SET_FILENAME_PREFIX_YN = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_PREFIX_YN) === '1'
  formData.value.FLT_IMGV_SET_FILENAME_PREFIX = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_PREFIX)
  formData.value.FLT_IMGV_SET_FILENAME_PREFIX_SEP = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_PREFIX_SEP)
  formData.value.FLT_IMGV_SET_FILENAME_DATA01_CODE = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA01_CODE)
  formData.value.FLT_IMGV_SET_FILENAME_DATA01_NAME = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA01_NAME)
  formData.value.FLT_IMGV_SET_FILENAME_DATA01_SEP = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA01_SEP)
  DataField01.value = {
    name: decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA01_NAME),
    value: decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA01_CODE),
  };
  formData.value.FLT_IMGV_SET_FILENAME_DATA02_YN = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA02_YN) === '1' 
  formData.value.FLT_IMGV_SET_FILENAME_DATA02_CODE = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA02_CODE)
  formData.value.FLT_IMGV_SET_FILENAME_DATA02_NAME = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA02_NAME)
  formData.value.FLT_IMGV_SET_FILENAME_DATA02_SEP = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA02_SEP)
  DataField02.value = {
    name: decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA02_NAME),
    value: decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA02_CODE),
  };
  formData.value.FLT_IMGV_SET_FILENAME_DATA03_YN = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA03_YN) === '1'
  formData.value.FLT_IMGV_SET_FILENAME_DATA03_CODE = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA03_CODE)
  formData.value.FLT_IMGV_SET_FILENAME_DATA03_NAME = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA03_NAME)
  formData.value.FLT_IMGV_SET_FILENAME_DATA03_SEP = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA03_SEP)
  DataField03.value = {
    name: decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA03_NAME),
    value: decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA03_CODE),
  };
  formData.value.FLT_IMGV_SET_FILENAME_DATA04_YN = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA04_YN) === '1'
  formData.value.FLT_IMGV_SET_FILENAME_DATA04_CODE = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA04_CODE)
  formData.value.FLT_IMGV_SET_FILENAME_DATA04_NAME = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA04_NAME)
  formData.value.FLT_IMGV_SET_FILENAME_DATA04_SEP = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA04_SEP)
  DataField04.value = {
    name: decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA04_NAME),
    value: decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA04_CODE),
  };
  formData.value.FLT_IMGV_SET_FILENAME_DATA05_YN = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA05_YN) === '1'
  formData.value.FLT_IMGV_SET_FILENAME_DATA05_CODE = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA05_CODE)
  formData.value.FLT_IMGV_SET_FILENAME_DATA05_NAME = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA05_NAME)
  formData.value.FLT_IMGV_SET_FILENAME_DATA05_SEP = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_DATA05_SEP)
  formData.value.FLT_IMGV_SET_FILENAME_SUFFIX_YN = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_SUFFIX_YN) === '1'
  formData.value.FLT_IMGV_SET_FILENAME_SUFFIX = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_SUFFIX)
  formData.value.FLT_IMGV_SET_FILENAME_EXT = decrypt(ViewerList.value[Index].IMGV_SET_FILENAME_EXT)
  formData.value.FLT_IMGV_SET_EVENT_SHIP_YN = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_YN)
  formData.value.FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_DISP_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_DISP_TYPE_NAME)
  formData.value.FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_FLAME_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_FLAME_TYPE_NAME)
  formData.value.FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_CLOSE_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_CLOSE_TYPE_NAME)

  InputData.value[0].FLT_ENABLE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_YN) === '1'
  InputData.value[0].FLT_DISPLAY.name = Vdecrypt(iewerList.value[Index].IMGV_SET_EVENT_SHIP_DISP_TYPE_NAME)
  InputData.value[0].FLT_DISPLAY.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_DISP_TYPE_CODE)
  InputData.value[0].FLT_FLAME.name = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_FLAME_TYPE_NAME)
  InputData.value[0].FLT_FLAME.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_FLAME_TYPE_CODE)
  InputData.value[0].FLT_CLOSE.name = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_CLOSE_TYPE_NAME)
  InputData.value[0].FLT_CLOSE.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_SHIP_CLOSE_TYPE_CODE)

  formData.value.FLT_IMGV_SET_EVENT_RETURN_YN = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_YN)
  formData.value.FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_DISP_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_DISP_TYPE_NAME)
  formData.value.FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_FLAME_TYPE_NAME)
  formData.value.FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_CLOSE_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_CLOSE_TYPE_NAME)

  InputData.value[1].FLT_ENABLE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_YN) === '1'
  InputData.value[1].FLT_DISPLAY.name = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_DISP_TYPE_NAME)
  InputData.value[1].FLT_DISPLAY.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_DISP_TYPE_CODE)
  InputData.value[1].FLT_FLAME.name = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_FLAME_TYPE_NAME)
  InputData.value[1].FLT_FLAME.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE)
  InputData.value[1].FLT_CLOSE.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_CLOSE_TYPE_NAME)
  InputData.value[1].FLT_CLOSE.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_RETURN_CLOSE_TYPE_CODE)

  formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_YN = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_YN)
  formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_NAME)
  formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_NAME)
  formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_NAME)

  InputData.value[2].FLT_ENABLE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_YN) === '1'
  InputData.value[2].FLT_DISPLAY.name = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_NAME)
  InputData.value[2].FLT_DISPLAY.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_CODE)
  InputData.value[2].FLT_FLAME.name = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_NAME)
  InputData.value[2].FLT_FLAME.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_CODE)
  InputData.value[2].FLT_CLOSE.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_NAME)
  InputData.value[2].FLT_CLOSE.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_CODE)

  formData.value.FLT_IMGV_SET_EVENT_STOCK_YN = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_YN)
  formData.value.FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_DISP_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_DISP_TYPE_NAME)
  formData.value.FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_FLAME_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_FLAME_TYPE_NAME)
  formData.value.FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_CODE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_CLOSE_TYPE_CODE)
  formData.value.FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_NAME = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_CLOSE_TYPE_NAME)

  InputData.value[3].FLT_ENABLE = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_YN) === '1'  
  InputData.value[3].FLT_DISPLAY.name = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_DISP_TYPE_NAME)
  InputData.value[3].FLT_DISPLAY.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_DISP_TYPE_CODE)
  InputData.value[3].FLT_FLAME.name = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_FLAME_TYPE_NAME)
  InputData.value[3].FLT_FLAME.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_FLAME_TYPE_CODE)
  InputData.value[3].FLT_CLOSE.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_CLOSE_TYPE_NAME)
  InputData.value[3].FLT_CLOSE.value = decrypt(ViewerList.value[Index].IMGV_SET_EVENT_STOCK_CLOSE_TYPE_CODE)

}

onMounted(async () => {
  togglePageLoading()
  isloading.isLoading = true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')

  DataField01.value = DataCommon[0]
  DataField02.value = DataCommon[0]
  DataField03.value = DataCommon[0]
  DataField04.value = DataCommon[0]

  Viewer.value = {
    name: '',
    value: '',
  };

  await fetchViewerList()
  isloading.isLoading = false
  togglePageLoading()
}) 

const fetchViewerList = async () => {
  await ProductImageViewer.fetchViewerList()
}

const btnNew = async () => {
  isCreate.value = true
  Viewer.value = {
    name: '',
    value: '',
  }
  resetFormData()
}

const btnCancel = async () => {
  isCreate.value = false
  Viewer.value = {
    name: '',
    value: '',
  }
  resetFormData()
}

const resetFormData = () => {
  formData.value = {
    FLT_IMGV_SET_NAME: '',
    FLT_IMGV_SET_ACTIVE_YN: true,
    FLT_IMGV_SET_PREFIX_URL: '',
    FLT_IMGV_SET_FILENAME: '',
    FLT_IMGV_SET_FILENAME_PREFIX_YN: false,
    FLT_IMGV_SET_FILENAME_PREFIX: '',
    FLT_IMGV_SET_FILENAME_PREFIX_SEP: '',
    FLT_IMGV_SET_FILENAME_DATA01_CODE: '',
    FLT_IMGV_SET_FILENAME_DATA01_NAME: '',
    FLT_IMGV_SET_FILENAME_DATA01_SEP: '',
    FLT_IMGV_SET_FILENAME_DATA02_YN: false,
    FLT_IMGV_SET_FILENAME_DATA02_CODE: '',
    FLT_IMGV_SET_FILENAME_DATA02_NAME: '',
    FLT_IMGV_SET_FILENAME_DATA02_SEP: '',
    FLT_IMGV_SET_FILENAME_DATA03_YN: false,
    FLT_IMGV_SET_FILENAME_DATA03_CODE: '',
    FLT_IMGV_SET_FILENAME_DATA03_NAME: '',
    FLT_IMGV_SET_FILENAME_DATA03_SEP: '',
    FLT_IMGV_SET_FILENAME_DATA04_YN: false,
    FLT_IMGV_SET_FILENAME_DATA04_CODE: '',
    FLT_IMGV_SET_FILENAME_DATA04_NAME: '',
    FLT_IMGV_SET_FILENAME_DATA04_SEP: '',
    FLT_IMGV_SET_FILENAME_DATA05_YN: false,
    FLT_IMGV_SET_FILENAME_DATA05_CODE: '',
    FLT_IMGV_SET_FILENAME_DATA05_NAME: '',
    FLT_IMGV_SET_FILENAME_DATA05_SEP: '',
    FLT_IMGV_SET_FILENAME_SUFFIX_YN: false,
    FLT_IMGV_SET_FILENAME_SUFFIX: '',
    FLT_IMGV_SET_FILENAME_EXT: '',
    FLT_IMGV_SET_EVENT_SHIP_YN: '',
    FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_RETURN_YN: '',
    FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_EXCHANGE_YN: '',
    FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_STOCK_YN: '',
    FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_NAME: '',
    FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_CODE: '',
    FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_NAME: ''
  }

  InputData.value = [{
    FLT_ENABLE: false,
    FLT_WORKS: 'Shipment',
    FLT_DISPLAY: {
      name: '',
      value: '',
    },
    FLT_FLAME: {
      name: '',
      value: '',
    },
    FLT_CLOSE: {
      name: '',
      value: '',
    }
  },{
    FLT_ENABLE: false,
    FLT_WORKS: 'Return',
    FLT_DISPLAY: {
      name: '',
      value: '',
    },
    FLT_FLAME: {
      name: '',
      value: '',
    },
    FLT_CLOSE: {
      name: '',
      value: '',
    }
  },{
    FLT_ENABLE: false,
    FLT_WORKS: 'Exchange',
    FLT_DISPLAY: {
      name: '',
      value: '',
    },
    FLT_FLAME: {
      name: '',
      value: '',
    },
    FLT_CLOSE: {
      name: '',
      value: ' ',
    }
  },{
    FLT_ENABLE: false,
    FLT_WORKS: 'Stock',
    FLT_DISPLAY: {
      name: '',
      value: '',
    },
    FLT_FLAME: {
      name: '',
      value: '',
    },
    FLT_CLOSE: {
      name: '',
      value: '',
    }
  }]

  DataField01.value = DataCommon[0]
  DataField02.value = DataCommon[0]
  DataField03.value = DataCommon[0]
  DataField04.value = DataCommon[0]
}

const DeleteViewerList = async () => {
  DIALOG_TYPE.value = 'DELETE'
  DIALOG_TITLE.value = 'Delete product image viewer'
  DIALOG_TEXT.value = 'Delete image viewer information?'

  openDialogModal.value = true
}

const SaveViewerList = async () => {

  DIALOG_TYPE.value = 'SAVE'
  DIALOG_TITLE.value = 'Save product image viewer'
  DIALOG_TEXT.value = 'Save image viewer information?'

  openDialogModal.value = true
}

const ConfirmDialog = async () => {
  
  if(DIALOG_TYPE.value === 'SAVE')
  {
    //formData.value.FLT_IMGV_SET_ACTIVE_YN = formData.value.FLT_IMGV_SET_ACTIVE_YN ? '1' : '0'   
  
    //formData.value.FLT_IMGV_SET_FILENAME_PREFIX_YN = formData.value.FLT_IMGV_SET_FILENAME_PREFIX_YN ? '1' : '0'  

    formData.value.FLT_IMGV_SET_FILENAME_DATA01_CODE = DataField01.value?.value ?? ''
    formData.value.FLT_IMGV_SET_FILENAME_DATA01_NAME = DataField01.value?.name ?? ''
    
    //formData.value.FLT_IMGV_SET_FILENAME_DATA02_YN = formData.value.FLT_IMGV_SET_FILENAME_DATA02_YN ? '1' : '0'  
    formData.value.FLT_IMGV_SET_FILENAME_DATA02_CODE = DataField02.value?.value ?? ''
    formData.value.FLT_IMGV_SET_FILENAME_DATA02_NAME = DataField02.value?.name ?? ''

    //formData.value.FLT_IMGV_SET_FILENAME_DATA03_YN = formData.value.FLT_IMGV_SET_FILENAME_DATA03_YN ? '1' : '0'  
    formData.value.FLT_IMGV_SET_FILENAME_DATA03_CODE = DataField03.value?.value ?? ''
    formData.value.FLT_IMGV_SET_FILENAME_DATA03_NAME = DataField03.value?.name ?? ''

    //formData.value.FLT_IMGV_SET_FILENAME_DATA04_YN = formData.value.FLT_IMGV_SET_FILENAME_DATA04_YN ? '1' : '0'  
    formData.value.FLT_IMGV_SET_FILENAME_DATA04_CODE = DataField04.value?.value ?? ''
    formData.value.FLT_IMGV_SET_FILENAME_DATA04_NAME = DataField04.value?.name ?? ''

    //formData.value.FLT_IMGV_SET_FILENAME_DATA05_YN = formData.value.FLT_IMGV_SET_FILENAME_DATA05_YN ? '1' : '0'  
    //formData.value.FLT_IMGV_SET_FILENAME_DATA05_CODE = DataField05.value?.value ?? ''
    //formData.value.FLT_IMGV_SET_FILENAME_DATA05_CODE = DataField05.value?.name ?? ''
    formData.value.FLT_IMGV_SET_FILENAME_DATA05_CODE = ''
    formData.value.FLT_IMGV_SET_FILENAME_DATA05_CODE = ''

    //formData.value.FLT_IMGV_SET_FILENAME_SUFFIX_YN = formData.value.FLT_IMGV_SET_FILENAME_SUFFIX_YN ? '1' : '0'  

    formData.value.FLT_IMGV_SET_EVENT_SHIP_YN = InputData.value[0].FLT_ENABLE
    formData.value.FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_CODE = InputData.value[0].FLT_DISPLAY.value
    formData.value.FLT_IMGV_SET_EVENT_SHIP_DISP_TYPE_NAME = InputData.value[0].FLT_DISPLAY.name
    formData.value.FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_CODE = InputData.value[0].FLT_FLAME.value
    formData.value.FLT_IMGV_SET_EVENT_SHIP_FLAME_TYPE_NAME = InputData.value[0].FLT_FLAME.name
    formData.value.FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_CODE = InputData.value[0].FLT_CLOSE.value
    formData.value.FLT_IMGV_SET_EVENT_SHIP_CLOSE_TYPE_NAME = InputData.value[0].FLT_CLOSE.name

    formData.value.FLT_IMGV_SET_EVENT_RETURN_YN = InputData.value[1].FLT_ENABLE 
    formData.value.FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_CODE = InputData.value[1].FLT_DISPLAY.value
    formData.value.FLT_IMGV_SET_EVENT_RETURN_DISP_TYPE_NAME = InputData.value[1].FLT_DISPLAY.name
    formData.value.FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE = InputData.value[1].FLT_FLAME.value
    formData.value.FLT_IMGV_SET_EVENT_RETURN_FLAME_TYPE_CODE = InputData.value[1].FLT_FLAME.name
    formData.value.FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_CODE = InputData.value[1].FLT_CLOSE.value
    formData.value.FLT_IMGV_SET_EVENT_RETURN_CLOSE_TYPE_NAME = InputData.value[1].FLT_CLOSE.name
    
    formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_YN = InputData.value[2].FLT_ENABLE
    formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_CODE = InputData.value[2].FLT_DISPLAY.value
    formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_DISP_TYPE_NAME = InputData.value[2].FLT_DISPLAY.name
    formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_CODE = InputData.value[2].FLT_FLAME.value
    formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_FLAME_TYPE_NAME = InputData.value[2].FLT_FLAME.name
    formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_CODE = InputData.value[2].FLT_CLOSE.value
    formData.value.FLT_IMGV_SET_EVENT_EXCHANGE_CLOSE_TYPE_NAME = InputData.value[2].FLT_CLOSE.name

    formData.value.FLT_IMGV_SET_EVENT_STOCK_YN = InputData.value[3].FLT_ENABLE
    formData.value.FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_CODE = InputData.value[3].FLT_DISPLAY.value
    formData.value.FLT_IMGV_SET_EVENT_STOCK_DISP_TYPE_NAME = InputData.value[3].FLT_DISPLAY.name
    formData.value.FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_CODE = InputData.value[3].FLT_FLAME.value
    formData.value.FLT_IMGV_SET_EVENT_STOCK_FLAME_TYPE_NAME = InputData.value[3].FLT_FLAME.name
    formData.value.FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_CODE = InputData.value[3].FLT_CLOSE.value
    formData.value.FLT_IMGV_SET_EVENT_STOCK_CLOSE_TYPE_NAME = InputData.value[3].FLT_CLOSE.name

    toggleLoading()
    const { success } = await ProductImageViewer.SaveViewerList(formData.value)
    if (success) {
      await fetchViewerList()  
      Viewer.value = {
        name: '',
        value: '',
      };  
    }
    toggleLoading()
  }
  else if(DIALOG_TYPE.value === 'DELETE')
  {
    toggleLoading()
    const { success } = await ProductImageViewer.DeleteViewerList(formData.value.FLT_IMGV_SET_NAME)
    if (success) {
      await fetchViewerList()  
      Viewer.value = {
        name: '',
        value: '',
      };  
    }
    toggleLoading()
  }
  openDialogModal.value = false
}


</script>

<template>
  <AppContent
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-6 gap-y-3 gap-x-12">
        <FormGroup
          :label="getComponentData('EU010400_LBL00001', 'caption', 'Viewer')"
          label-id="EU010400_LBL00001"
          label-for="EU010400_CMB00001"
          horizontal
          label-width="w-1/4"
        >
          <FormSelect
            v-if="!isCreate"
            id="EU010400_CMB00001"  
            v-model="Viewer" 
            :options="[
              {
                name: '',
                value: '',
              },
              ...ViewerList.map((Viewer) => ({
                name: decrypt(Viewer.WH_GROUP_FNAME) + ' - ' + decrypt(Viewer.IMGV_SET_NAME),
                value: decrypt(Viewer.WH_GROUP_FNAME) + ' - ' + decrypt(Viewer.IMGV_SET_NAME),
              }))
            ]"
          />
          <FormTextInput
            v-if="isCreate"
            id="EU010400_TXT00001"
            v-model="formData.FLT_IMGV_SET_NAME"
          />
        </FormGroup>   
        <div 
          class="col-span-1 text-start"
          horizontal
        >
          <div class="inline-flex items-center space-x-2">        
            <Button
              id="EU010400_BTN00001"
              rounded
              class="w-30"
              variant="gray"
              :disabled="isCreate"
              @click="btnNew"
            >
              {{ getComponentData('EU010400_BTN00001', 'caption', 'New') }}
            </Button>               
            <Button
              id="EU010400_BTN00002"
              rounded
              class="w-30"
              variant="gray"
              :disabled="!isCreate"
              @click="btnCancel"
            >
              {{ getComponentData('EU010400_BTN00002', 'caption', 'Cancel') }}
            </Button>            
          </div>
        </div>
      </div>
    </template>
    <Card
      divider
      shadow-size="none"
      card-header-class="px-3 py-2 space-y-1"
      class="shadow ring-1 ring-black ring-opacity-10 sm:rounded-lg flex flex-col justify-start"
      card-body-class="p-3 space-y-3"
    >     
      <div class="grid grid-cols-4 gap-y-3 gap-x-12">
        <FormGroup          
          class="py-2"
          :label="getComponentData('EU010400_LBL00002', 'caption','Active')"
          label-id="EU010400_LBL00002"
          label-for="EU001040_CHK00001"
          label-width="w-2/6"
          input-width="w-4/6"
          horizontal
        >
          <FormCheckbox
            id="EU001040_CHK00001"
            v-model="formData.FLT_IMGV_SET_ACTIVE_YN" 
            class="px-3"                   
            value="1"
            :checked="formData.FLT_IMGV_SET_ACTIVE_YN == '1'"          
          />
        </FormGroup> 
        <FormGroup />
        <FormGroup />
        <FormGroup />
        <div class="col-span-2">
          <FormGroup
            class="py-2"
            :label="getComponentData('EU010400_LBL00003', 'caption', 'Prefix URL')"
            label-id="EU010400_LBL00003"
            label-for="EU010400_TXT00002"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"
          >
            <FormTextInput
              id="EU010400_TXT00002"
              v-model="formData.FLT_IMGV_SET_PREFIX_URL"
            />
          </FormGroup>
        </div>
        <FormGroup />
        <FormGroup />
        <div class="col-span-2">
          <FormGroup
            :label="getComponentData('EU010400_LBL00004', 'caption', 'Image File Name')"
            label-id="EU010400_LBL00004"
            label-for="EU010400_TXT00003"
            horizontal
            label-width="w-1/6"
            input-width="w-5/6"            
          >
            <FormTextInput
              id="EU010400_TXT00003"
              v-model="formData.FLT_IMGV_SET_FILENAME"
              disabled
            />
          </FormGroup>
        </div>
      </div>
      <div class="grid grid-cols-3 py-5 gap-y-3 gap-x-12">
        <div class="col-span-1">
          <div class="grid grid-cols-5">
            <FormGroup />
            <FormGroup />
            <FormGroup />
            <div class="col-span-1">
              <h3 class="text-sm px-4">
                {{ getComponentData('EU010400_LBL00005', 'caption', 'Separate\nCharacters') }}
              </h3>
            </div>  
            <FormGroup />
            <div class="col-span-3">
              <FormGroup
                class="py-2"
                :label="getComponentData('EU010400_LBL00006', 'caption','Prefix text')"
                label-id="EU010400_LBL00006"
                label-for="EU001040_CHK00002"
                label-width="w-2/5"
                input-width="w-3/5"
                horizontal
                prefix-class="z-10"
              >
                <template #prefix>
                  <FormCheckbox
                    v-model="formData.FLT_IMGV_SET_FILENAME_PREFIX_YN"        
                  />
                </template>
                <FormTextInput
                  id="EU010400_TXT00004"
                  v-model="formData.FLT_IMGV_SET_FILENAME_PREFIX"     
                  style="min-width: 155px;"        
                />          
              </FormGroup> 
            </div>
            <div class="col-span-1 py-2 px-2">
              <FormTextInput                
                id="EU010400_TXT00005"                
                v-model="formData.FLT_IMGV_SET_FILENAME_PREFIX_SEP"
              />
            </div>
            <FormGroup />

            <div class="col-span-3">
              <FormGroup
                class="py-2"
                :label="getComponentData('EU010400_LBL00007', 'caption','Data Field #1')"
                label-id="EU010400_LBL00006"
                label-for="EU001040_CHK00002"
                label-width="w-2/5"
                input-width="w-3/5"
                horizontal
                prefix-class="z-10 border-0"
              >
                <template #prefix />
                <FormCombobox
                  id="EU010400_CMB00002"
                  v-model="DataField01"
                  style="min-width: 155px;"
                  :options="DataCommon"
                />      
              </FormGroup> 
            </div>
            <div class="col-span-1 py-2 px-2">
              <FormTextInput                
                id="EU010400_TXT00006"                
                v-model="formData.FLT_IMGV_SET_FILENAME_DATA01_SEP"
              />
            </div>
            <FormGroup />

            <div class="col-span-3">
              <FormGroup
                class="py-2"
                :label="getComponentData('EU010400_LBL00008', 'caption','Data Field #2')"
                label-id="EU010400_LBL00008"
                label-for="EU001040_CHK00003"
                label-width="w-2/5"
                input-width="w-3/5"
                horizontal
                prefix-class="z-10"
              >
                <template #prefix>
                  <FormCheckbox
                    v-model="formData.FLT_IMGV_SET_FILENAME_DATA02_YN"        
                  />  
                </template>
                <FormCombobox
                  id="EU010400_CMB00003"
                  v-model="DataField02"
                  style="min-width: 155px;"
                  :options="DataCommon"
                />    
              </FormGroup> 
            </div>
            <div class="col-span-1 py-2 px-2">
              <FormTextInput                
                id="EU010400_TXT00007"                
                v-model="formData.FLT_IMGV_SET_FILENAME_DATA02_SEP"
              />
            </div>
            <FormGroup />

            <div class="col-span-3">
              <FormGroup
                class="py-2"
                :label="getComponentData('EU010400_LBL00009', 'caption','Data Field #3')"
                label-id="EU010400_LBL00009"
                label-for="EU001040_CHK00004"
                label-width="w-2/5"
                input-width="w-3/5"
                horizontal
                prefix-class="z-10"
              >
                <template #prefix>
                  <FormCheckbox
                    v-model="formData.FLT_IMGV_SET_FILENAME_DATA03_YN"        
                  />  
                </template>
                <FormCombobox
                  id="EU010400_CMB00004"
                  v-model="DataField03"
                  style="min-width: 155px;"
                  :options="DataCommon"
                />  
              </FormGroup> 
            </div>
            <div class="col-span-1 py-2 px-2">
              <FormTextInput
                id="EU010400_TXT00008"
                v-model="formData.FLT_IMGV_SET_FILENAME_DATA03_SEP"
              />
            </div>
            <FormGroup />

            <div class="col-span-3">
              <FormGroup
                class="py-2"
                :label="getComponentData('EU010400_LBL00010', 'caption','Data Field #4')"
                label-id="EU010400_LBL00010"
                label-for="EU010400_CMB00005"
                label-width="w-2/5"
                input-width="w-3/5"
                horizontal
                prefix-class="z-10"
              >
                <template #prefix>
                  <FormCheckbox
                    v-model="formData.FLT_IMGV_SET_FILENAME_DATA04_YN"        
                  />  
                </template>
                <FormCombobox
                  id="EU010400_CMB00005"
                  v-model="DataField04"
                  style="min-width: 155px;"
                  :options="DataCommon"
                />  
              </FormGroup> 
            </div>
            <FormGroup />
            <FormGroup />
            <div class="col-span-3">
              <FormGroup
                class="py-2"
                :label="getComponentData('EU010400_LBL00011', 'caption','Suffix text')"
                label-id="EU010400_LBL00011"
                label-for="EU001040_CHK00006"
                label-width="w-2/5"
                input-width="w-3/5"
                horizontal
                prefix-class="z-10"
              >
                <template #prefix>
                  <FormCheckbox
                    v-model="formData.FLT_IMGV_SET_FILENAME_SUFFIX_YN"        
                  />  
                </template>
                <FormTextInput                
                  id="EU010400_TXT00009"
                  v-model="formData.FLT_IMGV_SET_FILENAME_SUFFIX"                
                  style="min-width: 155px;"
                />
              </FormGroup> 
            </div>
            <FormGroup />
            <FormGroup />
            <div class="col-span-3">
              <FormGroup
                class="py-2"
                :label="getComponentData('EU010400_LBL00012', 'caption','File extension')"
                label-id="EU010400_LBL00012"
                label-for="EU010400_TXT00010"
                label-width="w-2/5"
                input-width="w-3/5"
                horizontal
                prefix-class="z-10 border-0"
              >
                <template #prefix />                  
                <FormTextInput
                  id="EU010400_TXT00010"
                  v-model="formData.FLT_IMGV_SET_FILENAME_EXT"
                  style="min-width: 155px;"
                />
              </FormGroup> 
            </div>
            <FormGroup />
            <FormGroup />
          </div>
        </div>
        <div class="col-span-2">
          <p class="py-3">
            {{ getGridData('EU010400_GRD00001', 'caption', 'Events for Display') }}
          </p>
          <Table
            id="EU010400_GRD00001"                   
            border
            header-variant="secondary"            
          >
            <TableHead>              
              <TableHeadCell class="text-center">
                Enable
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Works
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Display
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Flame
              </TableHeadCell>
              <TableHeadCell class="text-center">
                Close
              </TableHeadCell>
            </TableHead>
            <TableBody>
              <TableRow
                v-for="(option, index) in InputData"
                :key="index"
              >                          
                <TableCell class="text-center">
                  <div>
                    <FormCheckbox 
                      v-model="InputData[index].FLT_ENABLE"
                      :checked="InputData[index].FLT_ENABLE"
                    />  
                  </div>               
                </TableCell>
                <TableCell class="text-center">
                  {{ option.FLT_WORKS }}
                </TableCell>
                <TableCell>
                  <div>
                    <FormSelect
                      id="EU010400_CMB00001"
                      v-model="InputData[index].FLT_DISPLAY"
                      :options="DisplayCommon"
                      :dropUp="index > 1"
                      :visibleRows="3"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <FormSelect
                      id="EU010400_CMB00001"
                      v-model="InputData[index].FLT_FLAME"
                      :options="FlameCommon"
                      :dropUp="index > 1"
                      :visibleRows="3"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <FormSelect
                      id="EU010400_CMB00001"
                      v-model="InputData[index].FLT_CLOSE"
                      :options="CloseCommon"
                      :dropUp="index > 1"
                      :visibleRows="3"
                    />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div> 
      <div class="flex space-x-3 justify-end p-2">
        <Button
          id="EU010400_BTN00004"
          class="w-30"
          rounded
          variant="gray"
          :disabled="isCreate"
          :loading="loading"   
          @click="DeleteViewerList"       
        >
          {{ getComponentData('EU010400_BTN00004', 'caption','DELETE') }}
        </Button>
        <Button
          id="EU010400_BTN00003"
          class="w-30"
          rounded
          variant="gray"
          :loading="loading" 
          @click="SaveViewerList"         
        >
          {{ getComponentData('EU010400_BTN00003', 'caption','SAVE') }}
        </Button>
      </div>      
    </Card>
    <!-- Dialog Modal -->
    <Modal
      :show="openDialogModal"
      divider
      @close="() => {
        openDialogModal = false
      }"
    >
      <template #header>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getComponentData('POP00001_LBL00001', 'caption', 'Information') }}
        </h3>
      </template>

      <template #body>
        <component
          :is="'POP00001'"
          :dialog-title="DIALOG_TITLE"
          :dialog-text="DIALOG_TEXT"
          @btn-confirm="ConfirmDialog"
          @btn-cancel="() => {
            openDialogModal = false
          }"
        />
      </template>
    </Modal>
  </AppContent>
</template>

<style scoped>

</style>
