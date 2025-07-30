<script setup>
defineProps({
  logoUrl: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<template>
  <footer class="bg-white fixed bottom-0 right-0 w-full flex flex-col">
    <div class="flex items-center justify-center sm:justify-end border-t border-gray-500 h-10 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <slot>
        <img
          alt="Logo"
          :src="logoUrl"
        >
      </slot>
    </div>
  </footer>
</template>

<style scoped>

</style>
