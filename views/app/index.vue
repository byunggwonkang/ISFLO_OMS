<script setup>
const pageLoader = usePageLoaderStore()
const workingSpaceData = useTabsStore();
const { toggleLoading } = useLoading()

const { currentTab } = storeToRefs(workingSpaceData)

watch(currentTab, async (newValue) => {
  if (newValue && newValue.component !== 'Dashboard' && newValue.component !== 'Empty') {
    toggleLoading()
    await pageLoader.fetchPageLoadData(newValue.component)
    toggleLoading()
  }
});

useHead({
  title: computed(() => {
    return `${currentTab.value?.name ?? 'Page Empty'} | ISAC`
  })
})

onMounted(
  workingSpaceData.getOpenTabs.length === 0
    ? () => {
        workingSpaceData.setCurrentTab({
          name: 'Home',
          href: '/app/',
          key: 'home',
          component: 'Dashboard',
          group: 'home'
        })
      }
    : () => {}
)
</script>

<template>
  <div>
    <KeepAlive>
      <component :is="`${currentTab.component ?? 'Dashboard'}`" />
    </KeepAlive>
  </div>
</template>

<style scoped>

</style>
