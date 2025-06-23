
import type { ICommand } from './interfaces/ICommand';
import { ProductService } from '../../services/productService';


export class DeleteProductCommand implements ICommand {
    private receiver: ProductService;
    private productId: number;

    constructor(receiver: ProductService, productId: number) {
        this.receiver = receiver;
        this.productId = productId;
    }


    public async execute(): Promise<void> {
        console.log(`Command: Ejecutando eliminación para el producto ${this.productId}`);
        try {
            await this.receiver.eliminarProducto(this.productId);
            console.log(`Command: Producto ${this.productId} eliminado exitosamente.`);
        } catch (error) {
            console.error(`Command: Falló la ejecución de eliminación para el producto ${this.productId}`, error);
        }
    }
}