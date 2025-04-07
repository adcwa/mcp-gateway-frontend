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
                v-if="!mcpServer.wasmPath" 
                @click="compileServer"
                :loading="compiling"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Compile
              </AppButton>
              <AppButton 
                v-else
                @click="editServer"
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
              <span v-if="mcpServer.wasmPath" class="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                Compiled
              </span>
              <span v-else class="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full">
                Not Compiled
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
              <div v-if="mcpServer.wasmPath">
                <div class="text-sm text-gray-500">WASM Path</div>
                <div class="font-medium truncate">{{ mcpServer.wasmPath }}</div>
              </div>
            </div>
          </AppCard>
          
          <!-- Add WASM File Upload Card -->
          <AppCard title="WASM File Management">
            <div class="space-y-6">
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Upload WASM File</h3>
                <FileUpload 
                  accept=".wasm"
                  acceptDescription="WebAssembly (.wasm) files only"
                  @file-selected="onFileSelected"
                />
                
                <div v-if="uploadFile" class="mt-4 flex justify-end">
                  <AppButton 
                    @click="uploadWasmFile" 
                    :loading="uploading"
                    size="sm"
                  >
                    Upload File
                  </AppButton>
                </div>
              </div>
              
              <div class="border-t border-gray-200 pt-5">
                <h3 class="text-sm font-medium text-gray-700 mb-3">Uploaded WASM Files</h3>
                <FileList 
                  :files="wasmFiles" 
                  :loading="loadingFiles"
                  @download="downloadWasmFile"
                  @delete="deleteWasmFile"
                />
              </div>
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
          
          <AppCard title="WASM Mechanism" v-if="mcpServer">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-700">MCP Server Lifecycle</h3>
                <div class="mt-2 space-y-2">
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-xs font-medium text-gray-800">1</span>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-gray-600">
                        <span class="font-medium">Create</span>: When you create an MCP Server, it starts in "draft" status. In this state, it cannot be used for API requests.
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-xs font-medium text-gray-800">2</span>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-gray-600">
                        <span class="font-medium">Compile</span>: The server must be compiled to generate a WASM file. This process transforms your HTTP interfaces into a WASM binary.
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-xs font-medium text-gray-800">3</span>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-gray-600">
                        <span class="font-medium">Upload (Optional)</span>: You can upload a custom WASM file instead of using the generated one.
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start">
                    <div class="flex-shrink-0 mt-1">
                      <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-xs font-medium text-blue-800">4</span>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-gray-600">
                        <span class="font-medium">Activate</span>: Once compiled and/or a WASM file is uploaded, you can activate the server to make it available for API requests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-700">Current Status</h3>
                <div class="mt-2 bg-gray-50 p-3 rounded-lg">
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600">Status:</span>
                      <span :class="statusClass(mcpServer.status)" class="text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {{ mcpServer.status }}
                      </span>
                    </div>
                    
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600">Compiled:</span>
                      <span v-if="mcpServer.wasmPath" class="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">Yes</span>
                      <span v-else class="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full">No</span>
                    </div>
                    
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600">WASM File:</span>
                      <span class="text-xs">{{ mcpServer.wasmPath ? getWasmFilename(mcpServer.wasmPath) : 'None' }}</span>
                    </div>
                    
                    <div class="flex justify-between">
                      <span class="text-sm text-gray-600">API Ready:</span>
                      <span v-if="mcpServer.status === 'active'" class="text-xs bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">Yes</span>
                      <span v-else class="text-xs bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">No</span>
                    </div>
                  </div>
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
                    <span class="font-medium" :class="{ 'text-primary-500': version.version === mcpServer.version }">
                      Version {{ version.version }}
                    </span>
                    <span v-if="version.version === mcpServer.version" class="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                      Current
                    </span>
                  </div>
                  <button 
                    v-if="version.version !== mcpServer.version"
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
import FileUpload from '~/components/FileUpload.vue';
import FileList from '~/components/FileList.vue';

const router = useRouter();
const route = useRoute();
const { $api } = useNuxtApp();

const loading = ref(true);
const compiling = ref(false);
const activating = ref(false);
const mcpServer = ref<any>(null);
const versions = ref<any[]>([]);
const httpInterfaces = ref<any[]>([]); // Mock data for now, should be fetched

// Test tool modal state
const showTestModal = ref(false);
const activeTool = ref<any>(null);
const testInputs = ref<{ name: string; value: string; placeholder: string }[]>([]);
const testingTool = ref(false);
const testResult = ref('');

// WASM File Upload
const uploadFile = ref<File | null>(null);
const uploading = ref(false);
const wasmFiles = ref<any[]>([]);
const loadingFiles = ref(false);

interface WasmFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  path: string;
}

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
    const response = await $api.mcpServers.getVersion(route.params.id as string, version);
    mcpServer.value = response.data;
  } catch (error) {
    console.error('Failed to load version:', error);
  } finally {
    loading.value = false;
  }
};

// Compile server
const compileServer = async () => {
  try {
    compiling.value = true;
    const response = await $api.mcpServers.compile(route.params.id as string);
    mcpServer.value = { ...mcpServer.value, wasmPath: response.data.wasmPath };
  } catch (error) {
    console.error('Failed to compile server:', error);
    alert('Failed to compile server');
  } finally {
    compiling.value = false;
  }
};

// Activate server
const activateServer = async () => {
  try {
    activating.value = true;
    await $api.mcpServers.activate(route.params.id as string);
    mcpServer.value = { ...mcpServer.value, status: 'active' };
  } catch (error) {
    console.error('Failed to activate server:', error);
    alert('Failed to activate server');
  } finally {
    activating.value = false;
  }
};

// Navigate to edit page
const editServer = () => {
  router.push(`/mcp-servers/${route.params.id}/edit`);
};

// Test a tool
const testTool = (tool: any) => {
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
    
    // Call the tool
    const response = await $api.mcpServers.invokeTool(
      route.params.id as string, 
      activeTool.value.name, 
      data
    );
    
    // Handle different response types
    if (typeof response.data === 'object') {
      testResult.value = JSON.stringify(response.data, null, 2);
    } else {
      testResult.value = response.data;
    }
  } catch (error: any) {
    console.error('Failed to test tool:', error);
    
    // Provide more detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      if (error.response.data && error.response.data.error) {
        testResult.value = `Error: ${error.response.data.error}`;
      } else if (error.response.data) {
        testResult.value = `Error: ${JSON.stringify(error.response.data, null, 2)}`;
      } else {
        testResult.value = `Error: Server returned status ${error.response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      testResult.value = 'Error: No response received from server. Check network connection.';
    } else {
      // Something happened in setting up the request
      testResult.value = `Error: ${error.message || 'Failed to test tool'}`;
    }
  } finally {
    testingTool.value = false;
  }
};

// WASM File Upload
function onFileSelected(file: File) {
  uploadFile.value = file;
}

async function uploadWasmFile() {
  if (!uploadFile.value) return;
  
  try {
    uploading.value = true;
    const { data } = await $api.mcpServers.uploadWasm(mcpServer.value.id, uploadFile.value);
    await fetchWasmFiles();
    uploadFile.value = null;
    
    // Show success message
    alert('File uploaded successfully');
    
    // Refresh server details
    await fetchMCPServer();
  } catch (error: any) {
    console.error('Error uploading WASM file:', error);
    alert('Error uploading file: ' + (error.response?.data?.error || error.message));
  } finally {
    uploading.value = false;
  }
}

async function fetchWasmFiles() {
  try {
    loadingFiles.value = true;
    const { data } = await $api.mcpServers.getWasmFiles(mcpServer.value.id);
    wasmFiles.value = data;
  } catch (error) {
    console.error('Error fetching WASM files:', error);
  } finally {
    loadingFiles.value = false;
  }
}

function downloadWasmFile(file: WasmFile) {
  // Create a download link
  const downloadUrl = $api.wasmFiles.download(file.id);
  window.open(downloadUrl, '_blank');
}

async function deleteWasmFile(file: WasmFile) {
  if (!confirm(`Are you sure you want to delete ${file.name}?`)) return;
  
  try {
    await $api.wasmFiles.delete(file.id);
    await fetchWasmFiles();
  } catch (error: any) {
    console.error('Error deleting WASM file:', error);
    alert('Error deleting file: ' + (error.response?.data?.error || error.message));
  }
}

// Fetch MCP server data and versions
onMounted(async () => {
  try {
    const id = route.params.id as string;
    const [serverResponse, versionsResponse] = await Promise.all([
      $api.mcpServers.getById(id),
      $api.mcpServers.getVersions(id)
    ]);
    
    mcpServer.value = serverResponse.data;
    versions.value = versionsResponse.data;
    
    // Mock HTTP interfaces data
    httpInterfaces.value = [
      {
        id: 'mock-1',
        name: 'Get User',
        method: 'GET',
        path: '/api/users/{id}'
      },
      {
        id: 'mock-2',
        name: 'Create User',
        method: 'POST',
        path: '/api/users'
      }
    ];
  } catch (error) {
    console.error('Failed to fetch MCP server:', error);
  } finally {
    loading.value = false;
  }
});

// Fetch WASM files when the server is loaded
watch(mcpServer, async (newServer) => {
  if (newServer && newServer.id) {
    await fetchWasmFiles();
  }
}, { immediate: true });

// Add fetchMCPServer function if it doesn't exist
async function fetchMCPServer() {
  try {
    loading.value = true;
    const response = await $api.mcpServers.getById(route.params.id as string);
    mcpServer.value = response.data;
  } catch (error) {
    console.error('Error fetching MCP server:', error);
  } finally {
    loading.value = false;
  }
}

// API usage examples
const apiBaseUrl = computed(() => {
  const config = useRuntimeConfig();
  return config.public.apiBaseUrl as string;
});

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

function generateExampleRequestBody(tool: any): string {
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
  alert('API endpoint copied to clipboard');
}

function copyCurlExample() {
  navigator.clipboard.writeText(curlExample.value);
  alert('cURL example copied to clipboard');
}

function copyTestResult() {
  navigator.clipboard.writeText(testResult.value);
  alert('Test result copied to clipboard');
}
</script> 