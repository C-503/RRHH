import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTasks as getAllNominas } from '../api/tasks.api.nomina';
import { getAllTasks as getAllEmpleados } from '../api/tasks.api';

const ListaNominas = () => {
  const [nominas, setNominas] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  const fetchDatos = async () => {
    try {
      const [nominasRes, empleadosRes] = await Promise.all([
        getAllNominas(),
        getAllEmpleados(),
      ]);
      setNominas(nominasRes.data);
      setEmpleados(empleadosRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setError('Hubo un error al cargar los datos.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const obtenerNombreCompleto = (empleadoId) => {
    // Buscamos por id o id_empleado
    const empleado = empleados.find((emp) => emp.id === empleadoId || emp.id_empleado === empleadoId);
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Empleado no encontrado';
  };

  // Filtrar las nóminas según el tipo seleccionado
  const nominasFiltradas = filtroTipo === 'Todos'
    ? nominas
    : nominas.filter(nomina => {
        // Puede ser nomina.nomina_tipo o nomina.nom_tipo según el backend
        const tipo = nomina.nomina_tipo || nomina.nom_tipo;
        return tipo && tipo.toLowerCase() === filtroTipo.toLowerCase();
      });

  if (loading) return <p className="text-gray-300">Cargando nóminas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <h1 className="text-2xl font-bold mb-4">Listado de Todas las Nóminas</h1>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filtrar por tipo de nómina:</label>
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="bg-zinc-800 text-white px-3 py-1 rounded"
        >
          <option value="Todos">Todos</option>
          <option value="Mensual">Mensual</option>
          <option value="Quincenal">Quincenal</option>
          <option value="Semanal">Semanal</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 shadow-md rounded-lg">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">ID Nómina</th>
              <th className="px-4 py-2 text-left text-gray-400">Empleado</th>
              <th className="px-4 py-2 text-left text-gray-400">Fecha</th>
              <th className="px-4 py-2 text-center text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {nominasFiltradas.map((nomina) => (
              <tr key={nomina.nomina_id || nomina.id} className="hover:bg-zinc-800">
                <td className="border px-4 py-2">{nomina.nomina_id || nomina.id}</td>
                <td className="border px-4 py-2">{obtenerNombreCompleto(nomina.empleado)}</td>
                <td className="border px-4 py-2">{nomina.nom_fecha}</td>
                <td className="border px-4 py-2 text-center">
                  <Link
                    to={`/tasks-boton/${nomina.empleado}/${nomina.nomina_id || nomina.id}`}
                    state={{ from: "rep-nomina" }}
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
            {nominasFiltradas.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-4">No hay nóminas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaNominas;