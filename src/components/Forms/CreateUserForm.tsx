import React, { useState } from 'react';
import type { RegistrarUsuarioRequest } from '../../services/userService.types';
import './Form.css'; // Un archivo de estilos compartido para formularios

interface CreateUserFormProps {
    onSave: (userData: RegistrarUsuarioRequest) => void;
    onCancel: () => void;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState<RegistrarUsuarioRequest>({
        fullname: '',
        email: '',
        password: '',
        cedula: 0,
        fechaRegistro: new Date().toISOString().split('T')[0], // Fecha de hoy
        rol: 2 // Por defecto, rol de usuario
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'cedula' || name === 'rol' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
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
                <label>Contraseña</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
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
                <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
                <button type="submit" className="integra-serv-primary-btn">Guardar</button>
            </div>
        </form>
    );
};
