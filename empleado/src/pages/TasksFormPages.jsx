import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTask, deleteTask, updateTask, getTask } from "../api/tasks.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export function TasksFormPages() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const params = useParams();

    const onSubmit = handleSubmit(async data => {
        if (params.id) {
            await updateTask(params.id, data);
            toast.success("Empleado actualizado con éxito", {
                style: {
                    background: "#383838",
                    color: "#FFD600"
                }
            });
        } else {
            await createTask({ ...data, estatus: 'Activo' }); // Establecemos 'Activo' al crear
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
            if (params.id) {
                const { data: { nombre, apellido, departamento, pueesto, salario_base, fecha_contratacion, estatus } } = await getTask(params.id);
                setValue("nombre", nombre);
                setValue("apellido", apellido);
                setValue("departamento", departamento);
                setValue("pueesto", pueesto);
                setValue("salario_base", salario_base);
                setValue("fecha_contratacion", fecha_contratacion);
                setValue("estatus", estatus); 
            } else {
                setValue("estatus", 'Activo'); // Establecemos el valor por defecto para creación
            }
        }
        loadTask();
    }, [params.id, setValue]);

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Nombre"
                    {...register("nombre", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3 text-white"
                />
                {errors.nombre && <span className="text-red-400">Este campo es requerido</span>}
                <input type="text" placeholder="Apellido"
                    {...register("apellido", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3 text-white"
                />
                {errors.apellido && <span className="text-red-400">Este campo es requerido</span>}
                <input type="text" placeholder="Departamento"
                    {...register("departamento", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3 text-white"
                />
                {errors.departamento && <span className="text-red-400">Este campo es requerido</span>}
                <input type="text" placeholder="Puesto"
                    {...register("pueesto", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3 text-white"
                />
                {errors.pueesto && <span className="text-red-400">Este campo es requerido</span>}
                <input type="text" placeholder="Salario"
                    {...register("salario_base", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3 text-white"
                />
                {errors.salario_base && <span className="text-red-400">Este campo es requerido</span>}
                <input type="date" placeholder="Fecha de contratación"
                    {...register("fecha_contratacion", { required: true })}
                    className="bg-zinc-700 p-3 rounded-lg block w-full mb-3 text-white"
                />
                {errors.fecha_contratacion && <span className="text-red-400">Este campo es requerido</span>}
                <input
                    type="text"
                    placeholder="Estatus"
                    {...register("estatus", { required: true })}
                    className="bg-zinc-800 p-3 rounded-lg block w-full mb-3 text-gray-400"
                    readOnly 
                />
                {errors.estatus && <span className="text-red-400">Este campo es requerido</span>}
                <button
                    className="bg-indigo-500 p-3 rounded-lg block w-full mt-3 text-white"
                >Guardar</button>
            </form>

            <div className="flex gap-2 justify-end mt-3">
                <button
                    type="button"
                    onClick={() => navigate("/tasks")}
                    className="bg-green-500 p-3 rounded-lg block w-35 text-white"
                >
                    Regresar
                </button>
                {params.id && (
                    <div className="flex gap-2">
                        <button
                            className="bg-yellow-500 p-3 rounded-lg block w-35 text-white"
                            type="button"
                            //onClick={() => navigate(`/reportes/${params.id}`)}
                            onClick={() => navigate(`/tasks-list-prestaciones/${params.id}`)}
                        >
                            Prestaciones
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/tasks-nomina/${params.id}`)}
                            className="bg-orange-500 p-3 rounded-lg block w-35 text-white"
                        >
                            Nomina
                        </button>
                        <button
                            className="bg-red-500 p-3 rounded-lg block w-35 text-white"
                            type="button"
                            onClick={async () => {
                                const accepted = window.confirm("¿Estás seguro de eliminar?");
                                if (accepted) {
                                    await deleteTask(params.id);
                                    toast.success("Empleado eliminado con éxito", {
                                        style: {
                                            background: "#383838",
                                            color: "#FFD600"
                                        }
                                    });
                                    navigate("/tasks");
                                }
                            }}
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}