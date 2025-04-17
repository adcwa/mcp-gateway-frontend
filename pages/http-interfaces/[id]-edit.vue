<template>
  <div>
    <div class="flex items-center mb-6">
      <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <PageHeader 
        title="Edit HTTP Interface" 
        description="Modify the HTTP interface configuration"
      />
    </div>
    
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
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <AppCard title="Basic Information">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                v-model.trim="httpInterface.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter interface name"
                @change="console.log('Name input changed:', httpInterface.name)"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model.trim="httpInterface.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter interface description"
                @change="console.log('Description input changed:', httpInterface.description)"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="method" class="block text-sm font-medium text-gray-700">HTTP Method</label>
                <select
                  id="method"
                  v-model="httpInterface.method"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  @change="console.log('Method select changed:', httpInterface.method)"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              
              <div>
                <label for="path" class="block text-sm font-medium text-gray-700">Path</label>
                <input
                  id="path"
                  v-model.trim="httpInterface.path"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="https://api.example.com/path"
                  @change="console.log('Path input changed:', httpInterface.path)"
                />
              </div>
            </div>
          </div>
        </AppCard>
        
        <!-- Parameters -->
        <AppCard title="Parameters">
          <div v-if="httpInterface.parameters.length === 0" class="text-center py-4">
            <p class="text-sm text-gray-500">No parameters added yet</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="(param, index) in httpInterface.parameters" :key="index" class="bg-gray-50 p-4 rounded-md relative">
              <button 
                @click="removeParameter(index)" 
                class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div class="flex flex-wrap items-center gap-2">
                <div class="w-48">
                  <label :for="`param-name-${index}`" class="block text-xs font-medium text-gray-700">Name</label>
                  <input
                    :id="`param-name-${index}`"
                    v-model="param.name"
                    type="text"
                    class="mt-0.5 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Parameter name"
                  />
                </div>
                
                <div class="w-40">
                  <label :for="`param-in-${index}`" class="block text-xs font-medium text-gray-700">Location</label>
                  <select
                    :id="`param-in-${index}`"
                    v-model="param.in"
                    class="mt-0.5 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="query">Query</option>
                    <option value="path">Path</option>
                    <option value="header">Header</option>
                  </select>
                </div>
                
                <div class="flex items-center mt-4 mr-4">
                  <input
                    :id="`param-required-${index}`"
                    v-model="param.required"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label :for="`param-required-${index}`" class="ml-2 text-sm text-gray-700">
                    Required
                  </label>
                </div>
                
                <div class="flex-grow min-w-52">
                  <label :for="`param-description-${index}`" class="block text-xs font-medium text-gray-700">Description</label>
                  <input
                    :id="`param-description-${index}`"
                    v-model="param.description"
                    type="text"
                    class="mt-0.5 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Parameter description"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <button 
              @click="addParameter" 
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Parameter
            </button>
          </div>
        </AppCard>
        
        <!-- Headers -->
        <AppCard title="Headers">
          <div v-if="httpInterface.headers.length === 0" class="text-center py-4">
            <p class="text-sm text-gray-500">No headers added yet</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="(header, index) in httpInterface.headers" :key="index" class="bg-gray-50 p-4 rounded-md relative">
              <button 
                @click="removeHeader(index)" 
                class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div class="flex flex-wrap items-center gap-2">
                <div class="w-48">
                  <label :for="`header-name-${index}`" class="block text-xs font-medium text-gray-700">Name</label>
                  <input
                    :id="`header-name-${index}`"
                    v-model="header.name"
                    type="text"
                    class="mt-0.5 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Header name"
                  />
                </div>
                
                <div class="w-48">
                  <label :for="`header-default-value-${index}`" class="block text-xs font-medium text-gray-700">Default Value</label>
                  <input
                    :id="`header-default-value-${index}`"
                    v-model="header.defaultValue"
                    type="text"
                    class="mt-0.5 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Default value"
                  />
                </div>
                
                <div class="flex items-center mt-4 mr-4">
                  <input
                    :id="`header-required-${index}`"
                    v-model="header.required"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label :for="`header-required-${index}`" class="ml-2 text-sm text-gray-700">
                    Required
                  </label>
                </div>
                
                <div class="flex-grow min-w-52">
                  <label :for="`header-description-${index}`" class="block text-xs font-medium text-gray-700">Description</label>
                  <input
                    :id="`header-description-${index}`"
                    v-model="header.description"
                    type="text"
                    class="mt-0.5 block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Header description"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <button 
              @click="addHeader" 
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Header
            </button>
          </div>
        </AppCard>
        
        <!-- Request Body -->
        <AppCard title="Request Body">
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="has-request-body"
                v-model="hasRequestBody"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                @change="console.log('Has request body changed:', hasRequestBody)"
              />
              <label for="has-request-body" class="ml-2 block text-sm text-gray-700">
                This request has a body
              </label>
            </div>
            
            <div v-if="hasRequestBody && httpInterface.requestBody" class="space-y-4">
              <div>
                <label for="content-type" class="block text-sm font-medium text-gray-700">Content Type</label>
                <select
                  id="content-type"
                  v-model="httpInterface.requestBody.contentType"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  @change="console.log('Request body content type changed:', httpInterface.requestBody.contentType)"
                >
                  <option value="application/json">application/json</option>
                  <option value="application/xml">application/xml</option>
                  <option value="text/plain">text/plain</option>
                  <option value="application/x-www-form-urlencoded">application/x-www-form-urlencoded</option>
                  <option value="multipart/form-data">multipart/form-data</option>
                </select>
              </div>
              
              <div>
                <label for="schema" class="block text-sm font-medium text-gray-700">Schema</label>
                <textarea
                  id="schema"
                  v-model="httpInterface.requestBody.schema"
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
                  placeholder='{"type": "object", "properties": {}}'
                  @change="console.log('Request body schema changed')"
                ></textarea>
              </div>
              
              <div>
                <label for="example" class="block text-sm font-medium text-gray-700">Example</label>
                <textarea
                  id="example"
                  v-model="httpInterface.requestBody.example"
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
                  placeholder='{"key": "value"}'
                  @change="console.log('Request body example changed')"
                ></textarea>
              </div>
            </div>
          </div>
        </AppCard>
        
        <!-- Responses -->
        <AppCard title="Responses">
          <div v-if="httpInterface.responses.length === 0" class="text-center py-4">
            <p class="text-sm text-gray-500">No responses added yet</p>
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="(response, index) in httpInterface.responses" :key="index" class="bg-gray-50 p-4 rounded-md relative">
              <button 
                @click="removeResponse(index)" 
                class="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label :for="`response-status-${index}`" class="block text-sm font-medium text-gray-700">Status Code</label>
                  <input
                    :id="`response-status-${index}`"
                    v-model.number="response.statusCode"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="200"
                  />
                </div>
                
                <div>
                  <label :for="`response-description-${index}`" class="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    :id="`response-description-${index}`"
                    v-model="response.description"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Successful response"
                  />
                </div>
                
                <div class="sm:col-span-2">
                  <div class="flex items-center">
                    <input
                      :id="`response-has-body-${index}`"
                      v-model="hasResponseBody[index]"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      @change="toggleResponseBody(index)"
                    />
                    <label :for="`response-has-body-${index}`" class="ml-2 block text-sm text-gray-700">
                      This response has a body
                    </label>
                  </div>
                </div>
                
                <template v-if="hasResponseBody[index] && response.body">
                  <div class="sm:col-span-2">
                    <label :for="`response-content-type-${index}`" class="block text-sm font-medium text-gray-700">Content Type</label>
                    <select
                      :id="`response-content-type-${index}`"
                      v-model="response.body.contentType"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="application/json">application/json</option>
                      <option value="application/xml">application/xml</option>
                      <option value="text/plain">text/plain</option>
                      <option value="text/html">text/html</option>
                    </select>
                  </div>
                  
                  <div class="sm:col-span-2">
                    <label :for="`response-schema-${index}`" class="block text-sm font-medium text-gray-700">Schema</label>
                    <textarea
                      :id="`response-schema-${index}`"
                      v-model="response.body.schema"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
                      placeholder='{"type": "object", "properties": {}}'
                    ></textarea>
                  </div>
                  
                  <div class="sm:col-span-2">
                    <label :for="`response-example-${index}`" class="block text-sm font-medium text-gray-700">Example</label>
                    <textarea
                      :id="`response-example-${index}`"
                      v-model="response.body.example"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
                      placeholder='{"key": "value"}'
                    ></textarea>
                  </div>
                </template>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <button 
              @click="addResponse" 
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Response
            </button>
          </div>
        </AppCard>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <AppCard title="Actions">
          <div class="space-y-4">
            <AppButton 
              full-width
              @click="updateInterface"
              :loading="updating"
              primary
            >
              {{ updating ? '正在更新...' : '更新HTTP接口' }}
            </AppButton>
            
            <AppButton 
              variant="secondary" 
              full-width
              @click="router.push(`/http-interfaces/${(route.params.id as string).replace('-edit', '')}`)"
            >
              Cancel
            </AppButton>
            
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div class="text-sm font-medium mb-2">Troubleshooting</div>
              <button 
                @click="forceRefresh" 
                class="text-xs text-primary-600 hover:text-primary-800 font-medium"
              >
                Force Refresh Form
              </button>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from '~/utils/toast';

