import { restClient } from './restClient';
import { rpcClient } from './rpcClient';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  error?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    try {
      const response = await restClient.post<AuthResponse>('/auth/login', credentials);
      if (response.token) {
        restClient.setApiToken(response.token);
        rpcClient.setApiToken(response.token);
        return response.token;
      }
      throw new Error(response.error || 'Login failed');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  setApiToken(token: string): void {
    restClient.setApiToken(token);
    rpcClient.setApiToken(token);
  },

  clearApiToken(): void {
    restClient.clearApiToken();
    rpcClient.clearApiToken();
  },

  async logout(): Promise<void> {
    restClient.clearApiToken();
    rpcClient.clearApiToken();
  },

  isAuthenticated(): boolean {
    // Allow access without token (like CLI) - auth is optional
    // If auth is required, API calls will fail and show errors
    return true;
  },

  getToken(): string | null {
    return restClient.getApiToken();
  },
};

