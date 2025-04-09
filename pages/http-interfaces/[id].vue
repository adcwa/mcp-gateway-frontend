<template>
  <div>
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else-if="!httpInterface" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-800">HTTP interface not found</h3>
      <div class="mt-6">
        <AppButton @click="router.push('/http-interfaces')">Back to HTTP Interfaces</AppButton>
      </div>
    </div>
    
    <div v-else>
      <div class="flex items-center mb-6">
        <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <PageHeader :title="httpInterface.name" :description="httpInterface.description || 'No description provided'">
          <template #actions>
            <div class="flex space-x-3">
              <AppButton variant="secondary" @click="openExportOpenAPI">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export OpenAPI
              </AppButton>
              <AppButton @click="editInterface">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </AppButton>
            </div>
          </template>
        </PageHeader>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Information -->
        <div class="lg:col-span-2 space-y-6">
          <AppCard title="Endpoint Information">
            <div class="flex items-center mb-4">
              <span :class="methodClass(httpInterface.method)" class="text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                {{ httpInterface.method }}
              </span>
              <span class="font-mono text-sm break-all">{{ httpInterface.path }}</span>
            </div>
            
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">Version</div>
                <div class="font-medium">{{ httpInterface.version }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Created</div>
                <div class="font-medium">{{ formatDate(httpInterface.createdAt) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Last Updated</div>
                <div class="font-medium">{{ formatDate(httpInterface.updatedAt) }}</div>
              </div>
            </div>
          </AppCard>
          
          <!-- Parameters -->
          <AppCard title="Parameters" v-if="httpInterface.parameters && httpInterface.parameters.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="param in httpInterface.parameters" :key="param.name">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ param.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ param.in }}</td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ param.type }}</td>
                    <td class="px-4 py-3 text-sm text-gray-500">
                      <span v-if="param.required" class="text-green-500">Yes</span>
                      <span v-else class="text-gray-500">No</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ param.description || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppCard>
          
          <!-- Headers -->
          <AppCard title="Headers" v-if="httpInterface.headers && httpInterface.headers.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr v-for="header in httpInterface.headers" :key="header.name">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ header.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ header.type }}</td>
                    <td class="px-4 py-3 text-sm text-gray-500">
                      <span v-if="header.required" class="text-green-500">Yes</span>
                      <span v-else class="text-gray-500">No</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-500">{{ header.description || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AppCard>
          
          <!-- Request Body -->
          <AppCard title="Request Body" v-if="httpInterface.requestBody">
            <div class="mb-3">
              <div class="text-sm text-gray-500">Content Type</div>
              <div class="font-medium">{{ httpInterface.requestBody.contentType }}</div>
            </div>
            
            <div>
              <div class="text-sm text-gray-500 mb-1">Schema</div>
              <pre class="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">{{ formatJSON(httpInterface.requestBody.schema) }}</pre>
            </div>
            
            <div v-if="httpInterface.requestBody.example" class="mt-3">
              <div class="text-sm text-gray-500 mb-1">Example</div>
              <pre class="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">{{ formatJSON(httpInterface.requestBody.example) }}</pre>
            </div>
          </AppCard>
          
          <!-- Responses -->
          <AppCard title="Responses" v-if="httpInterface.responses && httpInterface.responses.length > 0">
            <div v-for="(response, index) in httpInterface.responses" :key="index" :class="{ 'mt-6': index > 0 }">
              <div class="flex items-center">
                <span class="text-xs font-medium px-2.5 py-0.5 rounded-full mr-2" :class="statusClass(response.statusCode)">
                  {{ response.statusCode }}
                </span>
                <span class="font-medium">{{ response.description }}</span>
              </div>
              
              <div v-if="response.body" class="mt-3">
                <div class="text-sm text-gray-500 mb-1">Content Type</div>
                <div class="font-medium">{{ response.body.contentType }}</div>
                
                <div class="mt-2">
                  <div class="text-sm text-gray-500 mb-1">Schema</div>
                  <pre class="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">{{ formatJSON(response.body.schema) }}</pre>
                </div>
                
                <div v-if="response.body.example" class="mt-3">
                  <div class="text-sm text-gray-500 mb-1">Example</div>
                  <pre class="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">{{ formatJSON(response.body.example) }}</pre>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
          <AppCard title="Versions">
            <div v-if="versions.length" class="divide-y divide-gray-100">
              <div v-for="version in versions" :key="version.version" class="py-2 first:pt-0 last:pb-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <span class="font-medium" :class="{ 'text-primary-500': version.version === httpInterface.version }">
                      Version {{ version.version }}
                    </span>
                    <span v-if="version.version === httpInterface.version" class="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  </div>
                  <button 
                    v-if="version.version !== httpInterface.version"
                    @click="loadVersion(version.version)" 
                    class="text-primary-500 hover:text-primary-600 text-sm"
                  >
                    View
                  </button>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ formatDate(version.updatedAt) }}
                </div>
              </div>
            </div>
            <div v-else class="text-center py-3 text-gray-500">
              No versions available
            </div>
          </AppCard>
          
          <AppCard title="MCP Servers">
            <div class="text-sm text-gray-500 mb-3">
              This HTTP interface is used in the following MCP servers:
            </div>
            
            <div v-if="mcpServers.length" class="space-y-2">
              <NuxtLink 
                v-for="server in mcpServers" 
                :key="server.id" 
                :to="`/mcp-servers/${server.id}`"
                class="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div class="font-medium text-primary-500">{{ server.name }}</div>
                <div class="text-xs text-gray-500 mt-0.5">{{ server.description || 'No description' }}</div>
              </NuxtLink>
            </div>
            <div v-else class="text-center py-3 text-gray-500">
              Not used in any MCP servers
            </div>
            
            <div class="mt-4">
              <AppButton variant="secondary" size="sm" full-width @click="createMCPServer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create MCP Server
              </AppButton>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { $api } = useNuxtApp();

const loading = ref(true);
const httpInterface = ref<any>(null);
const versions = ref<any[]>([]);
const mcpServers = ref<any[]>([]); // Mock data for now, should be fetched

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

// Status code color mapping
const statusClass = (status: number) => {
  if (status >= 200 && status < 300) {
    return 'bg-green-100 text-green-800';
  } else if (status >= 300 && status < 400) {
    return 'bg-blue-100 text-blue-800';
  } else if (status >= 400 && status < 500) {
    return 'bg-yellow-100 text-yellow-800';
  } else if (status >= 500) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
};

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

// Format JSON for display
const formatJSON = (json: string) => {
  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch (e) {
    return json;
  }
};

// Load a specific version
const loadVersion = async (version: number) => {
  try {
    loading.value = true;
    const response = await $api.httpInterfaces.getVersion(route.params.id as string, version);
    httpInterface.value = response.data;
  } catch (error) {
    console.error('Failed to load version:', error);
  } finally {
    loading.value = false;
  }
};

// Export OpenAPI
const openExportOpenAPI = async () => {
  try {
    const response = await $api.httpInterfaces.exportOpenAPI(route.params.id as string);
    const openAPIData = response.data;
    
    // Create a downloadable JSON file
    const blob = new Blob([JSON.stringify(openAPIData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${httpInterface.value.name.toLowerCase().replace(/\s+/g, '-')}-openapi.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export OpenAPI:', error);
    alert('Failed to export OpenAPI');
  }
};

// Navigate to edit page
const editInterface = () => {
  router.push(`/http-interfaces/${route.params.id}-edit`);
};

// Create MCP Server
const createMCPServer = () => {
  router.push({
    path: '/mcp-servers/create',
    query: { 
      httpIds: route.params.id as string
    }
  });
};

// Fetch HTTP interface data and versions
onMounted(async () => {
  try {
    const id = route.params.id as string;
    const [interfaceResponse, versionsResponse] = await Promise.all([
      $api.httpInterfaces.getById(id),
      $api.httpInterfaces.getVersions(id)
    ]);
    
    httpInterface.value = interfaceResponse.data;
    versions.value = versionsResponse.data;
    
    // Mock MCP servers data
    mcpServers.value = [
      {
        id: 'mock-1',
        name: 'User API Server',
        description: 'Handles user authentication and profile management'
      },
      {
        id: 'mock-2',
        name: 'Product Catalog',
        description: 'Catalog of products and services'
      }
    ];
  } catch (error) {
    console.error('Failed to fetch HTTP interface:', error);
  } finally {
    loading.value = false;
  }
});
</script> 