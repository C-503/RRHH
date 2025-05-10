import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Navigation() {
  const location = useLocation();

  const isTasksPage = location.pathname === "/tasks";
  const isReportePage = /^\/reportes\/\d+$/.test(location.pathname);
  const isTasksCreatePage = location.pathname === "/tasks-indem-pages";
  const isTasksIdPage = location.pathname === "/tasks";
  const isTasksNominaPage = location.pathname === "/tasks";
  //const isTasksIdPage = /^\/tasks\/\d+$/.test(location.pathname);

  const [empleadoId, setEmpleadoId] = useState(null);

  useEffect(() => {
    const match = location.pathname.match(/^\/reportes\/(\d+)$/);
    if (match) {
      setEmpleadoId(match[1]);
    } else {
      setEmpleadoId(null);
    }
  }, [location.pathname]);

  return (
    <div className="flex justify-between items-center p-4">
      <Link to="/tasks">
        <h1 className="font-bold text-3xl mb-4">Recursos Humanos</h1>
      </Link>

      <div className="flex gap-2">
        {/* Botón permanente C-503 */}
        <Link to="/tasks-clemonoit503" className="font-bold px-3 py-2 rounded-lg text-white">
          C-503
        </Link>

        {isTasksPage && (
          <Link to="/tasks-create" className="bg-indigo-500 px-3 py-2 rounded-lg text-white">
            Crear Empleado
          </Link>
        )}

        {isReportePage && empleadoId && (
          <Link to={`/tasks-reporte-create/${empleadoId}`} className="bg-indigo-500 px-3 py-2 rounded-lg text-white">
            Crear Reporte
          </Link>
        )}

        {isTasksIdPage && (
          <Link to="/tasks-indem-pages" className="bg-green-500 px-3 py-2 rounded-lg text-white">
            Ver Indemnización
          </Link>
        )}

        {isTasksCreatePage && (
          <Link to="/tasks-indem" className="bg-red-400 px-3 py-2 rounded-lg text-white">
            Crear Indemnizacion
          </Link>
        )}

        {isTasksNominaPage && (
          <Link to="/tasks-nomina" className="bg-yellow-500 px-3 py-2 rounded-lg text-white">
            Ver Nomina
          </Link>
        )}

      </div>
    </div>
  );
}

