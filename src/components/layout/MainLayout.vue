<!-- src/components/layout/MainLayout.vue -->
<template>
  <div>
    <AppNavbar />
    <main class="bg-gray-100 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/common/AppNavbar.vue'
</script>