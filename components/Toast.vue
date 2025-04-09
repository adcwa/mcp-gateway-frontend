<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-3">
      <transition-group name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          :class="[
            'max-w-md w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 flex',
            toast.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 
            toast.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' : 
            toast.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' : 
            'bg-blue-50 border-l-4 border-blue-500'
          ]"
        >
          <div class="flex-shrink-0 mr-3">
            <svg 
              v-if="toast.type === 'success'"
              class="h-5 w-5 text-green-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg 
              v-else-if="toast.type === 'error'"
              class="h-5 w-5 text-red-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <svg 
              v-else-if="toast.type === 'warning'"
              class="h-5 w-5 text-yellow-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <svg 
              v-else
              class="h-5 w-5 text-blue-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <div class="flex-1 min-w-0">
            <div 
              :class="[
                'text-sm font-medium',
                toast.type === 'success' ? 'text-green-800' : 
                toast.type === 'error' ? 'text-red-800' : 
                toast.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
              ]"
            >
              {{ toast.title }}
            </div>
            <div 
              v-if="toast.message" 
              :class="[
                'mt-1 text-sm break-words',
                toast.type === 'success' ? 'text-green-700' : 
                toast.type === 'error' ? 'text-red-700' : 
                toast.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
              ]"
            >
              {{ toast.message }}
            </div>
          </div>
          
          <div class="ml-3 flex-shrink-0 self-start">
            <button 
              @click="removeToast(toast.id)" 
              :class="[
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                toast.type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-400' : 
                toast.type === 'error' ? 'text-red-500 hover:bg-red-100 focus:ring-red-400' : 
                toast.type === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-400' : 
                'text-blue-500 hover:bg-blue-100 focus:ring-blue-400'
              ]"
            >
              <span class="sr-only">关闭</span>
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

// Add a new toast notification
const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = nextId++;
  const newToast = { ...toast, id };
  toasts.value.push(newToast);
  
  // Auto remove the toast after the duration
  if (toast.duration !== 0) {
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000); // Default duration is 5 seconds
  }
  
  return id;
};

// Remove a toast by ID
const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

// Clear all toasts
const clearToasts = () => {
  toasts.value = [];
};

// Convenience methods for different toast types
const success = (title: string, message?: string, duration = 5000) => {
  return addToast({ type: 'success', title, message, duration });
};

const error = (title: string, message?: string, duration = 8000) => {
  return addToast({ type: 'error', title, message, duration });
};

const warning = (title: string, message?: string, duration = 6000) => {
  return addToast({ type: 'warning', title, message, duration });
};

const info = (title: string, message?: string, duration = 5000) => {
  return addToast({ type: 'info', title, message, duration });
};

defineExpose({
  addToast,
  removeToast,
  clearToasts,
  success,
  error,
  warning,
  info
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style> 