import axios from 'axios';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl as string;
  
  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // HTTP Interface API
  const httpInterfaces = {
    getAll: () => api.get('/api/http-interfaces'),
    getById: (id: string) => api.get(`/api/http-interfaces/${id}`),
    create: (data: any) => api.post('/api/http-interfaces', data),
    update: (id: string, data: any) => api.put(`/api/http-interfaces/${id}`, data),
    delete: (id: string) => api.delete(`/api/http-interfaces/${id}`),
    getVersions: (id: string) => api.get(`/api/http-interfaces/${id}/versions`),
    getVersion: (id: string, version: number) => api.get(`/api/http-interfaces/${id}/versions/${version}`),
    exportOpenAPI: (id: string) => api.get(`/api/http-interfaces/${id}/openapi`),
    createFromCurl: (data: any) => api.post('/api/http-interfaces/from-curl', data),
    createFromOpenAPI: (data: any) => api.post('/api/http-interfaces/from-openapi', data),
    uploadOpenAPI: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return axios.post(`${baseURL}/api/http-interfaces/from-openapi-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    }
  };
  
  // MCP Server API
  const mcpServers = {
    getAll: () => api.get('/api/mcp-servers'),
    getById: (id: string) => api.get(`/api/mcp-servers/${id}`),
    create: (data: any) => api.post('/api/mcp-servers', data),
    update: (id: string, data: any) => api.put(`/api/mcp-servers/${id}`, data),
    delete: (id: string) => api.delete(`/api/mcp-servers/${id}`),
    getVersions: (id: string) => api.get(`/api/mcp-servers/${id}/versions`),
    getVersion: (id: string, version: number) => api.get(`/api/mcp-servers/${id}/versions/${version}`),
    compile: (id: string) => api.post(`/api/mcp-servers/${id}/compile`),
    activate: (id: string) => api.post(`/api/mcp-servers/${id}/activate`),
    invokeTool: (id: string, tool: string, data: any) => api.post(
      `/api/mcp-servers/${id}/tools/${tool}`, 
      data,
      { 
        timeout: 30000,  // Longer timeout for tool execution
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ),
    // Add file upload function for WASM
    uploadWasm: (id: string, file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return axios.post(`${baseURL}/api/mcp-servers/${id}/upload-wasm`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    // Add function to list uploaded WASM files
    getWasmFiles: (id: string) => api.get(`/api/mcp-servers/${id}/wasm-files`)
  };

  // WASM File Management API
  const wasmFiles = {
    getAll: () => api.get('/api/wasm-files'),
    getById: (id: string) => api.get(`/api/wasm-files/${id}`),
    delete: (id: string) => api.delete(`/api/wasm-files/${id}`),
    download: (id: string) => {
      // Return URL for direct download
      return `${baseURL}/api/wasm-files/${id}/download`;
    }
  };
  
  return {
    httpInterfaces,
    mcpServers,
    wasmFiles
  };
}; 