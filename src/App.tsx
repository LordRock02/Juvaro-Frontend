// src/App.tsx

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';

// Componentes de página de marcador de posición
const LoginPage = () => <h1>Página de Login</h1>;
const DashboardPage = () => <h2>Contenido del Dashboard</h2>;
const VentasPage = () => <h2>Contenido de Ventas</h2>;
const ProductosPage = () => <h2>Contenido de Productos</h2>;
const ProduccionPage = () => <h2>Contenido de Producción</h2>;
const UsuariosPage = () => <h2>Contenido de Usuarios</h2>;
const MiCuentaPage = () => <h2>Contenido de Mi Cuenta</h2>;

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path='/login' element={<LoginPage />} />
          
          {/* Rutas anidadas que usan el NavBar como layout */}
          <Route path='/' element={<NavBar />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="ventas" element={<VentasPage />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="produccion" element={<ProduccionPage />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="mi-cuenta" element={<MiCuentaPage />} />
            
            {/* Redirige la ruta raíz a /dashboard */}
            <Route index element={<Navigate to="/dashboard" />} />
          </Route>

          {/* Cualquier otra ruta no encontrada redirige a la raíz */}
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;