import { ApiClientService } from '../api/ApiClientService';

interface ProductoDto {
    id: number;
    nombre: string;
    descripcion: string;
    imagenUrl: string | null;
    precio: number;
}

export interface StockDto {
    id: number;
    cantidad: number;
    productoId: number;
    departamentoId: number;
    producto?: ProductoDto; 
}

export interface RegistrarStockRequest {
    productoId: number;
    departamentoId: number;
    cantidad: number;
}

export interface UpdateStockRequest {
    cantidad: number;
}

export class StockService {
    private static instance: StockService;
    private apiClient: ApiClientService;

    private constructor() {
        this.apiClient = ApiClientService.getInstance();
    }

    public static getInstance(): StockService {
        if (!StockService.instance) {
            StockService.instance = new StockService();
        }
        return StockService.instance;
    }


    public async listarStocks(): Promise<StockDto[]> {
        try {
            const response = await this.apiClient.axiosInstance.get<StockDto[]>('/stocks');
            return response.data;
        } catch (error) {
            console.error('Error al listar el stock:', error);
            return [];
        }
    }

    public async buscarStockPorId(id: number): Promise<StockDto> {
        const response = await this.apiClient.axiosInstance.get<StockDto>(`/stocks/${id}`);
        return response.data;
    }


    public async buscarStockPorProductoYDepartamento(productoId: number, departamentoId: number): Promise<StockDto> {
        const response = await this.apiClient.axiosInstance.get<StockDto>('/stocks/buscar', {
            params: { productoId, departamentoId }
        });
        return response.data;
    }

    public async registrarStock(request: RegistrarStockRequest): Promise<StockDto> {
        const response = await this.apiClient.axiosInstance.post<StockDto>('/stocks/registrar', request);
        return response.data;
    }


    public async actualizarStock(id: number, request: UpdateStockRequest): Promise<StockDto> {
        const response = await this.apiClient.axiosInstance.put<StockDto>(`/stocks/${id}`, request);
        return response.data;
    }


    public async eliminarStock(id: number): Promise<void> {
        await this.apiClient.axiosInstance.delete(`/stocks/${id}`);
    }
}
