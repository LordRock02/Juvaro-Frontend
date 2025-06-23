
import React, { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../services/productService';
import type { ProductoDto } from '../services/productService.types';
import { ProductCard } from '../components/ProductCard/ProductCard';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal/Modal';
import { EditProductForm } from '../components/Forms/EditProductForm';
import { CreateProductForm } from '../components/Forms/CreateProductForm';
// 1. Importamos nuestro nuevo componente de modal de confirmación
import { ConfirmModal } from '../components/ConfirmModal/ConfirmModal';
import './ProductsPage.css';

import { UpdateProductCommand } from '../core/command/UpdateProductCommand';
import { CreateProductCommand } from '../core/command/CreateProductCommand';
import { DeleteProductCommand } from '../core/command/DeleteProductCommand';

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<ProductoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para los modales
    const [productToEdit, setProductToEdit] = useState<ProductoDto | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // --- 2. Nuevo estado para gestionar el modal de eliminación ---
    const [productToDelete, setProductToDelete] = useState<ProductoDto | null>(null);

    const { currentUser } = useAuth();
    const productService = ProductService.getInstance();

    const fetchProducts = useCallback(async () => {
        try { setLoading(true); setProducts(await productService.listarProductos()); } 
        catch (err) { setError('No se pudieron cargar los productos.'); } 
        finally { setLoading(false); }
    }, [productService]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // Lógica para el modal de CREACIÓN (sin cambios)
    const handleCreateProduct = async (newProductData: Omit<ProductoDto, 'id'>) => {
        const command = new CreateProductCommand(productService, newProductData);
        await command.execute();
        setIsCreateModalOpen(false);
        fetchProducts();
    };

    // Lógica para el modal de EDICIÓN (sin cambios)
    const handleSaveProduct = async (updatedProductData: Partial<ProductoDto>) => {
        if (!updatedProductData.id) return;
        const command = new UpdateProductCommand(productService, updatedProductData.id, updatedProductData);
        await command.execute();
        setProductToEdit(null);
        fetchProducts();
    };
    
    // --- 3. Lógica de eliminación refactorizada ---

    // Esta función solo abre el modal de confirmación, guardando el producto a eliminar.
    const requestDeleteProduct = (product: ProductoDto) => {
        setProductToDelete(product);
    };

    // Esta es la función que realmente ejecuta la eliminación, y se la pasamos al modal.
    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;

        const command = new DeleteProductCommand(productService, productToDelete.id);
        try {
            await command.execute();
            fetchProducts(); // Refresca la lista
        } catch (error) {
            alert("No se pudo eliminar el producto.");
        } finally {
            setProductToDelete(null); // Cierra el modal de confirmación
        }
    };

    if (loading) return <div className="products-container"><h2>Cargando...</h2></div>;
    if (error) return <div className="products-container"><h2>{error}</h2></div>;

    return (
        <>
            <div className="products-container">
                <div className="page-header">
                    <h1 className="products-title">Nuestros Productos</h1>
                    {currentUser?.rol === 'ROLE_ADMIN' && (
                        <button 
                            className="integra-serv-primary-btn" 
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Crear Producto
                        </button>
                    )}
                </div>
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            currentUser={currentUser}
                            callbacks={{
                                onEdit: () => setProductToEdit(product),
                                // 4. El botón 'onDelete' de la tarjeta ahora llama a requestDelete
                                onDelete: () => requestDeleteProduct(product),
                                onAddToCart: () => console.log('Add to cart'),
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Modal para EDITAR producto */}
            <Modal isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} title={`Editar: ${productToEdit?.nombre || ''}`}>
                {productToEdit && <EditProductForm product={productToEdit} onSave={handleSaveProduct} onCancel={() => setProductToEdit(null)} />}
            </Modal>

            {/* Modal para CREAR producto */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nuevo Producto">
                <CreateProductForm onSave={handleCreateProduct} onCancel={() => setIsCreateModalOpen(false)} />
            </Modal>
            
            {/* --- 5. Renderizamos el nuevo Modal de Confirmación --- */}
            <ConfirmModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDeleteProduct}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar "${productToDelete?.nombre}"? Esta acción no se puede deshacer.`}
            />
        </>
    );
};

export default ProductsPage;