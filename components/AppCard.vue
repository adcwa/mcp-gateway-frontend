<template>
  <div class="apple-card" :class="{ 'hover:-translate-y-1': hover }">
    <div v-if="title || $slots.header" class="flex items-center justify-between mb-4">
      <div v-if="title" class="text-lg font-semibold text-gray-800">{{ title }}</div>
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.default">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-100">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  },
  hover: {
    type: Boolean,
    default: true
  }
});
</script> 