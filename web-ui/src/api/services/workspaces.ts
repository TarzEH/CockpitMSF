import { restClient } from '../restClient';
import { Workspace } from '../../types';

export const workspacesService = {
  async list(): Promise<Workspace[]> {
    const response = await restClient.get<{ data: Workspace[] }>('/workspaces');
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async get(id: number): Promise<Workspace> {
    const response = await restClient.get<{ data: Workspace }>(`/workspaces/${id}`);
    return response.data;
  },

  async create(name: string): Promise<Workspace> {
    const response = await restClient.post<{ data: Workspace }>('/workspaces', { name });
    return response.data;
  },

  async update(id: number, name: string): Promise<Workspace> {
    const response = await restClient.put<{ data: Workspace }>(`/workspaces/${id}`, { name });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await restClient.delete(`/workspaces/${id}`);
  },
};
