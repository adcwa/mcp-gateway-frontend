<template>
  <div>
    <div class="flex items-center mb-6">
      <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <PageHeader 
        title="Create HTTP Interface" 
        description="Define a new HTTP interface configuration"
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
                v-model="httpInterface.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter interface name"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="httpInterface.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter interface description"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="method" class="block text-sm font-medium text-gray-700">HTTP Method</label>
                <select
                  id="method"
                  v-model="httpInterface.method"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
                  v-model="httpInterface.path"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="https://api.example.com/path"
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
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label :for="`param-name-${index}`" class="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    :id="`param-name-${index}`"
                    v-model="param.name"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Parameter name"
                  />
                </div>
                
                <div>
                  <label :for="`param-in-${index}`" class="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    :id="`param-in-${index}`"
                    v-model="param.in"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="query">Query</option>
                    <option value="path">Path</option>
                    <option value="header">Header</option>
                  </select>
                </div>
                
                <div>
                  <label :for="`param-type-${index}`" class="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    :id="`param-type-${index}`"
                    v-model="param.type"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="array">Array</option>
                    <option value="object">Object</option>
                  </select>
                </div>
                
                <div>
                  <div class="flex items-center">
                    <input
                      :id="`param-required-${index}`"
                      v-model="param.required"
                      type="checkbox"
                      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label :for="`param-required-${index}`" class="ml-2 block text-sm text-gray-700">
                      Required
                    </label>
                  </div>
                </div>
                
                <div class="sm:col-span-2">
                  <label :for="`param-description-${index}`" class="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    :id="`param-description-${index}`"
                    v-model="param.description"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
        
        <!-- Request Body -->
        <AppCard title="Request Body">
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                id="has-request-body"
                v-model="hasRequestBody"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="has-request-body" class="ml-2 block text-sm text-gray-700">
                This request has a body
              </label>
            </div>
            
            <div v-if="hasRequestBody" class="space-y-4">
              <div>
                <label for="content-type" class="block text-sm font-medium text-gray-700">Content Type</label>
                <select
                  id="content-type"
                  v-model="httpInterface.requestBody.contentType"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
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
              @click="createInterface"
              :loading="creating"
            >
              Create HTTP Interface
            </AppButton>
            
            <AppButton 
              variant="secondary" 
              full-width
              @click="router.push('/http-interfaces')"
            >
              Cancel
            </AppButton>
          </div>
        </AppCard>
        
        <AppCard title="Import Options">
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-700 mb-2">Import from Existing Sources</h3>
              <p class="text-sm text-gray-500 mb-4">
                You can create HTTP interfaces by importing from existing sources:
              </p>
            </div>
            
            <button 
              @click="importFromCurl"
              class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Import from cURL
            </button>
            
            <button 
              @click="importFromOpenAPI"
              class="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Import from OpenAPI
            </button>
            
            <div class="border-t border-gray-200 pt-4 mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Interface Creation Guide</h4>
              <div class="text-xs text-gray-600 space-y-2">
                <p>
                  <span class="font-medium">Basic Information:</span> 
                  Start by providing a name, description, HTTP method, and the URL path.
                </p>
                <p>
                  <span class="font-medium">Parameters:</span> 
                  Define query, path, or header parameters required by your API.
                </p>
                <p>
                  <span class="font-medium">Request Body:</span> 
                  For POST/PUT/PATCH methods, define the request body schema and example.
                </p>
                <p>
                  <span class="font-medium">Responses:</span> 
                  Add expected response status codes with their schemas and examples.
                </p>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>

  <!-- cURL Import Modal -->
  <div v-if="showCurlModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800">Import from cURL</h2>
          <button @click="closeCurlImportModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600 mb-4">
              Paste your cURL command below. The command will be parsed to create a new HTTP interface with the appropriate method, headers, and parameters.
            </p>
            <label for="curl-command" class="block text-sm font-medium text-gray-700">cURL Command</label>
            <textarea
              id="curl-command"
              v-model="curlCommand"
              rows="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
              placeholder='curl -X GET "https://api.example.com/endpoint?param=value" -H "Content-Type: application/json"'
            ></textarea>
          </div>
          
          <div class="bg-gray-50 p-3 rounded-lg">
            <h4 class="text-xs font-medium text-gray-700 mb-2">Example cURL Commands</h4>
            <div class="space-y-2">
              <div>
                <div class="text-xs font-medium text-gray-600">GET Request</div>
                <pre class="text-xs font-mono text-gray-800 mt-1 p-2 bg-gray-100 rounded overflow-x-auto">curl -X GET "https://api.example.com/users?id=123" -H "Accept: application/json"</pre>
              </div>
              <div>
                <div class="text-xs font-medium text-gray-600">POST Request with JSON Body</div>
                <pre class="text-xs font-mono text-gray-800 mt-1 p-2 bg-gray-100 rounded overflow-x-auto">curl -X POST "https://api.example.com/users" -H "Content-Type: application/json" -d '{"name":"John","email":"john@example.com"}'</pre>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="closeCurlImportModal" 
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <AppButton 
              @click="importFromCurlModal" 
              :loading="importingCurl"
              :disabled="!curlCommand"
            >
              Import
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { $api } = useNuxtApp();

