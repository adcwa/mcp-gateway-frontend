<template>
  <div>
    <div class="flex items-center mb-6">
      <button @click="router.back()" class="mr-4 text-gray-500 hover:text-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <PageHeader 
        title="编辑 MCP 服务器" 
        description="修改 MCP 服务器的配置"
      />
    </div>
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 主要表单 -->
      <div class="lg:col-span-2 space-y-6">
        <AppCard title="基本信息">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">名称</label>
              <input
                id="name"
                v-model="serverData.name"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="输入服务器名称"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">描述</label>
              <textarea
                id="description"
                v-model="serverData.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="输入服务器描述"
              ></textarea>
            </div>
          </div>
        </AppCard>
        
        <!-- HTTP 接口 -->
        <AppCard title="HTTP 接口">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">选择要包含在此 MCP 服务器中的 HTTP 接口：</p>
            </div>
            <div class="flex items-center">
              <input 
                v-model="searchTerm" 
                type="text" 
                placeholder="搜索接口..."
                class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              />
              <div class="ml-2">
                <select 
                  v-model="methodFilter" 
                  class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                >
                  <option value="">所有方法</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
            </div>
          </div>
          
          <div v-if="loadingInterfaces" class="flex justify-center py-4">
            <div class="animate-spin h-6 w-6 rounded-full border-t-2 border-b-2 border-primary-500"></div>
          </div>
          
          <div v-else-if="httpInterfaces.length === 0" class="text-center py-6">
            <p class="text-sm text-gray-500">没有可用的 HTTP 接口</p>
            <div class="mt-4">
              <NuxtLink to="/http-interfaces/create" class="text-sm text-primary-500 hover:text-primary-600">
                创建一个新的 HTTP 接口
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
              <p class="text-sm text-gray-500">没有接口符合您的搜索条件</p>
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <button
                v-if="filteredInterfaces.length > 0"
                @click="toggleSelectAll"
                class="text-sm text-primary-600 hover:text-primary-800"
              >
                {{ isAllSelected ? '取消全选' : '选择所有已筛选' }}
              </button>
              
              <div v-if="selectedHttpIds.length === 0" class="text-sm text-yellow-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>请至少选择一个 HTTP 接口</span>
              </div>
              <span v-else class="text-sm text-gray-500">
                已选择 {{ selectedHttpIds.length }} 个接口
              </span>
            </div>
          </div>
        </AppCard>
      </div>
      
      <!-- 侧边栏 -->
      <div class="space-y-6">
        <AppCard title="操作">
          <div class="space-y-4">
            <AppButton 
              full-width
              @click="updateServer"
              :loading="updating"
              :disabled="selectedHttpIds.length === 0 || !serverData.name"
            >
              更新 MCP 服务器
            </AppButton>
            
            <AppButton 
              variant="secondary" 
              full-width
              @click="router.push(`/mcp-servers/${route.params.id}`)"
            >
              取消
            </AppButton>
          </div>
        </AppCard>
        
        <AppCard title="已选择的接口">
          <div v-if="selectedHttpIds.length === 0" class="text-center py-4">
            <p class="text-sm text-gray-500">选择 HTTP 接口以预览工具</p>
          </div>
          
          <div v-else>
            <h3 class="text-sm font-medium text-gray-700 mb-2">已选择 {{ selectedHttpIds.length }} 个接口</h3>
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
              <h4 class="text-sm font-medium text-gray-700 mb-2">MCP 服务器预览</h4>
              <div class="text-xs text-gray-600">
                <p>您的 MCP 服务器将包含 {{ selectedHttpIds.length }} 个工具：</p>
                <ul class="list-disc pl-5 mt-2">
                  <li v-for="id in selectedHttpIds.slice(0, 5)" :key="id">
                    {{ getHttpInterfaceName(id) }}
                  </li>
                  <li v-if="selectedHttpIds.length > 5" class="italic">
                    以及 {{ selectedHttpIds.length - 5 }} 个更多...
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
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { $api } = useNuxtApp();

// 服务器数据
const serverData = reactive({
  name: '',
  description: '',
  httpIds: [] as string[],
  allowTools: [] as string[],
  tools: [] as any[]
});

// UI 状态
const loading = ref(true);
const loadingInterfaces = ref(true);
const updating = ref(false);
const httpInterfaces = ref<any[]>([]);
const selectedHttpIds = ref<string[]>([]);
const searchTerm = ref('');
const methodFilter = ref('');
const originalServer = ref<any>(null);

// 过滤接口
const filteredInterfaces = computed(() => {
  return httpInterfaces.value.filter(item => {
    const matchesSearch = searchTerm.value === '' || 
      item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      item.path.toLowerCase().includes(searchTerm.value.toLowerCase());
    
    const matchesMethod = methodFilter.value === '' || item.method === methodFilter.value;
    
    return matchesSearch && matchesMethod;
  });
});

