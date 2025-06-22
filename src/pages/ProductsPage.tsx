// En: src/pages/ProductsPage.tsx

import React from 'react';
// CAMBIO CLAVE: Usamos una importación NOMBRADA con llaves {}
import { ProductCard } from '../components/ProductCard/ProductCard'; 
import type { ProductoDto } from '../services/productService.types';
import './ProductsPage.css';

// Datos de ejemplo con la estructura correcta del DTO
const mockProducts: ProductoDto[] = [
  {
    id: 1,
    categoriaId: 1,
    nombre: 'producto',
    descripcion: 'Descripcion del producto',
    precio: 11115,
    imageUrl: 'https://static.vecteezy.com/system/resources/previews/005/551/044/non_2x/water-plastic-bottle-cartoon-illustration-isolated-object-vector.jpg'
  },
  {
    id: 2,
    categoriaId: 1,
    nombre: 'producto',
    descripcion: 'Descripcion del producto',
    precio: 11115,
    imageUrl: 'https://static.vecteezy.com/system/resources/previews/005/551/044/non_2x/water-plastic-bottle-cartoon-illustration-isolated-object-vector.jpg'
  },
  {
    id: 3,
    categoriaId: 1,
    nombre: 'producto',
    descripcion: 'Descripcion del producto',
    precio: 11115,
    imageUrl: 'https://static.vecteezy.com/system/resources/previews/005/551/044/non_2x/water-plastic-bottle-cartoon-illustration-isolated-object-vector.jpg'
  },
  {
    id: 4,
    categoriaId: 1,
    nombre: 'producto',
    descripcion: 'Descripcion del producto',
    precio: 11115,
    imageUrl: 'https://static.vecteezy.com/system/resources/previews/005/551/044/non_2x/water-plastic-bottle-cartoon-illustration-isolated-object-vector.jpg'
  },
];

const ProductsPage = () => {
  return (
    <div className="products-container">
      <h1 className="products-title">Nuestros Productos</h1>
      <div className="products-grid">
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
