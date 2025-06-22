// En: src/components/SignIn/SignIn.tsx

import { useNavigate } from 'react-router-dom';
import { iniciarSesionUsuario } from '../../services/authService';
import type { LoginCredentials } from '../../services/authService.types';
import { validarSignInForm } from '../../lib/validation';

// 1. Importamos el nuevo hook 'useAuth'
import { useAuth } from '../../context/AuthContext'; 

import { ToastContainer, toast, type ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css';

import { useEffect, useState, type FormEvent } from 'react';

const SignIn = () => {
    const navigate = useNavigate();
    // 2. Obtenemos la acción 'login' y el estado del contexto (nuestro Mediador)
    const { login, isLoggedIn } = useAuth();

    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '' // Usamos 'password' para ser consistentes
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const notify = (orden: 'success' | 'error', mensaje: string, posicion: ToastPosition = 'top-right') => {
        const options = { position: posicion, autoClose: 1500 };
        if (orden === 'success') {
            toast.success(mensaje, { ...options, autoClose: 1000, onClose: () => navigate('/dashboard') });
        } else {
            toast.error(mensaje, options);
        }
    };
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validarSignInForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            try {
                const response = await iniciarSesionUsuario(formData);
                // 3. El componente solo le dice al mediador que haga el login
                login(response);
                notify('success', `¡Bienvenido, ${response.nombre}!`);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Credenciales incorrectas o error en el servidor.';
                notify('error', errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/dashboard");
        }
    }, [isLoggedIn, navigate]);

    // 4. Usamos tu estructura JSX original
    return (
        <div className='homeSignInSignUp'>
            <div className='containerSignIn'>
                <div className='containerForm'>
                    <h3>Sign In</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={errors.email ? 'error-field' : ''}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder='Email'
                                value={formData.email}
                                onChange={handleChange}
                                name="email"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        <div className={errors.password ? 'error-field' : ''}>
                            <label htmlFor="password">Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                placeholder='Contraseña'
                                value={formData.password}
                                onChange={handleChange}
                                name="password" // Corregido de 'contraseña' a 'password'
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>
                        <div>
                            <button type="submit" className='btn-signin' disabled={isLoading}>
                                {isLoading ? 'Ingresando...' : 'Sign In'}
                            </button>
                        </div>
                    </form>
                    <p>Forgot Password?</p>
                </div>
                <div className='containerWelcome'>
                    <div>
                        <h2>Welcome to JUVARO</h2>
                        <p>Don’t have an account?</p>
                        <button onClick={() => navigate('/register')}>Sign Up</button>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default SignIn;
