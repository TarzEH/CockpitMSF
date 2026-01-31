import { restClient } from '../restClient';
import { Credential } from '../../types';

export const credentialsService = {
  async list(params?: Record<string, any>): Promise<Credential[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const url = query ? `/credentials?${query}` : '/credentials';
    const response = await restClient.get<{ data: Credential[] }>(url);
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async get(id: number): Promise<Credential> {
    const response = await restClient.get<{ data: Credential }>(`/credentials/${id}`);
    return response.data;
  },

  async create(credentialData: Partial<Credential>): Promise<Credential> {
    const response = await restClient.post<{ data: Credential }>('/credentials', credentialData);
    return response.data;
  },

  async update(id: number, credentialData: Partial<Credential>): Promise<Credential> {
    const response = await restClient.put<{ data: Credential }>(`/credentials/${id}`, credentialData);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await restClient.delete(`/credentials/${id}`);
  },
};
