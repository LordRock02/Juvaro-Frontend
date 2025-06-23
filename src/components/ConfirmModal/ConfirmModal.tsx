import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Modal } from '../Modal/Modal'; // Reutilizamos nuestro modal genérico
import './ConfirmModal.css';

// 1. Definimos las Props que aceptará este modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;      // Función para el botón "Cancelar"
  onConfirm: () => void;    // Función para el botón "Confirmar"
  title: string;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // 2. Usamos nuestro componente Modal como base
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirm-modal-content">
        <FontAwesomeIcon icon={faExclamationTriangle} className="confirm-modal-icon" />
        <p className="confirm-modal-message">{message}</p>
        
        {/* 3. Botones de acción con los estilos de tu proyecto */}
        <div className="confirm-modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-danger" onClick={onConfirm}>
            Sí, Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}