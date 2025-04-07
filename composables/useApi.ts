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
    createFromOpenAPI: (data: any) => api.post('/api/http-interfaces/from-openapi', data)
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
    invokeTool: (id: string, tool: string, data: any) => api.post(`/api/mcp-servers/${id}/tools/${tool}`, data)
  };
  
  return {
    httpInterfaces,
    mcpServers
  };
}; 