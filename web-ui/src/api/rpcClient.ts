import axios, { AxiosInstance } from 'axios';
import { RpcRequest, RpcResponse } from '../types';

const RPC_BASE_URL = import.meta.env.VITE_RPC_BASE_URL || '/rpc';

class RpcClient {
  private client: AxiosInstance;
  private apiToken: string | null = null;
  private requestId: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: RPC_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    const token = localStorage.getItem('msf_api_token');
    if (token) {
      this.setApiToken(token);
    }

    // Request interceptor to add auth token (only if token is set)
    this.client.interceptors.request.use(
      (config) => {
        // Only add Authorization header if token is set
        // If no token, services will work without auth if auth_initialized is false
        if (this.apiToken) {
          config.headers.Authorization = `Bearer ${this.apiToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearApiToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setApiToken(token: string) {
    this.apiToken = token;
    localStorage.setItem('msf_api_token', token);
  }

  clearApiToken() {
    this.apiToken = null;
    localStorage.removeItem('msf_api_token');
  }

  private getNextId(): number {
    return ++this.requestId;
  }

  async call(method: string, params: any[] = []): Promise<any> {
    const request: RpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: this.getNextId(),
    };

    try {
      const response = await this.client.post<RpcResponse>('', request);
      const data = response.data;

      if (data.error) {
        throw new Error(data.error.message || 'RPC Error');
      }

      return data.result;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error.message);
      }
      throw error;
    }
  }

  // Convenience methods for common operations
  async consoleCreate(): Promise<{ id: number; prompt: string; busy: boolean }> {
    return this.call('console.create');
  }

  async consoleList(): Promise<{ consoles: Array<{ id: number; prompt: string; busy: boolean }> }> {
    return this.call('console.list');
  }

  async consoleRead(id: number): Promise<{ data: string; prompt: string; busy: boolean }> {
    return this.call('console.read', [id]);
  }

  async consoleWrite(id: number, data: string): Promise<{ wrote: number }> {
    return this.call('console.write', [id, data]);
  }

  async consoleDestroy(id: number): Promise<{ result: string }> {
    return this.call('console.destroy', [id]);
  }

  async moduleExploits(): Promise<{ modules: string[] }> {
    return this.call('module.exploits');
  }

  async modulePayloads(moduleInfo?: string, arch?: string): Promise<{ modules: string[] | Record<string, any> }> {
    return this.call('module.payloads', [moduleInfo, arch]);
  }

  async moduleAuxiliary(): Promise<{ modules: string[] }> {
    return this.call('module.auxiliary');
  }

  async modulePost(): Promise<{ modules: string[] }> {
    return this.call('module.post');
  }

  async moduleInfo(type: string, moduleName: string): Promise<any> {
    return this.call('module.info', [type, moduleName]);
  }

  async moduleExecute(type: string, moduleName: string, opts: Record<string, any>): Promise<any> {
    return this.call('module.execute', [type, moduleName, opts]);
  }

  async jobList(): Promise<{ jobs: any[] }> {
    return this.call('job.list');
  }

  async jobInfo(jobId: number): Promise<any> {
    return this.call('job.info', [jobId]);
  }

  async jobStop(jobId: number): Promise<{ result: string }> {
    return this.call('job.stop', [jobId]);
  }

  async coreVersion(): Promise<{ version: string; ruby: string; api: string }> {
    return this.call('core.version');
  }
}

export const rpcClient = new RpcClient();
