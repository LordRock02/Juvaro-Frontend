import { ApiClientService } from '../api/ApiClientService';


export interface DetalleVentaDto {
  id: number;
  productoId: number;
  nombreProducto: string;
  departamentoId: number;
  nombreDepartamento: string;
  cantidad: number;
  precioUnitario: number;
}

export interface VentaDto {
  id: number;
  usuarioId: number;
  nombreUsuario: string;
  fecha: string; 
  valorTotal: number;
  detalles: DetalleVentaDto[];
}

export interface ItemVentaRequest {
  productoId: number;
  departamentoId: number;
  cantidad: number;
}

export interface RegistrarVentaRequest {
  usuarioId: number;
  items: ItemVentaRequest[];
}

export class VentaService {
    private static instance: VentaService;
    private apiClient: ApiClientService;

    private constructor() {
        this.apiClient = ApiClientService.getInstance();
    }

    public static getInstance(): VentaService {
        if (!VentaService.instance) {
            VentaService.instance = new VentaService();
        }
        return VentaService.instance;
    }

    public async registrarVenta(request: RegistrarVentaRequest): Promise<VentaDto> {
        const response = await this.apiClient.axiosInstance.post<VentaDto>('/ventas/registrar', request);
        return response.data;
    }

    public async listarTodasLasVentas(): Promise<VentaDto[]> {
        try {
            const response = await this.apiClient.axiosInstance.get<VentaDto[]>('/ventas');
            return response.data;
        } catch (error) {
            console.error('Error al listar las ventas:', error);
            return [];
        }
    }

        public async listarVentasUsuario(usuarioId: number): Promise<VentaDto[]> {
        try {
            const response = await this.apiClient.axiosInstance.get<VentaDto[]>(`/ventas/buscarVentaUsuario/${usuarioId}`);
            return response.data;
        } catch (error) {
            console.error('Error al listar las ventas:', error);
            return [];
        }
    }

    public async obtenerVentaPorId(id: number): Promise<VentaDto> {
        const response = await this.apiClient.axiosInstance.get<VentaDto>(`/ventas/${id}`);
        return response.data;
    }

}
