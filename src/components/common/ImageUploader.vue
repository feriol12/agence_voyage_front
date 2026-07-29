<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-[#1E293B] mb-1">
      {{ label }}
      <span v-if="required" class="text-[#E74C3C] ml-0.5">*</span>
    </label>

    <!-- Zone de drop / upload (compacte) -->
    <div
      class="relative rounded-lg border-2 border-dashed transition-all duration-200"
      :class="[
        isDragging ? 'border-[#E67E22] bg-[#E67E22]/5' : 'border-[#CBD5E1] hover:border-[#E67E22]',
        error ? 'border-[#E74C3C] bg-red-50' : ''
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <!-- Input file caché -->
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        multiple
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        @change="handleFileSelect"
      />

      <!-- Contenu compact -->
      <div class="flex flex-col items-center justify-center p-3 text-center">
        <div class="text-2xl mb-1 text-[#94A3B8]">
          <slot name="icon">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </slot>
        </div>
        <p class="text-xs text-[#64748B]">
          <span class="font-medium text-[#0F3B5C]">Cliquez</span> ou glissez-déposez vos images
        </p>
        <p v-if="hint" class="text-xs text-[#94A3B8] mt-0.5">{{ hint }}</p>
        <p v-if="error" class="text-xs text-[#E74C3C] mt-1">{{ error }}</p>
      </div>
    </div>

    <!-- Aperçu des images -->
    <div v-if="previews.length > 0" class="mt-2 flex flex-wrap gap-2">
      <div
        v-for="(preview, index) in previews"
        :key="index"
        class="relative h-16 w-16 rounded-lg overflow-hidden border border-[#E2E8F0] group"
      >
        <img :src="preview" class="h-full w-full object-cover" />
        <button
          @click="removeImage(index)"
          class="absolute -top-1 -right-1 rounded-full bg-[#E74C3C] p-0.5 text-white hover:bg-[#C0392B] transition-colors opacity-0 group-hover:opacity-100"
        >
          <XMarkIcon class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <!-- Message d'erreur global -->
    <p v-if="error" class="mt-1 text-xs text-[#E74C3C]">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: 'Formats acceptés : JPG, PNG, GIF (max 2 Mo par image)'
  },
  error: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  maxSize: {
    type: Number,
    default: 2 // Mo
  },
  maxFiles: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:modelValue', 'remove'])

const fileInput = ref(null)
const isDragging = ref(false)
const files = ref([])
const previews = ref([])

// Synchronisation avec la prop modelValue
watch(() => props.modelValue, (newVal) => {
  if (newVal && Array.isArray(newVal)) {
    files.value = newVal
  }
}, { immediate: true })

const handleFileSelect = (event) => {
  const selectedFiles = Array.from(event.target.files)
  processFiles(selectedFiles)
  event.target.value = ''
}

const handleDrop = (event) => {
  isDragging.value = false
  const droppedFiles = Array.from(event.dataTransfer.files)
  processFiles(droppedFiles)
}

const processFiles = (newFiles) => {
  if (files.value.length + newFiles.length > props.maxFiles) {
    emit('update:modelValue', null)
    return
  }

  const validFiles = newFiles.filter(file => {
    if (file.size > props.maxSize * 1024 * 1024) return false
    if (props.accept && props.accept !== '*/*') {
      const acceptedTypes = props.accept.split(',').map(t => t.trim())
      const fileType = file.type
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const baseType = type.replace('/*', '')
          return fileType.startsWith(baseType)
        }
        return fileType === type
      })
      if (!isAccepted) return false
    }
    return true
  })

  files.value = [...files.value, ...validFiles]
  const newPreviews = validFiles.map(file => URL.createObjectURL(file))
  previews.value = [...previews.value, ...newPreviews]
  emit('update:modelValue', files.value)
}

const removeImage = (index) => {
  URL.revokeObjectURL(previews.value[index])
  previews.value.splice(index, 1)
  files.value.splice(index, 1)
  emit('update:modelValue', files.value)
}

onUnmounted(() => {
  previews.value.forEach(url => URL.revokeObjectURL(url))
})
</script>