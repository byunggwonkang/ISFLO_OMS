<script setup>
definePageMeta({
  layout: 'guest'
})

onMounted(() => {
  setTimeout(() => {
    navigateTo('/auth/login')
  }, 4000)
})
</script>

<template>
  <div class="flex flex-col justify-center items-center w-full min-h-full mx-auto space-y-3 h-screen">
    <div class="pb-2 pl-2 -mt-10">
      <div class="flex items-center space-x-12">
        <div>
          <img
            alt="Logo"
            src="~/assets/img/logo/callaway-company-logo.svg"
            class="h-8 lg:h-12"
          >
        </div>
        <div>
          <img
            alt="Logo"
            class="h-12"
            src="~/assets/img/logo/travismathew-logo.svg"
          >
        </div>
      </div>
    </div>
    <div>
      <span class="loader" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: block;
  margin:15px auto;
  position: relative;
  background: #FFF;
  box-shadow: -24px 0 #FFF, 24px 0 #FFF;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  33% {
    background: #FFF;
    box-shadow: -24px 0 #000, 24px 0 #FFF;
  }
  66% {
    background: #000;
    box-shadow: -24px 0 #FFF, 24px 0 #FFF;
  }
  100% {
    background: #FFF;
    box-shadow: -24px 0 #FFF, 24px 0 #000;
  }
}
</style>
