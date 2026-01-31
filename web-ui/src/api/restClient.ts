import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class RestClient {
  private client: AxiosInstance;
  private apiToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
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
          // Handle unauthorized - clear token and redirect to login
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
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  clearApiToken() {
    this.apiToken = null;
    localStorage.removeItem('msf_api_token');
    delete this.client.defaults.headers.common['Authorization'];
  }

  getApiToken(): string | null {
    return this.apiToken;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const restClient = new RestClient();
