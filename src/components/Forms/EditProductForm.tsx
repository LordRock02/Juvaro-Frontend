import React, { useState, useEffect, type FormEvent } from 'react';
import type { ProductoDto } from '../../services/productService.types';
import './Form.css'; // Usaremos una hoja de estilos compartida para los formularios

// 1. Definimos las Props que recibirá el formulario
interface EditProductFormProps {
  product: ProductoDto;
  onSave: (updatedProduct: Partial<ProductoDto>) => void; // Función para llamar al guardar
  onCancel: () => void; // Función para llamar al cancelar
}

export const EditProductForm: React.FC<EditProductFormProps> = ({ product, onSave, onCancel }) => {
  // 2. Estado interno para los campos del formulario. Se inicializa con los datos del producto.
  const [formData, setFormData] = useState({
    nombre: product.nombre,
    descripcion: product.descripcion,
    precio: product.precio,
    categoriaId: product.categoriaId
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sincroniza el estado del formulario si el producto a editar cambia
  useEffect(() => {
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoriaId: product.categoriaId
    });
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulamos un guardado y llamamos al callback con los datos actualizados
    console.log("Guardando cambios del producto:", formData);
    onSave({ id: product.id, ...formData });
    // Normalmente, la lógica de 'isLoading' sería más compleja con llamadas a API
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Producto</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="precio">Precio</label>
        <input
          type="number"
          id="precio"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>
      {/* 3. Botones de acción del formulario */}
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </button>
        <button type="submit" className="integra-serv-primary-btn" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  );
};