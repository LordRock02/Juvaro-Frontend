// src/components/ui/NavBar.tsx

import { Outlet, useNavigate, Link } from 'react-router-dom';
import './NavBar.css'; // Asegúrate de que esta línea esté presente
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, faBoxOpen, faShoppingCart, faIndustry, 
    faUsers, faUser, faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import {faDigg } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useState } from 'react';

// Simulación del Contexto Global
const useIntegraStates = () => ({
  state: {
    userData: { rol: 'ROLE_ADMIN' } 
  },
  dispatch: (action: any) => console.log('Dispatching:', action)
});

interface BtnState {
  [key: string]: 'selected' | 'unselected';
}

const NavBar = () => {
    const initialBtnState: BtnState = {
        "dashboard": "unselected", "ventas": "unselected", "productos": "unselected",
        "produccion": "unselected", "usuarios": "unselected", "mi-cuenta": "unselected",
    };

    const [btnSelected, setBtnSelected] = useState<BtnState>(initialBtnState);
    const { state, dispatch } = useIntegraStates();
    const navigate = useNavigate();

    useEffect(() => {
        setBtnSelected(prev => ({ ...prev, "dashboard": "selected" }));
        navigate('/dashboard'); 
    }, []);

    const handleClick = (buttonName: string) => {
        const newState = { ...initialBtnState, [buttonName]: "selected" } as BtnState;
        setBtnSelected(newState);
        navigate(buttonName);
    };

    const cerrarSesion = () => {
        console.log("Cerrando sesión...");
        navigate('/login');
    };

    // ----- CAMBIO PRINCIPAL: Envolvemos todo en un div con una clase -----
    return (
        <div className="layout-container">
            <nav>
                <Link to='/dashboard' className='logo'><FontAwesomeIcon icon={faDigg} className='icono' /><strong>JUVARO S.A.</strong></Link>
                
                <ul className="nav__links">
                    <Link to='/dashboard' className={`option ${btnSelected['dashboard']}`} onClick={() => handleClick('dashboard')} ><FontAwesomeIcon icon={faChartLine} className='icono'/>Dashboard</Link>
                    <Link to='/ventas' className={`option ${btnSelected['ventas']}`} onClick={() => handleClick('ventas')} ><FontAwesomeIcon icon={faShoppingCart} className='icono'/>Ventas</Link>
                    <Link to='/productos' className={`option ${btnSelected['productos']}`} onClick={() => handleClick('productos')} ><FontAwesomeIcon icon={faBoxOpen} className='icono' />Productos</Link>
                    
                    {state.userData?.rol === 'ROLE_ADMIN' && (
                        <>
                            <Link to='/produccion' className={`option ${btnSelected['produccion']}`} onClick={() => handleClick('produccion')}><FontAwesomeIcon icon={faIndustry} className='icono' />Producción</Link>
                            <Link to='/usuarios' className={`option ${btnSelected['usuarios']}`} onClick={() => handleClick('usuarios')}><FontAwesomeIcon icon={faUsers} className='icono' />Usuarios</Link>
                        </>
                    )}
                </ul>
                
                <div>
                    <Link to='/mi-cuenta' className={`option ${btnSelected['mi-cuenta']}`} onClick={() => handleClick('mi-cuenta')} ><FontAwesomeIcon icon={faUser} className='icono'/>Mi Cuenta</Link>
                    <Link to='/login' className="option unselected" onClick={cerrarSesion} ><FontAwesomeIcon icon={faRightFromBracket} className='icono' />Cerrar Sesión</Link>
                </div>
            </nav>

            <main className="content-area">
                <Outlet />
            </main>
        </div>
    )
}

export default NavBar;