import React, { useState, useEffect, useCallback } from 'react';
import './DepartmentsPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faTrash, faTableList, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

// Importaciones de lógica
import { DepartmentService, type DepartamentoDto } from '../../services/departmentService';
import { StockService, type StockDto } from '../../services/stockService';
import { ProductService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import type { ProductoDto as FullProductoDto } from '../../services/productService.types';

// Importaciones de componentes de UI
import { Modal } from '../../components/Modal/Modal';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';
import { DepartmentForm } from '../../components/Forms/DepartmentForm';
import { DepartmentTable } from '../../components/DepartmentTable/DepartmentTable';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { AddStockForm } from '../../components/Forms/AddStockForm'; // <-- Se importa el nuevo formulario

const DepartmentsPage: React.FC = () => {
    // Estados para Departamentos
    const [departments, setDepartments] = useState<DepartamentoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para Stock
    const [departmentStock, setDepartmentStock] = useState<StockDto[]>([]);
    const [stockLoading, setStockLoading] = useState<boolean>(false);
    const [stockToDelete, setStockToDelete] = useState<StockDto | null>(null);

    // Estados para el modal de "Agregar Stock"
    const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
    const [availableProducts, setAvailableProducts] = useState<FullProductoDto[]>([]);
    
    // Estados para otros modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [departmentToEdit, setDepartmentToEdit] = useState<DepartamentoDto | null>(null);
    const [departmentToDelete, setDepartmentToDelete] = useState<DepartamentoDto | null>(null);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

    const departmentService = DepartmentService.getInstance();
    const stockService = StockService.getInstance();
    const productService = ProductService.getInstance();
    const { currentUser } = useAuth();

    // Lógica de carga de datos...
    const fetchDepartments = useCallback(async () => {
        try {
            setLoading(true);
            setDepartments(await departmentService.listarDepartamentos());
        } catch (err) { setError('No se pudieron cargar los departamentos.'); } 
        finally { setLoading(false); }
    }, [departmentService]);

    useEffect(() => { fetchDepartments(); }, [fetchDepartments]);

    const fetchStockForDepartment = useCallback(async () => {
        if (!selectedDepartmentId) {
            setDepartmentStock([]);
            return;
        }
        try {
            setStockLoading(true);
            const allStock = await stockService.listarStocks();
            const filteredStock = allStock.filter(stock => stock.departamentoId === parseInt(selectedDepartmentId));
            setDepartmentStock(filteredStock);
        } catch (err) { setError('No se pudo cargar el stock del departamento.'); } 
        finally { setStockLoading(false); }
    }, [selectedDepartmentId, stockService]);

    useEffect(() => { fetchStockForDepartment(); }, [fetchStockForDepartment]);

    // Lógica CRUD de Departamentos...
    const handleCreateDepartment = async (data: { nombre: string }) => {
        await departmentService.registrarDepartamento(data);
        setIsCreateModalOpen(false);
        fetchDepartments();
    };
    const handleUpdateDepartment = async (data: { nombre: string }) => {
        if (!departmentToEdit) return;
        await departmentService.actualizarDepartamento(departmentToEdit.id, data);
        setDepartmentToEdit(null);
        fetchDepartments();
    };
    const handleDeleteDepartment = async () => {
        if (!departmentToDelete) return;
        await departmentService.eliminarDepartamento(departmentToDelete.id);
        setDepartmentToDelete(null);
        fetchDepartments();
    };
    const handleEditFromTable = (department: DepartamentoDto) => {
        setIsManageModalOpen(false);
        setDepartmentToEdit(department);
    };
    const handleDeleteFromTable = (department: DepartamentoDto) => {
        setDepartmentToDelete(department);
    };
    
    // Lógica de Stock...
    const handleStockChange = async (stockItem: StockDto, newQuantity: number) => {
        if (newQuantity === 0) {
            setStockToDelete(stockItem);
            return;
        }
        if (newQuantity < 0) return;
        setDepartmentStock(currentStock => currentStock.map(item => item.id === stockItem.id ? { ...item, cantidad: newQuantity } : item));
        try {
            await stockService.actualizarStock(stockItem.id, { cantidad: newQuantity });
        } catch (error) {
            console.error("Error al actualizar el stock, revirtiendo.", error);
            fetchStockForDepartment();
        }
    };
    const handleDeleteStock = async () => {
        if (!stockToDelete) return;
        try {
            await stockService.eliminarStock(stockToDelete.id);
            setDepartmentStock(prevStock => prevStock.filter(item => item.id !== stockToDelete.id));
        } catch (error) {
            console.error("Error al eliminar el stock.", error);
        } finally {
            setStockToDelete(null);
        }
    };
    
    // Lógica para registrar un nuevo stock...
    const handleOpenAddStockModal = async () => {
        try {
            const products = await productService.listarProductos();
            const existingProductIds = new Set(departmentStock.map(s => s.producto?.id));
            const productsNotYetInStock = products.filter(p => !existingProductIds.has(p.id));
            setAvailableProducts(productsNotYetInStock);
            setIsAddStockModalOpen(true);
        } catch (error) {
            console.error("Error al cargar la lista de productos", error);
        }
    };

    const handleRegisterStock = async (data: { productId: string; cantidad: number }) => {
        if (!selectedDepartmentId) return;
        try {
            await stockService.registrarStock({
                productoId: parseInt(data.productId),
                departamentoId: parseInt(selectedDepartmentId),
                cantidad: data.cantidad
            });
            setIsAddStockModalOpen(false);
            fetchStockForDepartment(); // Refresh
        } catch (error) {
            console.error("Error al registrar el nuevo stock", error);
            alert("No se pudo agregar el producto al stock. Es posible que ya exista.");
        }
    };

    const handleSelectDepartment = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDepartmentId(e.target.value);
    };

    return (
        <>
            <div className="departments-page-container">
                <div className="page-header">
                    <h1 className="page-title">Gestión de Departamentos y Stock</h1>
                    <div className="header-actions">
                        <div className="styled-selector-wrapper">
                            <label htmlFor="department-selector" className="styled-selector-label">Departamento Activo:</label>
                            <select id="department-selector" value={selectedDepartmentId} onChange={handleSelectDepartment} className="styled-selector" disabled={loading}>
                                <option value="">{loading ? 'Cargando...' : '-- Seleccionar --'}</option>
                                {departments.map(dept => (<option key={dept.id} value={dept.id}>{dept.nombre}</option>))}
                            </select>
                        </div>
                        <button className="integra-serv-primary-btn" onClick={() => setIsManageModalOpen(true)}>
                            <FontAwesomeIcon icon={faTableList} />
                            <span>Gestionar Departamentos</span>
                        </button>
                    </div>
                </div>

                {selectedDepartmentId && (
                    <div className="add-stock-container">
                         <button className="integra-serv-primary-btn" onClick={handleOpenAddStockModal}>
                            <FontAwesomeIcon icon={faPlusCircle} />
                            <span>Agregar Producto al Stock</span>
                        </button>
                    </div>
                )}
                
                <div className="departments-page-content">
                    {!selectedDepartmentId ? (
                        <div className="dashboard-placeholder">
                            <h2>Dashboard Principal</h2>
                            <p>Seleccione un departamento para ver su stock.</p>
                        </div>
                    ) : stockLoading ? (
                        <p>Cargando stock...</p>
                    ) : (
                        <div className="products-grid">
                            {departmentStock.map(stockItem => (
                                stockItem.producto ? (
                                    <ProductCard
                                        key={stockItem.id}
                                        product={stockItem.producto as FullProductoDto}
                                        currentUser={currentUser}
                                        isStockView={true}
                                        stockQuantity={stockItem.cantidad}
                                        onStockIncrement={() => handleStockChange(stockItem, stockItem.cantidad + 1)}
                                        onStockDecrement={() => handleStockChange(stockItem, stockItem.cantidad - 1)}
                                        callbacks={{}}
                                    />
                                ) : null
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Modales --- */}

            <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Gestionar Departamentos">
                <div className="modal-content-wrapper"><DepartmentTable departments={departments} onEdit={handleEditFromTable} onDelete={handleDeleteFromTable}/></div>
                <div className="modal-footer"><button className="integra-serv-primary-btn" onClick={() => { setIsManageModalOpen(false); setIsCreateModalOpen(true); }}><FontAwesomeIcon icon={faPlus} /><span>Agregar Departamento</span></button></div>
            </Modal>
            
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Crear Departamento">
                <DepartmentForm onSave={handleCreateDepartment} onCancel={() => setIsCreateModalOpen(false)} isSaving={loading} />
            </Modal>

            <Modal isOpen={!!departmentToEdit} onClose={() => setDepartmentToEdit(null)} title="Editar Departamento">
                {departmentToEdit && <DepartmentForm initialData={departmentToEdit} onSave={handleUpdateDepartment} onCancel={() => setDepartmentToEdit(null)} isSaving={loading} />}
            </Modal>

            <ConfirmModal isOpen={!!departmentToDelete} onClose={() => setDepartmentToDelete(null)} onConfirm={handleDeleteDepartment} title="Confirmar Eliminación" message={`¿Seguro que quieres eliminar el departamento "${departmentToDelete?.nombre}"?`} />
            
            {/* --- MODIFICADO: Ahora se usa el componente AddStockForm --- */}
            <Modal isOpen={isAddStockModalOpen} onClose={() => setIsAddStockModalOpen(false)} title="Agregar Producto al Stock">
                <AddStockForm 
                    availableProducts={availableProducts}
                    onSave={handleRegisterStock}
                    onCancel={() => setIsAddStockModalOpen(false)}
                />
            </Modal>
            
            <ConfirmModal
                isOpen={!!stockToDelete}
                onClose={() => setStockToDelete(null)}
                onConfirm={handleDeleteStock}
                title="Confirmar Eliminación de Stock"
                message={`¿Seguro que quieres eliminar el producto "${stockToDelete?.producto?.nombre}" del stock de este departamento?`}
            />
        </>
    );
};

export default DepartmentsPage;