const router = useRouter();
const route = useRoute();
const { $api } = useNuxtApp();

// UI state
const loading = ref(true);
const updating = ref(false);
const httpInterface = ref<any>(null);
const hasRequestBody = ref(false);
const hasResponseBody = ref<Record<number, boolean>>({});

// Fetch the HTTP interface data
async function fetchHttpInterface() {
  try {
    loading.value = true;
    // Extract the actual ID part from the route parameter (removing "-edit" suffix if present)
    const id = (route.params.id as string).replace('-edit', '');
    console.log('Fetching HTTP interface with ID:', id);
    
    const response = await $api.httpInterfaces.getById(id);
    console.log('Received HTTP interface data:', response.data);
    
    // Make sure we have a valid response
    if (!response.data) {
      throw new Error('Empty response received from server');
    }
    
    // Create a proper deep clone with all required properties
    const interfaceData = JSON.parse(JSON.stringify(response.data));
    
    // Initialize all fields to ensure proper reactivity
    httpInterface.value = {
      id: interfaceData.id || '',
      name: interfaceData.name || '',
      description: interfaceData.description || '',
      method: interfaceData.method || 'GET',
      path: interfaceData.path || '',
      version: interfaceData.version || 1,
      createdAt: interfaceData.createdAt || new Date().toISOString(),
      updatedAt: interfaceData.updatedAt || new Date().toISOString(),
      parameters: Array.isArray(interfaceData.parameters) ? interfaceData.parameters : [],
      headers: Array.isArray(interfaceData.headers) ? interfaceData.headers : [],
      responses: Array.isArray(interfaceData.responses) ? interfaceData.responses : [],
      requestBody: interfaceData.requestBody || null
    };
    
    console.log('Initialized httpInterface:', httpInterface.value);
    
    // Set up request body state
    hasRequestBody.value = !!httpInterface.value.requestBody;
    console.log('Request body exists:', hasRequestBody.value);
    
    // Initialize requestBody if needed
    if (hasRequestBody.value && !httpInterface.value.requestBody) {
      console.log('Creating default request body');
      httpInterface.value.requestBody = {
        contentType: 'application/json',
        schema: '',
        example: ''
      };
    }
    
    // Set up response body states
    if (httpInterface.value.responses && httpInterface.value.responses.length > 0) {
      httpInterface.value.responses.forEach((response: any, index: number) => {
        hasResponseBody.value[index] = !!response.body;
        console.log(`Response ${index} has body:`, hasResponseBody.value[index]);
        
        // Ensure response has proper structure
        if (!response.statusCode) response.statusCode = 200;
        if (!response.description) response.description = 'Successful response';
        
        // Initialize body if missing but marked as having body
        if (hasResponseBody.value[index] && !response.body) {
          response.body = {
            contentType: 'application/json',
            schema: '',
            example: ''
          };
        }
      });
    } else {
      // If no responses, add default one
      httpInterface.value.responses = [];
    }
  } catch (error: any) {
    console.error('Failed to fetch HTTP interface:', error);
    toast.error('加载失败', `无法加载HTTP接口: ${error.response?.data?.error || error.message || '未知错误'}`);
  } finally {
    loading.value = false;
  }
}

