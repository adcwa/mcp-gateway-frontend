<template>
  <div>
    <div class="space-y-6">
      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-3">从OpenAPI规范导入</h3>
        <p class="text-sm text-gray-500 mb-4">
          您可以从OpenAPI规范（Swagger）导入HTTP接口。
          这将根据您规范中定义的路径创建一个或多个HTTP接口。
        </p>
      </div>
      
      <div>
        <div class="space-y-4">
          <div>
            <h4 class="text-sm font-medium text-gray-700">选择导入方式：</h4>
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
                  上传OpenAPI文件
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
                  粘贴OpenAPI JSON
                </label>
              </div>
            </div>
          </div>
          
          <div v-if="importMethod === 'file'">
            <FileUpload 
              accept=".json,.yaml,.yml"
              acceptDescription="OpenAPI规范文件 (.json, .yaml, .yml)"
              @file-selected="onFileSelected"
            />
            
            <div v-if="file" class="mt-4 flex justify-end">
              <AppButton 
                @click="importOpenAPIFromFile" 
                :loading="importing"
                size="sm"
              >
                从文件导入
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
                placeholder='在此粘贴您的OpenAPI JSON规范'
              ></textarea>
            </div>
            
            <div class="flex justify-end">
              <AppButton 
                @click="importOpenAPIFromJson" 
                :loading="importing"
                :disabled="!openAPIJson"
                size="sm"
              >
                从JSON导入
              </AppButton>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">OpenAPI导入指南</h4>
        <div class="bg-gray-50 p-3 rounded-lg">
          <div class="space-y-2 text-sm text-gray-600">
            <p>
              <span class="font-medium">格式支持：</span> 
              我们支持JSON或YAML格式的OpenAPI/Swagger规范。
            </p>
            <p>
              <span class="font-medium">导入路径：</span> 
              OpenAPI规范中的每个路径都将作为单独的HTTP接口导入。
            </p>
            <p>
              <span class="font-medium">限制：</span> 
              非常大的规范可能需要分多次导入。
            </p>
          </div>
        </div>
      </div>
      
      <div v-if="importResult.success" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="flex items-center">
          <CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" />
          <span class="text-green-700 font-medium">导入成功!</span>
        </div>
        <p class="mt-2 text-sm text-green-600">
          恭喜！您已成功导入 {{ importResult.count }} 个HTTP接口。这些接口已准备好在您的MCP服务器中使用，可以立即集成到您的项目中。
        </p>
        <p class="mt-1 text-sm text-green-600">
          您可以查看导入的接口，编辑它们的配置，或将它们添加到MCP服务器。
        </p>
        <div class="mt-3">
          <button 
            @click="viewImportedInterfaces" 
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {{ importResult.count === 1 ? '查看导入的接口' : '查看导入的接口列表' }}
          </button>
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
            <h3 class="text-sm font-medium text-red-800">导入失败</h3>
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
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  redirectToList: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['import-success', 'import-error', 'refresh-interfaces']);

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
    
    console.log('Uploading OpenAPI file:', file.value.name);
    const response = await $api.httpInterfaces.uploadOpenAPI(file.value);
    console.log('Upload response:', response);
    
    // 直接传递响应数据给处理函数，让它根据数据格式进行处理
    handleImportSuccess(response.data);
  } catch (error: any) {
    console.error('Import error:', error);
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
      importResult.error = '无效的JSON格式：请检查您的OpenAPI规范格式';
      emit('import-error', '无效的JSON格式');
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
  console.log('Import success data:', data);
  
  // 处理包含 interfaces 字段的响应格式
  if (data && data.interfaces && Array.isArray(data.interfaces)) {
    importResult.success = true;
    importResult.count = data.interfaces.length;
    importResult.interfaceIds = data.interfaces.map((item: any) => item.id);
    emit('import-success', importResult);
    refreshInterfaces();
  } 
  // 处理直接返回接口数组的情况
  else if (Array.isArray(data)) {
    importResult.success = true;
    importResult.count = data.length;
    importResult.interfaceIds = data.map((item: any) => item.id);
    emit('import-success', importResult);
    refreshInterfaces();
  } 
  // 处理返回单个接口的情况
  else if (data && data.id) {
    importResult.success = true;
    importResult.count = 1;
    importResult.interfaceIds = [data.id];
    emit('import-success', importResult);
    refreshInterfaces();
  } 
  else {
    handleImportError(new Error('导入响应格式不正确'));
    console.error('Unexpected response format:', data);
  }
}

// Handle import error
function handleImportError(error: any) {
  console.error('Import error details:', error);
  
  // Try to extract error message from different response formats
  if (error.response) {
    if (error.response.data && error.response.data.error) {
      importResult.error = error.response.data.error;
    } else if (error.response.data && error.response.data.message) {
      importResult.error = error.response.data.message;
    } else if (typeof error.response.data === 'string') {
      importResult.error = error.response.data;
    } else {
      importResult.error = `错误 ${error.response.status}：${error.response.statusText}`;
    }
  } else if (error.message) {
    importResult.error = error.message;
  } else {
    importResult.error = '导入过程中发生未知错误';
  }
  
  emit('import-error', importResult.error);
}

// Reset import result
function resetImportResult() {
  importResult.success = false;
  importResult.error = '';
  importResult.count = 0;
  importResult.interfaceIds = [];
}

// Refresh the interfaces list in the parent component
function refreshInterfaces() {
  // 通知父组件需要刷新接口列表
  if (props.redirectToList) {
    emit('refresh-interfaces');
  }
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