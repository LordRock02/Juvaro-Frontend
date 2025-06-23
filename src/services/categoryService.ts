import { ApiClientService } from '../api/ApiClientService';

// 1. Definimos la interfaz para el DTO de Categoría
export interface CategoriaDto {
  id: number;
  nombre: string;
  descripcion: string;
}

/**
 * Fachada para las operaciones relacionadas con las categorías.
 */
export class CategoryService {
    private static instance: CategoryService;
    private apiClient: ApiClientService;

    private constructor() {
        this.apiClient = ApiClientService.getInstance();
    }

    public static getInstance(): CategoryService {
        if (!CategoryService.instance) {
            CategoryService.instance = new CategoryService();
        }
        return CategoryService.instance;
    }

    /**
     * Obtiene la lista completa de categorías desde el backend.
     * @returns Una Promesa que se resuelve con un array de categorías.
     */
    public async listarCategorias(): Promise<CategoriaDto[]> {
        try {
            const response = await this.apiClient.axiosInstance.get<CategoriaDto[]>('/categorias');
            return response.data;
        } catch (error) {
            console.error('Error al listar categorías:', error);
            // Devolvemos un array vacío en caso de error para que la UI no se rompa.
            return []; 
        }
    }
}