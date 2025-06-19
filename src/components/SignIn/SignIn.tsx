// en: src/components/SignIn/SignIn.tsx

import { useNavigate } from 'react-router-dom';
// --- CORRECCIÓN 1: Rutas ajustadas a tu estructura de carpetas ---
// Desde 'src/components/SignIn/' necesitamos subir un nivel a 'components/'
// y otro a 'src/' antes de entrar a 'services/' o 'lib/'.
import { iniciarSesionUsuario, type AuthResponse } from '../../services/authService';
import { validarSignInForm } from '../../lib/validation';

// --- CORRECCIÓN 2: Se importa el tipo correcto 'ToastPosition' y el CSS ---
import { ToastContainer, toast, type ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './SignIn.css'; // Asegúrate que este archivo esté en la misma carpeta

import { useEffect, useState } from 'react';

// Simulación del Contexto que usaremos más adelante
const useIntegraStates = () => ({
  dispatch: (action: any) => console.log('AuthContext Dispatch:', action)
});

const SignIn = () => {
    const navigate = useNavigate();
    const { dispatch } = useIntegraStates();

    const [formData, setFormData] = useState({
        email: '',
        contraseña: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // --- CORRECCIÓN 3: Usamos el tipo 'ToastPosition' que es el correcto ---
    const notify = (orden: 'success' | 'error', mensaje: string, posicion: ToastPosition) => {
        const options = { position: posicion, autoClose: 1000 };
        if (orden === 'success') {
            toast.success(mensaje, { ...options, autoClose: 500, onClose: () => navigate('/dashboard') });
        } else {
            toast.error(mensaje, options);
        }
    };
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validarSignInForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            iniciarSesionUsuario(formData)
                .then((response: AuthResponse) => {
                    dispatch({ type: 'SET_USER_INFO', payload: response });
                    dispatch({ type: 'SET_TOKEN', payload: response.token });
                    localStorage.setItem('info_usuario', JSON.stringify(response));
                    localStorage.setItem('token', response.token);
                    notify('success', '¡Login exitoso!', 'top-right');
                })
                .catch((err) => {
                    console.error(err);
                    notify('error', 'Error en el inicio de sesión', 'top-right');
                });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);


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
                        <div className={errors.contraseña ? 'error-field' : ''}>
                            <label htmlFor="contraseña">Contraseña</label>
                            <input
                                id="contraseña"
                                type="password"
                                placeholder='Contraseña'
                                value={formData.contraseña}
                                onChange={handleChange}
                                name="contraseña"
                            />
                            {errors.contraseña && <span className="error-message">{errors.contraseña}</span>}
                        </div>
                        <div>
                            <button type="submit" className='btn-signin'>Sign In</button>
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
