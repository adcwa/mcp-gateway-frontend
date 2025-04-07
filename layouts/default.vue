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
              <NuxtLink to="/router" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium" :class="{ 'text-primary-500': $route.path.startsWith('/router') }">
                Router
              </NuxtLink>
            </nav>
          </div>
          <div class="flex items-center">
            <a href="https://github.com/higress-group/mcp-gateway" target="_blank" class="text-gray-700 hover:text-primary-500 px-3 py-2 text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
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