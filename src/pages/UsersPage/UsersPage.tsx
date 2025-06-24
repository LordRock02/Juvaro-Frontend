import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/userService';
import type { UsuarioDto, RegistrarUsuarioRequest, UpdateUsuarioRequest } from '../../services/userService.types';
import { useAuth } from '../../context/AuthContext';

// Suponiendo que tienes estos componentes de tu proyecto
import { Modal } from '../../components/Modal/Modal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';

// Formularios que crearemos a continuación
import { CreateUserForm } from '../../components/Forms/CreateUserForm';
import { EditUserForm } from '../../components/Forms/EditUserForm';

import './UsersPage.css'; // Estilos que crearemos a continuación

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<UsuarioDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para los modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<UsuarioDto | null>(null);
    const [userToDelete, setUserToDelete] = useState<UsuarioDto | null>(null);

    const { currentUser } = useAuth();
    const userService = UserService.getInstance();

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const userList = await userService.listarUsuarios();
            setUsers(userList);
        } catch (err) {
            setError('No se pudieron cargar los usuarios.');
        } finally {
            setLoading(false);
        }
    }, [userService]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateUser = async (newUserData: RegistrarUsuarioRequest) => {
        try {
            await userService.registrarUsuario(newUserData);
            setIsCreateModalOpen(false);
            fetchUsers(); // Recargar la lista de usuarios
        } catch (error) {
            alert('Error al crear el usuario.');
        }
    };

    const handleUpdateUser = async (updatedUserData: UpdateUsuarioRequest) => {
        try {
            await userService.actualizarUsuario(updatedUserData);
            setUserToEdit(null);
            fetchUsers(); // Recargar la lista de usuarios
        } catch (error) {
            alert('Error al actualizar el usuario.');
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await userService.eliminarUsuario(userToDelete.id);
            setUserToDelete(null);
            fetchUsers(); // Recargar la lista de usuarios
        } catch (error) {
            alert('Error al eliminar el usuario.');
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    if (loading) return <div className="users-page-container"><h2>Cargando...</h2></div>;
    if (error) return <div className="users-page-container"><h2>{error}</h2></div>;

    return (
        <>
            <div className="users-page-container">
                <div className="page-header">
                    <h1 className="page-title">Gestionar Usuarios</h1>
                    {currentUser?.rol === 'ROLE_ADMIN' && (
                        <button 
                            className="integra-serv-primary-btn" 
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Crear Usuario
                        </button>
                    )}
                </div>

                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Cédula</th>
                                <th>Fecha Registro</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.fullname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.cedula}</td>
                                    <td>{formatDate(user.fechaRegistro)}</td>
                                    <td>{user.rol === 1 ? 'Admin' : 'Usuario'}</td>
                                    <td className="actions-cell">
                                        <button onClick={() => setUserToEdit(user)} className="action-btn edit-btn">
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => setUserToDelete(user)} className="action-btn delete-btn">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Modales --- */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Nuevo Usuario">
                <CreateUserForm onSave={handleCreateUser} onCancel={() => setIsCreateModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={!!userToEdit} onClose={() => setUserToEdit(null)} title={`Editar Usuario: ${userToEdit?.fullname}`}>
                {userToEdit && <EditUserForm user={userToEdit} onSave={handleUpdateUser} onCancel={() => setUserToEdit(null)} />}
            </Modal>

            <ConfirmModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={handleDeleteUser}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que quieres eliminar al usuario "${userToDelete?.fullname}"? Esta acción no se puede deshacer.`}
            />
        </>
    );
};

export default UsersPage;
