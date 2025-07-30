<script setup>
import { breakpointsTailwind, useBreakpoints, useWindowSize, useFullscreen } from '@vueuse/core'
import { onMounted, watch } from 'vue'
import { useIdle } from '@vueuse/core'

const { width } = useWindowSize()
const workingSpaceData = useTabsStore();
const breakpoints = useBreakpoints(breakpointsTailwind)

const { toggle } = useFullscreen()

const setMaxTabsBasedOnWidth = () => {
  if (width.value < 420) {
    workingSpaceData.setMaxTabs(2)
  } else if (width.value < 768) {
    workingSpaceData.setMaxTabs(3)
  } else if (breakpoints.between('sm', 'md').value) {
    workingSpaceData.setMaxTabs(3)
  } else if (breakpoints.between('md', 'lg').value) {
    workingSpaceData.setMaxTabs(4)
  } else if (breakpoints.between('lg', 'xl').value) {
    workingSpaceData.setMaxTabs(4)
  } else if (breakpoints.between('xl', '2xl').value) {
    workingSpaceData.setMaxTabs(6)
  } else if (breakpoints.isGreater('2xl')) {
    workingSpaceData.setMaxTabs(8)
  }
}

watch(() => width.value, setMaxTabsBasedOnWidth)

onMounted(() => {
  setMaxTabsBasedOnWidth()
})

const sidebar = useSidebarStore();

const auth = useAuthStore();
const { idle, reset } = useIdle(1000 * 60 * 60)

watch(idle, (val) => {
  if (val) {
    if (auth.isAuthenticated) {
      const { success } =  auth.logout()
      if (success) useTabsStore().clearAllTabs();
    }
    reset()
  }
})
</script>


<template>
  <div>
    <!-- Sidebar -->
    <AppSidebar />

    <div
      class="transition-all duration-300 relative"
      :class="[
        sidebar.isDesktopSidebarOpen ? 'lg:pl-[7.5rem] 2xl:pl-[7.5rem]' : 'lg:pl-64 2xl:pl-[17rem]'
      ]"
    >
      <div
        class="w-full z-20 transition-all duration-300 sticky top-0"
      >
        <!-- Header -->
        <AppHeader
          @toggle="toggle"
        />

        <!-- Opened Working Menu -->
        <WorkingMenuBar />
      </div>

      <main class="relative">
        <!-- Working Space-->
        <slot />
      </main>

      <!-- Footer -->
      <AppFooter
        class="transition-all duration-300"
        :class="[
          sidebar.isDesktopSidebarOpen ? 'lg:pl-[7.5rem] 2xl:pl-[7.5rem]' : 'lg:pl-64 2xl:pl-[17rem]'
        ]"
      >
        <img
          alt="Logo"
          src="../assets/img/logo/isac-with-power-by.svg"
        >
      </AppFooter>

      <!-- Back to top -->
      <AppBackToTop />
    </div>
  </div>
</template>

<style scoped>

</style>
