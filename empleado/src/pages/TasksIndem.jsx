import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    getTask as getIndemnizacion,
    createTask as createIndemnizacion,
    updateTask as updateIndemnizacion,
    deleteTask as deleteIndemnizacion, 
} from "../api/tasks.api.indem";
import axios from "axios";
import { updateEmpleadoEstadoIndemnizacion } from "../api/tasks.api";

export function TasksIndem() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm();

    const navigate = useNavigate();
    const params = useParams();

    const [diasDescanso, setDiasDescanso] = useState(0);
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [fechaContratacion, setFechaContratacion] = useState("");
    const [salarioPromedio, setSalarioPromedio] = useState(0);
    const [calculoIndemnizacion, setCalculoIndemnizacion] = useState(0);
    const [montoTotal, setMontoTotal] = useState(0);
    const [isLoadingIndemnizacion, setIsLoadingIndemnizacion] = useState(true);

    useEffect(() => {
        async function loadEmpleados() {
            try {
                const res = await axios.get("http://localhost:8000/tasks/api/v1/empleados/");
                setEmpleados(res.data);
            } catch (error) {
                console.error("Error cargando empleados:", error);
                toast.error("No se pudieron cargar los empleados.");
            }
        }
        loadEmpleados();
    }, []);

    useEffect(() => {
        async function loadIndemnizacion() {
            if (params.id) {
                setIsLoadingIndemnizacion(true);
                console.log("Cargando indemnización con ID:", params.id);
                try {
                    const { data } = await getIndemnizacion(params.id);
                    console.log("Datos de la indemnización recibidos:", data);
                    const empleadoId = data.empleado ? data.empleado : null;
                    setValue("empleado", empleadoId);
                    setEmpleadoSeleccionado(empleadoId);
                    setValue("fecha_terminacion", data.fecha_terminacion);
                    setValue("motivo", data.motivo);
                    setValue("fecha_pago", data.fecha_pago);
                    setFechaContratacion(data.fecha_contratacion);
                    setSalarioPromedio(parseFloat(data.salario_promedio));
                    setCalculoIndemnizacion(parseFloat(data.Calculo_indemnizacion));
                    setMontoTotal(parseFloat(data.monto_total));
                } catch (error) {
                    console.error("Error cargando indemnización:", error);
                    toast.error("No se pudieron cargar los datos de la indemnización.");
                } finally {
                    setIsLoadingIndemnizacion(false);
                }
            } else {
                setIsLoadingIndemnizacion(false);
            }
        }
        loadIndemnizacion();
    }, [params.id, setValue]);

    useEffect(() => {
        if (empleadoSeleccionado !== null && empleados.length > 0) {
            const empleado = empleados.find(emp => emp.id_empleado === empleadoSeleccionado);
            if (empleado) {
                const salario = parseFloat(empleado.salario_base);
                setFechaContratacion(empleado.fecha_contratacion);
                setSalarioPromedio(isNaN(salario) ? 0 : salario);
                setValue("fecha_contratacion", empleado.fecha_contratacion);
                setDiasDescanso(empleado.dias_descanso || 0);
            }
        }
    }, [empleadoSeleccionado, empleados, setValue]);

    const fechaTerminacion = watch("fecha_terminacion");
    useEffect(() => {
        if (fechaContratacion && fechaTerminacion && !isNaN(salarioPromedio)) {
            const inicio = new Date(fechaContratacion);
            const fin = new Date(fechaTerminacion);
            const diasTrabajados = Math.floor((fin - inicio) / (1000 * 60 * 60 * 24));
            const aniosExactos = diasTrabajados / 365.25;
            const calculo = aniosExactos * salarioPromedio;

            // Cálculo adicional: 10% del salario base * días de descanso
            const extraDescanso = (salarioPromedio * 0.10) * diasDescanso;

            setCalculoIndemnizacion(calculo);
            setMontoTotal(extraDescanso + calculo);
        } else {
            setCalculoIndemnizacion(0);
            setMontoTotal(0);
        }
    }, [fechaContratacion, fechaTerminacion, salarioPromedio, diasDescanso]);

    const onSubmit = handleSubmit(async data => {
        const salarioPromedioNumerico = parseFloat(salarioPromedio);
        const calculoIndemnizacionNumerico = parseFloat(calculoIndemnizacion);
        // Cálculo adicional: 10% del salario base * días de descanso
        const extraDescanso = (salarioPromedioNumerico * 0.10) * diasDescanso;
        const montoTotalNumerico = parseFloat(extraDescanso + calculoIndemnizacionNumerico);

        const payload = {
            empleado: parseInt(data.empleado),
            fecha_contratacion: fechaContratacion,
            fecha_terminacion: data.fecha_terminacion,
            motivo: data.motivo,
            salario_promedio: isNaN(salarioPromedioNumerico) ? '0.00' : salarioPromedioNumerico.toFixed(2),
            Calculo_indemnizacion: isNaN(calculoIndemnizacionNumerico) ? '0.00' : calculoIndemnizacionNumerico.toFixed(2),
            monto_total: isNaN(montoTotalNumerico) ? '0.00' : montoTotalNumerico.toFixed(2),
            fecha_pago: data.fecha_pago
        };

        try {
            let indemnizacionCreada = null;
            if (params.id) {
                await updateIndemnizacion(params.id, payload);
                toast.success("Indemnización actualizada!");
            } else {
                const resIndemnizacion = await createIndemnizacion(payload);
                indemnizacionCreada = resIndemnizacion.data;
                toast.success("Indemnización creada!");

                // Si se crea una nueva indemnización, actualizamos el estado del empleado
                if (indemnizacionCreada && payload.empleado) {
                    try {
                        await updateEmpleadoEstadoIndemnizacion(payload.empleado, 1); 
                        console.log(`Estado del empleado ${payload.empleado} actualizado a activo.`);
                    } catch (errorActualizarEmpleado) {
                        console.error("Error al actualizar el estado del empleado:", errorActualizarEmpleado);
                        toast.error("Error al actualizar el estado del empleado.");
                    }
                }
            }
            navigate("/tasks");
        } catch (error) {
            console.error("Error al guardar:", error);
            toast.error("Error: " + (error.response?.data?.detail || error.message));
        }
    });

    const handleDelete = async () => {
        if (params.id) {
            try {
                const { data: indemnizacionAEliminar } = await getIndemnizacion(params.id);
                const empleadoId = indemnizacionAEliminar?.empleado;

                await deleteIndemnizacion(params.id);
                toast.success("Indemnización eliminada!");

                if (empleadoId) {
                    try {
                        // Actualizar el estado del empleado a 0 directamente al eliminar la indemnización
                        await updateEmpleadoEstadoIndemnizacion(empleadoId, 0);
                        console.log(`Estado del empleado ${empleadoId} actualizado a inactivo.`);
                    } catch (errorActualizarEmpleado) {
                        console.error("Error al actualizar el estado del empleado:", errorActualizarEmpleado);
                        toast.error("Error al actualizar el estado del empleado.");
                    }
                }

                navigate("/tasks");
            } catch (error) {
                console.error("Error al eliminar:", error);
                toast.error("Error al eliminar la indemnización.");
            }
        }
    };

    if (isLoadingIndemnizacion && params.id) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg text-white text-center">
                Cargando datos de la indemnización...
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">
                {params.id ? "Editar Indemnización" : "Indemnización"}
            </h1>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="space-y-5">
                    <div>
                        <label htmlFor="empleado" className="block text-sm font-medium text-gray-300 mb-1">Empleado</label>
                        <select
                            id="empleado"
                            {...register("empleado", { required: "Seleccione un empleado" })}
                            className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.empleado ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                            onChange={e => {
                                const selectedId = e.target.value ? parseInt(e.target.value) : null;
                                setValue("empleado", selectedId, { shouldValidate: true });
                                setEmpleadoSeleccionado(selectedId);
                            }}
                            value={watch("empleado") || ""}
                        >
                            <option value="">-- Seleccione --</option>
                            {empleados.map(emp => (
                                <option key={emp.id_empleado} value={emp.id_empleado}>
                                    {emp.nombre} {emp.apellido}
                                </option>
                            ))}
                        </select>
                        {errors.empleado && <span className="text-red-400 text-xs mt-1">{errors.empleado.message}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Contratación</label>
                        <input
                            type="date"
                            value={fechaContratacion || ""}
                            disabled
                            className="bg-zinc-800 p-3 rounded-lg block w-full h-14 text-gray-400 border border-zinc-700"
                        />
                    </div>

                    <div>
                        <label htmlFor="motivo" className="block text-sm font-medium text-gray-300 mb-1">Motivo</label>
                        <input
                            id="motivo"
                            type="text"
                            {...register("motivo", { required: "Motivo requerido" })}
                            className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.motivo ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                        />
                        {errors.motivo && <span className="text-red-400 text-xs mt-1">{errors.motivo.message}</span>}
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label htmlFor="fecha_terminacion" className="block text-sm font-medium text-gray-300 mb-1">Fecha Terminación</label>
                        <input
                            id="fecha_terminacion"
                            type="date"
                            {...register("fecha_terminacion", { required: "Fecha requerida" })}
                            className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.fecha_terminacion ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                        />
                        {errors.fecha_terminacion && <span className="text-red-400 text-xs mt-1">{errors.fecha_terminacion.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="fecha_pago" className="block text-sm font-medium text-gray-300 mb-1">Fecha Pago</label>
                        <input
                            id="fecha_pago"
                            type="date"
                            {...register("fecha_pago", { required: "Fecha de pago requerida" })}
                            className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.fecha_pago ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                        />
                        {errors.fecha_pago && <span className="text-red-400 text-xs mt-1">{errors.fecha_pago.message}</span>}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Días de Descanso</label>
                        <input
                          type="number"
                          value={diasDescanso}
                          disabled
                         className="bg-zinc-800 p-3 rounded-lg block w-full h-14 text-gray-400 border border-zinc-700"
                        />
                    </div>

                   
                </div>

                <div className="md:col-span-2 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Salario Promedio</label>
                            <div className="bg-zinc-700 p-3 rounded-lg text-white h-14 flex items-center justify-center">{!isNaN(salarioPromedio) ? salarioPromedio.toFixed(2) : 'N/A'}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1"> Indemnización</label>
                            <div className="bg-zinc-700 p-3 rounded-lg text-white h-14 flex items-center justify-center">{!isNaN(calculoIndemnizacion) ? calculoIndemnizacion.toFixed(2) : 'N/A'}</div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1"> Dias Descanso </label>
                            <div className="bg-zinc-700 p-3 rounded-lg text-white h-14 flex items-center justify-center">
                                {(!isNaN(salarioPromedio) && !isNaN(diasDescanso)) ? ((salarioPromedio * 0.10 * diasDescanso).toFixed(2)) : 'N/A'}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Monto Total</label>
                            <div className="bg-zinc-700 p-3 rounded-lg text-white h-14 flex items-center justify-center">{!isNaN(montoTotal) ? montoTotal.toFixed(2) : 'N/A'}</div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex justify-between items-center">
                    <button
                        type="submit"
                        className="w-full md:w-auto bg-blue-600 py-3 px-4 rounded-lg text-white text-lg"
                    >
                        {params.id ? "Actualizar" : "Crear"} Indemnización
                    </button>
                      <button
                            type="button"
                            onClick= {() => navigate("/tasks")}
                            className="ml-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg"
                        >
                            Regresar
                        </button>
                    {params.id && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="ml-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg"
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}