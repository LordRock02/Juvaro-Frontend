// En: src/components/Forms/AddStockForm.tsx

import React, { useState, type FormEvent } from 'react';
import type { ProductoDto } from '../../services/productService.types';
import './Form.css'; // Reutilizamos los mismos estilos

interface AddStockFormProps {
  // Lista de productos que aún no están en el stock de este departamento
  availableProducts: ProductoDto[];
  onSave: (data: { productId: string; cantidad: number }) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const AddStockForm: React.FC<AddStockFormProps> = ({ 
  availableProducts, 
  onSave, 
  onCancel,
  isSaving = false
}) => {
  const [formData, setFormData] = useState({
    productId: '',
    cantidad: 1,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.productId) {
      alert("Por favor, seleccione un producto.");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="product-select">Producto:</label>
        <select
          id="product-select"
          className="styled-selector" // Reutilizamos el estilo del selector
          value={formData.productId}
          onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
          required
        >
          <option value="" disabled>Seleccione un producto...</option>
          {availableProducts.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="quantity-input">Cantidad Inicial:</label>
        <input
          id="quantity-input"
          type="number"
          min="1"
          value={formData.cantidad}
          onChange={(e) => setFormData(prev => ({ ...prev, cantidad: parseInt(e.target.value, 10) || 1 }))}
          className="stock-input"
          required
        />
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </button>
        <button type="submit" className="integra-serv-primary-btn" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};
