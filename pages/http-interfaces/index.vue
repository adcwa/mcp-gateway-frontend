<template>
  <div>
    <PageHeader
      title="HTTP Interfaces"
      description="Manage your HTTP interfaces"
    >
      <template #actions>
        <AppButton @click="navigateToCreate">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Interface
        </AppButton>
      </template>
    </PageHeader>
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else-if="interfaces.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-800">No HTTP interfaces found</h3>
      <p class="mt-1 text-gray-500">Get started by creating your first HTTP interface</p>
      <div class="mt-6">
        <AppButton @click="navigateToCreate">Create Interface</AppButton>
      </div>
    </div>
    
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AppCard v-for="item in interfaces" :key="item.id" hover>
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ item.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ item.description || 'No description' }}</p>
          </div>
          <div class="flex items-center space-x-1">
            <span :class="methodClass(item.method)" class="text-xs font-medium px-2.5 py-0.5 rounded-full">
              {{ item.method }}
            </span>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="text-sm text-gray-700">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span class="truncate">{{ item.path }}</span>
            </div>
          </div>
          
          <div class="mt-2 text-xs text-gray-500">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Version: {{ item.version }}</span>
            </div>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-between">
            <NuxtLink :to="`/http-interfaces/${item.id}`" class="text-sm text-primary-500 hover:text-primary-600 flex items-center">
              View details
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            
            <div class="flex space-x-2">
              <button @click="openExportOpenAPI(item)" class="text-gray-500 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button @click="confirmDelete(item)" class="text-gray-500 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </template>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const { $api } = useNuxtApp();

const interfaces = ref<any[]>([]);
const loading = ref(true);

// Method color mapping
const methodClass = (method: string) => {
  const classes = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800',
    PATCH: 'bg-purple-100 text-purple-800'
  };
  
  return classes[method as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

// Navigation
const navigateToCreate = () => {
  router.push('/http-interfaces/create');
};

// Export OpenAPI
const openExportOpenAPI = async (item: any) => {
  try {
    const response = await $api.httpInterfaces.exportOpenAPI(item.id);
    const openAPIData = response.data;
    
    // Create a downloadable JSON file
    const blob = new Blob([JSON.stringify(openAPIData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.name.toLowerCase().replace(/\s+/g, '-')}-openapi.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export OpenAPI:', error);
    alert('Failed to export OpenAPI');
  }
};

// Delete interface
const confirmDelete = async (item: any) => {
  if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
    try {
      await $api.httpInterfaces.delete(item.id);
      interfaces.value = interfaces.value.filter(i => i.id !== item.id);
    } catch (error) {
      console.error('Failed to delete interface:', error);
      alert('Failed to delete interface');
    }
  }
};

// Fetch HTTP interfaces
onMounted(async () => {
  try {
    const response = await $api.httpInterfaces.getAll();
    interfaces.value = response.data;
  } catch (error) {
    console.error('Failed to fetch HTTP interfaces:', error);
  } finally {
    loading.value = false;
  }
});
</script> 