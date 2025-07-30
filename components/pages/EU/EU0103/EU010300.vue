<script setup>
import { encrypt, decrypt } from '@/stores/common/aes'
import { useLoadingStore } from '@/stores/common/loading'
const isloading = useLoadingStore()

const { pageLoading, togglePageLoading } = usePageLoading();
const WaybillDesign = useWaybillDesignStore()
const { currentTab } = storeToRefs(useTabsStore())
const pageLoader = usePageLoaderStore()
const { LogisticList } = storeToRefs(WaybillDesign)

const { loading, toggleLoading } = useLoading()

const Logistic = ref({})

const { getComponentData } = usePageLoaderComponent([currentTab.value?.component]);

onMounted(async () => {  
  togglePageLoading()
  isloading.isLoading =true
  await pageLoader.fetchPageLoadData(currentTab.value?.component ?? '')  
  await WaybillDesign.fetchLogisticList()

  Logistic.value = {
    name: decrypt(LogisticList.value[0].COURIER_FNAME),
    value: decrypt(LogisticList.value[0].COURIER_SID),
  };
  isloading.isLoading =false

  togglePageLoading()
})

</script>

<template>
  <AppContent
    divider
    :loading="pageLoading"
  >
    <template #filters>
      <div class="grid grid-cols-5 gap-y-3 gap-x-12">
        <FormGroup
          :label="getComponentData('EU010300_LBL00001', 'caption', 'Logistics')"
          label-id="EU010300_LBL00001"
          label-for="EU010300_CMB00001"
          horizontal
        >
          <FormSelect
            id="EU010300_CMB00001"
            v-model="Logistic"
            :options="
              LogisticList.map((item) => ({
                name: decrypt(item.COURIER_FNAME),
                value: decrypt(item.COURIER_SID),
              }))"
          />
        </FormGroup>
      </div>
    </template>    
  </AppContent>
</template>

<style scoped>

</style>
