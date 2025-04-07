<template>
  <div>
    <div class="space-y-6">
      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-3">Import from OpenAPI Specification</h3>
        <p class="text-sm text-gray-500 mb-4">
          You can import HTTP interfaces from an OpenAPI specification (Swagger). 
          This will create one or more HTTP interfaces based on the paths defined in your specification.
        </p>
      </div>
      
      <div>
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-700">Choose an import method:</h4>
            <div class="mt-2 space-y-2">
              <div class="flex items-center">
                <input 
                  id="import-file" 
                  v-model="importMethod" 
                  type="radio" 
                  value="file"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label for="import-file" class="ml-2 block text-sm text-gray-700">
                  Upload OpenAPI file
                </label>
              </div>
              <div class="flex items-center">
                <input 
                  id="import-json" 
                  v-model="importMethod" 
                  type="radio" 
                  value="json"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label for="import-json" class="ml-2 block text-sm text-gray-700">
                  Paste OpenAPI JSON
                </label>
              </div>
            </div>
          </div>
          
          <div v-if="importMethod === 'file'">
            <FileUpload 
              accept=".json,.yaml,.yml"
              acceptDescription="OpenAPI specification files (.json, .yaml, .yml)"
              @file-selected="onFileSelected"
            />
            
            <div v-if="file" class="mt-4 flex justify-end">
              <AppButton 
                @click="importOpenAPIFromFile" 
                :loading="importing"
                size="sm"
              >
                Import from File
              </AppButton>
            </div>
          </div>
          
          <div v-if="importMethod === 'json'" class="space-y-3">
            <div>
              <label for="openapi-json" class="block text-sm font-medium text-gray-700">OpenAPI JSON</label>
              <textarea
                id="openapi-json"
                v-model="openAPIJson"
                rows="10"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
                placeholder='Paste your OpenAPI JSON specification here'
              ></textarea>
            </div>
            
            <div class="flex justify-end">
              <AppButton 
                @click="importOpenAPIFromJson" 
                :loading="importing"
                :disabled="!openAPIJson"
                size="sm"
              >
                Import from JSON
              </AppButton>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">OpenAPI Import Guide</h4>
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="space-y-2 text-sm text-gray-600">
            <p>
              <span class="font-medium">Format Support:</span> 
              We support OpenAPI/Swagger specifications in JSON or YAML format.
            </p>
            <p>
              <span class="font-medium">Importing Paths:</span> 
              Each path in your OpenAPI spec will be imported as a separate HTTP interface.
            </p>
            <p>
              <span class="font-medium">Limitations:</span> 
              Very large specifications may need to be split into multiple imports.
            </p>
          </div>
        </div>
      </div>
      
      <div v-if="importResult.success" class="bg-green-50 p-4 rounded-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Import Successful</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Successfully imported {{ importResult.count }} HTTP interfaces.</p>
            </div>
            <div class="mt-4">
              <div class="-mx-2 -my-1.5 flex">
                <button 
                  @click="viewImportedInterfaces" 
                  class="rounded-md bg-green-100 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  View Interfaces
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="importResult.error" class="bg-red-50 p-4 rounded-lg">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Import Failed</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ importResult.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import FileUpload from './FileUpload.vue';

const props = defineProps({
  redirectToList: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['import-success', 'import-error']);

const router = useRouter();
const { $api } = useNuxtApp();

// State
const importMethod = ref('file');
const file = ref<File | null>(null);
const openAPIJson = ref('');
const importing = ref(false);
const importResult = reactive({
  success: false,
  error: '',
  count: 0,
  interfaceIds: [] as string[]
});

// File selection
function onFileSelected(selectedFile: File) {
  file.value = selectedFile;
}

// Import from file
async function importOpenAPIFromFile() {
  if (!file.value) return;
  
  try {
    importing.value = true;
    resetImportResult();
    
    const response = await $api.httpInterfaces.uploadOpenAPI(file.value);
    handleImportSuccess(response.data);
  } catch (error: any) {
    handleImportError(error);
  } finally {
    importing.value = false;
  }
}

// Import from JSON
async function importOpenAPIFromJson() {
  if (!openAPIJson.value) return;
  
  try {
    importing.value = true;
    resetImportResult();
    
    let jsonData;
    try {
      jsonData = JSON.parse(openAPIJson.value);
    } catch (e) {
      importResult.error = 'Invalid JSON: Please check your OpenAPI specification format';
      emit('import-error', 'Invalid JSON format');
      return;
    }
    
    const response = await $api.httpInterfaces.createFromOpenAPI({ spec: jsonData });
    handleImportSuccess(response.data);
  } catch (error: any) {
    handleImportError(error);
  } finally {
    importing.value = false;
  }
}

// Handle import success
function handleImportSuccess(data: any) {
  if (Array.isArray(data)) {
    importResult.success = true;
    importResult.count = data.length;
    importResult.interfaceIds = data.map((item: any) => item.id);
    emit('import-success', importResult);
  } else if (data && data.id) {
    importResult.success = true;
    importResult.count = 1;
    importResult.interfaceIds = [data.id];
    emit('import-success', importResult);
  } else {
    handleImportError(new Error('Unexpected response format'));
  }
}

// Handle import error
function handleImportError(error: any) {
  importResult.error = error.response?.data?.error || error.message || 'Unknown error occurred';
  emit('import-error', importResult.error);
}

// Reset import result
function resetImportResult() {
  importResult.success = false;
  importResult.error = '';
  importResult.count = 0;
  importResult.interfaceIds = [];
}

// View imported interfaces
function viewImportedInterfaces() {
  if (importResult.interfaceIds.length === 1) {
    router.push(`/http-interfaces/${importResult.interfaceIds[0]}`);
  } else if (props.redirectToList) {
    router.push('/http-interfaces');
  }
}
</script> 