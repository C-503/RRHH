import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const TasksNominaPages = () => {
  const [nominas, setNominas] = useState([]);
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id_empleado } = useParams(); // <-- extrae el ID desde la URL

  // Obtener nóminas del empleado
  const fetchNominas = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tasks/api/v1/nomina/empleado/${id_empleado}/`);
      setNominas(response.data);
    } catch (error) {
      console.error('Error al obtener las nóminas:', error);
    }
  };

  // Obtener info del empleado
  const fetchEmpleado = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/tasks/api/v1/empleados/${id_empleado}/`);
      console.log('Empleado response data:', response.data); 
      if (response.data) {
        setEmpleado(response.data); 
      } else {
        console.error('Empleado no encontrado.');
      }
    } catch (error) {
      console.error('Error al obtener el empleado:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchNominas(), fetchEmpleado()]);
      setLoading(false);
    };
    loadData();
  }, [id_empleado]);

  if (loading) return <p className="text-gray-300">Cargando nóminas...</p>;

  if (!empleado) return <p className="text-gray-300">Cargando datos del empleado...</p>;

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <h1 className="text-2xl font-bold mb-4">Nóminas de {empleado.nombre} {empleado.apellido}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 shadow-md rounded-lg">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">ID Nómina</th>
              <th className="px-4 py-2 text-left text-gray-400">Fecha</th>
              <th className="px-4 py-2 text-center text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {nominas.map((nomina) => (
              <tr key={nomina.nomina_id} className="hover:bg-zinc-800">
                <td className="border px-4 py-2">{nomina.nomina_id}</td>
                <td className="border px-4 py-2">{nomina.nom_fecha}</td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    to={`/tasks-boton/${id_empleado}/${nomina.nomina_id}`}
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
            {nominas.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center text-gray-400 py-4">No hay nóminas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksNominaPages;
