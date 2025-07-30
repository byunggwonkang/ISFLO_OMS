<script setup>
const pageLoader = usePageLoaderStore()
const { currentWorkingSpace } = useGetCurrentWorkingSpaceFromUrl()
const workingSpaceData = useTabsStore();
const router = useRouter()

const { loading, toggleLoading } = useLoading()

onBeforeMount(async () => {
  toggleLoading()
  await pageLoader.fetchPageLoadData(currentWorkingSpace.value?.component)
  toggleLoading()
})

onMounted(() => {
  workingSpaceData.addTab(currentWorkingSpace.value)
})

const { currentTab } = storeToRefs(workingSpaceData)

useHead({
  title: computed(() => {
    return `${decrypt(currentTab.value?.name) ?? 'Page Empty'} | ISAC`
  })
})

watch(currentTab, (newValue) => {
  if (!newValue && router.currentRoute.value.path !== '/app') {
    navigateTo('/app/')
  }

  if (newValue) {
    navigateTo(`/app/${newValue?.key ?? '' }`)
  }
})
</script>

<template>
  <div>
    <div
      v-if="loading"
      class="h-screen p-3 space-y-3"
    >
      <SkeletonLoader class="w-full h-14 rounded" />
      <SkeletonLoader class="w-full h-96 rounded" />
    </div>
    <component
      :is="`${workingSpaceData.getCurrentTab?.component ?? 'Empty'}`"
      v-else
    />
  </div>
</template>

<style scoped>

</style>
