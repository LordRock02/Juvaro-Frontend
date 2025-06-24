import React, { useState, useEffect, useCallback } from 'react';
import { VentaService, type VentaDto, type DetalleVentaDto } from '../../services/ventaService';
import { ProductService } from '../../services/productService';
import type { ProductoDto } from '../../services/productService.types';
import { useAuth } from '../../context/AuthContext';
import './OrdersPage.css';

// Creamos un nuevo tipo que incluye la URL de la imagen en el detalle
interface EnrichedDetalleVentaDto extends DetalleVentaDto {
    imagenUrl?: string;
}

interface EnrichedVentaDto extends Omit<VentaDto, 'detalles'> {
    detalles: EnrichedDetalleVentaDto[];
}

const OrdersPage: React.FC = () => {
    // El estado ahora usará nuestro nuevo tipo de dato "enriquecido"
    const [orders, setOrders] = useState<EnrichedVentaDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const { currentUser } = useAuth();
    const ventaService = VentaService.getInstance();
    const productService = ProductService.getInstance();

    const fetchData = useCallback(async () => {
        if (!currentUser) {
            setError("Debes iniciar sesión para ver tus pedidos.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const [userOrders, allProducts] = await Promise.all([
                ventaService.listarVentasUsuario(currentUser.id),
                productService.listarProductos()
            ]);

            // --- LÓGICA DE UNIÓN DE DATOS ---
            // Creamos un mapa de productos para una búsqueda ultra rápida (ID -> Producto)
            const productsMap = new Map(allProducts.map(p => [p.id, p]));

            // "Enriquecemos" los datos de los pedidos añadiendo la URL de la imagen a cada detalle
            const enrichedOrders = userOrders.map(order => ({
                ...order,
                detalles: order.detalles.map(detalle => {
                    const product = productsMap.get(detalle.productoId);
                    return {
                        ...detalle,
                        imagenUrl: product?.imagenUrl // Añadimos la URL de la imagen aquí
                    };
                })
            }));

            const sortedOrders = enrichedOrders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            
            setOrders(sortedOrders);

        } catch (err) {
            console.error("Error al cargar los datos para la página de pedidos:", err);
            setError('No se pudieron cargar los datos. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    }, [currentUser]); // Removimos dependencias de servicios para evitar re-cargas innecesarias

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleDetails = (orderId: number) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };
    
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) {
        return <div className="orders-page-container"><h2>Cargando tus pedidos...</h2></div>;
    }

    if (error) {
        return <div className="orders-page-container"><h2 className="error-message">{error}</h2></div>;
    }

    return (
        <div className="orders-page-container">
            <div className="page-header">
                <h1 className="page-title">Mis Pedidos</h1>
            </div>

            {orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-info">
                                    <span className="info-label">FECHA DEL PEDIDO</span>
                                    <span className="info-value">{formatDate(order.fecha)}</span>
                                </div>
                                <div className="order-info">
                                    <span className="info-label">TOTAL</span>
                                    <span className="info-value">${order.valorTotal.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="order-info">
                                    <span className="info-label">PEDIDO #</span>
                                    <span className="info-value">{order.id}</span>
                                </div>
                                <div className="order-actions">
                                   <button 
                                        onClick={() => handleToggleDetails(order.id)}
                                        className="integra-serv-secondary-btn"
                                    >
                                        {expandedOrderId === order.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                                    </button>
                                </div>
                            </div>
                            
                            {expandedOrderId === order.id && (
                                <div className="order-card-details">
                                    <ul>
                                        {order.detalles.map(detalle => {
                                            // Se imprime el detalle en la consola para verificación
                                            console.log('Verificando detalle de producto:', detalle);

                                            return (
                                                <li key={detalle.id} className="detail-item">
                                                    {/* Se ha eliminado la etiqueta <img> */}
                                                    <div className="product-info">
                                                        <span className="product-name">{detalle.nombreProducto}</span>
                                                        <span className="product-department">Vendido por: {detalle.nombreDepartamento}</span>
                                                    </div>
                                                    <div className="price-info">
                                                       {detalle.cantidad} uds. x ${detalle.precioUnitario.toLocaleString('es-CO')}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No has realizado ningún pedido todavía.</p>
            )}
        </div>
    );
};

export default OrdersPage;
