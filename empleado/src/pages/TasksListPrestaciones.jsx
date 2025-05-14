import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const TasksListPrestaciones = () => {
  const [prestaciones, setPrestaciones] = useState([]);
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  console.log("ID del empleado desde la URL:", id);

  // Obtiene prestaciones por empleado
  const fetchPrestaciones = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tasks/api/v1/prestacion_dias/empleado/${id}/`);
      console.log("Datos de prestaciones recibidos:", response.data);
      setPrestaciones(response.data);
    } catch (error) {
      console.error("Error al obtener las prestaciones:", error);
    }
  };

  // Obtiene info del empleado
  const fetchEmpleado = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tasks/api/v1/empleados/${id}/`);
      if (response.data) {
        setEmpleado(response.data);
      } else {
        console.error("Empleado no encontrado.");
      }
    } catch (error) {
      console.error("Error al obtener el empleado:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchPrestaciones(), fetchEmpleado()]);
      setLoading(false);
    };
    loadData();
  }, [id]);

  if (loading) return <p className="text-gray-300">Cargando prestaciones...</p>;
  if (!empleado) return <p className="text-gray-300">Cargando datos del empleado...</p>;

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <h1 className="text-2xl font-bold mb-4">Prestaciones de {empleado.nombre} {empleado.apellido}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 shadow-md rounded-lg">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">ID</th>
              <th className="px-4 py-2 text-left text-gray-400">Días Disp.</th>
              <th className="px-4 py-2 text-left text-gray-400">Días Tomados</th>
              <th className="px-4 py-2 text-left text-gray-400">Estado</th>
              <th className="px-4 py-2 text-center text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestaciones.map((prestacion) => (
              <tr key={prestacion.prestacion_dias_id} className="hover:bg-zinc-800">
                <td className="border px-4 py-2">{prestacion.prestacion_dias_id}</td>
                <td className="border px-4 py-2">{prestacion.dias_disponibles}</td>
                <td className="border px-4 py-2">{prestacion.dias_tomados}</td>
                <td className="border px-4 py-2">{prestacion.estado}</td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    to={`/tasks-prestacion/${id}/${prestacion.prestacion_dias_id}`}
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
            {prestaciones.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-4">No hay prestaciones registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksListPrestaciones;