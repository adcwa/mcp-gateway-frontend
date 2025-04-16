<template>
  <div>
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else-if="!mcpServer" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-800">MCP server not found</h3>
      <div class="mt-6">
        <AppButton @click="router.push('/mcp-servers')">Back to MCP Servers</AppButton>
      </div>
    </div>
    
    <div v-else>
      <div class="flex items-center mb-6">
        <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <PageHeader :title="mcpServer.name" :description="mcpServer.description || 'No description provided'">
          <template #actions>
            <div class="flex space-x-3">
              <AppButton 
                v-if="mcpServer.status !== 'active'" 
                variant="secondary" 
                @click="activateServer"
                :loading="activating"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Activate
              </AppButton>
              <AppButton 
                v-if="mcpServer.status !== 'active'" 
                @click="registerServer"
                :loading="registering"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Register
              </AppButton>
              <AppButton 
                @click="editServer"
                variant="secondary"
              >
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
          <AppCard title="Server Information">
            <div class="flex items-center mb-4">
              <span :class="statusClass(mcpServer.status)" class="text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                {{ mcpServer.status }}
              </span>
            </div>
            
            <div class="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">Version</div>
                <div class="font-medium">{{ mcpServer.version }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Created</div>
                <div class="font-medium">{{ formatDate(mcpServer.createdAt) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Last Updated</div>
                <div class="font-medium">{{ formatDate(mcpServer.updatedAt) }}</div>
              </div>
            </div>
          </AppCard>
          
          <!-- HTTP Interfaces Card -->
          <AppCard title="HTTP Interfaces" v-if="mcpServer.tools && mcpServer.tools.length > 0">
            <div class="mb-4">
              <p class="text-sm text-gray-500">
                This MCP server was created from the following HTTP interfaces:
              </p>
            </div>
            
            <div v-if="loadingHttpInterfaces" class="flex justify-center py-4">
              <div class="animate-spin h-5 w-5 rounded-full border-t-2 border-b-2 border-primary-500"></div>
            </div>
            
            <div v-else-if="httpInterfaces.length === 0" class="text-center py-4">
              <p class="text-sm text-gray-500">No HTTP interfaces information available</p>
            </div>
            
            <div v-else class="divide-y divide-gray-100">
              <div 
                v-for="(item, index) in httpInterfaces" 
                :key="item.id" 
                class="py-3"
              >
                <div class="flex items-center">
                  <span :class="methodClass(item.method)" class="text-xs font-medium px-2 py-0.5 rounded mr-2">
                    {{ item.method }}
                  </span>
                  <span class="font-medium text-gray-800">{{ item.name }}</span>
                </div>
                <div class="flex justify-between items-center mt-1">
                  <div class="text-sm text-gray-500 font-mono">{{ item.path }}</div>
                  <div>
                    <NuxtLink 
                      :to="`/http-interfaces/${item.id}`" 
                      class="text-xs text-primary-600 hover:text-primary-800"
                    >
                      View Details
                    </NuxtLink>
                  </div>
                </div>
                <div v-if="item.description" class="text-sm text-gray-500 mt-1">
                  {{ item.description }}
                </div>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <NuxtLink 
                to="/http-interfaces" 
                class="text-sm text-primary-600 hover:text-primary-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Manage HTTP Interfaces
              </NuxtLink>
            </div>
          </AppCard>
          
          <AppCard title="Tools">
            <div v-if="mcpServer.tools && mcpServer.tools.length > 0">
              <div v-for="(tool, index) in mcpServer.tools" :key="tool.name" :class="{ 'mt-6 pt-6 border-t border-gray-100': index > 0 }">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-800">{{ tool.name }}</h3>
                  <button 
                    v-if="mcpServer.status === 'active'" 
                    @click="testTool(tool)"
                    class="text-primary-500 hover:text-primary-600 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Test
                  </button>
                </div>
                <p class="text-sm text-gray-500 mt-1">{{ tool.description || 'No description' }}</p>
                
                <div class="mt-4">
                  <div class="text-sm font-medium text-gray-700 mb-2">Request Template</div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <div class="flex items-center">
                      <span :class="methodClass(tool.requestTemplate.method)" class="text-xs font-medium px-2 py-0.5 rounded mr-2">
                        {{ tool.requestTemplate.method }}
                      </span>
                      <span class="font-mono text-sm">{{ tool.requestTemplate.url }}</span>
                    </div>
                    
                    <div v-if="tool.requestTemplate.headers && Object.keys(tool.requestTemplate.headers).length > 0" class="mt-3">
                      <div class="text-xs font-medium text-gray-600 mb-1">Headers</div>
                      <div class="text-xs font-mono text-gray-700 space-y-1">
                        <div v-for="(value, key) in tool.requestTemplate.headers" :key="key" class="flex">
                          <span class="text-gray-500 mr-2">{{ key }}:</span>
                          <span>{{ value }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="tool.requestTemplate.body" class="mt-3">
                      <div class="text-xs font-medium text-gray-600 mb-1">Body</div>
                      <pre class="text-xs font-mono text-gray-700 whitespace-pre-wrap break-all">{{ tool.requestTemplate.body }}</pre>
                    </div>
                  </div>
                </div>
                
                <div class="mt-4">
                  <div class="text-sm font-medium text-gray-700 mb-2">Response Template</div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <pre class="text-xs font-mono text-gray-700 whitespace-pre-wrap break-all">{{ tool.responseTemplate.body }}</pre>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No tools available
            </div>
          </AppCard>
          
          <AppCard title="Usage Guide" v-if="mcpServer.status === 'active'">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">How to Use This MCP Server</h3>
                <p class="text-sm text-gray-600">This MCP Server is active and ready to use. You can invoke any of the tools using the API endpoint below:</p>
              </div>
              
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="text-xs font-medium text-gray-700">API Endpoint</div>
                  <button @click="copyEndpoint" class="text-primary-500 hover:text-primary-600 text-xs">
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-8m-10 0h2m2 0h2m-6 5v-3m0 0h2m2 0h2" />
                      </svg>
                      Copy
                    </span>
                  </button>
                </div>
                <code class="block text-xs font-mono text-gray-800 break-all">{{ apiEndpoint }}</code>
              </div>
              
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="text-xs font-medium text-gray-700">Example Request (curl)</div>
                  <button @click="copyCurlExample" class="text-primary-500 hover:text-primary-600 text-xs">
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-8m-10 0h2m2 0h2m-6 5v-3m0 0h2m2 0h2" />
                      </svg>
                      Copy
                    </span>
                  </button>
                </div>
                <pre class="text-xs font-mono text-gray-800 overflow-x-auto p-1">{{ curlExample }}</pre>
              </div>
              
              <div v-if="mcpServer.tools && mcpServer.tools.length > 0">
                <div class="text-sm font-medium text-gray-700 mb-2">Available Tools</div>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr class="bg-gray-50">
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool Name</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-100">
                      <tr v-for="tool in mcpServer.tools" :key="tool.name">
                        <td class="px-3 py-2 text-sm font-medium text-gray-900">{{ tool.name }}</td>
                        <td class="px-3 py-2 text-sm text-gray-500">{{ tool.description || 'No description' }}</td>
                        <td class="px-3 py-2">
                          <span :class="methodClass(tool.requestTemplate.method)" class="text-xs font-medium px-2 py-0.5 rounded">
                            {{ tool.requestTemplate.method }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
        
        <!-- Sidebar -->
        <div class="space-y-6">
         
          
          <AppCard title="HTTP Interfaces">
            <div class="text-sm text-gray-500 mb-3">
              This MCP server uses the following HTTP interfaces:
            </div>
            
            <div v-if="httpInterfaces.length" class="space-y-2">
              <NuxtLink 
                v-for="httpInterface in httpInterfaces" 
                :key="httpInterface.id" 
                :to="`/http-interfaces/${httpInterface.id}`"
                class="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div class="flex items-center">
                  <span :class="methodClass(httpInterface.method)" class="text-xs font-medium px-2 py-0.5 rounded mr-2">
                    {{ httpInterface.method }}
                  </span>
                  <span class="font-medium text-primary-500">{{ httpInterface.name }}</span>
                </div>
                <div class="text-xs text-gray-500 mt-1 pl-10">{{ httpInterface.path }}</div>
              </NuxtLink>
            </div>
            <div v-else class="text-center py-3 text-gray-500">
              No HTTP interfaces associated
            </div>
          </AppCard>
          
          <!-- Test Tool Modal -->
          <div v-if="showTestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div class="p-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-semibold text-gray-800">Test Tool: {{ activeTool?.name }}</h2>
                  <button @click="showTestModal = false" class="text-gray-500 hover:text-gray-700" :disabled="testingTool">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="p-4">
                <form @submit.prevent="runTest">
                  <div v-if="testInputs.length" class="space-y-4">
                    <div v-for="(input, index) in testInputs" :key="index">
                      <label :for="`input-${index}`" class="form-label">{{ input.name }}</label>
                      <input 
                        :id="`input-${index}`" 
                        v-model="input.value" 
                        type="text" 
                        class="form-input"
                        :placeholder="input.placeholder" 
                        :disabled="testingTool"
                      />
                    </div>
                  </div>
                  <div v-else class="text-center py-4 text-gray-500">
                    No inputs required for this tool
                  </div>
                  
                  <div class="mt-6">
                    <AppButton 
                      type="submit" 
                      :loading="testingTool" 
                      full-width
                      :disabled="testingTool"
                    >
                      {{ testingTool ? 'Running Test...' : 'Run Test' }}
                    </AppButton>
                  </div>
                </form>
                
                <div v-if="testResult" class="mt-6">
                  <div class="text-sm font-medium text-gray-700 mb-2 flex justify-between">
                    <span>Result</span>
                    <button 
                      @click="copyTestResult" 
                      class="text-primary-500 hover:text-primary-600 text-xs flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-8m-10 0h2m2 0h2m-6 5v-3m0 0h2m2 0h2" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <div 
                    class="bg-gray-50 rounded-lg p-3 overflow-auto max-h-80"
                    :class="{ 'bg-red-50': testResult.startsWith('Error:') }"
                  >
                    <pre class="text-xs font-mono text-gray-700 whitespace-pre-wrap break-all">{{ testResult }}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { useApi } from '~/composables/useApi';
import { useToast } from '~/composables/useToast';
import { useRuntimeConfig } from '#app/nuxt';

// Define interfaces for better type checking
interface MCPServer {
  id: string;
  name: string;
  description?: string;
  status: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  tools?: Tool[];
}

interface Tool {
  name: string;
  description?: string;
  requestTemplate: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: string;
  };
  responseTemplate: {
    body: string;
  };
}

interface HttpInterface {
  id: string;
  name: string;
  path: string;
  method: string;
  description?: string;
}

interface Version {
  version: number;
  updatedAt: string;
}

const router = useRouter();
const route = useRoute();
const $api = useApi();
const toast = useToast();
const config = useRuntimeConfig();

const loading = ref(true);
const activating = ref(false);
const registering = ref(false);
const mcpServer = ref<MCPServer | null>(null);
const versions = ref<Version[]>([]);
const httpInterfaces = ref<HttpInterface[]>([]);
const loadingHttpInterfaces = ref(false);
const testingTool = ref(false);
const testParams = ref<Record<string, any>>({});
const testResult = ref('');
const selectedParameterSchema = ref(null);
const validationErrors = ref<Record<string, string>>({});

// Get the server ID from the route params
const serverId = computed(() => {
  const id = route.params.id;
  return typeof id === 'string' ? id : id[0];
});

// Test tool modal state
const showTestModal = ref(false);
const activeTool = ref<Tool | null>(null);
const testInputs = ref<{ name: string; value: string; placeholder: string }[]>([]);

// API base URL for examples
const apiBaseUrl = computed(() => {
  return config.public.apiBaseUrl || '';
});

// WASM File Upload
const uploadFile = ref(null);
const uploading = ref(false);
const wasmFiles = ref([]);
const loadingFiles = ref(false);

// Status color mapping
const statusClass = (status: string) => {
  const classes = {
    draft: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  };
  
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

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

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

// Load a specific version
const loadVersion = async (version: number) => {
  try {
    loading.value = true;
    const response = await $api.mcpServers.getVersion(serverId.value, version);
    mcpServer.value = response.data;
    toast.success(`Loaded version ${version}`);
  } catch (error) {
    console.error('Error loading version:', error);
    toast.error(`Failed to load version ${version}`);
  } finally {
    loading.value = false;
  }
};

// Register server
async function registerServer() {
  if (registering.value) return;
  
  registering.value = true;
  try {
    await $api.mcpServers.register(serverId.value);
    toast.success('MCP Server registered successfully');
    await fetchMCPServer();
  } catch (error: any) {
    console.error('Error registering MCP server:', error);
    console.error('Error details:', error.response?.data);
    toast.error(error.response?.data?.error || 'Failed to register MCP server');
  } finally {
    registering.value = false;
  }
}

// Activate server
async function activateServer() {
  if (activating.value) return;
  
  activating.value = true;
  try {
    await $api.mcpServers.activate(serverId.value);
    toast.success('MCP Server activated successfully');
    await fetchMCPServer();
  } catch (error: any) {
    console.error('Error activating MCP server:', error);
    console.error('Error details:', error.response?.data);
    toast.error(error.response?.data?.error || 'Failed to activate MCP server');
  } finally {
    activating.value = false;
  }
}

// Navigate to edit page
const editServer = () => {
  router.push(`/mcp-servers/${serverId.value}-edit`);
};

// Test a tool
const testTool = (tool: Tool) => {
  activeTool.value = tool;
  testResult.value = '';
  
  // Parse URL to find parameters
  const url = tool.requestTemplate.url;
  const params = [];
  const regex = /\{([^}]+)\}/g;
  let match;
  
  while ((match = regex.exec(url)) !== null) {
    params.push({
      name: match[1],
      value: '',
      placeholder: `Enter value for ${match[1]}`
    });
  }
  
  testInputs.value = params;
  showTestModal.value = true;
};

// Run test
const runTest = async () => {
  if (!activeTool.value) return;
  
  try {
    testingTool.value = true;
    testResult.value = '';
    
    // Create data object from inputs
    const data: Record<string, string> = {};
    testInputs.value.forEach(input => {
      data[input.name] = input.value;
    });
    
    console.log(`Invoking tool: ${activeTool.value.name} for server ${serverId.value}`);
    console.log('Request payload:', JSON.stringify(data));
    
    // Call the tool
    const response = await $api.mcpServers.invokeTool(
      serverId.value, 
      activeTool.value.name, 
      data
    );
    
    console.log(`Tool response status: ${response.status}`);
    console.log('Tool response data:', response.data);
    
    // Handle different response types
    if (typeof response.data === 'object') {
      testResult.value = JSON.stringify(response.data, null, 2);
    } else {
      testResult.value = response.data;
    }
  } catch (error: any) {
    console.error('Failed to test tool:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error(`Error status: ${error.response.status}`);
      console.error('Error response headers:', error.response.headers);
      console.error('Error response data:', error.response.data);
      
      // Provide more detailed error information
      if (error.response.data && error.response.data.error) {
        testResult.value = `Error: ${error.response.data.error}`;
      } else if (error.response.data) {
        testResult.value = `Error: ${JSON.stringify(error.response.data, null, 2)}`;
      } else {
        testResult.value = `Error: Server returned status ${error.response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      testResult.value = 'Error: No response received from server. Check network connection.';
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
      testResult.value = `Error: ${error.message || 'Failed to test tool'}`;
    }
  } finally {
    testingTool.value = false;
  }
};

// Fetch MCP server
async function fetchMCPServer() {
  try {
    loading.value = true;
    console.log(`Fetching MCP server with ID: ${serverId.value}`);
    const response = await $api.mcpServers.getById(serverId.value);
    console.log('MCP server response:', response.data);
    mcpServer.value = response.data;
    
    // Fetch HTTP interfaces used to create this MCP server
    if (mcpServer.value && mcpServer.value.tools && mcpServer.value.tools.length > 0) {
      await fetchHttpInterfaces();
    }
  } catch (error: any) {
    console.error('Error fetching MCP server:', error);
    console.error('Error details:', error.response?.data);
    mcpServer.value = null;
    toast.error(error.response?.data?.error || 'Failed to fetch MCP Server');
  } finally {
    loading.value = false;
  }
}

// Fetch HTTP interfaces
async function fetchHttpInterfaces() {
  try {
    loadingHttpInterfaces.value = true;
    console.log(`Fetching HTTP interfaces for server: ${serverId.value}`);
    const response = await $api.mcpServers.getHttpInterfaces(serverId.value);
    console.log('HTTP interfaces response:', response.data);
    httpInterfaces.value = response.data;
  } catch (error: any) {
    console.error('Failed to fetch HTTP interfaces:', error);
    console.error('Error details:', error.response?.data);
    httpInterfaces.value = [];
  } finally {
    loadingHttpInterfaces.value = false;
  }
}

// API usage examples
const apiEndpoint = computed(() => {
  if (!mcpServer.value) return '';
  return `${apiBaseUrl.value}/api/mcp-servers/${mcpServer.value.id}/tools/{tool-name}`;
});

const curlExample = computed(() => {
  if (!mcpServer.value || !mcpServer.value.tools || mcpServer.value.tools.length === 0) return '';
  
  const tool = mcpServer.value.tools[0];
  return `curl -X POST "${apiBaseUrl.value}/api/mcp-servers/${mcpServer.value.id}/tools/${tool.name}" \\
  -H "Content-Type: application/json" \\
  -d '${generateExampleRequestBody(tool)}'`;
});

// Helper functions
function getWasmFilename(path: string): string {
  if (!path) return 'None';
  const parts = path.split('/');
  return parts[parts.length - 1];
}

function generateExampleRequestBody(tool: Tool): string {
  // Extract parameters from the URL template
  const url = tool.requestTemplate.url;
  const regex = /\{([^}]+)\}/g;
  let match;
  const params: Record<string, string> = {};
  
  while ((match = regex.exec(url)) !== null) {
    params[match[1]] = `value-for-${match[1]}`;
  }
  
  return JSON.stringify(params, null, 2);
}

function copyEndpoint() {
  navigator.clipboard.writeText(apiEndpoint.value);
  toast.success('复制成功', 'API端点已复制到剪贴板');
}

function copyCurlExample() {
  navigator.clipboard.writeText(curlExample.value);
  toast.success('复制成功', 'cURL示例已复制到剪贴板');
}

function copyTestResult() {
  navigator.clipboard.writeText(testResult.value || '');
  toast.success('复制成功', '测试结果已复制到剪贴板');
}

// Fetch MCP server versions
async function fetchVersions() {
  try {
    const id = serverId.value as string;
    const response = await $api.mcpServers.getVersions(id);
    versions.value = response.data;
  } catch (error) {
    console.error('Failed to fetch MCP server versions:', error);
    versions.value = [];
  }
}

// Load on mount
onMounted(async () => {
  await fetchMCPServer();
  await fetchVersions();
});
</script> 