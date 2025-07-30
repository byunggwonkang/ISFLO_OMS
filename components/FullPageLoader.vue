<template>
  <div v-if="loading.isLoading" class="loader-overlay">
    <img src="@/assets/img/logo/loading_logo.png" alt="로딩 중" class="logo-spinner" />
  </div>
</template>
  
  <script setup>
  import { useLoadingStore } from '@/stores/common/loading'
  const loading = useLoadingStore()
  </script>
  
  <style scoped>
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .logo-spinner {
    width: 80px;
    height: 80px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>