<template>
  <div>
    <PageHeader
      title="MCP Servers"
      description="Manage your MCP servers"
    >
      <template #actions>
        <AppButton @click="navigateToCreate">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Server
        </AppButton>
      </template>
    </PageHeader>
    
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin h-10 w-10 rounded-full border-t-2 border-b-2 border-primary-500"></div>
    </div>
    
    <div v-else-if="servers.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-800">No MCP servers found</h3>
      <p class="mt-1 text-gray-500">Get started by creating your first MCP server</p>
      <div class="mt-6">
        <AppButton @click="navigateToCreate">Create Server</AppButton>
      </div>
    </div>
    
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AppCard v-for="server in servers" :key="server.id" hover>
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">{{ server.name }}</h3>
            <p class="text-sm text-gray-500 mt-1">{{ server.description || 'No description' }}</p>
          </div>
          <div class="flex items-center space-x-1">
            <span :class="statusClass(server.status)" class="text-xs font-medium px-2.5 py-0.5 rounded-full">
              {{ server.status }}
            </span>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <span class="text-sm text-gray-700">{{ server.tools.length }} tools</span>
          </div>
          
          <div class="flex flex-wrap gap-1 mt-2">
            <span v-for="tool in server.tools.slice(0, 3)" :key="tool.name" class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              {{ tool.name }}
            </span>
            <span v-if="server.tools.length > 3" class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
              +{{ server.tools.length - 3 }} more
            </span>
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-between">
            <NuxtLink :to="`/mcp-servers/${server.id}`" class="text-sm text-primary-500 hover:text-primary-600 flex items-center">
              View details
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            
            <div class="flex space-x-2">
              <button v-if="server.status !== 'active'" @click="activateServer(server.id)" class="text-gray-500 hover:text-green-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button @click="openDeleteConfirm(server)" class="text-gray-500 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </template>
      </AppCard>
    </div>
    
    <!-- 删除确认对话框 -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="删除MCP服务器"
      :message="`您确定要删除 '${serverToDelete?.name || ''}' 服务器吗？此操作无法撤销。`"
      confirm-text="删除"
      type="danger"
      @confirm="deleteServer(serverToDelete?.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from '~/utils/toast';
import ConfirmDialog from '~/components/ConfirmDialog.vue';

const router = useRouter();
const { $api } = useNuxtApp();

const servers = ref<any[]>([]);
const loading = ref(true);
const showDeleteConfirm = ref(false);
const serverToDelete = ref<any>(null);

// Status color mapping
const statusClass = (status: string) => {
  const classes = {
    draft: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  };
  
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

// Navigation
const navigateToCreate = () => {
  router.push('/mcp-servers/create');
};

// Activate server
async function activateServer(id: string) {
  try {
    const serverIndex = servers.value.findIndex(s => s.id === id);
    if (serverIndex !== -1) {
      servers.value[serverIndex].activating = true;
    }
    
    await $api.mcpServers.activate(id);
    
    // Update server status in the list
    if (serverIndex !== -1) {
      servers.value[serverIndex].status = 'active';
      servers.value[serverIndex].activating = false;
    }
    
    toast.success('激活成功', 'MCP服务器已成功激活');
  } catch (error: any) {
    console.error('Failed to activate server:', error);
    toast.error('激活失败', '服务器激活失败');
    
    // Reset activating state
    const serverIndex = servers.value.findIndex(s => s.id === id);
    if (serverIndex !== -1) {
      servers.value[serverIndex].activating = false;
    }
  }
}

// 打开删除确认对话框
function openDeleteConfirm(server: any) {
  serverToDelete.value = server;
  showDeleteConfirm.value = true;
}

// Delete server
async function deleteServer(id?: string) {
  if (!id) return;
  
  try {
    await $api.mcpServers.delete(id);
    
    // Remove from list
    servers.value = servers.value.filter(s => s.id !== id);
    toast.success('删除成功', 'MCP服务器已成功删除');
  } catch (error: any) {
    console.error('Failed to delete server:', error);
    toast.error('删除失败', '无法删除MCP服务器');
  }
}

// Fetch MCP servers
onMounted(async () => {
  try {
    const response = await $api.mcpServers.getAll();
    servers.value = response.data;
  } catch (error) {
    console.error('Failed to fetch MCP servers:', error);
  } finally {
    loading.value = false;
  }
});
</script> 