export interface ProductoDto {
  id: number;
  categoriaId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string; 
}
export interface UpdateProducto{
  categoriaId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
}