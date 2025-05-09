import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getTask } from "../api/tasks.api"; // Asegúrate de que este método está correctamente configurado para obtener los datos del empleado
import {
  createTask as createReporte,
  updateTask as updateReporte,
  getTask as getReporte,
} from "../api/tasks.api.reporte"; // Asegúrate de que estos métodos están bien definidos en tu API

export function TasksReporte() {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();
    const { id: empleadoId, reporte_id } = useParams();

    useEffect(() => {
        async function loadData() {
            // Verificar que el empleadoId no esté vacío
            if (empleadoId) {
                try {
                    const { data: { nombre, apellido } } = await getTask(empleadoId);
                    // Establecer el valor completo del empleado en el campo "empleado"
                    setValue("empleado", `${nombre} ${apellido}`);
                } catch (error) {
                    console.error("Error al cargar los datos del empleado:", error);
                    toast.error("No se pudo cargar la información del empleado.");
                }
            }

            // Si hay reporte_id, se carga el reporte existente para editar
            if (reporte_id) {
                const { data: { reporte_tipo, reporte_desc, reporte_fecha } } = await getReporte(reporte_id);
                setValue("reporte_tipo", reporte_tipo);
                setValue("reporte_desc", reporte_desc);
                setValue("reporte_fecha", reporte_fecha);
            } else {
                // Si no hay reporte_id, aseguramos que los campos de reporte estén vacíos
                setValue("reporte_tipo", "");
                setValue("reporte_desc", "");
                setValue("reporte_fecha", "");
            }
        }

        loadData();
    }, [empleadoId, reporte_id, setValue]);

    const onSubmit = handleSubmit(async (data) => {
        if (!empleadoId) {
            toast.error("Empleado no disponible.");
            return;
        }

        const dataToSend = {
            reporte_tipo: data.reporte_tipo,
            reporte_desc: data.reporte_desc,
            reporte_fecha: data.reporte_fecha,
            empleado: empleadoId,
        };

        try {
            if (reporte_id) {
                // Si existe reporte_id, se actualiza el reporte
                await updateReporte(reporte_id, dataToSend);
                toast.success("Reporte actualizado con éxito.");
            } else {
                // Si no existe reporte_id, se crea un nuevo reporte
                await createReporte(dataToSend);
                toast.success("Reporte creado con éxito.");
            }
            navigate(`/tasks`);
        } catch (error) {
            console.error("Error al guardar el reporte:", error);
            toast.error("Error al guardar el reporte.");
        }
    });

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-5 text-white">
                {reporte_id ? "Editar" : "Agregar"} Reporte
            </h1>

            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Empleado</label>
                    <input
                        type="text"
                        id="empleado"
                        value={empleadoId ? "Cargando..." : ""}  // Mostrar "Cargando..." mientras se carga el nombre
                        readOnly
                        {...register("empleado", { required: "El nombre del empleado es obligatorio" })}
                        className="bg-zinc-700 p-3 rounded-lg block w-full mb-1 text-gray-400 cursor-not-allowed"
                    />
                    {errors.empleado && <span className="text-red-500 text-xs">{errors.empleado.message}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="reporte_tipo" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Reporte</label>
                    <input
                        id="reporte_tipo"
                        type="text"
                        placeholder="Tipo de Reporte"
                        {...register("reporte_tipo", { required: "El tipo de reporte es requerido" })}
                        className={`bg-zinc-700 p-3 rounded-lg block w-full mb-1 ${errors.reporte_tipo ? 'border border-red-500' : 'border border-transparent'}`}
                    />
                    {errors.reporte_tipo && <span className="text-red-500 text-xs">{errors.reporte_tipo.message}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="reporte_desc" className="block text-sm font-medium text-gray-300 mb-1">Descripción del Reporte</label>
                    <input
                        id="reporte_desc"
                        type="text"
                        placeholder="Descripción"
                        {...register("reporte_desc", { required: "La descripción del reporte es requerida" })}
                        className={`bg-zinc-700 p-3 rounded-lg block w-full mb-1 ${errors.reporte_desc ? 'border border-red-500' : 'border border-transparent'}`}
                    />
                    {errors.reporte_desc && <span className="text-red-500 text-xs">{errors.reporte_desc.message}</span>}
                </div>

                <div className="mb-4">
                    <label htmlFor="reporte_fecha" className="block text-sm font-medium text-gray-300 mb-1">Fecha del Reporte</label>
                    <input
                        id="reporte_fecha"
                        type="date"
                        {...register("reporte_fecha", { required: "La fecha es requerida" })}
                        className={`bg-zinc-700 p-3 rounded-lg block w-full mb-1 ${errors.reporte_fecha ? 'border border-red-500' : 'border border-transparent'}`}
                    />
                    {errors.reporte_fecha && <span className="text-red-500 text-xs">{errors.reporte_fecha.message}</span>}
                </div>

                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-lg block w-full mt-5 transition duration-200"
                >
                    {reporte_id ? "Actualizar" : "Guardar"} Reporte
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/tasks")}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded-lg block w-full mt-5 transition duration-200"
                >
                    Regresar
                </button>
            </form>
        </div>
    );
}



