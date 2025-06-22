// En: src/components/SignUp/SignUp.tsx

import { useNavigate } from 'react-router-dom';
// Asegúrate que la ruta de importación es correcta
import { registrarUsuario } from '../../services/authService'; 
import type { RegisterCredentials } from '../../services/authService.types';
import { validarSignUpForm } from '../../lib/validation';

import './SignUp.css';
import { ToastContainer, toast, type ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';

const SignUp = () => {
    const navigate = useNavigate();
    // 2. Obtenemos la instancia del mediador

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        cedula: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    const notify = (orden: 'success' | 'error', mensaje: string, posicion: ToastPosition = 'bottom-right') => {
        const options = { position: posicion, autoClose: 2000 };
        if (orden === 'success') {
            toast.success(mensaje, { ...options, onClose: () => navigate('/login') });
        } else {
            toast.error(mensaje, options);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validarSignUpForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setIsLoading(true);
            const credentialsToRegister: RegisterCredentials = {
                fullname: formData.fullname,
                password: formData.password,
                email: formData.email,
                cedula: Number(formData.cedula),
                rol: 2 // Rol de usuario por defecto
            };

            try {
                const newUser = await registrarUsuario(credentialsToRegister);
                // 3. Notificamos al mediador que el registro fue exitoso
                // (Aunque en este flujo no se inicia sesión, es una buena práctica notificar)
                console.log('SignUp notificando del nuevo usuario:', newUser);
                notify('success', `¡Bienvenido, ${newUser.nombre}! Tu cuenta ha sido creada.`);
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Error al registrar el usuario.';
                notify('error', errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='homeSignInSignUp'>
            <div className='containerSignUp'>
                <div className='containerWelcome'>
                    <div>
                        <h2>Bienvenido a JUVARO</h2>
                        <p>¿Ya tienes una cuenta?</p>
                        <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                    </div>
                </div>
                <div className='containerForm'>
                    <h3>Crear Cuenta</h3>
                    <form onSubmit={handleSubmit}>
                        {/* Input para Fullname */}
                        <div className={errors.fullname ? 'error-field' : ''}>
                            <label htmlFor="fullname">Nombre Completo</label>
                            <input id="fullname" name="fullname" type="text" placeholder='Nombre Completo'
                                value={formData.fullname} onChange={handleChange} />
                            {errors.fullname && <span className="error-message">{errors.fullname}</span>}
                        </div>
                        
                        {/* Input para Email */}
                        <div className={errors.email ? 'error-field' : ''}>
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" placeholder='Email'
                                value={formData.email} onChange={handleChange} />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                        
                        {/* Input para Password (antes contraseña) */}
                        <div className={errors.password ? 'error-field' : ''}>
                            <label htmlFor="password">Contraseña</label>
                            <input id="password" name="password" type="password" placeholder='Contraseña'
                                value={formData.password} onChange={handleChange} />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        {/* Input para Cédula */}
                        <div className={errors.cedula ? 'error-field' : ''}>
                            <label htmlFor="cedula">Cédula</label>
                            <input id="cedula" name="cedula" type="number" placeholder='Cédula'
                                value={formData.cedula} onChange={handleChange} />
                            {errors.cedula && <span className="error-message">{errors.cedula}</span>}
                        </div>
                        
                        <div>
                            <button type="submit" className='btn-signin' disabled={isLoading}>
                                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                            </button>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default SignUp;
