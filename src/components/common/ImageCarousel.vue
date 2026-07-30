<template>
  <div 
    class="relative w-full bg-gray-100 overflow-hidden group/carousel" 
    :style="{ aspectRatio: isMobile ? '1/1' : '16/9' }"
    @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Diaporama -->
    <div
      class="flex h-full transition-transform duration-500 ease-out will-change-transform"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(image, index) in images"
        :key="index"
        class="min-w-full h-full flex-shrink-0"
      >
        <img
          :src="image"
          :alt="`Image ${index + 1}`"
          class="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </div>

    <!-- Placeholder -->
    <div
      v-if="images.length === 0"
      class="absolute inset-0 flex flex-col items-center justify-center text-[#94A3B8]"
    >
      <PhotoIcon class="h-12 w-12 md:h-16 md:w-16 opacity-50" />
      <span class="mt-2 text-xs md:text-sm font-medium">Aucune image</span>
    </div>

    <!-- Dots -->
    <div
      v-if="images.length > 1"
      class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20"
    >
      <button
        v-for="(_, index) in images"
        :key="index"
        @click="goTo(index)"
        class="transition-all duration-300 cursor-pointer rounded-full"
        :class="[
          index === currentIndex 
            ? 'w-6 md:w-8 h-1.5 bg-white' 
            : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
        ]"
        :aria-label="`Aller à l'image ${index + 1}`"
      />
    </div>

    <!-- Flèche gauche (invisible sur mobile, sauf au survol) -->
    <button
      v-if="images.length > 1"
      @click="prev"
      class="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300"
      :class="isMobile ? 'opacity-0' : 'opacity-0 group-hover/carousel:opacity-100'"
      aria-label="Image précédente"
    >
      <div class="rounded-full bg-black/40 backdrop-blur-sm p-1.5 md:p-2.5 text-white hover:bg-black/60 transition-colors shadow-lg">
        <ChevronLeftIcon class="h-4 w-4 md:h-5 md:w-5" />
      </div>
    </button>

    <!-- Flèche droite (invisible sur mobile, sauf au survol) -->
    <button
      v-if="images.length > 1"
      @click="next"
      class="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-300"
      :class="isMobile ? 'opacity-0' : 'opacity-0 group-hover/carousel:opacity-100'"
      aria-label="Image suivante"
    >
      <div class="rounded-full bg-black/40 backdrop-blur-sm p-1.5 md:p-2.5 text-white hover:bg-black/60 transition-colors shadow-lg">
        <ChevronRightIcon class="h-4 w-4 md:h-5 md:w-5" />
      </div>
    </button>

    <!-- Compteur (mobile uniquement) -->
    <div 
      v-if="images.length > 1 && isMobile"
      class="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full"
    >
      {{ currentIndex + 1 }} / {{ images.length }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { PhotoIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  interval: {
    type: Number,
    default: 4000
  },
  autoplay: {
    type: Boolean,
    default: true
  }
})

const currentIndex = ref(0)
let intervalId = null
const isMobile = ref(window.innerWidth < 640)

let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchMove = (e) => {
  touchEndX = e.changedTouches[0].screenX
}

const handleTouchEnd = () => {
  const diff = touchStartX - touchEndX
  if (Math.abs(diff) > 50) {
    if (diff > 0) next()
    else prev()
  }
}

const next = () => {
  if (props.images.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prev = () => {
  if (props.images.length === 0) return
  currentIndex.value = currentIndex.value === 0
    ? props.images.length - 1
    : currentIndex.value - 1
}

const goTo = (index) => {
  currentIndex.value = index
  resetAutoplay()
}

const resetAutoplay = () => {
  stopAutoplay()
  startAutoplay()
}

const startAutoplay = () => {
  if (!props.autoplay || props.images.length <= 1) return
  intervalId = setInterval(next, props.interval)
}

const stopAutoplay = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 640
}

watch(() => props.images, () => {
  currentIndex.value = 0
  stopAutoplay()
  startAutoplay()
}, { immediate: true })

onMounted(() => {
  startAutoplay()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  stopAutoplay()
  window.removeEventListener('resize', handleResize)
})
</script>