// Watch hasRequestBody changes to properly initialize requestBody
watch(hasRequestBody, (newVal) => {
  if (!httpInterface.value) return;
  
  if (newVal) {
    // Create a new requestBody object if needed
    if (!httpInterface.value.requestBody) {
      httpInterface.value.requestBody = reactive({
        contentType: 'application/json',
        schema: '',
        example: ''
      });
      // Force refresh the UI
      nextTick(() => {
        console.log('RequestBody initialized:', httpInterface.value.requestBody);
      });
    }
  } else {
    // Keep the data during editing, only remove during save
    console.log('Request body checkbox unchecked');
  }
});

// Monitor for changes to make sure they are tracked
watch(() => httpInterface.value?.name, (newVal) => {
  console.log('Name changed:', newVal);
});

// Monitor requestBody content type changes
watch(() => httpInterface.value?.requestBody?.contentType, (newVal) => {
  if (newVal) {
    console.log('RequestBody content type changed:', newVal);
  }
}, { deep: true });

// Add parameter
function addParameter() {
  httpInterface.value.parameters.push({
    name: '',
    in: 'query',
    type: 'string',
    required: false,
    description: ''
  });
}

// Remove parameter
function removeParameter(index: number) {
  httpInterface.value.parameters.splice(index, 1);
}

