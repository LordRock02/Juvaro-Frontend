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
// --- CORRECCIÓN: Asegurándose de que la ruta de importación sea correcta ---
import UsersPage from './pages/UsersPage/UsersPage'; 
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';

// Tus componentes de página placeholders
const DashboardPage = () => <h2>Contenido del Dashboard</h2>;
const VentasPage = () => <h2>Contenido de Ventas</h2>;
const MiCuentaPage = () => <h2>Contenido de Mi Cuenta</h2>;

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
                                <Route index element={<Navigate to="/dashboard" replace />} />
                                <Route path="ventas" element={<SalesPage />} />
                                <Route path="ordenes" element={<OrdersPage />} />
                                <Route path="productos" element={<ProductsPage />} />
                                <Route path="departamentos" element={<DepartmentsPage />} />
                                <Route path="usuarios" element={<UsersPage />} />
                                <Route path="mi-cuenta" element={<ProfilePage />} />
                                <Route path="store" element={<StorePage />} />
                                
                                {/* --- NUEVO: Ruta para la página de checkout --- */}
                                <Route path="checkout" element={<CheckoutPage />} />

                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                            </Route>
                        </Route>
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
