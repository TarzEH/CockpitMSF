import { restClient } from '../restClient';
import { Host } from '../../types';

export const hostsService = {
  async list(params?: Record<string, any>): Promise<Host[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const url = query ? `/hosts?${query}` : '/hosts';
    const response = await restClient.get<{ data: Host[] }>(url);
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async get(id: number): Promise<Host> {
    const response = await restClient.get<{ data: Host }>(`/hosts/${id}`);
    return response.data;
  },

  async create(hostData: Partial<Host>): Promise<Host> {
    const response = await restClient.post<{ data: Host }>('/hosts', hostData);
    return response.data;
  },

  async update(id: number, hostData: Partial<Host>): Promise<Host> {
    const response = await restClient.put<{ data: Host }>(`/hosts/${id}`, hostData);
    return response.data;
  },
};
