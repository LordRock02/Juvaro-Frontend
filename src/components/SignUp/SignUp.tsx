// en: src/components/SignUp/SignUp.tsx

import { useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../../services/authService';
import { validarSignUpForm } from '../../lib/validation';

import './SignUp.css'; // Crearemos este archivo a continuación
import { ToastContainer, toast, type ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';

const SignUp = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        contraseña: '',
        cedula: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const notify = (orden: 'success' | 'error', mensaje: string, posicion: ToastPosition) => {
        const options = { position: posicion, autoClose: 1000 };
        if (orden === 'success') {
            toast.success(mensaje, { ...options, autoClose: 500, onClose: () => navigate('/login') });
        } else {
            toast.error(mensaje, options);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validarSignUpForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            registrarUsuario(formData)
                .then((response) => {
                    console.log("Respuesta del servicio de registro mock:", response);
                    if (response.succes) {
                        notify('success', '¡Usuario creado!', 'bottom-right');
                    } else {
                        notify('error', response.error || 'Ocurrió un error', 'bottom-right');
                    }
                });
        }
    };

    return (
        <div className='homeSignInSignUp'>
            <div className='containerSignUp'>
                <div className='containerWelcome'>
                    <div>
                        <h2>Welcome to JUVARO</h2>
                        <p>Do you have an account?</p>
                        <button onClick={() => navigate('/login')}>Sign In</button>
                    </div>
                </div>
                <div className='containerForm'>
                    <h3>Sign Up</h3>
                    <form onSubmit={handleSubmit}>
                        <div className={errors.fullname ? 'error-field' : ''}>
                            <label htmlFor="fullname">Fullname</label>
                            <input
                                id="fullname"
                                type="text"
                                placeholder='Fullname'
                                value={formData.fullname}
                                onChange={handleChange}
                                name="fullname"
                            />
                            {errors.fullname && <span className="error-message">{errors.fullname}</span>}
                        </div>
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
                        <div className={errors.cedula ? 'error-field' : ''}>
                            <label htmlFor="cedula">Cédula</label>
                            <input
                                id="cedula"
                                type="text"
                                placeholder='Cédula'
                                value={formData.cedula}
                                onChange={handleChange}
                                name="cedula"
                            />
                            {errors.cedula && <span className="error-message">{errors.cedula}</span>}
                        </div>
                        <div>
                            <button type="submit" className='btn-signin'>Sign Up</button>
                        </div>
                    </form>
                </div>
                 <ToastContainer />
            </div>
        </div>
    );
};

export default SignUp;
