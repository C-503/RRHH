import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

// API Importes
// C503
import { getTask } from "../api/tasks.api";
// Importamos funciones para prestaciones desde el archivo específico
import {
  getAllTasks, 
  createTask, 
  updateTask   

} from "../api/tasks.api.prestacion";
// C503

export function Tasksprestacion() {
  const { id: empleadoId } = useParams(); 
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [empleado, setEmpleado] = useState(null);
  const [prestacionExistenteId, setPrestacionExistenteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // 1. Cargamos datos del empleado
        const resEmpleado = await getTask(empleadoId);
        setEmpleado(resEmpleado.data);
  
        // 2. Buscamos prestaciones existentes
        const resPrestaciones = await getAllTasks();
        console.log("Prestaciones obtenidas:", resPrestaciones.data);
  
        const prestacionEncontrada = resPrestaciones.data.find(
          (p) => String(p.empleado) === String(empleadoId)
        );
  
        if (prestacionEncontrada) {
          setPrestacionExistenteId(prestacionEncontrada.prestacion_id);
          reset({
            prestacion_tipo: prestacionEncontrada.prestacion_tipo,
            prestacion_monto: prestacionEncontrada.prestacion_monto,
          });
        } else {
          setPrestacionExistenteId(null);
          reset({ prestacion_tipo: "", prestacion_monto: "" });
        }
  
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        toast.error("No se pudieron cargar los datos necesarios.");
      } finally {
        setIsLoading(false);
      }
    }
  
    if (empleadoId) {
      loadData();
    }
  }, [empleadoId, navigate, reset]);
  

  const isEditing = prestacionExistenteId !== null;

  const onSubmit = handleSubmit(async (data) => {
     if (!empleado) {
       toast.error("Datos del empleado no disponibles.");
       return;
    }

    const dataToSend = {
      prestacion_tipo: data.prestacion_tipo,
      prestacion_monto: data.prestacion_monto,
      empleado: empleadoId,
    };

    try {
      if (isEditing) {
        // Actualizamos usando el ID de la prestación existente
        await updateTask(prestacionExistenteId, dataToSend);
        toast.success("Prestación actualizada con éxito");
      } else {
        // Crear nueva prestación
        await createTask(dataToSend);
        toast.success("Prestación agregada con éxito");
      }
      navigate("/tasks");

    } catch (error) {
      console.error("Error al guardar la prestación:", error);
      toast.error(`Error al ${isEditing ? 'actualizar' : 'guardar'} la prestación.`);
    }
  });

  if (isLoading) {
     return <div className="text-center text-white p-10">Cargando datos...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-5 text-white">
        {isEditing ? "Editar" : "Agregar"} Prestación
      </h1>

      <form onSubmit={onSubmit}>
        {/* Campo Empleado */}
        {empleado && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Empleado</label>
            <input
              type="text"
              value={`${empleado.nombre || ''} ${empleado.apellido || ''}`}
              readOnly
              className="bg-zinc-700 p-3 rounded-lg block w-full text-gray-400 cursor-not-allowed"
            />
          </div>
        )}

        {/* Campo Tipo de Prestación */}
        <div className="mb-4">
            <label htmlFor="prestacion_tipo" className="block text-sm font-medium text-gray-300 mb-1">Tipo de Prestación</label>
            <input
              id="prestacion_tipo"
              type="text"
              placeholder="Prestacion"
              {...register("prestacion_tipo", { required: "El tipo de prestación es requerido" })}
              className={`bg-zinc-700 p-3 rounded-lg block w-full mb-1 ${errors.prestacion_tipo ? 'border border-red-500' : 'border border-transparent'}`}
            />
            {errors.prestacion_tipo && <span className="text-red-500 text-xs">{errors.prestacion_tipo.message}</span>}
        </div>

        {/* Campo Monto */}
        <div className="mb-4">
             <label htmlFor="prestacion_monto" className="block text-sm font-medium text-gray-300 mb-1">Monto (Q)</label>
            <input
              id="prestacion_monto"
              type="number"
              step="0.01"
              placeholder="Cantidad"
              {...register("prestacion_monto", {
                required: "El monto es requerido",
                valueAsNumber: true,
                min: { value: 0.01, message: "El monto debe ser positivo" }
              })}
              className={`bg-zinc-700 p-3 rounded-lg block w-full mb-1 ${errors.prestacion_monto ? 'border border-red-500' : 'border border-transparent'}`}
            />
            {errors.prestacion_monto && <span className="text-red-500 text-xs">{errors.prestacion_monto.message}</span>}
        </div>

        {/* Botón Guardar/Actualizar */}
        <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-lg block w-full mt-5 transition duration-200"
        >
          {isEditing ? "Actualizar" : "Guardar"} Prestación
        </button>
      </form>
    </div>
  );
}
