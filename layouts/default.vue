<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">MCP Gateway</span>
            </div>
            <nav class="ml-6 flex space-x-8 items-center">
              <NuxtLink to="/" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium" :class="{ 'text-primary-500': $route.path === '/' }">
                Dashboard
              </NuxtLink>
              <NuxtLink to="/http-interfaces" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium" :class="{ 'text-primary-500': $route.path.startsWith('/http-interfaces') }">
                HTTP Interfaces
              </NuxtLink>
              <NuxtLink to="/mcp-servers" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium" :class="{ 'text-primary-500': $route.path.startsWith('/mcp-servers') }">
                MCP Servers
              </NuxtLink>
              
            </nav>
          </div>
          <div class="flex items-center">
            
          </div>
        </div>
      </div>
    </header>

    <!-- Page Content -->
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center text-sm text-gray-500">
          <p>MCP Gateway Management Interface © {{ new Date().getFullYear() }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Layout setup
</script> 