export interface UsuarioDto {
    id: number;
    fullname: string;
    email: string;
    password?: string; // El password puede ser opcional en las respuestas
    cedula: string;
    fechaRegistro: string; // Las fechas se manejan como string en formato ISO
    rol: number;
}

export interface RegistrarUsuarioRequest {
    fullname: string;
    password: string;
    email: string;
    cedula: number;
    fechaRegistro: string;
    rol: number;
}

export interface UpdateUsuarioRequest {
    id: number;
    fullname?: string;
    password?: string;
    email?: string;
    cedula?: number;
    fechaRegistro?: string;
    rol?: number;
}