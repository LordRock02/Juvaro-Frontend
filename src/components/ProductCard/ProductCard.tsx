import React from 'react';
import type { ProductoDto } from '../../services/productService.types';
// Ya no necesitamos las interfaces de Strategy// Podemos mantener este tipo para los callbacks
import './ProductCard.css';

// 1. Actualizamos las Props
// En lugar de una estrategia, ahora recibe directamente el objeto del usuario.
interface ProductCardProps {
  product: ProductoDto;
  currentUser: any | null;
  callbacks: ActionCallbacks;
}

export interface ActionCallbacks {
  onAddToCart?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, currentUser, callbacks }) => {
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
        
        {/* --- 2. Lógica de Renderizado Condicional --- */}
        <div className="product-actions">
          {currentUser?.rol === 'ROLE_ADMIN' ? (
            // Si es Admin, muestra los botones de Editar y Eliminar
            <>
              <button className="edit-btn" onClick={callbacks.onEdit}>
                  Editar
              </button>
              <button className="delete-btn" onClick={callbacks.onDelete}>
                  Eliminar
              </button>
            </>
          ) : (
            // Si no, muestra el botón de Agregar
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