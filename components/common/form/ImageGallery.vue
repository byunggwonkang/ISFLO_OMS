<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const lightboxImage = ref(null)

const openLightbox = (img) => {
  lightboxImage.value = img
}

const closeLightbox = () => {
  lightboxImage.value = null
}
</script>

<template>
  <div class="image-gallery">
    <!-- Swiper (2개 이상일 때만) -->
    <div v-if="images.length >= 2" class="image-list swiper-wrapper-container">
      <Swiper
        :slides-per-view="2"
        :space-between="8"
        :modules="[Navigation]"
        navigation
        :watch-overflow="false"
      >
        <SwiperSlide
          v-for="(img, index) in images"
          :key="index"
          class="cursor-pointer slide-item"
        >
          <img
            :src="img"
            alt="Gallery Image"
            class="gallery-thumb"
            @click="openLightbox(img)"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- 이미지 1개일 경우 -->
    <div v-else-if="images.length === 1" class="image-list single-image">
      <img
        :src="images[0]"
        alt="Gallery Image"
        class="gallery-thumb"
        @click="openLightbox(images[0])"
      />
    </div>

    <!-- 이미지 없음 -->
    <div v-else class="no-image">
      <img src="/images/no-image.jpg" alt="No Image" class="no-image-placeholder" />
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxImage" class="lightbox" @click="closeLightbox">
      <img :src="lightboxImage" class="lightbox-img" />
    </div>
  </div>
</template>

<style scoped>
.image-gallery {
  padding: 0px;
}

.image-list {
  width: 100%;
}

.single-image {
  display: flex;
  justify-content: center;
}

/* 썸네일: 정사각형 */
.gallery-thumb {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  z-index: 1;
}
.gallery-thumb:hover {
  transform: scale(1.05);
}

/* 슬라이드 항목 여백 최소화 */
.slide-item {
  width: 110px !important;
  overflow: visible !important;
  position: relative;
  z-index: 0;
}

/* Swiper 기본 위치 지정 */
:deep(.swiper) {
  position: relative;
  z-index: 2;
}

/* Swiper 화살표 스타일 */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  z-index: 1000;
  pointer-events: auto;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

/* 화살표 아이콘 사이즈 줄이기 */
:deep(.swiper-button-next::after),
:deep(.swiper-button-prev::after) {
  font-size: 18px !important;
  color: white !important;
}

/* 이미지 없음 대체 이미지 */
.no-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
}
.no-image-placeholder {
  width: 120px;
  height: 120px;
  object-fit: contain;
  opacity: 0.5;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.lightbox-img {
  max-width: 600px;
  max-height: 600px;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 0 10px #000;
}
</style>
