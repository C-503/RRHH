import {useNavigate} from "react-router-dom";

export function TaskCard({task}) {

    const navigate = useNavigate();
//tarjeta de vista
    return (
        <div 
        className="bg-zinc-800 p-4 w-35 h-20 hover:bg-zinc-700 hover:cursor-pointer"
        
        onClick={() => {
         navigate(`/tasks/${task.id_empleado}`);
        }}
        >
            <p className="font-bold uppercase">{task.nombre}</p>
            <p className="text-salte-350">{task.apellido}</p>
        </div>
    );
}


