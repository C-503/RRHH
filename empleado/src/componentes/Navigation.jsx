import {Link} from "react-router-dom";
export function Navigation() {
    return (
        <div className="flex justify-between p-4 ">
         <Link to ="/tasks">
             <h1 className="font-bold text-3x1 mb-4">Recursos Humanos</h1>
         </Link>
        <button className="bg-indigo-500 px-3 py-2 rounded-lg">
        <Link to="/tasks-create">Crear Empleado</Link>
        </button>
        <button className="bg-indigo-500 px-3 py-2 rounded-lg">
        <Link to="/tasks-boton">Nomina</Link>
        </button>
    </div>
    );
    }

