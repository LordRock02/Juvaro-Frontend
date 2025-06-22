import { ApiClientService } from '../api/ApiClientService'; 

import type { 
    LoginCredentials, 
    AuthResponse, 
    RegisterCredentials, 
    UserData 
} from './authService.types'; 

// --- FUNCIÓN DE LOGIN ---
export const iniciarSesionUsuario = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    console.log("Enviando credenciales de login:", credentials);
    try {
        const apiService = ApiClientService.getInstance();
        const response = await apiService.axiosInstance.post<AuthResponse>('/auth/login', {
            email: credentials.email,
            password: credentials.password
        });
        console.log("Respuesta de login recibida:", response.data);
        return response.data;
    } catch (error: any) {
        console.error('Error en el servicio de inicio de sesión:', error.response?.data || error.message);
        throw error;
    }
};

export const registrarUsuario = async (credentials: RegisterCredentials): Promise<UserData> => {
    console.log("Enviando datos de registro al backend:", credentials);
    try {
        const apiService = ApiClientService.getInstance();

        const requestBody = {
            ...credentials,
            fechaRegistro: new Date().toISOString().split('T')[0] // Formato "yyyy-MM-dd"
        };
        
        const response = await apiService.axiosInstance.post<UserData>('/auth/register', requestBody);

        console.log("Respuesta de registro recibida:", response.data);
        return response.data;

    } catch (error: any) {
        console.error('Error en el servicio de registro:', error.response?.data || error.message);
        throw error;
    }
};
