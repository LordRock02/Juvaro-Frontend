import React, { useState, useEffect, useCallback } from 'react';
import { DepartmentService, type DepartamentoDto } from '../../services/departmentService';
import { StockService } from '../../services/stockService';
import type { ProductoDto } from '../../services/productService.types';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './StorePage.css';

const PRODUCTS_PER_PAGE = 24;

const StorePage: React.FC = () => {
    const [products, setProducts] = useState<ProductoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [departments, setDepartments] = useState<DepartamentoDto[]>([]);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(() => localStorage.getItem('selectedDepartment') || '');
    const [currentPage, setCurrentPage] = useState(1);

    const { currentUser } = useAuth();
    const { cartItems, addToCart, updateQuantity } = useCart();
    const departmentService = DepartmentService.getInstance();
    const stockService = StockService.getInstance();

    useEffect(() => {
        const loadDepartments = async () => {
            setLoading(true);
            try {
                const allDepartments = await departmentService.listarDepartamentos();
                setDepartments(allDepartments);
                const savedDeptId = localStorage.getItem('selectedDepartment');
                const isValidSavedId = savedDeptId && allDepartments.some(d => d.id.toString() === savedDeptId);
                
                if (isValidSavedId) {
                    setSelectedDepartmentId(savedDeptId);
                } else if (allDepartments.length > 0) {
                    setSelectedDepartmentId(allDepartments[0].id.toString());
                }
            } catch (err) {
                setError('No se pudieron cargar las tiendas.');
            } finally {
                setLoading(false);
            }
        };
        loadDepartments();
    }, [departmentService]);

    useEffect(() => {
        const fetchProductsFromStock = async () => {
            if (selectedDepartmentId) {
                setLoading(true);
                setError(null);
                try {
                    const allStock = await stockService.listarStocks();
                    const filteredStock = allStock.filter(
                        stock => stock.departamentoId === parseInt(selectedDepartmentId) && stock.cantidad > 0
                    );
                    const productsInStock = filteredStock
                        .map(s => s.producto)
                        .filter((p): p is ProductoDto => p !== undefined);
                    setProducts(productsInStock);
                } catch (err) {
                    setError('No se pudo cargar el stock de la tienda.');
                } finally {
                    setLoading(false);
                }
            } else {
                setProducts([]);
            }
        };
        fetchProductsFromStock();
    }, [selectedDepartmentId, stockService]);

    useEffect(() => {
        if (selectedDepartmentId) {
            localStorage.setItem('selectedDepartment', selectedDepartmentId);
        }
    }, [selectedDepartmentId]);
    
    // --- CORRECCIÓN: Lógica de paginación añadida ---
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="store-container">
            <div className="page-header">
                <h1 className="page-title">Nuestra Tienda</h1>
                <div className="styled-selector-wrapper">
                    <label htmlFor="department-selector" className="styled-selector-label">Ver productos en:</label>
                    <select
                        id="department-selector"
                        value={selectedDepartmentId}
                        onChange={(e) => setSelectedDepartmentId(e.target.value)}
                        className="styled-selector"
                        disabled={loading && departments.length === 0}
                    >
                        {departments.length === 0 && <option>Cargando tiendas...</option>}
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.nombre}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? <p>Cargando productos...</p> : 
             error ? <p className="error-message">{error}</p> :
             currentProducts.length > 0 ? (
                <div className="products-grid">
                    {currentProducts.map(product => {
                        const itemInCart = cartItems.find(item => item.id === product.id);
                        return (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                currentUser={currentUser}
                                cartQuantity={itemInCart?.quantity}
                                callbacks={{
                                    onAddToCart: () => addToCart(product, parseInt(selectedDepartmentId)),
                                    onQuantityChange: (newQuantity) => updateQuantity(product.id, newQuantity),
                                }}
                            />
                        );
                    })}
                </div>
            ) : (
                <p>{selectedDepartmentId ? "No hay productos en esta tienda." : "Por favor, selecciona una tienda para empezar."}</p>
            )}

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
    );
};

export default StorePage;