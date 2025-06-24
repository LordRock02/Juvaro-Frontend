import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UpdateUsuarioRequest } from '../../services/userService.types';
import './Form.css'; // Reutilizamos los estilos de formulario

interface EditProfileFormProps {
    onSave: (data: UpdateUsuarioRequest) => void;
    onCancel: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ onSave, onCancel }) => {
    const { currentUser } = useAuth();
    
    // El estado del formulario ahora incluye todos los campos necesarios
    const [formData, setFormData] = useState({
        fullname: currentUser?.usuario.fullname || '',
        email: currentUser?.usuario.email || '',
        // Se añade la cédula, asegurándonos de que sea un número
        cedula: parseInt(currentUser?.usuario.cedula || '0', 10),
        password: '' // El campo de la contraseña siempre empieza vacío
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Se crea el objeto de la petición
        const dataToSave: Partial<UpdateUsuarioRequest> = {
            fullname: formData.fullname,
            email: formData.email,
            // Se convierte la cédula a número antes de enviarla
            cedula: Number(formData.cedula)
        };

        // Solo se añade la contraseña al objeto si el usuario ha escrito algo
        if (formData.password) {
            dataToSave.password = formData.password;
        }

        onSave(dataToSave as UpdateUsuarioRequest);
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            {/* Se añade el campo para la cédula */}
            <div className="form-group">
                <label>Cédula</label>
                <input type="number" name="cedula" value={formData.cedula} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label>Nueva Contraseña (opcional)</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Dejar en blanco para no cambiar" />
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
                <button type="submit" className="integra-serv-primary-btn">Guardar Cambios</button>
            </div>
        </form>
    );
};
