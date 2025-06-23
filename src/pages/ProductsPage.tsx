// En: src/pages/ProductsPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../services/productService';
import type { ProductoDto } from '../services/productService.types';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { useAuth } from '../context/AuthContext';
import './ProductsPage.css';

// 1. Importamos los componentes que usaremos directamente
import { Modal } from '../components/Modal/Modal';
import { EditProductForm } from '../components/Forms/EditProductForm';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<ProductoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- 2. Estado para controlar el modal ---
    // Guardamos qué producto está seleccionado para editar. Si es 'null', el modal está cerrado.
    const [productToEdit, setProductToEdit] = useState<ProductoDto | null>(null);

    const { currentUser } = useAuth();
    const productService = ProductService.getInstance();

    const fetchProducts = useCallback(async () => {
        try { setLoading(true); setProducts(await productService.listarProductos()); } 
        catch (err) { setError('No se pudieron cargar los productos.'); } 
        finally { setLoading(false); }
    }, [productService]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // --- 3. Lógica para manejar el modal ---

    // Abre el modal guardando el producto seleccionado en el estado
    const handleEditClick = (product: ProductoDto) => {
        setProductToEdit(product);
    };

    // Cierra el modal simplemente poniendo el producto a editar en 'null'
    const handleCloseModal = () => {
        setProductToEdit(null);
    };

    // Lógica para cuando el formulario guarda los cambios
    const handleSaveProduct = (updatedProduct: Partial<ProductoDto>) => {
        console.log("Guardando cambios para el producto:", updatedProduct);
        // Aquí iría la lógica futura para llamar al comando o servicio de actualización
        // await productService.actualizarProducto(updatedProduct.id, updatedProduct);
        
        // Después de guardar, cerramos el modal y refrescamos la lista para ver los cambios
        handleCloseModal();
        fetchProducts();
    };
    
    const handleDeleteProduct = (productId: number) => {
        console.log(`ACCIÓN: Eliminar el producto ${productId}`);
        // Aquí iría la lógica del comando DeleteProduct
    };

    const handleAddToCart = (productId: number) => {
        console.log(`ACCIÓN: Añadir al carrito el producto ${productId}`);
    };

    if (loading) return <div className="products-container"><h2>Cargando...</h2></div>;
    if (error) return <div className="products-container"><h2>{error}</h2></div>;

    return (
        // Usamos un Fragment (<>) para que el modal no esté dentro del contenedor principal
        <>
            <div className="products-container">
                <h1 className="products-title">Nuestros Productos</h1>
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            currentUser={currentUser}
                            callbacks={{
                                onEdit: () => handleEditClick(product),
                                onDelete: () => handleDeleteProduct(product.id),
                                onAddToCart: () => handleAddToCart(product.id),
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* --- 4. Renderizado directo del Modal --- */}
            {/* El modal se muestra solo si hay un 'productToEdit' */}
            <Modal 
                isOpen={!!productToEdit} 
                onClose={handleCloseModal} 
                title={`Editar: ${productToEdit?.nombre || ''}`}
            >
                {/* Renderizamos directamente el EditProductForm si hay un producto seleccionado.
                  Esto es composición de componentes en su forma más pura.
                */}
                {productToEdit && (
                    <EditProductForm 
                        product={productToEdit}
                        onSave={handleSaveProduct}
                        onCancel={handleCloseModal}
                    />
                )}
            </Modal>
        </>
    );
};

export default ProductsPage;
