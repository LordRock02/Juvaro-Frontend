import React, { useState, useEffect } from 'react';
import type { UsuarioDto, UpdateUsuarioRequest } from '../../services/userService.types';
import './Form.css';

interface EditUserFormProps {
    user: UsuarioDto;
    onSave: (userData: UpdateUsuarioRequest) => void;
    onCancel: () => void;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<UpdateUsuarioRequest>({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        password: '', // El password se envía vacío a menos que se quiera cambiar
        cedula: parseInt(user.cedula),
        rol: user.rol
    });
    
    useEffect(() => {
        setFormData({
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            password: '',
            cedula: parseInt(user.cedula),
            rol: user.rol
        });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'cedula' || name === 'rol' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Solo enviar el password si el campo no está vacío
        const dataToSave: UpdateUsuarioRequest = { ...formData };
        if (!dataToSave.password) {
            delete dataToSave.password;
        }
        onSave(dataToSave);
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
            <div className="form-group">
                <label>Cédula</label>
                <input type="number" name="cedula" value={formData.cedula} onChange={handleChange} required />
            </div>
             <div className="form-group">
                <label>Rol</label>
                <select name="rol" value={formData.rol} onChange={handleChange}>
                    <option value={2}>Usuario</option>
                    <option value={1}>Admin</option>
                </select>
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn-secondary">Actualizar</button>
                <button type="submit" className="integra-serv-primary-btn">Actualizar</button>
            </div>
        </form>
    );
};
