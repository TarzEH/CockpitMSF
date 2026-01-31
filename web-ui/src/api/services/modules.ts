import { restClient } from '../restClient';
import { rpcClient } from '../rpcClient';
import { Module } from '../../types';

export const modulesService = {
  async search(query: string, type?: string): Promise<Module[]> {
    const params: Record<string, any> = { q: query };
    if (type) {
      params.type = type;
    }
    const queryParams = new URLSearchParams(params);
    const response = await restClient.get<{ data: Module[] }>(`/modules?${queryParams.toString()}`);
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async getExploits(): Promise<string[]> {
    try {
      const response = await rpcClient.moduleExploits();
      console.log('Exploits response:', response);
      // RPC returns { modules: [...] } directly
      const modules = response?.modules || [];
      console.log(`Loaded ${modules.length} exploits`);
      return Array.isArray(modules) ? modules : [];
    } catch (error) {
      console.error('Error fetching exploits:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      return [];
    }
  },

  async getPayloads(moduleInfo?: string, arch?: string): Promise<string[] | Record<string, any>> {
    try {
      const response = await rpcClient.modulePayloads(moduleInfo, arch);
      const modules = response?.modules || [];
      return Array.isArray(modules) ? modules : [];
    } catch (error) {
      console.error('Error fetching payloads:', error);
      return [];
    }
  },

  async getAuxiliary(): Promise<string[]> {
    try {
      const response = await rpcClient.moduleAuxiliary();
      const modules = response?.modules || [];
      return Array.isArray(modules) ? modules : [];
    } catch (error) {
      console.error('Error fetching auxiliary:', error);
      return [];
    }
  },

  async getPost(): Promise<string[]> {
    try {
      const response = await rpcClient.modulePost();
      const modules = response?.modules || [];
      return Array.isArray(modules) ? modules : [];
    } catch (error) {
      console.error('Error fetching post modules:', error);
      return [];
    }
  },

  async getInfo(type: string, moduleName: string): Promise<any> {
    return rpcClient.moduleInfo(type, moduleName);
  },

  async execute(type: string, moduleName: string, opts: Record<string, any>): Promise<any> {
    return rpcClient.moduleExecute(type, moduleName, opts);
  },
};
