import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export function Navigation() {
  //nos sirve para mostar el boton en la pagina que queramos
  const location = useLocation();
  const isTasksPage = location.pathname === "/tasks";
  const isReportePage = /^\/reportes\/\d+$/.test(location.pathname); 
  
 
  const [empleadoId, setEmpleadoId] = useState(null);

  useEffect(() => {
    
    const match = location.pathname.match(/^\/reportes\/(\d+)$/);
    if (match) {
      setEmpleadoId(match[1]); // Extraemos el ID del empleado de la URL
    } else {
      setEmpleadoId(null); // Si no hay ID, dejamos el empleadoId como null
    }
  }, [location.pathname]);

  return (
    <div className="flex justify-between items-center p-4">
      <Link to="/tasks">
        <h1 className="font-bold text-3xl mb-4">Recursos Humanos</h1>
      </Link>

      {isTasksPage && (
        <div className="flex gap-2">
          <Link to="/tasks-create" className="bg-indigo-500 px-3 py-2 rounded-lg text-white">
            Crear Empleado
          </Link>
        </div>
      )}

      {isReportePage && empleadoId && (
        <div className="flex gap-2">
          <Link to={`/tasks-reporte-create/${empleadoId}`} className="bg-indigo-500 px-3 py-2 rounded-lg text-white">
            Crear Reporte
          </Link>
        </div>
      )}
    </div>
  );
}
