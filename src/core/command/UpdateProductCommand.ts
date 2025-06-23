import type { ICommand } from "./interfaces/ICommand";
import { ProductService } from "../../services/productService";

interface UpdateProductPayload {
    nombre?: string;
    descripcion?: string;
    precio?: number;
}

export class UpdateProductCommand implements ICommand{
    private receiver: ProductService;
    private productId: number;
    private payload: UpdateProductPayload;

    constructor(receiver: ProductService, productId:number, payload: UpdateProductPayload){
        this.receiver = receiver;
        this.productId = productId;
        this.payload = payload;
    }

    
    public async execute(): Promise<void> {
        console.log(`Command: Ejecutando actualización para el producto ${this.productId}`);
        try {
            await this.receiver.actualizarProducto(this.productId, this.payload);
            console.log(`Command: Producto ${this.productId} actualizado exitosamente.`);
            // Aquí se podría mostrar una notificación de éxito.
        } catch (error) {
            console.error(`Command: Falló la ejecución de actualización para el producto ${this.productId}`, error);
            // Aquí se podría mostrar una notificación de error.
        }
    }

}