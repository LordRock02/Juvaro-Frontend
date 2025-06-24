import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faPen } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { UserService } from '../../services/userService';
import type { UpdateUsuarioRequest } from '../../services/userService.types';

// Importa los componentes de Modal y el nuevo formulario de edición
import { Modal } from '../../components/Modal/Modal';
import { EditProfileForm } from '../../components/Forms/EditProfileForm';

import './ProfilePage.css';

const ProfilePage: React.FC = () => {
    // Asumimos que currentUser contiene los datos del usuario directamente
    const { currentUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userService = UserService.getInstance();

    const handleUpdateProfile = async (data: UpdateUsuarioRequest) => {
        if (!currentUser) return;
        
        try {
            // Se crea el objeto para la petición, incluyendo el ID del usuario actual
            const requestData = { ...data, id: currentUser.id };
            await userService.actualizarUsuario(requestData);
            
            // Forzamos una recarga de la página. Esta es la forma más segura de
            // obtener los datos actualizados en todo el contexto de la aplicación.
            window.location.reload();

        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            alert("No se pudo actualizar la información. Inténtalo de nuevo.");
        }
    };

    if (!currentUser) {
        return <div className="profile-page-container">Cargando información del usuario...</div>;
    }

    return (
        <>
            <div className="profile-page-container">
                <div className="profile-card">
                    <div className="profile-header">
                        <h2>Información del Usuario</h2>
                        <button className="edit-profile-btn" onClick={() => setIsModalOpen(true)}>
                            <FontAwesomeIcon icon={faPen} />
                        </button>
                    </div>
                    <div className="profile-body">
                        <div className="avatar-container">
                            <FontAwesomeIcon icon={faUserCircle} className="avatar-icon" />
                        </div>
                        <div className="details-container">
                            {/* CORRECCIÓN: Se leen los datos directamente de currentUser, usando optional chaining */}
                            <span className="detail-label">Nombre:</span>
                            <span className="detail-value">{currentUser?.nombre}</span>
                            
                            <span className="detail-label">Documento:</span>
                            <span className="detail-value">{currentUser?.cedula}</span>

                            <span className="detail-label">Correo:</span>
                            <span className="detail-value">{currentUser?.email}</span>

                            <span className="detail-label">Rol:</span>
                            <span className="detail-value">{currentUser?.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario'}</span>
                            
                            <span className="detail-label">Estado:</span>
                            <span className="detail-value">Activo (a)</span>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Editar Perfil">
                <EditProfileForm 
                    onSave={handleUpdateProfile}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
};

export default ProfilePage;
