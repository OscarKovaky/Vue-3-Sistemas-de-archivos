// src/plugins/dispatchClient.ts

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
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

        // Configurar interceptores
        this.client.interceptors.response.use(
          this.handleSuccess,
          this.handleError
        );
  }

  public init(baseUrl: string, apiKey: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        'X-Api-Key': apiKey,
      },
      validateStatus: () => true,
    });

    // Configurar interceptores
    this.client.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
  }


  private handleSuccess<T>(response: AxiosResponse<T>): AxiosResponse<T> {
    return response;
  }

  private async handleError(error: AxiosError): Promise<any> {
    const { response } = error;

    if (response) {
        const problemDetails = response.data as any;

        // Mostrar el detalle del problema en lugar del objeto completo
        const errorMessage = problemDetails.detail || problemDetails.title || 'An error occurred';

        notification.show(errorMessage, 'error');

        // Loguear un mensaje de error más detallado
        console.error('Error Details:', JSON.stringify(problemDetails, null, 2));
    } else {
        // Manejar errores que no tienen respuesta (por ejemplo, problemas de red)
        notification.show(error.message || 'Network error', 'error');
        console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }

  private async handleResponse<T>(promise: Promise<AxiosResponse<T>>): Promise<ApiResponse<T>> {
    try {
      const resp = await promise;
      return this.toApiResponse(resp);
    } catch (error) {
      throw error;
    }
  }

  private toApiResponse<T>(resp: AxiosResponse<T>): ApiResponse<T> {
    if (resp.status >= 500) {
      throw new Error(resp.statusText);
    } else if (resp.status >= 400) {
        const msg = (resp.data as any)?.message || JSON.stringify(resp.data) || resp.statusText;
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

  public async addUser(user: RegisterUserDto) {
    return await this.post<RegisterUserDto>("Auth/register", user);
  }

  public async updateUser(user: UserDto) {
    return await this.put<UserDto>("Auth/update-username", user);
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