// 是否全部选中
const isAllSelected = computed(() => {
  return filteredInterfaces.value.length > 0 && 
    filteredInterfaces.value.every(item => selectedHttpIds.value.includes(item.id));
});

// 方法颜色映射
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

// 获取 HTTP 接口方法
const getHttpInterfaceMethod = (id: string) => {
  const httpInterface = httpInterfaces.value.find(item => item.id === id);
  return httpInterface ? httpInterface.method : '';
};

// 获取 HTTP 接口名称
const getHttpInterfaceName = (id: string) => {
  const httpInterface = httpInterfaces.value.find(item => item.id === id);
  return httpInterface ? httpInterface.name : '';
};

// 获取 HTTP 接口方法的 CSS 类
const getMethodClass = (id: string) => {
  const method = getHttpInterfaceMethod(id);
  return methodClass(method);
};

// 移除 HTTP 接口
const removeHttpInterface = (id: string) => {
  const index = selectedHttpIds.value.indexOf(id);
  if (index !== -1) {
    selectedHttpIds.value.splice(index, 1);
  }
};

// 切换全选/取消全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // 取消选择所有已筛选的接口
    filteredInterfaces.value.forEach(item => {
      const index = selectedHttpIds.value.indexOf(item.id);
      if (index !== -1) {
        selectedHttpIds.value.splice(index, 1);
      }
    });
  } else {
    // 选择所有已筛选的接口
    filteredInterfaces.value.forEach(item => {
      if (!selectedHttpIds.value.includes(item.id)) {
        selectedHttpIds.value.push(item.id);
      }
    });
  }
};

// 加载 MCP 服务器数据
const loadMCPServer = async () => {
  try {
    loading.value = true;
    const response = await $api.mcpServers.getById(route.params.id as string);
    originalServer.value = response.data;
    
    // 填充表单数据
    serverData.name = originalServer.value.name;
    serverData.description = originalServer.value.description || '';
    
    // 加载 HTTP 接口
    await loadHttpInterfaces();
    
  } catch (error) {
    console.error('加载 MCP 服务器失败:', error);
    alert('加载 MCP 服务器失败');
    router.push('/mcp-servers');
  } finally {
    loading.value = false;
  }
};

// 加载 HTTP 接口
const loadHttpInterfaces = async () => {
  try {
    loadingInterfaces.value = true;
    // 获取所有 HTTP 接口
    const response = await $api.httpInterfaces.getAll();
    httpInterfaces.value = response.data;
    
    // 加载当前服务器使用的 HTTP 接口
    const httpInterfacesResponse = await $api.mcpServers.getHttpInterfaces(route.params.id as string);
    const serverInterfaces = httpInterfacesResponse.data;
    
    // 设置已选 HTTP 接口 ID
    selectedHttpIds.value = serverInterfaces.map((item: any) => item.id);
  } catch (error) {
    console.error('加载 HTTP 接口失败:', error);
  } finally {
    loadingInterfaces.value = false;
  }
};

// 监听选中的 HTTP IDs 变化
watch(selectedHttpIds, (newValue) => {
  serverData.httpIds = [...newValue];
});

// 更新 MCP 服务器
const updateServer = async () => {
  // 校验
  if (!serverData.name) {
    alert('请输入服务器名称');
    return;
  }
  
  if (selectedHttpIds.value.length === 0) {
    alert('请至少选择一个 HTTP 接口');
    return;
  }
  
  try {
    updating.value = true;
    
    // 获取选中的 HTTP 接口
    const selectedInterfaces = httpInterfaces.value.filter(item => selectedHttpIds.value.includes(item.id));
    
    // 创建工具列表
    const tools = selectedInterfaces.map(item => ({
      name: item.name,
      description: item.description || '',
      requestTemplate: {
        method: item.method,
        url: item.path,
        headers: {}
      },
      responseTemplate: {
        body: ''
      }
    }));
    
    // 创建允许的工具列表
    const allowTools = tools.map(tool => tool.name);
    
    // 创建更新对象
    const updateData = {
      ...originalServer.value,
      name: serverData.name,
      description: serverData.description,
      tools: tools,
      allowTools: allowTools
    };
    
    // 发送更新请求
    await $api.mcpServers.update(route.params.id as string, updateData);
    
    // 导航到详情页
    router.push(`/mcp-servers/${route.params.id}`);
  } catch (error: any) {
    console.error('更新 MCP 服务器失败:', error);
    alert(`更新 MCP 服务器失败: ${error.response?.data?.error || error.message || '未知错误'}`);
  } finally {
    updating.value = false;
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadMCPServer();
});
</script> 