// Create a new interface object with default values
const httpInterface = reactive({
  name: '',
  description: '',
  method: 'GET',
  path: '',
  parameters: [] as any[],
  headers: [] as any[],
  requestBody: {
    contentType: 'application/json',
    schema: '',
    example: ''
  } as any,
  responses: [] as any[]
});

// UI state
const creating = ref(false);
const hasRequestBody = ref(false);
const hasResponseBody = ref<Record<number, boolean>>({});

// Add parameter
function addParameter() {
  httpInterface.parameters.push({
    name: '',
    in: 'query',
    type: 'string',
    required: false,
    description: ''
  });
}

// Remove parameter
function removeParameter(index: number) {
  httpInterface.parameters.splice(index, 1);
}

// Add response
function addResponse() {
  const newIndex = httpInterface.responses.length;
  httpInterface.responses.push({
    statusCode: 200,
    description: 'Successful response',
    body: null
  });
  
  hasResponseBody.value[newIndex] = false;
}

// Remove response
function removeResponse(index: number) {
  httpInterface.responses.splice(index, 1);
  
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
    if (!httpInterface.responses[index].body) {
      httpInterface.responses[index].body = {
        contentType: 'application/json',
        schema: '',
        example: ''
      };
    }
  } else {
    // Remove body
    httpInterface.responses[index].body = null;
  }
}

// Create interface
async function createInterface() {
  // Validate
  if (!httpInterface.name) {
    alert('Please enter a name for the interface');
    return;
  }
  
  if (!httpInterface.path) {
    alert('Please enter a path for the interface');
    return;
  }
  
  // Prepare data
  const data = { ...httpInterface };
  
  // Remove request body if not needed
  if (!hasRequestBody.value) {
    data.requestBody = null;
  }
  
  try {
    creating.value = true;
    const response = await $api.httpInterfaces.create(data);
    
    // Navigate to the new interface
    router.push(`/http-interfaces/${response.data.id}`);
  } catch (error: any) {
    console.error('Failed to create interface:', error);
    alert(`Failed to create interface: ${error.response?.data?.error || error.message || 'Unknown error'}`);
  } finally {
    creating.value = false;
  }
}

// Add these functions to the script section
const showCurlModal = ref(false);
const curlCommand = ref('');
const importingCurl = ref(false);

function openCurlImportModal() {
  showCurlModal.value = true;
}

function closeCurlImportModal() {
  showCurlModal.value = false;
}

async function importFromCurlModal() {
  if (!curlCommand.value) {
    alert('Please enter a cURL command');
    return;
  }
  
  try {
    importingCurl.value = true;
    const response = await $api.httpInterfaces.createFromCurl({ curl: curlCommand.value });
    
    // Navigate to the new interface
    router.push(`/http-interfaces/${response.data.id}`);
  } catch (error: any) {
    console.error('Failed to import from cURL:', error);
    alert(`Failed to import from cURL: ${error.response?.data?.error || error.message || 'Unknown error'}`);
  } finally {
    importingCurl.value = false;
    closeCurlImportModal();
  }
}

// Replace the existing importFromCurl function with this one
function importFromCurl() {
  openCurlImportModal();
}

// Import from OpenAPI
function importFromOpenAPI() {
  alert('This feature is not yet implemented. Please check back later.');
}
</script> 