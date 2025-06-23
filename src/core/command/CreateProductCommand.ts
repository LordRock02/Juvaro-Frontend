// En: src/core/command/CreateProductCommand.ts

import type { ICommand } from './interfaces/ICommand';
import { ProductService } from '../../services/productService';
import type { ProductoDto } from '../../services/productService.types';

// El payload son todos los campos de un producto excepto el ID
type CreateProductPayload = Omit<ProductoDto, 'id'>;

export class CreateProductCommand implements ICommand {
    private receiver: ProductService;
    private payload: CreateProductPayload;

    constructor(receiver: ProductService, payload: CreateProductPayload) {
        this.receiver = receiver;
        this.payload = payload;
    }

    public async execute(): Promise<void> {
        console.log(`Command: Ejecutando creación de producto...`);
        try {
            await this.receiver.registrarProducto(this.payload);
            console.log(`Command: Producto creado exitosamente.`);
        } catch (error) {
            console.error(`Command: Falló la ejecución de creación de producto`, error);
        }
    }
}

