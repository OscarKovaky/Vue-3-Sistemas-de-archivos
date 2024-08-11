// src/plugins/dispatchClient.ts

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import notification from '../store/notification';
import { ApiResponse, FilesDto, RegisterUserDto, TreeNodeDto, UserDto } from './types';

export default class DispatchClient {
  
  private client: AxiosInstance;

  constructor(baseUrl: string, token: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },

      validateStatus: () => true,
    });
  }

  public init(baseUrl: string, token: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
   
      },
      validateStatus: () => true,
    });
  }



  private async handleResponse<T>(promise: Promise<AxiosResponse<T>>): Promise<ApiResponse<T>> {
    try {
      const resp = await promise;
      return this.toApiResponse(resp);
    } catch (error) {
      notification.show((error as any).message || 'Unknown error', 'error');
      console.error('Error:', error);
      throw error;
    }
  }

  private toApiResponse<T>(resp: AxiosResponse<T>): ApiResponse<T> {
    if (resp.status >= 500) {
      throw new Error(resp.statusText);
    } else if (resp.status >= 400) {
      const msg = (resp.data as any)?.message || resp.data || resp.statusText;
      throw new Error(msg);
    }

    return {
      status: resp.status,
      message: resp.statusText,
      response: resp.data,
      success: resp.status < 400,
    };
  }

  public async getDataURL(fileId: string): Promise<ApiResponse<string>> {
    return this.get<string>(`File/${fileId}/dataurl`);
  }

  public async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.handleResponse(this.client.get<T>(url));
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.handleResponse(this.client.delete<T>(url));
  }

  public async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.post<T>(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }

  public async updateFile(file: File, id: string): Promise<ApiResponse<FilesDto>> {
    const fd = new FormData();
    fd.append('file', file, file.name);

    return this.handleResponse(
      this.client.put(`File/${id}`, fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  public async uploadFile(file: File): Promise<ApiResponse<FilesDto>> {
    const fd = new FormData();
    fd.append('file', file, file.name);

    return this.handleResponse(
      this.client.post('File', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  public async postFile<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.post<T>(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  public async putFile<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.put<T>(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  public async getFile(url: string): Promise<Blob> {
    const response = await this.client.get(url, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: 'blob', // Asegúrate de manejar la respuesta como blob
    });
  
    return response.data; // Devuelve el archivo como un Blob
  }

  public async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.put<T>(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }

  public async patch<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.patch<T>(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  }
  public async getUsers() {
    return await this.get<UserDto[]>("Auth");
  }

  public async addUser(country: RegisterUserDto) {
    return await this.post<RegisterUserDto>("Auth/register", country);
  }

  public async updateUser(country: UserDto) {
    return await this.put<UserDto>("Auth", country);
  }

  public async deleteUser(id: number) {
    return await this.delete<UserDto>(`Auth/${id}`);
  }

  public async getUserNodes(userId: number) {
    return await this.get<TreeNodeDto[]>(`Tree/${userId}`);
  }

  public async createNode(node: TreeNodeDto) {
    return await this.post<number>('Tree', node);
  }

  public async deleteNode(id: number) {
    return await this.delete<void>(`Tree/single/${id}`);
  }

  public async deleteNodeWithChildren(id: number) {
    return await this.delete<void>(`Tree/cascade/${id}`);
  }



}



export const client = new DispatchClient("", "");