import { ApiClientService } from '../api/ApiClientService';
import type { UsuarioDto, RegistrarUsuarioRequest, UpdateUsuarioRequest } from './userService.types';

export class UserService {
    private static instance: UserService;
    private apiClient: ApiClientService;

    private constructor() {
        this.apiClient = ApiClientService.getInstance();
    }

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }


    public async registrarUsuario(request: RegistrarUsuarioRequest): Promise<UsuarioDto> {
        try {
            const response = await this.apiClient.axiosInstance.post<UsuarioDto>('/usuarios/registrar', request);
            return response.data;
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    }


    public async actualizarUsuario(request: UpdateUsuarioRequest): Promise<UsuarioDto> {
        try {
            const response = await this.apiClient.axiosInstance.put<UsuarioDto>('/usuarios/actualizar', request);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar usuario ${request.id}:`, error);
            throw error;
        }
    }


    public async listarUsuarios(): Promise<UsuarioDto[]> {
        try {
            const response = await this.apiClient.axiosInstance.get<UsuarioDto[]>('/usuarios/listar');
            return response.data;
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            throw error;
        }
    }


    public async obtenerUsuarioPorId(id: number): Promise<UsuarioDto> {
        try {
            const response = await this.apiClient.axiosInstance.get<UsuarioDto>(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener usuario ${id}:`, error);
            throw error;
        }
    }

    public async eliminarUsuario(id: number): Promise<any> { // El endpoint de Spring retorna <?>
        try {
            const response = await this.apiClient.axiosInstance.delete(`/usuarios/eliminar/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar usuario ${id}:`, error);
            throw error;
        }
    }
}