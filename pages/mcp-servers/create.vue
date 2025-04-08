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
        description="Define a new MCP server configuration by selecting HTTP interfaces"
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
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">Select HTTP interfaces to include in this MCP server:</p>
            </div>
            <div class="flex items-center">
              <input 
                v-model="searchTerm" 
                type="text" 
                placeholder="Search interfaces..."
                class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              />
              <div class="ml-2">
                <select 
                  v-model="methodFilter" 
                  class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                >
                  <option value="">All Methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
            </div>
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
                v-for="item in filteredInterfaces" 
                :key="item.id" 
                class="flex p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                :class="{ 'bg-gray-50': selectedHttpIds.includes(item.id) }"
              >
                <div class="flex-shrink-0 mr-3">
                  <input 
                    :id="`http-${item.id}`" 
                    v-model="selectedHttpIds"
                    :value="item.id"
                    type="checkbox" 
                    class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <label :for="`http-${item.id}`" class="flex-1 cursor-pointer">
                  <div class="flex items-center">
                    <span :class="methodClass(item.method)" class="text-xs font-medium px-2 py-0.5 rounded mr-2">
                      {{ item.method }}
                    </span>
                    <span class="font-medium text-gray-800">{{ item.name }}</span>
                  </div>
                  <div class="text-sm text-gray-500 mt-0.5 flex items-center">
                    <span class="font-mono">{{ item.path }}</span>
                  </div>
                  <div v-if="item.description" class="text-sm text-gray-500 mt-1">
                    {{ item.description }}
                  </div>
                  <div class="mt-2 flex flex-wrap gap-1" v-if="item.parameters && item.parameters.length > 0">
                    <span 
                      v-for="param in item.parameters"
                      :key="param.name"
                      class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                    >
                      {{ param.name }}{{ param.required ? '*' : '' }}
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            <div v-if="filteredInterfaces.length === 0" class="text-center py-4">
              <p class="text-sm text-gray-500">No interfaces match your search criteria</p>
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <button
                v-if="filteredInterfaces.length > 0"
                @click="toggleSelectAll"
                class="text-sm text-primary-600 hover:text-primary-800"
              >
                {{ isAllSelected ? 'Deselect All' : 'Select All Filtered' }}
              </button>
              
              <div v-if="selectedHttpIds.length === 0" class="text-sm text-yellow-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Please select at least one HTTP interface</span>
              </div>
              <span v-else class="text-sm text-gray-500">
                {{ selectedHttpIds.length }} interface(s) selected
              </span>
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
              :disabled="selectedHttpIds.length === 0 || !serverData.name"
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
        
        <AppCard title="Selected Interfaces">
          <div v-if="selectedHttpIds.length === 0" class="text-center py-4">
            <p class="text-sm text-gray-500">Select HTTP interfaces to preview tools</p>
          </div>
          
          <div v-else>
            <h3 class="text-sm font-medium text-gray-700 mb-2">{{ selectedHttpIds.length }} interface(s) selected</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div 
                v-for="id in selectedHttpIds" 
                :key="id" 
                class="text-sm bg-gray-50 p-2 rounded flex items-center justify-between"
              >
                <div class="flex items-center">
                  <span :class="getMethodClass(id)" class="inline-block w-14 text-center text-xs font-medium px-1 py-0.5 rounded mr-2">
                    {{ getHttpInterfaceMethod(id) }}
                  </span>
                  <span class="truncate max-w-[150px]">{{ getHttpInterfaceName(id) }}</span>
                </div>
                <button 
                  @click="removeHttpInterface(id)"
                  class="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100">
              <h4 class="text-sm font-medium text-gray-700 mb-2">MCP Server Preview</h4>
              <div class="text-xs text-gray-600">
                <p>Your MCP Server will contain {{ selectedHttpIds.length }} tool(s):</p>
                <ul class="list-disc pl-5 mt-2">
                  <li v-for="id in selectedHttpIds.slice(0, 5)" :key="id">
                    {{ getHttpInterfaceName(id) }}
                  </li>
                  <li v-if="selectedHttpIds.length > 5" class="italic">
                    and {{ selectedHttpIds.length - 5 }} more...
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

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
const searchTerm = ref('');
const methodFilter = ref('');

// Computed properties
const filteredInterfaces = computed(() => {
  return httpInterfaces.value.filter(item => {
    const matchesSearch = searchTerm.value === '' || 
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.value.toLowerCase()));
    
    const matchesMethod = methodFilter.value === '' || item.method === methodFilter.value;
    
    return matchesSearch && matchesMethod;
  });
});

const isAllSelected = computed(() => {
  return filteredInterfaces.value.length > 0 && 
    filteredInterfaces.value.every(item => selectedHttpIds.value.includes(item.id));
});

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

// Toggle select all filtered interfaces
function toggleSelectAll() {
  if (isAllSelected.value) {
    // Deselect all filtered interfaces
    selectedHttpIds.value = selectedHttpIds.value.filter(id => 
      !filteredInterfaces.value.some(item => item.id === id)
    );
  } else {
    // Select all filtered interfaces
    const filteredIds = filteredInterfaces.value.map(item => item.id);
    selectedHttpIds.value = [...new Set([...selectedHttpIds.value, ...filteredIds])];
  }
}

// Get HTTP interface method by ID
function getHttpInterfaceMethod(id: string): string {
  const httpInterface = httpInterfaces.value.find(item => item.id === id);
  return httpInterface ? httpInterface.method : '';
}

// Get HTTP interface method class by ID
function getMethodClass(id: string): string {
  const method = getHttpInterfaceMethod(id);
  return methodClass(method);
}

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
    
    // Check if there are pre-selected interfaces from the query params
    const route = useRoute();
    if (route.query.selected) {
      const selectedIds = (route.query.selected as string).split(',');
      selectedHttpIds.value = selectedIds.filter(id => 
        httpInterfaces.value.some(iface => iface.id === id)
      );
    }
  } catch (error) {
    console.error('Failed to fetch HTTP interfaces:', error);
  } finally {
    loading.value = false;
  }
});
</script> 