import axios from 'axios';
import { useRuntimeConfig } from '#app/nuxt';

export function useApi() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl || '';
  
  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  
  // Add request interceptor for logging
  api.interceptors.request.use(
    (config) => {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor for logging
  api.interceptors.response.use(
    (response) => {
      console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error('API Response Error:', error.response || error);
      return Promise.reject(error);
    }
  );
  
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
    register: (id: string) => api.post(`/api/mcp-servers/${id}/register`),
    activate: (id: string) => api.post(`/api/mcp-servers/${id}/activate`),
    deactivate: (id: string) => api.post(`/api/mcp-servers/${id}/deactivate`),
    getHttpInterfaces: (id: string) => api.get(`/api/mcp-servers/${id}/http-interfaces`),
    validateName: (data: any) => api.post(`/api/mcp-servers/validate-name`, data),
    getMetadata: (id: string) => api.get(`/api/mcp-servers/${id}/metadata`),
    getUsageGuide: (id: string) => api.get(`/api/mcp-servers/${id}/usage-guide`),
    getClientExamples: (id: string) => api.get(`/api/mcp-servers/${id}/client-examples`),
    invokeTool: (id: string, toolName: string, params: any) => {
      console.log(`Invoking MCP tool: ${toolName} on server: ${id}`);
      console.log('Tool parameters:', params);
      
      return api.post(`/api/mcp-servers/${id}/tools/${toolName}`, params)
        .then(response => {
          console.log(`Tool invocation successful: ${toolName}`);
          console.log('Tool response:', response.data);
          return response;
        })
        .catch(error => {
          console.error(`Tool invocation failed: ${toolName}`);
          console.error('Error details:', error.response?.data || error.message);
          throw error;
        });
    }
  };
  
  return {
    httpInterfaces,
    mcpServers
  };
} 