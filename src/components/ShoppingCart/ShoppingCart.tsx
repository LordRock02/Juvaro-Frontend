import React from 'react';
import { Link } from 'react-router-dom'; // <-- Se importa Link
import { useCart } from '../../context/CartContext';
import './ShoppingCart.css'; // Asumiendo que has creado este archivo

export const ShoppingCart: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, cartCount, isCartOpen, toggleCart } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);

    return (
        <>
            <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
            <div className={`side-cart-container ${isCartOpen ? 'open' : ''}`}>
                <div className="side-cart-header">
                    <h3>Carrito ({cartCount})</h3>
                    <button onClick={toggleCart} className="close-btn">&times;</button>
                </div>
                
                {cartItems.length === 0 ? (
                    <p className="empty-cart-message">Tu carrito está vacío.</p>
                ) : (
                    <>
                        <div className="side-cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="side-cart-item">
                                    <img src={item.imagenUrl || `https://placehold.co/80x80`} alt={item.nombre} />
                                    <div className="item-info">
                                        <span>{item.nombre}</span>
                                        <span className="item-price">{formatPrice(item.precio)}</span>
                                    </div>
                                    <div className="item-quantity">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <button className="item-remove" onClick={() => removeFromCart(item.id)}>&times;</button>
                                </div>
                            ))}
                        </div>
                        <div className="side-cart-footer">
                            <div className="summary-line">
                                <span>Subtotal:</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            {/* --- MODIFICADO: Ahora es un Link que redirige y cierra el panel --- */}
                            <Link to="/checkout" className="integra-serv-primary-btn checkout-btn" onClick={toggleCart}>
                                Proceder al Pago
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
