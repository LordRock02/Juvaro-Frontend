// En: src/components/forms/CreateProductForm.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import type { ProductoDto } from '../../services/productService.types';
// 1. Importamos el servicio y el tipo de Categoría
import { CategoryService, type CategoriaDto } from '../../services/categoryService';
import './Form.css'; // Reutilizamos los mismos estilos de formulario

// Definimos las Props que recibirá el formulario
interface CreateProductFormProps {
  onSave: (newProductData: Omit<ProductoDto, 'id'>) => void;
  onCancel: () => void;
}

// Estado inicial con los campos vacíos
const initialState = {
  nombre: '',
  descripcion: '',
  precio: 0,
  imagenUrl: '',
  categoriaId: 0, // Empezamos con 0 o un valor inválido para forzar la selección
};

export const CreateProductForm: React.FC<CreateProductFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialState);
  
  // 2. Nuevo estado para guardar la lista de categorías
  const [categories, setCategories] = useState<CategoriaDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 3. useEffect para cargar las categorías cuando el componente se monta
  useEffect(() => {
    const fetchCategories = async () => {
      const categoryService = CategoryService.getInstance();
      const fetchedCategories = await categoryService.listarCategorias();
      setCategories(fetchedCategories);
      // Opcional: Asigna la primera categoría como seleccionada por defecto
      if (fetchedCategories.length > 0) {
        setFormData(prev => ({ ...prev, categoriaId: fetchedCategories[0].id }));
      }
    };

    fetchCategories();
  }, []); // El array vacío asegura que se ejecute solo una vez

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' || name === 'categoriaId' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.categoriaId === 0) {
        alert("Por favor, seleccione una categoría.");
        return;
    }
    setIsLoading(true);
    onSave(formData);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* ... tus otros campos no cambian ... */}
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Producto</label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
      </div>

      {/* --- 4. Campo de Categoría ahora es un <select> --- */}
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
      
      {/* ... el resto de tus campos ... */}
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
