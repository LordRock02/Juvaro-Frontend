import React from 'react';
import type { ProductoDto } from '../../services/productService.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './ProductCard.css';

export interface ActionCallbacks {
  onAddToCart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface ProductCardProps {
  product: ProductoDto;
  currentUser: any | null;
  callbacks: ActionCallbacks;
  isStockView?: boolean;
  stockQuantity?: number;
  onStockIncrement?: () => void;
  onStockDecrement?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  currentUser, 
  callbacks, 
  isStockView = false,
  stockQuantity,
  onStockIncrement,
  onStockDecrement
}) => {
  const imageUrl = product.imagenUrl || `https://placehold.co/400x400/f35588/FFFFFF?text=${encodeURIComponent(product.nombre)}`;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={imageUrl} 
          alt={`Imagen de ${product.nombre}`} 
          className="product-image"
        />
      </div>
      <div className="product-info-card">
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-description">{product.descripcion}</p>
        <p className="product-price">{formatPrice(product.precio)}</p>
        
        <div className="product-actions">
          {isStockView ? (
            <div className="stock-control">
              <button className="stock-action-btn stock-decrement-btn" onClick={onStockDecrement}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              {/* --- MODIFICADO: Ahora solo muestra el número --- */}
              <span className="stock-quantity">{stockQuantity}</span>
              <button className="stock-action-btn stock-increment-btn" onClick={onStockIncrement}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          ) : currentUser?.rol === 'ROLE_ADMIN' ? (
            <>
              <button className="edit-btn" onClick={callbacks.onEdit}>
                Editar
              </button>
              <button className="delete-btn" onClick={callbacks.onDelete}>
                Eliminar
              </button>
            </>
          ) : (
            <button 
              className="integra-serv-primary-btn" 
              onClick={callbacks.onAddToCart}
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
