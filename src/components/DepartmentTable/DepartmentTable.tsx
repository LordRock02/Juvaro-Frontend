import React from 'react';
import type { DepartamentoDto } from '../../services/departmentService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import './DepartmentTable.css'; // Usaremos una hoja de estilos dedicada

interface DepartmentTableProps {
  departments: DepartamentoDto[];
  onEdit: (department: DepartamentoDto) => void;
  onDelete: (department: DepartamentoDto) => void;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({ departments, onEdit, onDelete }) => {
  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th style={{ textAlign: 'right' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {departments.map(dept => (
          <tr key={dept.id}>
            <td>{dept.id}</td>
            <td>{dept.nombre}</td>
            <td className="actions-cell">
              <button className="icon-btn edit-btn" onClick={() => onEdit(dept)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <button className="icon-btn delete-btn" onClick={() => onDelete(dept)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};