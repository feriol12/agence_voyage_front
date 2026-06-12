<script setup>
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import AppToastModal from '@/components/common/AppToastModal.vue'
import AppConfirmModal from '@/components/common/AppConfirmModal.vue'



const route = useRoute()

// Pages qui n'utilisent PAS le layout principal
const noLayoutRoutes = ['/login', '/register','/forgot-password','/reset-password']

const useLayout = computed(() => {
  return !noLayoutRoutes.includes(route.path)
})
</script>

<template>
  <MainLayout v-if="useLayout">
    <RouterView />
    <AppToastModal />
    <AppConfirmModal />
  </MainLayout>
  <RouterView v-else />
</template>
