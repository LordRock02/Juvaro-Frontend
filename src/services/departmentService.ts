import { ApiClientService } from '../api/ApiClientService';

// 1. Definimos todos los tipos necesarios
export interface DepartamentoDto {
  id: number;
  nombre: string;
  // Añade otros campos si los tienes, como 'descripcion'
}

// Basado en tu imagen, el DTO de registro y actualización solo necesita el nombre.
interface DepartmentRequest {
  nombre: string;
}

/**
 * Fachada y Receptor para las operaciones de Departamentos.
 */
export class DepartmentService {
    private static instance: DepartmentService;
    private apiClient: ApiClientService;

    private constructor() {
        this.apiClient = ApiClientService.getInstance();
    }

    public static getInstance(): DepartmentService {
        if (!DepartmentService.instance) {
            DepartmentService.instance = new DepartmentService();
        }
        return DepartmentService.instance;
    }

    public async listarDepartamentos(): Promise<DepartamentoDto[]> {
        try {
            const response = await this.apiClient.axiosInstance.get<DepartamentoDto[]>('/departamentos');
            return response.data;
        } catch (error) {
            console.error('Error al listar departamentos:', error);
            return []; 
        }
    }

    // --- NUEVOS MÉTODOS CRUD ---

    public async registrarDepartamento(request: DepartmentRequest): Promise<DepartamentoDto> {
        // Usamos la ruta del backend '/categorias/registrar'
        const response = await this.apiClient.axiosInstance.post<DepartamentoDto>('/departamentos/registrar', request);
        return response.data;
    }

    public async actualizarDepartamento(id: number, request: DepartmentRequest): Promise<DepartamentoDto> {
        const response = await this.apiClient.axiosInstance.put<DepartamentoDto>(`/departamentos/${id}`, request);
        return response.data;
    }

    public async eliminarDepartamento(id: number): Promise<void> {
        await this.apiClient.axiosInstance.delete(`/departamentos/${id}`);
    }
}