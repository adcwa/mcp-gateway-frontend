<template>
  <div>
    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin h-6 w-6 rounded-full border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else-if="files.length === 0" class="text-center py-4">
      <p class="text-sm text-gray-500">No files uploaded yet</p>
    </div>
    
    <div v-else class="divide-y divide-gray-200">
      <div v-for="file in files" :key="file.id" class="py-3 flex items-center justify-between">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <div class="text-sm font-medium text-gray-900">{{ file.name }}</div>
            <div class="text-xs text-gray-500">
              {{ formatFileSize(file.size) }} • Uploaded {{ formatDate(file.uploadedAt) }}
            </div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button 
            @click="download(file)" 
            class="text-xs text-primary-600 hover:text-primary-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          
          <button 
            @click="deleteFile(file)" 
            class="text-xs text-red-600 hover:text-red-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface FileItem {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  path: string;
}

const props = defineProps<{
  files: FileItem[];
  loading: boolean;
}>();

const emit = defineEmits(['download', 'delete']);

function download(file: FileItem) {
  emit('download', file);
}

function deleteFile(file: FileItem) {
  emit('delete', file);
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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script> 