export interface LoginCredentials {
  email: string;
  password: string; 
}

export interface AuthResponse {
    token: string;
    nombre: string;
    usuario: UserData;
}

export interface RegisterCredentials {
    fullname: string;
    password: string;
    email: string;
    cedula: number;
    rol: number;
}

export interface UserData {
    id: number;
    nombre: string;
    cedula: number;
    email: string;
    rol: string;
}
