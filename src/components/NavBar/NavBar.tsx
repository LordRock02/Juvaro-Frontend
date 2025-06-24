// En: src/components/NavBar/NavBar.tsx

import React, { useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from '../ShoppingCart/ShoppingCart'; // Asegúrate que la ruta sea correcta
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as freeSolidSvgIcons from '@fortawesome/free-solid-svg-icons';
import { faDigg } from '@fortawesome/free-brands-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import type { INavigationStrategy, NavigationLink } from '../../core/strategy/interfaces/INavigationStrategy';
import { AdminNavigationStrategy } from '../../core/strategy/AdminNavigationStrategy';
import { UserNavigationStrategy } from '../../core/strategy/UserNavigationStrategy';

const NavBar: React.FC = () => {
    const { isLoggedIn, currentUser, logout } = useAuth();
    // --- CORREGIDO: Se obtiene 'isCartOpen' del contexto ---
    const { cartCount, toggleCart, isCartOpen } = useCart();
    const location = useLocation();

    const navigationLinks = useMemo((): NavigationLink[] => {
        let strategy: INavigationStrategy;
        if (isLoggedIn && currentUser?.rol === 'ROLE_ADMIN') {
            strategy = new AdminNavigationStrategy();
        } else {
            strategy = new UserNavigationStrategy();
        }
        return strategy.getNavigationLinks();
    }, [isLoggedIn, currentUser]); 

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="layout-container">
            <nav>
                <Link to='/dashboard' className='logo'>
                    <FontAwesomeIcon icon={faDigg} className='icono' />
                    <strong>JUVARO S.A.</strong>
                </Link>
                <ul className="nav__links">
                    {navigationLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link to={link.path} key={link.path} className={`option ${isActive ? 'selected' : 'unselected'}`}>
                                <FontAwesomeIcon icon={link.icon} className='icono' />
                                {link.label}
                            </Link>
                        );
                    })}
                </ul>
                <div className="nav__footer">
                    {isLoggedIn && (
                        <>
                            <Link to='/mi-cuenta' className={`option ${location.pathname === '/mi-cuenta' ? 'selected' : 'unselected'}`}>
                                <FontAwesomeIcon icon={freeSolidSvgIcons.faUser} className='icono'/>
                                {currentUser?.nombre || 'Mi Cuenta'}
                            </Link>
                            <a className="option unselected" onClick={handleLogout} style={{cursor: 'pointer'}}>
                                <FontAwesomeIcon icon={freeSolidSvgIcons.faRightFromBracket} className='icono' />
                                Cerrar Sesión
                            </a>
                        </>
                    )}
                </div>
            </nav>

            <main className="content-area">
                <Outlet />
            </main>

            {/* --- Componentes Flotantes (Carrito) --- */}
            {isLoggedIn && currentUser?.rol !== 'ROLE_ADMIN' && (
                <>
                    {/* --- CORREGIDO: Se añade la clase condicional 'hidden' --- */}
                    <button onClick={toggleCart} className={`floating-cart-btn ${isCartOpen ? 'hidden' : ''}`}>
                        <FontAwesomeIcon icon={faShoppingCart} />
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </button>
                    <ShoppingCart />
                </>
            )}
        </div>
    );
}

export default NavBar;
