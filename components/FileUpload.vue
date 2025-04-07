<template>
  <div>
    <div v-if="!isDragging" 
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-500 transition-colors"
      @dragover.prevent="isDragging = true"
      @click="triggerFileInput"
    >
      <div class="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          <span v-if="file">Replace {{ file.name }}</span>
          <span v-else>Drop file or click to upload</span>
        </h3>
        <p class="mt-1 text-xs text-gray-500">
          {{ acceptDescription }}
        </p>
        <div class="mt-3" v-if="file">
          <span class="font-medium text-sm text-gray-900">{{ file.name }}</span>
          <span class="ml-2 text-sm text-gray-500">({{ formatFileSize(file.size) }})</span>
        </div>
      </div>
    </div>
    <div v-else
      class="border-2 border-dashed border-primary-500 rounded-lg p-6 bg-primary-50 cursor-pointer"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="onDropFile"
    >
      <div class="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-primary-700">
          Drop file here to upload
        </h3>
      </div>
    </div>
    
    <input 
      ref="fileInput"
      type="file" 
      :accept="accept"
      class="hidden" 
      @change="onFileSelected" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  accept: {
    type: String,
    default: '*/*'
  },
  acceptDescription: {
    type: String,
    default: 'WASM (.wasm) files only'
  }
});

const emit = defineEmits(['file-selected']);

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    file.value = input.files[0];
    emit('file-selected', file.value);
  }
}

function onDropFile(event: DragEvent) {
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    file.value = event.dataTransfer.files[0];
    emit('file-selected', file.value);
  }
}

function formatFileSize(size: number): string {
  if (size < 1024) {
    return size + ' bytes';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB';
  } else {
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
</script> 