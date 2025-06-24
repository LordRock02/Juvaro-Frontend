// En: src/components/Forms/DepartmentForm.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import type { DepartamentoDto } from '../../services/departmentService';
import './Form.css'; // Reutilizamos los mismos estilos de formulario

// Definimos las Props que recibirá el formulario
interface DepartmentFormProps {
  onSave: (data: { nombre: string }) => void;
  onCancel: () => void;
  initialData?: DepartamentoDto | null;
  isSaving?: boolean;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({ 
  onSave, 
  onCancel, 
  initialData = null,
  isSaving = false 
}) => {
  const [nombre, setNombre] = useState('');

  // Si se proporcionan datos iniciales (para editar), llenamos el formulario
  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
    } else {
      setNombre(''); // Limpiamos al abrir para crear uno nuevo
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
        alert("El nombre del departamento no puede estar vacío.");
        return;
    }
    onSave({ nombre });
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Departamento</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          required 
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </button>
        <button type="submit" className="integra-serv-primary-btn" disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};