// Add header
function addHeader() {
  httpInterface.value.headers.push({
    name: '',
    type: 'string',
    required: false,
    description: '',
    defaultValue: ''
  });
}

// Remove header
function removeHeader(index: number) {
  httpInterface.value.headers.splice(index, 1);
}

// Add response
function addResponse() {
  const newIndex = httpInterface.value.responses.length;
  httpInterface.value.responses.push({
    statusCode: 200,
    description: 'Successful response',
    body: null
  });
  
  hasResponseBody.value[newIndex] = false;
}

// Remove response
function removeResponse(index: number) {
  httpInterface.value.responses.splice(index, 1);
  
  // Reindex hasResponseBody
  const newHasResponseBody: Record<number, boolean> = {};
  Object.entries(hasResponseBody.value).forEach(([key, value]) => {
    const keyNum = parseInt(key);
    if (keyNum < index) {
      newHasResponseBody[keyNum] = value;
    } else if (keyNum > index) {
      newHasResponseBody[keyNum - 1] = value;
    }
  });
  
  hasResponseBody.value = newHasResponseBody;
}

// Toggle response body
function toggleResponseBody(index: number) {
  if (hasResponseBody.value[index]) {
    // Add body if not exists
    if (!httpInterface.value.responses[index].body) {
      httpInterface.value.responses[index].body = reactive({
        contentType: 'application/json',
        schema: '',
        example: ''
      });
      // Force UI update
      nextTick(() => {
        console.log(`Response ${index} body initialized:`, httpInterface.value.responses[index].body);
      });
    }
  } else {
    // Keep data during editing
    console.log(`Response ${index} body marked for removal`);
  }
}

// Update interface
async function updateInterface() {
  try {
    console.log('Starting updateInterface()', httpInterface.value);
    
    // Validate required fields
    if (!httpInterface.value.name?.trim()) {
      toast.warning('验证失败', '请输入接口名称');
      return;
    }
    
    if (!httpInterface.value.path?.trim()) {
      toast.warning('验证失败', '请输入接口路径');
      return;
    }
    
    // Make copy of the data for submission to avoid reactivity issues
    const payload = JSON.parse(JSON.stringify(httpInterface.value));
    console.log('Prepared payload:', payload);
    
    // Ensure arrays are initialized properly
    payload.parameters = payload.parameters || [];
    payload.headers = payload.headers || [];
    payload.responses = payload.responses || [];
    
    // Handle request body
    if (!hasRequestBody.value) {
      console.log('Removing request body from payload');
      payload.requestBody = null;
    } else if (payload.requestBody) {
      console.log('Request body included in payload:', payload.requestBody);
    }
    
    // Process response body for each response
    if (payload.responses && Array.isArray(payload.responses)) {
      payload.responses.forEach((response: any, index: number) => {
        if (!hasResponseBody.value[index]) {
          console.log(`Removing response body from response ${index}`);
          response.body = null;
        } else {
          console.log(`Response ${index} has body:`, response.body);
        }
      });
    }
    
    updating.value = true;
    // Extract the actual ID part from the route parameter (removing "-edit" suffix if present)
    const id = (route.params.id as string).replace('-edit', '');
    
    console.log('Sending update request for interface:', id);
    console.log('Final payload:', payload);
    
    try {
      const response = await $api.httpInterfaces.update(id, payload);
      console.log('Update successful:', response.data);
      
      // Show success message
      toast.success('更新成功', 'HTTP接口已更新');
      
      // Navigate back to the interface details page
      router.push(`/http-interfaces/${id}`);
    } catch (apiError: any) {
      console.error('API error updating HTTP interface:', apiError);
      
      let errorMessage = '更新接口失败';
      if (apiError.response?.data?.error) {
        errorMessage = apiError.response.data.error;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }
      
      toast.error('更新失败', errorMessage);
    }
  } catch (error: any) {
    console.error('Error preparing HTTP interface update:', error);
    toast.error('准备数据失败', `准备更新数据时出错: ${error.message || '未知错误'}`);
  } finally {
    updating.value = false;
  }
}

// Force refresh the form (for troubleshooting)
function forceRefresh() {
  // Extract the actual ID part from the route parameter (removing "-edit" suffix if present)
  const id = (route.params.id as string).replace('-edit', '');
  loading.value = true;
  
  // Re-fetch the data
  fetchHttpInterface().then(() => {
    toast.info('刷新完成', '表单数据已从服务器刷新');
  }).catch(error => {
    console.error('Failed to refresh data:', error);
    toast.error('刷新失败', '无法刷新数据，请查看控制台以获取详细信息');
  }).finally(() => {
    loading.value = false;
  });
}

// Load data on mount
onMounted(() => {
  fetchHttpInterface();
});
</script> 