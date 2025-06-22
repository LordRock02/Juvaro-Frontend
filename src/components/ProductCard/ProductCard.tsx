import React from 'react';
import type { ProductoDto } from '../../services/productService.types'; 
import './ProductCard.css';

interface ProductCardProps {
  product: ProductoDto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.imageUrl || `https://placehold.co/400x400/f35588/FFFFFF?text=${encodeURIComponent(product.nombre)}`;

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
        <button className="integra-serv-primary-btn">
          Agregar
        </button>
      </div>
    </div>
  );
};