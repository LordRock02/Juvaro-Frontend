import { ApiClientService } from '../api/ApiClientService';
import type { ProductoDto } from './productService.types';


interface UpdateProductoRequest {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    // ...otros campos que se puedan actualizar
}

const ENDPOINT = '/productos';

export class ProductService {
    private static instance: ProductService;
    private apiClient: ApiClientService;

    private constructor() {
        this.apiClient = ApiClientService.getInstance();
    }

    public static getInstance(): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }

    // --- Métodos que serán llamados por los Comandos ---

    public async listarProductos(): Promise<ProductoDto[]> {
        try {
            const response = await this.apiClient.axiosInstance.get<ProductoDto[]>(ENDPOINT);
            return response.data;
        } catch (error) {
            console.error('Error al listar productos:', error);
            throw error;
        }
    }
    
    public async actualizarProducto(id: number, request: UpdateProductoRequest): Promise<ProductoDto> {
        console.log(`ProductService: Actualizando producto ${id} con datos:`, request);
        try {
            const response = await this.apiClient.axiosInstance.put<ProductoDto>(`/productos/${id}`, request);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar producto ${id}:`, error);
            throw error;
        }
    }

    public async eliminarProducto(id: number): Promise<void> {
        console.log(`ProductService: Eliminando producto ${id}`);
        try {
            await this.apiClient.axiosInstance.delete(`/productos/${id}`);
        } catch (error) {
            console.error(`Error al eliminar producto ${id}:`, error);
            throw error;
        }
    }
}