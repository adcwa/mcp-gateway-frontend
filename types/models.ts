/**
 * Type definitions for MCP Gateway
 */

// HTTP Interface types
export interface HttpInterface {
  id?: string;
  name: string;
  path: string;
  method: string;
  description?: string;
  headers?: Header[];
  params?: Param[];
  body?: Body;
  response?: Response;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Header {
  name: string;
  description?: string;
  required: boolean;
  type: string;
}

export interface Param {
  name: string;
  description?: string;
  required: boolean;
  type: string;
  in: string;
}

export interface Body {
  description?: string;
  required: boolean;
  type: string;
  schema?: Record<string, any>;
}

export interface Response {
  description?: string;
  type: string;
  schema?: Record<string, any>;
}

// MCP Server types
export interface MCPServer {
  id: string;
  name: string;
  description?: string;
  status: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  tools?: Tool[];
  httpInterfaces?: HttpInterface[];
}

export interface Tool {
  name: string;
  description: string;
  requestTemplate: string;
  responseTemplate: string;
}

export interface Version {
  version: string;
  updatedAt: string;
}

// API Response type
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

// Toast types
export interface ToastOptions {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
}

// Create from curl & OpenAPI params
export interface CreateFromCurlParams {
  curl: string;
  name: string;
  description?: string;
}

export interface CreateFromOpenAPIParams {
  spec: any;
  path?: string;
  method?: string;
} 