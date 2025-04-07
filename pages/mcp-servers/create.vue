<template>
  <div>
    <div class="flex items-center mb-6">
      <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <PageHeader 
        title="Create MCP Server" 
        description="Define a new MCP server configuration"
      />
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <AppCard title="Basic Information">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                v-model="serverData.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter server name"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="serverData.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter server description"
              ></textarea>
            </div>
          </div>
        </AppCard>
        
        <!-- HTTP Interfaces -->
        <AppCard title="HTTP Interfaces">
          <div class="mb-4">
            <p class="text-sm text-gray-500">Select HTTP interfaces to include in this MCP server:</p>
          </div>
          
          <div v-if="loading" class="flex justify-center py-4">
            <div class="animate-spin h-6 w-6 rounded-full border-t-2 border-b-2 border-primary-500"></div>
          </div>
          
          <div v-else-if="httpInterfaces.length === 0" class="text-center py-6">
            <p class="text-sm text-gray-500">No HTTP interfaces available</p>
            <div class="mt-4">
              <NuxtLink to="/http-interfaces/create" class="text-sm text-primary-500 hover:text-primary-600">
                Create a new HTTP interface
              </NuxtLink>
            </div>
          </div>
          
          <div v-else>
            <div class="space-y-2 max-h-96 overflow-y-auto">
              <div 
                v-for="item in httpInterfaces" 
                :key="item.id" 
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <input 
                  :id="`http-${item.id}`" 
                  v-model="selectedHttpIds"
                  :value="item.id"
                  type="checkbox" 
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label :for="`http-${item.id}`" class="flex-1 cursor-pointer">
                  <div class="flex items-center">
                    <span :class="methodClass(item.method)" class="text-xs font-medium px-2 py-0.5 rounded mr-2">
                      {{ item.method }}
                    </span>
                    <span class="font-medium text-gray-800">{{ item.name }}</span>
                  </div>
                  <div class="text-sm text-gray-500 mt-0.5">{{ item.path }}</div>
                </label>
              </div>
            </div>
            
            <div v-if="selectedHttpIds.length === 0" class="mt-4 text-sm text-yellow-600">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Please select at least one HTTP interface</span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <AppCard title="Actions">
          <div class="space-y-4">
            <AppButton 
              full-width
              @click="createServer"
              :loading="creating"
              :disabled="selectedHttpIds.length === 0"
            >
              Create MCP Server
            </AppButton>
            
            <AppButton 
              variant="secondary" 
              full-width
              @click="router.push('/mcp-servers')"
            >
              Cancel
            </AppButton>
          </div>
        </AppCard>
        
        <AppCard title="Preview">
          <div v-if="selectedHttpIds.length === 0" class="text-center py-4">
            <p class="text-sm text-gray-500">Select HTTP interfaces to preview tools</p>
          </div>
          
          <div v-else>
            <h3 class="text-sm font-medium text-gray-700 mb-2">Selected Interfaces ({{ selectedHttpIds.length }})</h3>
            <div class="space-y-2">
              <div 
                v-for="id in selectedHttpIds" 
                :key="id" 
                class="text-sm bg-gray-50 p-2 rounded flex items-center justify-between"
              >
                <span>{{ getHttpInterfaceName(id) }}</span>
                <button 
                  @click="removeHttpInterface(id)"
                  class="text-gray-400 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { $api } = useNuxtApp();

// Server data
const serverData = reactive({
  name: '',
  description: '',
  httpIds: [] as string[]
});

// UI state
const loading = ref(true);
const creating = ref(false);
const httpInterfaces = ref<any[]>([]);
const selectedHttpIds = ref<string[]>([]);

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

// Get HTTP interface name by ID
function getHttpInterfaceName(id: string): string {
  const httpInterface = httpInterfaces.value.find(item => item.id === id);
  return httpInterface ? httpInterface.name : 'Unknown';
}

// Remove HTTP interface from selection
function removeHttpInterface(id: string) {
  selectedHttpIds.value = selectedHttpIds.value.filter(item => item !== id);
}

// Watch selectedHttpIds for changes
watch(selectedHttpIds, (newValue) => {
  serverData.httpIds = [...newValue];
});

// Create server
async function createServer() {
  // Validate
  if (!serverData.name) {
    alert('Please enter a name for the server');
    return;
  }
  
  if (serverData.httpIds.length === 0) {
    alert('Please select at least one HTTP interface');
    return;
  }
  
  try {
    creating.value = true;
    const response = await $api.mcpServers.create(serverData);
    
    // Navigate to the new server
    router.push(`/mcp-servers/${response.data.id}`);
  } catch (error: any) {
    console.error('Failed to create MCP server:', error);
    alert(`Failed to create MCP server: ${error.response?.data?.error || error.message || 'Unknown error'}`);
  } finally {
    creating.value = false;
  }
}

// Fetch HTTP interfaces
onMounted(async () => {
  try {
    const response = await $api.httpInterfaces.getAll();
    httpInterfaces.value = response.data;
  } catch (error) {
    console.error('Failed to fetch HTTP interfaces:', error);
  } finally {
    loading.value = false;
  }
});
</script> 