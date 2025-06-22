// src/components/ui/NavBar.tsx


import { Outlet, Link } from 'react-router-dom';
// 1. Importamos el nuevo hook 'useAuth'
import { useAuth } from '../../context/AuthContext'; 
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as freeSolidSvgIcons from '@fortawesome/free-solid-svg-icons';
import { faDigg } from '@fortawesome/free-brands-svg-icons';
import React from 'react'; // Ya no se necesitan useEffect ni useState para la sesión

const NavBar: React.FC = () => {
    // 2. Leemos el estado y las acciones directamente del contexto (nuestro Mediador)
    // Ya no necesitamos estado local (useState) para isLoggedIn o user.
    const { isLoggedIn, currentUser, logout } = useAuth();

    // 3. La función de logout ahora es mucho más simple
    const handleLogout = () => {
        // El NavBar solo le dice al mediador que cierre la sesión.
        logout();
        // No necesita navegar, el componente ProtectedRoutes se encargará de ello reactivamente.
    };

    // Ya no se necesita el bloque useEffect para suscribirse,
    // el contexto de React maneja las actualizaciones automáticamente.

    return (
        <div className="layout-container">
            <nav className="navbar">
                <Link to='/dashboard' className='logo'><FontAwesomeIcon icon={faDigg} className='icono' /><strong>JUVARO S.A.</strong></Link>
                
                <ul className="nav__links">
                    {/* El resto de tus links no cambian */}
                    <Link to='/dashboard' className='option'><FontAwesomeIcon icon={freeSolidSvgIcons.faChartLine} className='icono'/>Dashboard</Link>
                    <Link to='/ventas' className='option'><FontAwesomeIcon icon={freeSolidSvgIcons.faShoppingCart} className='icono'/>Ventas</Link>
                    <Link to='/productos' className='option'><FontAwesomeIcon icon={freeSolidSvgIcons.faBoxOpen} className='icono' />Productos</Link>
                    
                    {/* La lógica condicional sigue funcionando igual, pero ahora es más robusta */}
                    {isLoggedIn && currentUser?.rol === 'ROLE_ADMIN' && (
                        <>
                            <Link to='/produccion' className='option'><FontAwesomeIcon icon={freeSolidSvgIcons.faIndustry} className='icono' />Producción</Link>
                            <Link to='/usuarios' className='option'><FontAwesomeIcon icon={freeSolidSvgIcons.faUsers} className='icono' />Usuarios</Link>
                        </>
                    )}
                </ul>
                
                <div className="nav__footer">
                    {isLoggedIn ? (
                        <>
                            <Link to='/mi-cuenta' className='option'><FontAwesomeIcon icon={freeSolidSvgIcons.faUser} className='icono'/>{currentUser?.nombre || 'Mi Cuenta'}</Link>
                            <a className="option unselected" onClick={handleLogout} style={{cursor: 'pointer'}}>
                                <FontAwesomeIcon icon={freeSolidSvgIcons.faRightFromBracket} className='icono' />Cerrar Sesión
                            </a>
                        </>
                    ) : (
                        // Este bloque casi nunca se mostrará gracias a ProtectedRoutes
                        <Link to='/login' className="option unselected"><FontAwesomeIcon icon={freeSolidSvgIcons.faRightFromBracket} className='icono' />Iniciar Sesión</Link>
                    )}
                </div>
            </nav>
            <main className="content-area">
                <Outlet />
            </main>
        </div>
    );
}

export default NavBar;