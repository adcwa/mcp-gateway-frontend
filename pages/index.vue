<template>
  <div>
    <PageHeader
      title="Dashboard"
      description="Welcome to MCP Gateway Management"
    />
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AppCard title="HTTP Interfaces" hover>
        <div class="flex items-center justify-between">
          <div class="text-4xl font-bold text-primary-500">{{ httpInterfaces.length }}</div>
          <div class="p-3 bg-primary-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-500">Configured HTTP interfaces</p>
        <template #footer>
          <NuxtLink to="/http-interfaces" class="text-sm text-primary-500 hover:text-primary-600 flex items-center">
            View all interfaces
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </template>
      </AppCard>
      
      <AppCard title="MCP Servers" hover>
        <div class="flex items-center justify-between">
          <div class="text-4xl font-bold text-primary-500">{{ mcpServers.length }}</div>
          <div class="p-3 bg-primary-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
        </div>
        <p class="mt-2 text-sm text-gray-500">Managed MCP servers</p>
        <template #footer>
          <NuxtLink to="/mcp-servers" class="text-sm text-primary-500 hover:text-primary-600 flex items-center">
            View all servers
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
        </template>
      </AppCard>
      
      <AppCard title="Quick Actions" hover>
        <div class="space-y-3">
          <NuxtLink to="/http-interfaces/create" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="p-2 bg-primary-100 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div class="font-medium">Create HTTP Interface</div>
              <div class="text-xs text-gray-500">Add a new HTTP endpoint</div>
            </div>
          </NuxtLink>
          
          <NuxtLink to="/mcp-servers/create" class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div class="p-2 bg-primary-100 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div class="font-medium">Create MCP Server</div>
              <div class="text-xs text-gray-500">Configure a new MCP server</div>
            </div>
          </NuxtLink>
        </div>
      </AppCard>
    </div>
    
    <!-- Recent Activity -->
    <div class="mt-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <AppCard>
        <div v-if="recentActivity.length" class="divide-y divide-gray-100">
          <div v-for="(activity, index) in recentActivity" :key="index" class="py-3 first:pt-0 last:pb-0">
            <div class="flex items-center">
              <div class="p-2 rounded-full" :class="activityTypeClasses[activity.type]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="activityIconClasses[activity.type]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="activity.type === 'created'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  <path v-else-if="activity.type === 'updated'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium">{{ activity.message }}</div>
                <div class="text-xs text-gray-500">{{ formatDate(activity.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-4 text-gray-500">
          No recent activity
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp();

const httpInterfaces = ref<any[]>([]);
const mcpServers = ref<any[]>([]);
const recentActivity = ref<any[]>([]);

// Activity styling
const activityTypeClasses = {
  created: 'bg-green-100',
  updated: 'bg-blue-100',
  deployed: 'bg-purple-100'
};

const activityIconClasses = {
  created: 'text-green-600',
  updated: 'text-blue-600',
  deployed: 'text-purple-600'
};

// Format date helper
const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

// Fetch data
onMounted(async () => {
  try {
    const [httpResponse, mcpResponse] = await Promise.all([
      $api.httpInterfaces.getAll(),
      $api.mcpServers.getAll()
    ]);
    
    httpInterfaces.value = httpResponse.data;
    mcpServers.value = mcpResponse.data;
    
    // Mock recent activity (replace with real data if available)
    recentActivity.value = [
      {
        type: 'created',
        message: 'Created new HTTP interface "User API"',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
      },
      {
        type: 'updated',
        message: 'Updated MCP Server "User Server" configuration',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
      },
      {
        type: 'deployed',
        message: 'Deployed MCP Server "Auth Server" to production',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
      }
    ];
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
});
</script> 