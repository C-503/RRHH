import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTask, deleteTask, updateTask, getTask } from "../api/tasks.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";


export function TasksFormPages() {

    const { register, handleSubmit, formState: { errors}, setValue } = useForm()
    const navigate = useNavigate();
    const params = useParams();

    const onSubmit = handleSubmit(async data => {
        if(params.id){
            await updateTask(params.id, data);
            toast.success("Empleado actualizado con éxito", {
                style: {
                    background: "#383838",
                    color: "#FFD600"
                }
            });
        }else{
            await createTask(data);
            toast.success("Empleado creado con éxito", {
                style: {
                    background: "#383838",
                    color: "#FFD600"
                }
            });
        }
        navigate("/tasks");
    });

    useEffect(() => {
       async function loadTask() {
            if(params.id){
                const {data: {nombre, apellido, fecha_contratacion, estatus}} = await getTask(params.id);
                setValue("nombre", nombre);
                setValue("apellido", apellido);
                setValue("fecha_contratacion", fecha_contratacion);
                setValue("estatus", estatus);

            }
        }
        loadTask();

    }, []);

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Nombre"
                    {...register("nombre", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                />
                {errors.nombre && <span>Este campo es requerido</span>}

                <input type="text" placeholder="Apellido"
                    {...register("apellido", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                />
                {errors.apellido && <span>Este campo es requerido</span>}
                <input type="date" placeholder="Fecha de contratación"
                    {...register("fecha_contratacion", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                />
                {errors.fecha_contratacion && <span>Este campo es requerido</span>}
                <input type="text" placeholder="Estatus"
                    {...register("estatus", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
                />
                {errors.estatus && <span>Este campo es requerido</span>}
                <button 
                className="bg-indigo-500 p-3 rounded-lg block w-full mt-3"
                >Guardar</button>
            </form>

            {params.id && (
                <div className="flex justify-end">
                     <button 
            className="bg-red-500 p-3 rounded-lg block w-48 mt-3"
            onClick={async () =>{
               const accepted = window.confirm("¿Estás seguro de eliminar")
               if(accepted){
                  await deleteTask(params.id);
                   toast.success("Empleado eliminado con éxito", {
                    style: {
                        background: "#383838",
                        color: "#FFD600"
                    }
                });
                navigate("/tasks");
               }
            }}>
                Eliminar
                </button> 
                </div>
                )}
        </div>
    )
}