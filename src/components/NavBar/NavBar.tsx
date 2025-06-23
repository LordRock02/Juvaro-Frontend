// En: src/components/NavBar/NavBar.tsx

import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as freeSolidSvgIcons from '@fortawesome/free-solid-svg-icons';
import { faDigg } from '@fortawesome/free-brands-svg-icons';
import React, { useMemo } from 'react'; // 'useMemo' es útil aquí

import type { INavigationStrategy, NavigationLink } from '../../core/strategy/interfaces/INavigationStrategy';
import { AdminNavigationStrategy } from '../../core/strategy/AdminNavigationStrategy';
import { UserNavigationStrategy } from '../../core/strategy/UserNavigationStrategy';

const NavBar: React.FC = () => {
    const { isLoggedIn, currentUser, logout } = useAuth();


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
            <nav className="navbar">
                <Link to='/dashboard' className='logo'><FontAwesomeIcon icon={faDigg} className='icono' /><strong>JUVARO S.A.</strong></Link>
                {/* La lógica 'if' compleja ha desaparecido. Ahora solo mapeamos los resultados. */}
                <ul className="nav__links">
                    {navigationLinks.map((link) => (
                        <Link to={link.path} key={link.path} className='option'>
                            <FontAwesomeIcon icon={link.icon} className='icono' />
                            {link.label}
                        </Link>
                    ))}
                </ul>
                
                <div className="nav__footer">
                    {isLoggedIn && (
                        <>
                            <Link to='/mi-cuenta' className='option'>
                                <FontAwesomeIcon icon={freeSolidSvgIcons.faUser} className='icono'/>
                                {currentUser?.nombre || 'Mi Cuenta'}
                            </Link>
                            <a className="option" onClick={handleLogout} style={{cursor: 'pointer'}}>
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
        </div>
    );
}

export default NavBar;

