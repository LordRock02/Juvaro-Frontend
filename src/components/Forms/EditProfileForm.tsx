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
    
    // El estado del formulario se inicializa con los datos del usuario actual
    const [formData, setFormData] = useState({
        fullname: currentUser?.nombre || '',
        email: currentUser?.email || '',
        password: '' // El campo de la contraseña siempre empieza vacío
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Se crea el objeto de la petición solo con los datos que se van a enviar
        const dataToSave: Partial<UpdateUsuarioRequest> = {
            fullname: formData.fullname,
            email: formData.email
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
