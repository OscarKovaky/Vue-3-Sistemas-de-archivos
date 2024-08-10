
import axios, { AxiosInstance, AxiosResponse } from "axios";
import notification from "../store/notification";

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  response: T;
}

export interface FilesDto {
  id?: string;
  name: string;
  type: string;
  data: string;
}


export default class DispatchClient {
  private client!: AxiosInstance;


  constructor(baseUrl: string, token: string, unionId: string) {
    this.init(baseUrl, token, unionId);
  }

  public init(baseUrl: string, token: string, unionId: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Union-Id": unionId,
      },
      validateStatus: () => true,
    });
  }

  private async handleResponse<T>(
    promise: Promise<AxiosResponse<T>>
  ): Promise<ApiResponse<T>> {
    try {
      const resp = await promise;
      return this.toApiResponse(resp);
    } catch (error) {
      notification.show((error as any), "error");
      console.error("Error:", error);
      throw error;
    }
  }

  private toApiResponse<T>(resp: AxiosResponse<T>): ApiResponse<T> {
    if (resp.status >= 500) {
      throw new Error(resp.statusText);
    } else if (resp.status >= 400) {
      let msg: string =
        (resp.data as any)?.message || resp.data || resp.statusText;
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
          "Content-Type": "application/json",
        },
      })
    );
  }

  public async updateFile(
    file: File,
    id: string
  ): Promise<ApiResponse<FilesDto>> {
    const fd = new FormData();
    fd.append("file", file, file.name);

    return this.handleResponse(
      this.client.put(`File/${id}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  public async uploadFile(file: File): Promise<ApiResponse<FilesDto>> {
    const fd = new FormData();
    fd.append("file", file, file.name);

    return this.handleResponse(
      this.client.post("File", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  public async postFile<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.post(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  public async putFile<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.put(url, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
  }

  public async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.put<T>(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  }

  public async patch<T>(url: string, data: any): Promise<ApiResponse<T>> {
    return this.handleResponse(
      this.client.patch<T>(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  }
}

export const client = new DispatchClient("", "", "");
