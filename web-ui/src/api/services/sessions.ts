import { restClient } from '../restClient';
import { Session } from '../../types';

export const sessionsService = {
  async list(params?: Record<string, any>): Promise<Session[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      const query = queryParams.toString();
      const url = query ? `/sessions?${query}` : '/sessions';
      const response = await restClient.get<{ data: Session[] | Session }>(url);
      
      // Handle both array and single object responses
      if (!response || !response.data) {
        return [];
      }
      
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If it's a single object, wrap it in an array
      return [response.data];
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  },

  async get(id: number): Promise<Session> {
    const response = await restClient.get<{ data: Session }>(`/sessions/${id}`);
    return response.data;
  },

  async create(sessionData: Partial<Session>): Promise<Session> {
    const response = await restClient.post<{ data: Session }>('/sessions', sessionData);
    return response.data;
  },

  async update(id: number, sessionData: Partial<Session>): Promise<Session> {
    const response = await restClient.put<{ data: Session }>(`/sessions/${id}`, sessionData);
    return response.data;
  },
};
