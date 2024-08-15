// src/models/Nodo.ts

export interface TreeNodeDto {
    id?: number;                     // Id del nodo
    name: string;                   // Nombre del nodo
    isFile: boolean;                // Indica si el nodo es un archivo o no
    path: string;                   // Ruta del nodo
    parentId?: number;
    userId?: number;                // Id del nodo padre, puede ser undefined si es un nodo raíz
    children: TreeNodeDto[];        // Lista de nodos hijos, inicializada como un arreglo vacío
  }
  // src/models/Usuario.t

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

  export interface UserDto {
    id?: number;        // Identificador único del usuario
    username: string; // Nombre de usuario
    email: string;    // Correo electrónico del usuario
    role: string;     // Rol del usuario
}

export interface VForm {
    validate: () => boolean;
    reset: () => void;
  }


  // Define the RegisterUserDto type
export interface RegisterUserDto  {
  username: string;
  password: string;
  email: string;
  role: string;
};
