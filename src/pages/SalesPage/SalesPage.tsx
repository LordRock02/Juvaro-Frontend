import React, { useState, useEffect, useCallback } from 'react';
import { VentaService, type VentaDto, type DetalleVentaDto } from '../../services/ventaService';
import { ProductService } from '../../services/productService';
import './SalesPage.css'; // Estilos específicos para esta página

// Interfaz para los detalles de venta enriquecidos con la URL de la imagen
interface EnrichedDetalleVentaDto extends DetalleVentaDto {
    imagenUrl?: string;
}

// Interfaz para las ventas enriquecidas
interface EnrichedVentaDto extends Omit<VentaDto, 'detalles'> {
    detalles: EnrichedDetalleVentaDto[];
}

const SalesPage: React.FC = () => {
    const [sales, setSales] = useState<EnrichedVentaDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);

    // No necesitamos useAuth aquí, ya que es para un admin
    const ventaService = VentaService.getInstance();
    const productService = ProductService.getInstance();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Usamos Promise.all para cargar todas las ventas y productos simultáneamente
            const [allSales, allProducts] = await Promise.all([
                ventaService.listarTodasLasVentas(), // <-- CAMBIO CLAVE AQUÍ
                productService.listarProductos()
            ]);

            // Creamos un mapa de productos para una búsqueda eficiente
            const productsMap = new Map(allProducts.map(p => [p.id, p]));

            // "Enriquecemos" los datos de las ventas con la URL de la imagen
            const enrichedSales = allSales.map(sale => ({
                ...sale,
                detalles: sale.detalles.map(detalle => {
                    const product = productsMap.get(detalle.productoId);
                    return {
                        ...detalle,
                        imagenUrl: product?.imagenUrl
                    };
                })
            }));

            // Ordenamos las ventas de la más reciente a la más antigua
            const sortedSales = enrichedSales.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            
            setSales(sortedSales);

        } catch (err) {
            console.error("Error al cargar los datos de ventas:", err);
            setError('No se pudieron cargar las ventas. Inténtalo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    }, [ventaService, productService]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleDetails = (saleId: number) => {
        setExpandedSaleId(prevId => (prevId === saleId ? null : saleId));
    };
    
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (loading) {
        return <div className="sales-page-container"><h2>Cargando Ventas...</h2></div>;
    }

    if (error) {
        return <div className="sales-page-container"><h2 className="error-message">{error}</h2></div>;
    }

    return (
        <div className="sales-page-container">
            <div className="page-header">
                <h1 className="page-title">Registro de Ventas</h1>
            </div>

            {sales.length > 0 ? (
                <div className="sales-list">
                    {sales.map(sale => (
                        <div key={sale.id} className="sale-card">
                            <div className="sale-card-header">
                                <div className="info-group">
                                    <span className="info-label">CLIENTE</span>
                                    <span className="info-value">{sale.nombreUsuario}</span>
                                </div>
                                <div className="info-group">
                                    <span className="info-label">FECHA DE VENTA</span>
                                    <span className="info-value">{formatDate(sale.fecha)}</span>
                                </div>
                                <div className="info-group">
                                    <span className="info-label">TOTAL</span>
                                    <span className="info-value">${sale.valorTotal.toLocaleString('es-CO')}</span>
                                </div>
                                <div className="info-group">
                                    <span className="info-label">VENTA #</span>
                                    <span className="info-value">{sale.id}</span>
                                </div>
                                <div className="sale-actions">
                                   <button 
                                        onClick={() => handleToggleDetails(sale.id)}
                                        className="integra-serv-secondary-btn"
                                    >
                                        {expandedSaleId === sale.id ? 'Ocultar Detalles' : 'Ver Detalles'}
                                    </button>
                                </div>
                            </div>
                            
                            {expandedSaleId === sale.id && (
                                <div className="sale-card-details">
                                    <ul>
                                        {sale.detalles.map(detalle => (
                                            <li key={detalle.id} className="detail-item">
                                                <div className="product-info">
                                                    <span className="product-name">{detalle.nombreProducto}</span>
                                                    <span className="product-department">Vendido en: {detalle.nombreDepartamento}</span>
                                                </div>
                                                <div className="price-info">
                                                   {detalle.cantidad} uds. x ${detalle.precioUnitario.toLocaleString('es-CO')}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No se han registrado ventas todavía.</p>
            )}
        </div>
    );
};

export default SalesPage;
