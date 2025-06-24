import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { VentaService, type RegistrarVentaRequest } from '../../services/ventaService';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

export const CheckoutPage: React.FC = () => {
    const { cartItems, clearCart, cartCount } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const ventaService = VentaService.getInstance();

    const formatPrice = (price: number) => { 
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
     };
    const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);

    const handleFinalizePurchase = async () => {
        if (!currentUser || cartItems.length === 0) return;

        const request: RegistrarVentaRequest = {
            usuarioId: currentUser.id,
            items: cartItems.map(item => ({
                productoId: item.id,
                departamentoId: item.departmentId,
                cantidad: item.quantity,
            })),
        };

        try {
            await ventaService.registrarVenta(request);
            alert("¡Gracias por tu compra!");
            clearCart();
            navigate('/store');
        } catch (error) {
            console.error("Error al finalizar la compra:", error);
            alert("Hubo un error al procesar tu compra. Por favor, inténtalo de nuevo.");
        }
    };

    // --- CORRECCIÓN: Se añade el JSX para renderizar el contenido ---
    return (
        <div className="checkout-container">
            <div className="page-header">
                <h1 className="page-title">Finalizar Compra</h1>
            </div>

            <div className="checkout-layout">
                <div className="order-details">
                    <h2>Resumen de tu pedido</h2>
                    {cartItems.length > 0 ? (
                        <div className="items-summary-list">
                            {cartItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <img src={item.imagenUrl || 'https://placehold.co/80x80'} alt={item.nombre} />
                                    <div className="item-name">
                                        <span>{item.nombre}</span>
                                        <small>Cantidad: {item.quantity}</small>
                                    </div>
                                    <div className="item-price">
                                        {formatPrice(item.precio * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No hay artículos en tu carrito.</p>
                    )}
                </div>

                <div className="order-summary">
                    <h2>Total del Carrito</h2>
                    <div className="summary-line">
                        <span>Subtotal ({cartCount} productos)</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="summary-line total">
                        <span>Total a pagar</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>
                    <button 
                        className="integra-serv-primary-btn checkout-btn" 
                        onClick={handleFinalizePurchase}
                        disabled={cartItems.length === 0}
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    );
};
