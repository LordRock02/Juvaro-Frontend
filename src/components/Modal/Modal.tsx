import React, { type ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Modal.css';

// 1. Definimos las Props que nuestro Modal aceptará
interface ModalProps {
  isOpen: boolean;        // Para controlar si el modal está abierto o cerrado
  onClose: () => void;      // La función que se llamará al cerrar
  title: string;          // El título que se mostrará en la cabecera
  children: ReactNode;    // El contenido que irá dentro del modal (nuestro formulario)
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Si el modal no está abierto, no renderizamos nada.
  if (!isOpen) {
    return null;
  }

  // Usamos e.stopPropagation() para evitar que un clic dentro del modal lo cierre.
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    // 2. El fondo oscuro (overlay). Al hacer clic en él, se cierra el modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* 3. El contenedor del modal */}
      <div className="modal-content" onClick={handleModalContentClick}>
        {/* 4. La cabecera del modal */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        {/* 5. El cuerpo del modal, donde renderizamos el contenido que nos pasen */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};