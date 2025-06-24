import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import NavBar from './components/NavBar/NavBar';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import ProductsPage from './pages/ProductPage/ProductsPage';
import DepartmentsPage from './pages/DepartmentsPage/DepartmentsPage';
import StorePage  from './pages/StorePage/StorePage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SalesPage from './pages/SalesPage/SalesPage';
import UsersPage from './pages/UsersPage/UsersPage'; 
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';

// Componente para la página de inicio (puede ser un Dashboard o una bienvenida)

// --- COMPONENTE DE REDIRECCIÓN POR ROL ---
// Este componente decide a dónde enviar al usuario basado en su rol.
const HomeRedirect = () => {
    const { currentUser } = useAuth();
    // Verifica si el usuario es administrador (asumiendo que rol 1 es ADMIN)
    const isAdmin = currentUser?.usuario?.rol === 1; 
    // Define la ruta por defecto según el rol
    const defaultPath = isAdmin ? '/ventas' : '/store';
    
    return <Navigate to={defaultPath} replace />;
};

const ProtectedRoutes = () => {
    const { isLoggedIn } = useAuth();
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        {/* --- RUTAS PÚBLICAS --- */}
                        <Route path='/login' element={<SignIn />} />
                        <Route path='/register' element={<SignUp />} />
                        
                        {/* --- RUTAS PROTEGIDAS --- */}
                        <Route element={<ProtectedRoutes />}>
                            <Route path="/" element={<NavBar />}>
                                {/* --- RUTA DE INICIO REDIRIGE SEGÚN ROL --- */}
                                <Route index element={<HomeRedirect />} />
                                
                                <Route path="ventas" element={<SalesPage />} />
                                <Route path="ordenes" element={<OrdersPage />} />
                                <Route path="productos" element={<ProductsPage />} />
                                <Route path="departamentos" element={<DepartmentsPage />} />
                                <Route path="usuarios" element={<UsersPage />} />
                                <Route path="mi-cuenta" element={<ProfilePage />} />
                                <Route path="store" element={<StorePage />} />
                                <Route path="checkout" element={<CheckoutPage />} />

                                {/* Redirección para cualquier ruta no encontrada */}
                                <Route path="*" element={<HomeRedirect />} />
                            </Route>
                        </Route>
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
