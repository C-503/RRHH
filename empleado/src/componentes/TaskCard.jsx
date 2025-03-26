import {useNavigate} from "react-router-dom";

export function TaskCard({task}) {

    const navigate = useNavigate();

    return (
        <div 
        className="bg-zinc-800 p-4 hover:bg-zinc-700 hover:cursor-pointer"
        
        onClick={() => {
         navigate(`/tasks/${task.id_empleado}`);
        }}
        >
            <h1 className = "font-bold uppercase">{task.id_empleado}</h1>
            <p className="text-slate-400">{task.nombre}</p>
            <p className="text-salte-350">{task.apellido}</p>
            <p className="text-slate-300">{task.fecha_contratacion}</p>
            <p className="text-slate-250">{task.estatus}</p>
        </div>
    );
}


