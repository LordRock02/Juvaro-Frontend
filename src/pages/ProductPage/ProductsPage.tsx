import React, { useState, useEffect, useCallback } from 'react';
import { ProductService } from '../../services/productService';
import type { ProductoDto } from '../../services/productService.types';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/Modal/Modal';
import { EditProductForm } from '../../components/Forms/EditProductForm';
import { CreateProductForm } from '../../components/Forms/CreateProductForm';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import './ProductsPage.css';

import { UpdateProductCommand } from '../../core/command/UpdateProductCommand';
import { CreateProductCommand } from '../../core/command/CreateProductCommand';
import { DeleteProductCommand } from '../../core/command/DeleteProductCommand';

// --- MODIFICADO: Ahora se muestran 24 productos por página ---
const PRODUCTS_PER_PAGE = 30;

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<ProductoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para la paginación
    const [currentPage, setCurrentPage] = useState(1);

    // Estados para los modales
    const [productToEdit, setProductToEdit] = useState<ProductoDto | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductoDto | null>(null);

    const { currentUser } = useAuth();
    const productService = ProductService.getInstance();

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setProducts(await productService.listarProductos());
        } catch (err) {
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, [productService]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleCreateProduct = async (newProductData: Omit<ProductoDto, 'id'>) => {
        const command = new CreateProductCommand(productService, newProductData);
        await command.execute();
        setIsCreateModalOpen(false);
        fetchProducts();
    };

    const handleSaveProduct = async (updatedProductData: Partial<ProductoDto>) => {
        if (!updatedProductData.id) return;
        const command = new UpdateProductCommand(productService, updatedProductData.id, updatedProductData);
        await command.execute();
        setProductToEdit(null);
        fetchProducts();
    };

    const requestDeleteProduct = (product: ProductoDto) => {
        setProductToDelete(product);
    };

    const confirmDeleteProduct = async () => {
        if (!productToDelete) return;
        const command = new DeleteProductCommand(productService, productToDelete.id);
        try {
            await command.execute();
            fetchProducts();
        } catch (error) {
            alert("No se pudo eliminar el producto.");
        } finally {
            setProductToDelete(null);
        }
    };
    
    // Lógica de Paginación
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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
                    {currentProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            currentUser={currentUser}
                            callbacks={{
                                onEdit: () => setProductToEdit(product),
                                onDelete: () => requestDeleteProduct(product),
                                onAddToCart: () => console.log('Add to cart'),
                            }}
                        />
                    ))}
                </div>

                {/* Controles de Paginación */}
                {totalPages > 1 && (
                    <div className="pagination-container">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="pagination-btn"
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button 
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="pagination-btn"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>

            {/* Modales (sin cambios) */}
            <Modal isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} title={`Editar: ${productToEdit?.nombre || ''}`}>
                {productToEdit && <EditProductForm product={productToEdit} onSave={handleSaveProduct} onCancel={() => setProductToEdit(null)} />}
            </Modal>
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nuevo Producto">
                <CreateProductForm onSave={handleCreateProduct} onCancel={() => setIsCreateModalOpen(false)} />
            </Modal>
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
