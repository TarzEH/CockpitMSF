import { restClient } from '../restClient';
import { Loot } from '../../types';

export const lootService = {
  async list(params?: Record<string, any>): Promise<Loot[]> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }
    const query = queryParams.toString();
    const url = query ? `/loots?${query}` : '/loots';
    const response = await restClient.get<{ data: Loot[] }>(url);
    return Array.isArray(response.data) ? response.data : [response.data];
  },

  async get(id: number): Promise<Loot> {
    const response = await restClient.get<{ data: Loot }>(`/loots/${id}`);
    return response.data;
  },
};
