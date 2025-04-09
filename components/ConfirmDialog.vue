<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
          <div class="p-4 sm:p-6">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <component 
                  :is="iconComponent" 
                  class="h-6 w-6" 
                  :class="iconClass"
                  aria-hidden="true" 
                />
              </div>
              <div class="ml-3 w-0 flex-1">
                <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">{{ message }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button 
              type="button" 
              :class="[
                'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
                type === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' :
                'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
              ]"
              @click="confirm"
            >
              {{ confirmText }}
            </button>
            <button 
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="cancel"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, h } from 'vue';
import { ExclamationTriangleIcon, ExclamationCircleIcon, InformationCircleIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '您确定要执行此操作吗？'
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value: string) => {
      return ['primary', 'danger', 'warning', 'info'].includes(value);
    }
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const iconComponent = computed(() => {
  switch (props.type) {
    case 'danger':
      return ExclamationCircleIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    case 'info':
      return InformationCircleIcon;
    default:
      return QuestionMarkCircleIcon;
  }
});

const iconClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'text-red-600';
    case 'warning':
      return 'text-yellow-600';
    case 'info':
      return 'text-blue-600';
    default:
      return 'text-primary-600';
  }
});

const confirm = () => {
  emit('confirm');
  emit('update:modelValue', false);
};

const cancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 