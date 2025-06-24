import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
// 1. Importamos el nuevo hook 'useAuth'
import { useAuth } from './context/AuthContext';
import NavBar from './components/NavBar/NavBar';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import ProductsPage from './pages/ProductPage/ProductsPage';
import DepartmentsPage from './pages/DepartmentsPage/DepartmentsPage';

// Tus componentes de página placeholders se mantienen igual
const DashboardPage = () => <h2>Contenido del Dashboard</h2>;
const VentasPage = () => <h2>Contenido de Ventas</h2>;
const UsuariosPage = () => <h2>Contenido de Usuarios</h2>;
const MiCuentaPage = () => <h2>Contenido de Mi Cuenta</h2>;

/**
 * Componente Guardián de Rutas Protegidas, ahora simplificado.
 */
const ProtectedRoutes = () => {
    // 2. Lee el estado directamente del Mediador (el contexto)
    const { isLoggedIn } = useAuth();
    console.log(`ProtectedRoute renderizando. isLoggedIn: ${isLoggedIn}`);

    // 3. La decisión es simple y directa. React se encarga de re-renderizar.
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- RUTAS PÚBLICAS --- */}
                <Route path='/login' element={<SignIn />} />
                <Route path='/register' element={<SignUp />} />
                
                {/* --- RUTAS PROTEGIDAS --- */}
                {/* Usamos el nuevo componente guardián */}
                <Route element={<ProtectedRoutes />}>
                    {/* El layout principal y todas las páginas protegidas van aquí */}
                    <Route path="/" element={<NavBar />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="ventas" element={<VentasPage />} />
                        <Route path="productos" element={<ProductsPage />} />
                        <Route path="Departamentos" element={<DepartmentsPage />} />
                        <Route path="usuarios" element={<UsuariosPage />} />
                        <Route path="mi-cuenta" element={<MiCuentaPage />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;