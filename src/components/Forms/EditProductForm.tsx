// En: src/components/forms/EditProductForm.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import type { ProductoDto } from '../../services/productService.types';
import { CategoryService, type CategoriaDto } from '../../services/categoryService';
import './Form.css';

interface EditProductFormProps {
  product: ProductoDto;
  onSave: (updatedProduct: Partial<ProductoDto>) => void;
  onCancel: () => void;
}

export const EditProductForm: React.FC<EditProductFormProps> = ({ product, onSave, onCancel }) => {
  // CORRECCIÓN 1: El precio ahora se maneja como string en el estado del formulario
  // para permitir la entrada de decimales.
  const [formData, setFormData] = useState({
    nombre: product.nombre ?? '',
    descripcion: product.descripcion ?? '',
    precio: String(product.precio ?? 0),
    imagenUrl: product.imagenUrl ?? '',
    categoriaId: product.categoriaId ?? 0,
  });

  const [categories, setCategories] = useState<CategoriaDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryService = CategoryService.getInstance();
      const fetchedCategories = await categoryService.listarCategorias();
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  // Sincroniza el formulario si el producto cambia
  useEffect(() => {
    setFormData({
      nombre: product.nombre ?? '',
      descripcion: product.descripcion ?? '',
      precio: String(product.precio ?? 0), // También se actualiza como string
      imagenUrl: product.imagenUrl ?? '',
      categoriaId: product.categoriaId ?? 0,
    });
  }, [product]);

  // CORRECCIÓN 2: La función ahora es más simple y maneja correctamente los tipos.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'categoriaId') {
      // El ID de categoría sigue siendo un número entero.
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0,
      }));
    } else {
      // El resto de los campos, incluido el precio, se actualizan como texto.
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // CORRECCIÓN 3: Al guardar, el precio (que es un string) se convierte a número decimal.
    const dataToSave = {
        ...formData,
        precio: parseFloat(formData.precio) || 0
    };

    onSave({ id: product.id, ...dataToSave });
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Producto</label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
      </div>
      
      <div className="form-group">
        <label htmlFor="categoriaId">Categoría</label>
        <select
          id="categoriaId"
          name="categoriaId"
          value={formData.categoriaId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Seleccione una categoría...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nombre}
            </option>
          ))}
        </select>
      </div>
      
       <div className="form-group">
        <label htmlFor="descripcion">Descripción</label>
        <textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} required />
      </div>
       <div className="form-group">
        <label htmlFor="precio">Precio</label>
        <input type="number" id="precio" name="precio" value={formData.precio} onChange={handleChange} step="0.01" required />
      </div>
       <div className="form-group">
        <label htmlFor="imagenUrl">URL de la Imagen</label>
        <input type="text" id="imagenUrl" name="imagenUrl" value={formData.imagenUrl} onChange={handleChange} />
      </div>

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
