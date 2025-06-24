// En: src/components/forms/CreateProductForm.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import type { ProductoDto } from '../../services/productService.types';
import { CategoryService, type CategoriaDto } from '../../services/categoryService';
import './Form.css';

interface CreateProductFormProps {
  onSave: (newProductData: Omit<ProductoDto, 'id'>) => void;
  onCancel: () => void;
}

// CORRECCIÓN 1: El precio se inicializa como un string
const initialState = {
  nombre: '',
  descripcion: '',
  precio: '0',
  imagenUrl: '',
  categoriaId: 0,
};

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialState);
  const [categories, setCategories] = useState<CategoriaDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryService = CategoryService.getInstance();
      const fetchedCategories = await categoryService.listarCategorias();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setFormData(prev => ({ ...prev, categoriaId: fetchedCategories[0].id }));
      }
    };

    fetchCategories();
  }, []);

  // CORRECCIÓN 2: La función ahora maneja el precio como texto y el ID como número
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'categoriaId') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.categoriaId === 0) {
        alert("Por favor, seleccione una categoría.");
        return;
    }
    setIsLoading(true);

    // CORRECCIÓN 3: Se convierte el precio a número decimal antes de guardar
    const dataToSave = {
        ...formData,
        precio: parseFloat(formData.precio) || 0
    };

    onSave(dataToSave);
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
          <option value={0} disabled>-- Seleccione una categoría --</option>
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
          {isLoading ? 'Creando...' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
};
