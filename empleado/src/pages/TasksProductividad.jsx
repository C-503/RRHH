import React, { useEffect, useState } from 'react';
import { getAllTasks as getEmpleados } from '../api/tasks.api';
import { getAllTasks as getProductividades } from '../api/tasks.api.produc';

export function TasksProductividad() {
  const [empleados, setEmpleados] = useState([]);
  const [productividades, setProductividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [empRes, prodRes] = await Promise.all([
        getEmpleados(),
        getProductividades()
      ]);
      setEmpleados(empRes.data);
      setProductividades(prodRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Regla: productivo si inpro_ev >= 60 y inpro_TC >= 5
  function esProductivo(prod) {
    return prod.inpro_ev >= 60 && prod.inpro_TC >= 4;
  }

  const handleEdit = (prod) => {
    // Redirige a TasksProduct con el id de la productividad
    window.location.href = `/tasks-product/${prod.Productivo_id}`;
  };

  if (loading) return <div className="text-gray-300">Cargando productividad...</div>;

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-center">Productividad de empleados</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 shadow-md rounded-lg">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Empleado</th>
              <th className="px-4 py-2 text-left text-gray-400">Fecha</th>
              <th className="px-4 py-2 text-center text-gray-400">Tareas Realizadas</th>
              <th className="px-4 py-2 text-center text-gray-400">Horas Trabajadas</th>
              <th className="px-4 py-2 text-center text-gray-400">Eficiencia (%)</th>
              <th className="px-4 py-2 text-center text-gray-400">Estado</th>
              <th className="px-4 py-2 text-center text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productividades.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-4">No hay registros de productividad.</td>
              </tr>
            )}
            {productividades.map(prod => {
              const empleado = empleados.find(e => e.id_empleado === prod.emplaod || e.id_empleado === prod.empleado);
              return (
                <tr key={prod.Productivo_id} className="hover:bg-zinc-800">
                  <td className="border px-4 py-2 font-medium whitespace-nowrap">{empleado ? `${empleado.nombre} ${empleado.apellido}` : 'Desconocido'}</td>
                  <td className="border px-4 py-2">{prod.fecha || '-'}</td>
                  <td className="border px-4 py-2 text-center">{prod.inpro_TC}</td>
                  <td className="border px-4 py-2 text-center">{prod.inpro_horasT}</td>
                  <td className="border px-4 py-2 text-center">{prod.inpro_ev}</td>
                  <td className="border px-4 py-2 text-center">
                    {esProductivo(prod) ? (
                      <span className="text-green-400 font-bold">Productivo</span>
                    ) : (
                      <span className="text-red-400 font-bold">No productivo</span>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                      onClick={() => handleEdit(prod)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
