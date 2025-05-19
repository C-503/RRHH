import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import { getTask as getEmpleado, updateEmpleado } from "../api/tasks.api"; // Importa updateEmpleado
import {
    createTask,
    updateTask,
    getTask as getPrestacionDia,
    deleteTask as deletePrestacionDia
} from "../api/tasks.api.presta";

export function Tasksprestacion() {
    const { id: empleadoId, prestacion_dias_id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            dias_disponibles: "",
            dias_tomados: 0,
            fecha_solicitud: "",
            estado: "Pendiente",
            fecha_aprobacion: "",
            fecha_rechazo: "",
            motivo_rechazo: "",
            periodo: "",
            dias_descanso: 0,
        }
    });

    const [empleado, setEmpleado] = useState(null);
    const isCreating = !prestacion_dias_id;
    const [isLoading, setIsLoading] = useState(true);
    // Nuevo estado para guardar los dias_restantes originales al editar
    const [originalDiasRestantes, setOriginalDiasRestantes] = useState(0);

    const dias_disponibles = watch("dias_disponibles") || 0;
    const dias_tomados = watch("dias_tomados") || 0;
    const dias_restantes = dias_disponibles - dias_tomados;

    useEffect(() => {
        async function loadEmpleadoData() {
            setIsLoading(true);
            console.log("useEffect loadEmpleadoData ejecutándose...");
            console.log("Empleado ID:", empleadoId);
            try {
                const resEmpleado = await getEmpleado(empleadoId);
                setEmpleado(resEmpleado.data);
                console.log("Datos del empleado cargados:", resEmpleado.data);
                setValue("dias_descanso", resEmpleado.data.dias_descanso || 0);
            } catch (error) {
                console.error("Error al cargar datos del empleado:", error);
                toast.error("No se pudieron cargar los datos del empleado.");
            } finally {
                setIsLoading(false);
                console.log("useEffect loadEmpleadoData finalizado.");
            }
        }

        if (empleadoId) {
            loadEmpleadoData();
        } else {
            console.log("useEffect loadEmpleadoData: No hay Empleado ID.");
        }
    }, [empleadoId, setValue]);

    useEffect(() => {
        async function loadPrestacionData() {
            console.log("useEffect loadPrestacionData ejecutándose...");
            console.log("Empleado ID:", empleadoId);
            console.log("Prestacion ID:", prestacion_dias_id);
            console.log("isCreating:", isCreating);
            if (!isCreating && prestacion_dias_id) {
                setIsLoading(true);
                try {
                    console.log("Intentando cargar prestación con ID:", prestacion_dias_id);
                    const resPrestacion = await getPrestacionDia(prestacion_dias_id);
                    console.log("Respuesta de getPrestacionDia:", resPrestacion);
                    if (resPrestacion.data) {
                        console.log("Datos de la prestación cargados:", resPrestacion.data);
                        reset({
                            dias_disponibles: resPrestacion.data.dias_disponibles,
                            dias_tomados: resPrestacion.data.dias_tomados,
                            fecha_solicitud: resPrestacion.data.fecha_solicitud ? resPrestacion.data.fecha_solicitud.split('T')[0] : "",
                            estado: resPrestacion.data.estado || "Pendiente",
                            fecha_aprobacion: resPrestacion.data.fecha_aprobacion ? resPrestacion.data.fecha_aprobacion.split('T')[0] : "",
                            fecha_rechazo: resPrestacion.data.fecha_rechazo ? resPrestacion.data.fecha_rechazo.split('T')[0] : "",
                            motivo_rechazo: resPrestacion.data.motivo_rechazo || "",
                            periodo: resPrestacion.data.periodo || "",
                            dias_descanso: 0,
                        });
                        // Guardar los dias_restantes originales para el cálculo correcto al editar
                        setOriginalDiasRestantes((resPrestacion.data.dias_disponibles || 0) - (resPrestacion.data.dias_tomados || 0));
                        console.log("Formulario reseteado con datos de la prestación.");
                    } else {
                        toast.error("Prestación no encontrada.");
                        navigate(`/prestaciones/${empleadoId}`);
                    }
                } catch (error) {
                    console.error("Error al cargar datos de la prestación:", error);
                    toast.error("No se pudieron cargar los datos de la prestación.");
                    navigate(`/prestaciones/${empleadoId}`);
                } finally {
                    setIsLoading(false);
                    console.log("useEffect loadPrestacionData finalizado.");
                }
            } else {
                console.log("useEffect loadPrestacionData: Modo de creación o no hay ID de prestación.");
                reset({
                    dias_disponibles: "",
                    dias_tomados: 0,
                    fecha_solicitud: "",
                    estado: "Pendiente",
                    fecha_aprobacion: "",
                    fecha_rechazo: "",
                    motivo_rechazo: "",
                    periodo: "",
                    dias_descanso: 0,
                });
                console.log("Formulario reseteado a valores por defecto (creación o sin ID).");
                setIsLoading(false);
                console.log("useEffect loadPrestacionData finalizado (creación o sin ID).");
            }
        }

        if (empleadoId) {
            loadPrestacionData();
        } else {
            console.log("useEffect loadPrestacionData: No hay Empleado ID para cargar la prestación.");
        }
    }, [empleadoId, prestacion_dias_id, isCreating, reset, navigate]);

    const onSubmit = handleSubmit(async (data) => {
        console.log("onSubmit ejecutándose con data:", data);
        if (!empleado) {
            toast.error("Datos del empleado no disponibles.");
            return;
        }

        const dataToSend = {
            ...data,
            empleado: empleadoId,
            fecha_aprobacion: data.fecha_aprobacion || null,
            fecha_rechazo: data.fecha_rechazo || null,
        };

        console.log("Datos a enviar al backend (prestación):", dataToSend);

        try {
            let responsePrestacion;
            if (isCreating) {
                console.log("Creando nueva prestación...");
                responsePrestacion = await createTask(dataToSend);
                console.log("Respuesta de createTask:", responsePrestacion);
                toast.success("Prestación registrada con éxito");
            } else {
                console.log("Actualizando prestación con ID:", prestacion_dias_id);
                responsePrestacion = await updateTask(prestacion_dias_id, dataToSend);
                console.log("Respuesta de updateTask:", responsePrestacion);
                toast.success("Prestación actualizada con éxito");
            }

            // Actualizar los días de descanso del empleado
            let nuevosDiasDescanso;
            if (isCreating) {
                nuevosDiasDescanso = empleado.dias_descanso + dias_restantes;
            } else {
                // Al editar, sumar solo la diferencia de dias_restantes
                nuevosDiasDescanso = empleado.dias_descanso + (dias_restantes - originalDiasRestantes);
            }
            console.log("Días de descanso actuales del empleado:", empleado.dias_descanso);
            console.log("Días restantes de la prestación:", dias_restantes);
            console.log("Nuevos días de descanso a guardar:", nuevosDiasDescanso);

            try {
                // Construir el payload completo del empleado para el PUT
                const empleadoPayload = {
                    nombre: empleado.nombre,
                    apellido: empleado.apellido,
                    departamento: empleado.departamento,
                    pueesto: empleado.pueesto, // Ojo: así está en tu modelo
                    salario_base: empleado.salario_base,
                    fecha_contratacion: empleado.fecha_contratacion,
                    estatus: empleado.estatus,
                    estado_indemnizacion: empleado.estado_indemnizacion,
                    dias_descanso: nuevosDiasDescanso,
                };
                const responseEmpleado = await updateEmpleado(empleadoId, empleadoPayload);
                console.log("Respuesta de updateEmpleado:", responseEmpleado);
                toast.success("Días de descanso del empleado actualizados.");
            } catch (error) {
                console.error("Error al actualizar días de descanso:", error);
                toast.error("No se pudieron actualizar los días de descanso del empleado.");
                // Considerar si quieres revertir la operación de la prestación aquí
            }

            navigate(`/tasks-list-prestaciones/${empleadoId}`);

        } catch (error) {
            console.error("Error al guardar:", error);
            toast.error("Ocurrió un error al guardar los datos.");
        }
    });

    if (isLoading) {
        return <div className="text-center text-white p-10">Cargando datos...</div>;
    }
    const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta prestación?");
    if (confirmDelete) {
        try {
            await deletePrestacionDia(prestacion_dias_id);
            toast.success("Prestación eliminada exitosamente.");
            navigate(`/tasks-list-prestaciones/${empleadoId}`);
        } catch (error) {
            console.error("Error al eliminar prestación:", error);
            toast.error("No se pudo eliminar la prestación.");
        }
    }
};


    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-5 text-white">
                {isCreating ? "Registrar" : "Editar"} Prestación de Días
            </h1>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">


                {/* Columna 1 */}
                <div>
                    {empleado && (
                        <div className="mb-4 md:col-span-2">
                            <label className="text-gray-300 block mb-1">Empleado</label>
                            <input
                                type="text"
                                value={`${empleado.nombre} ${empleado.apellido}`}
                                readOnly
                                className="bg-zinc-700 p-3 rounded-lg w-full text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    )}

                     {/* Campo de días de descanso (solo lectura) */}
                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Días de descanso</label>
                        <input
                            type="number"
                            value={empleado?.dias_descanso || 0}
                            className="bg-zinc-700 p-3 rounded-lg w-full text-gray-400 cursor-not-allowed"
                            readOnly
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Días disponibles</label>
                        <input
                            type="number"
                            {...register("dias_disponibles", { required: "Campo obligatorio", min: 0 })}
                            className={`bg-zinc-700 p-3 rounded-lg w-full ${errors.dias_disponibles ? 'border border-red-500' : ''}`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Días tomados</label>
                        <input
                            type="number"
                            {...register("dias_tomados", { required: "Campo obligatorio", min: 0 })}
                            className={`bg-zinc-700 p-3 rounded-lg w-full ${errors.dias_tomados ? 'border border-red-500' : ''}`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Fecha de solicitud</label>
                        <input
                            type="date"
                            {...register("fecha_solicitud", { required: "Campo obligatorio" })}
                            className={`bg-zinc-700 p-3 rounded-lg w-full ${errors.fecha_solicitud ? 'border border-red-500' : ''}`}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Fecha de rechazo</label>
                        <input
                            type="date"
                            {...register("fecha_rechazo")}
                            className="bg-zinc-700 p-3 rounded-lg w-full"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate(`/tasks-list-prestaciones/${empleadoId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg w-full"
                    >
                        Cancelar
                    </button>
                </div>

                {/* Columna 2 */}
                <div>
                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Período</label>
                        <input
                            type="number"
                            {...register("periodo")}
                            className="bg-zinc-700 p-3 rounded-lg w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Días restantes</label>
                        <input
                            type="number"
                            value={dias_restantes}
                            readOnly
                            className="bg-zinc-700 p-3 rounded-lg w-full text-gray-400"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Estado</label>
                        <select
                            {...register("estado", { required: "Campo obligatorio" })}
                            className="bg-zinc-700 p-3 rounded-lg w-full"
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aprobada">Aprobada</option>
                            <option value="Rechazada">Rechazada</option>
                            <option value="Tomados">Tomados</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Fecha de aprobación</label>
                        <input
                            type="date"
                            {...register("fecha_aprobacion")}
                            className="bg-zinc-700 p-3 rounded-lg w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-300 block mb-1">Motivo de rechazo</label>
                        <input
                            type="text"
                            {...register("motivo_rechazo")}
                            className="bg-zinc-700 p-3 rounded-lg w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded-lg w-full"
                    >
                        {isCreating ? "Guardar" : "Actualizar"}
                    </button>

                    {!isCreating && (
                       <button
                            type="button"
                            onClick={handleDelete}
                            className="mt-2 bg-red-700 hover:bg-red-800 text-white font-bold p-3 rounded-lg w-full"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

