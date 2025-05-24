import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllTasks as getEmpleados } from '../api/tasks.api';
import { createTask as createProductividad, getTask as getProductividad, updateTask as updateProductividad, deleteTask as deleteProductividad } from '../api/tasks.api.produc';

export function TasksProduct() {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState({
    empleado: '',
    fecha: '',
    inpro_TC: '',
    inpro_horasT: '',
    inpro_ev: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmpleados() {
      setLoading(true);
      const res = await getEmpleados();
      setEmpleados(res.data);
      setLoading(false);
    }
    fetchEmpleados();
  }, []);

  useEffect(() => {
    async function fetchProductividad() {
      if (id) {
        setIsEditing(true);
        const res = await getProductividad(id);
        const prod = res.data;
        setForm({
          empleado: prod.empleado || prod.emplaod || '',
          fecha: prod.fecha || '',
          inpro_TC: prod.inpro_TC || '',
          inpro_horasT: prod.inpro_horasT || '',
          inpro_ev: prod.inpro_ev || '',
        });
      }
    }
    fetchProductividad();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: value };
    // Si cambian tareas o horas, recalcula eficiencia
    if (name === 'inpro_TC' || name === 'inpro_horasT') {
      const tareas = name === 'inpro_TC' ? Number(value) : Number(newForm.inpro_TC);
      const horas = name === 'inpro_horasT' ? Number(value) : Number(newForm.inpro_horasT);
      if (horas > 0) {
        // Eficiencia = tareas / horas * 100
        newForm.inpro_ev = ((tareas / horas) * 100).toFixed(2);
      } else {
        newForm.inpro_ev = '';
      }
    }
    setForm(newForm);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (isEditing) {
      await updateProductividad(id, {
        empleado: form.empleado,
        fecha: form.fecha,
        inpro_TC: form.inpro_TC,
        inpro_horasT: form.inpro_horasT,
        inpro_ev: form.inpro_ev,
      });
    } else {
      await createProductividad({
        empleado: form.empleado,
        fecha: form.fecha,
        inpro_TC: form.inpro_TC,
        inpro_horasT: form.inpro_horasT,
        inpro_ev: form.inpro_ev,
      });
    }
    navigate('/tasks-productividad');
  };

  const handleCancel = () => {
    navigate('/tasks-productividad');
  };

  const handleDelete = async () => {
    if (id && window.confirm('¿Seguro que deseas eliminar este registro de productividad?')) {
      await deleteProductividad(id);
      navigate('/tasks-productividad');
    }
  };

  if (loading) return <div className="text-gray-300">Cargando empleados...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">{isEditing ? 'Editar Productividad' : 'Registrar Productividad'}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Empleado</label>
          <select
            name="empleado"
            value={form.empleado}
            onChange={handleChange}
            required
            className="bg-zinc-700 p-3 rounded-lg block w-full text-white"
            disabled={isEditing} // No permitir cambiar empleado al editar
          >
            <option value="">Seleccione un empleado</option>
            {empleados.map(emp => (
              <option key={emp.id_empleado} value={emp.id_empleado}>
                {emp.nombre} {emp.apellido}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            className="bg-zinc-700 p-3 rounded-lg block w-full text-white"
            disabled={isEditing} // No permitir cambiar fecha al editar
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tareas Completadas</label>
          <input
            type="number"
            name="inpro_TC"
            value={form.inpro_TC}
            onChange={handleChange}
            required
            min="0"
            className="bg-zinc-700 p-3 rounded-lg block w-full text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Horas Trabajadas</label>
          <input
            type="number"
            name="inpro_horasT"
            value={form.inpro_horasT}
            onChange={handleChange}
            required
            min="0"
            className="bg-zinc-700 p-3 rounded-lg block w-full text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Eficiencia (%)</label>
          <input
            type="number"
            name="inpro_ev"
            value={form.inpro_ev}
            onChange={handleChange}
            required
            min="0"
            max="100"
            step="0.01"
            className="bg-zinc-700 p-3 rounded-lg block w-full text-white"
            readOnly // Solo lectura, se calcula automáticamente
          />
        </div>
        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-lg w-1/2"
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg w-1/2"
          >
            Cancelar
          </button>
        </div>
        {isEditing && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-800 hover:bg-red-900 text-white font-bold p-3 rounded-lg w-full"
            >
              Eliminar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
