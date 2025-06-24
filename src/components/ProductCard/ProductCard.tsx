import React from 'react';
import type { ProductoDto } from '../../services/productService.types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ProductCard.css';

export interface ActionCallbacks {
  onAddToCart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  // --- NUEVO: Callback unificado para cambiar la cantidad ---
  onQuantityChange?: (newQuantity: number) => void;
}

interface ProductCardProps {
  product: ProductoDto;
  currentUser: any | null;
  callbacks: ActionCallbacks;
  isStockView?: boolean;
  stockQuantity?: number;
  onStockIncrement?: () => void;
  onStockDecrement?: () => void;
  // --- NUEVO: Prop para saber la cantidad en el carrito ---
  cartQuantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  currentUser, 
  callbacks, 
  isStockView = false,
  stockQuantity,
  onStockIncrement,
  onStockDecrement,
  cartQuantity
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
          ) : cartQuantity && cartQuantity > 0 ? (
             // --- NUEVO: Vista para cuando el producto está en el carrito ---
             <div className="stock-control">
                {/* Botón de eliminar (pone la cantidad a 0) */}
                <button 
                  className="stock-action-btn stock-decrement-btn" 
                  onClick={() => callbacks.onQuantityChange?.(cartQuantity - 1)}
                >
                  <FontAwesomeIcon icon={cartQuantity === 1 ? faTrash : faMinus} />
                </button>
                <span className="stock-quantity">{cartQuantity}</span>
                <button 
                  className="stock-action-btn stock-increment-btn" 
                  onClick={() => callbacks.onQuantityChange?.(cartQuantity + 1)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
          ) : (
             // --- Vista por defecto para el usuario ---
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
