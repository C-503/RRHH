import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { createTask, updateTask, getTask } from "../api/tasks.api.nomina";

//Constantes para Horas Estándar por Periodo 
const STANDARD_HOURS = {
    Semanal: 48,
    Quincenal: 96,
    Mensual: 208,
};
const OVERTIME_RATE_MULTIPLIER = 1.5;
const IGSS_RATE = 0.0483;

export function TasksbuttonsPages() {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm({

        defaultValues: {
            cantidad_horas_extra: 0,
            nomina_sueldo: 0,
            nomina_horasextra: 0,
            nomina_bono: 0,
            nomina_incentivos: 0,
            nomina_isr: 0,
            nomina_iggs: 0,
            nomina_tipo: "",
            nom_fecha: ""
        }
    });
    const navigate = useNavigate();
    const params = useParams();

    // Estados
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [salarioBase, setSalarioBase] = useState(null);

    //Observadores de Campos
    const cantidadHorasExtra = watch("cantidad_horas_extra", 0);
    const tipoNomina = watch("nomina_tipo", "");
    const bono = watch("nomina_bono", 0);
    const incentivo = watch("nomina_incentivos", 0);
    const isr = watch("nomina_isr", 0);


    //Efectos
    // 1. Cargar empleados
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

    // 2. Cargar datos de nómina existente
    useEffect(() => {
        async function loadNomina() {
            if (params.id) {
                try {
                    const { data } = await getTask(params.id);
                    const empleadoId = typeof data.empleado === 'object' && data.empleado !== null
                        ? data.empleado.id_empleado
                        : data.empleado;

                    // Establece todos los valores del formulario
                    setValue("empleado", empleadoId ? parseInt(empleadoId) : null);
                    setValue("cantidad_horas_extra", data.cantidad_horas_extra || 0);
                    setValue("nomina_horasextra", data.nomina_horasextra || 0);
                    setValue("nomina_bono", data.nomina_bono || 0);
                    setValue("nomina_incentivos", data.nomina_incentivos || 0);
                    setValue("nomina_isr", data.nomina_isr || 0);
                    setValue("nomina_tipo", data.nomina_tipo || "");
                    setValue("nom_fecha", data.nom_fecha ? data.nom_fecha.split('T')[0] : "");

                    setTimeout(() => setEmpleadoSeleccionado(empleadoId ? parseInt(empleadoId) : null), 0);

                } catch (error) {
                    console.error("Error cargando la nómina:", error);
                    toast.error("No se pudieron cargar los datos de la nómina.");
                }
            }
        }
        if (empleados.length > 0 || !params.id) {
            loadNomina();
        }
    }, [params.id, setValue, empleados]);

    // 3. Obtener Salario Base Original del empleado seleccionado
    useEffect(() => {
        if (empleadoSeleccionado !== null && empleados.length > 0) {
            const empleado = empleados.find(emp => emp.id_empleado === empleadoSeleccionado);
            if (empleado) {
                const base = parseFloat(empleado.salario_base);
                setSalarioBase(!isNaN(base) ? base : null);
            } else {
                setSalarioBase(null);
            }
        } else {
            setSalarioBase(null);
        }
    }, [empleadoSeleccionado, empleados]);

    // 4. Calcular Ingresos Brutos, Deducciones (IGSS calculado, ISR manual) y Sueldo Neto
    useEffect(() => {
        //Obtener Valores Numéricos
        const base = parseFloat(salarioBase);
        const hours = parseFloat(cantidadHorasExtra) || 0;
        const bonusAmount = parseFloat(bono) || 0;
        const incentivesAmount = parseFloat(incentivo) || 0;
        const isrDeduction = parseFloat(isr) || 0;

        //Calcular Pago Horas Extra
        let pagoCalculadoOT = 0;
        if (!isNaN(base) && base > 0 && hours >= 0 && tipoNomina && STANDARD_HOURS[tipoNomina]) {
            const standardHoursForPeriod = STANDARD_HOURS[tipoNomina];
            if (standardHoursForPeriod > 0) {
                const regularHourlyRate = base / standardHoursForPeriod;
                if (!isNaN(regularHourlyRate) && regularHourlyRate >= 0) {
                    const overtimeHourlyRate = regularHourlyRate * OVERTIME_RATE_MULTIPLIER;
                    pagoCalculadoOT = overtimeHourlyRate * hours;
                }
            }
        }

        //Calcular Ingresos Brutos (Base para IGSS)
        let grossRemuneration = 0;
        if (!isNaN(base) && base > 0) {
            grossRemuneration += base;
        }
        grossRemuneration += pagoCalculadoOT + bonusAmount + incentivesAmount;

        //Calcular Deducciones
        const iggsCalculado = grossRemuneration * IGSS_RATE;

        //Calcular Sueldo Neto
        const netPay = grossRemuneration - iggsCalculado - isrDeduction;

        //Actualizar Campos del Formulario
        setValue("nomina_iggs", iggsCalculado.toFixed(2));
        setValue("nomina_sueldo", netPay.toFixed(2));

    // Dependencias
    }, [salarioBase, cantidadHorasExtra, tipoNomina, bono, incentivo, isr, setValue]);


    //Manejador de Envío
    const onSubmit = handleSubmit(async data => {

        const payload = {
            ...data,
            empleado: parseInt(data.empleado) || null,
            nomina_sueldo: parseFloat(data.nomina_sueldo) || 0,
            cantidad_horas_extra: parseFloat(data.cantidad_horas_extra) || 0,
            nomina_horasextra: parseFloat(data.nomina_horasextra) || 0,
            nomina_bono: parseFloat(data.nomina_bono) || 0,
            nomina_incentivos: parseFloat(data.nomina_incentivos) || 0,
            nomina_isr: parseFloat(data.nomina_isr) || 0,
            nomina_iggs: parseFloat(data.nomina_iggs) || 0,
        };
        console.log("Payload a enviar:", payload);
        try {
            if (params.id) {
                await updateTask(params.id, payload);
                toast.success("Nómina actualizada!");
            } else {
                await createTask(payload);
                toast.success("Nómina creada!");
            }
            navigate("/tasks");
        } catch (error) {
            console.error("Error al guardar:", error);
            const errorMsg = error.response?.data?.detail || error.message || "Error desconocido.";
            toast.error(`Error: ${errorMsg}`);
        }
    });

    //Renderizado JSX
    return (
        <div className="max-w-xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg">
             <h1 className="text-3xl font-bold mb-6 text-white text-center">
                {params.id ? "Editar Nómina" : "Crear Nueva Nómina"}
            </h1>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                {/* Columna 1 */}
                <div className="space-y-5">
                    {/* Empleado */}
                    <div>
                         <label htmlFor="empleado" className="block text-sm font-medium text-gray-300 mb-1">Empleado</label>
                         <select id="empleado"
                            {...register("empleado", { required: "Seleccione un empleado" })}
                            className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.empleado ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                            onChange={e => {
                                const selectedId = e.target.value ? parseInt(e.target.value) : null;
                                setValue("empleado", selectedId, { shouldValidate: true });
                                setEmpleadoSeleccionado(selectedId);
                            }}
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

                    {/* Salario Base Original */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Salario Base</label>
                        <div className="bg-zinc-800 p-3 rounded-lg block w-full h-14 text-gray-400 flex items-center border border-zinc-700">
                            {salarioBase !== null && salarioBase !== undefined ? salarioBase.toFixed(2) : '-'}
                        </div>
                    </div>

                     {/* Sueldo Neto */}
                    <div>
                        <label htmlFor="nomina_sueldo" className="block text-sm font-medium text-gray-300 mb-1">Sueldo Nomina</label>
                        <input id="nomina_sueldo"
                            type="number"
                            placeholder="0.00"
                            {...register("nomina_sueldo", { valueAsNumber: true })}
                            className="bg-zinc-800 p-3 rounded-lg block w-full h-14 text-gray-400 border border-zinc-700"
                            readOnly
                        />
                    </div>


                    {/* Cantidad Horas Extra */}
                    <div>
                        <label htmlFor="cantidad_horas_extra" className="block text-sm font-medium text-gray-300 mb-1">Cantidad Horas Extra</label>
                        <input id="cantidad_horas_extra"
                            type="number"
                            placeholder="0"
                            {...register("cantidad_horas_extra", {
                                valueAsNumber: true,
                                min: { value: 0, message: "No puede ser negativo" }
                            })}
                            className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.cantidad_horas_extra ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                        />
                         {errors.cantidad_horas_extra && <span className="text-red-400 text-xs mt-1">{errors.cantidad_horas_extra.message}</span>}
                    </div>

                    {/* Bonos */}
                    <div>
                         <label htmlFor="nomina_bono" className="block text-sm font-medium text-gray-300 mb-1">Bonos</label>
                         <input id="nomina_bono"
                            type="number"
                            placeholder="0.00"
                            {...register("nomina_bono", { valueAsNumber: true, min: 0 })}
                             className="bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white border border-zinc-600"
                        />
                    </div>
                </div>

                {/* Columna 2 */}
                <div className="space-y-5">
                    {/* Incentivos */}
                    <div>
                        <label htmlFor="nomina_incentivos" className="block text-sm font-medium text-gray-300 mb-1">Incentivos</label>
                       <input id="nomina_incentivos"
                           type="number"
                           placeholder="0.00"
                           {...register("nomina_incentivos", { valueAsNumber: true, min: 0 })}
                            className="bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white border border-zinc-600"
                       />
                   </div>

                   {/* ISR */}
                   <div>
                       <label htmlFor="nomina_isr" className="block text-sm font-medium text-gray-300 mb-1">ISR</label>
                       <input id="nomina_isr"
                           type="number"
                           placeholder="0.00"
                           {...register("nomina_isr", { required: "ISR requerido", valueAsNumber: true, min: 0 })}
                           className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.nomina_isr ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                       />
                       {errors.nomina_isr && <span className="text-red-400 text-xs mt-1">{errors.nomina_isr.message}</span>}
                   </div>

                    {/* IGSS */}
                    <div>
                         {/* Etiqueta actualizada */}
                        <label htmlFor="nomina_iggs" className="block text-sm font-medium text-gray-300 mb-1">IGSS (Calculo {IGSS_RATE * 100}%)</label>
                        <input id="nomina_iggs"
                            type="number"
                            placeholder="0.00"
                            {...register("nomina_iggs", { valueAsNumber: true, min: 0 })}
                            className="bg-zinc-800 p-3 rounded-lg block w-full h-14 text-gray-400 border border-zinc-700"
                            readOnly
                        />
                   </div>


                    {/* Tipo Nómina */}
                    <div>
                        <label htmlFor="nomina_tipo" className="block text-sm font-medium text-gray-300 mb-1">Tipo Nómina</label>
                        <select id="nomina_tipo"
                            {...register("nomina_tipo", { required: "Seleccione un tipo" })}
                            className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.nomina_tipo ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                        >
                            <option value="">-- Seleccione un Tipo --</option>
                            <option value="Mensual">Mensual</option>
                            <option value="Semanal">Semanal</option>
                            <option value="Quincenal">Quincenal</option>
                        </select>
                        {errors.nomina_tipo && <span className="text-red-400 text-xs mt-1">{errors.nomina_tipo.message}</span>}
                    </div>

                    {/* Fecha Nómina */}
                    <div>
                        <label htmlFor="nom_fecha" className="block text-sm font-medium text-gray-300 mb-1">Fecha Nómina</label>
                       <input id="nom_fecha"
                           type="date"
                           {...register("nom_fecha", { required: "Fecha requerida" })}
                           className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.nom_fecha ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                           style={{ colorScheme: "dark" }}
                       />
                       {errors.nom_fecha && <span className="text-red-400 text-xs mt-1">{errors.nom_fecha.message}</span>}
                   </div>


                    {/* Botón Guardar */}
                     <div className="md:col-span-2 mt-4">
                         <button type="submit" className="w-full bg-indigo-600 p-3 rounded-lg text-white font-semibold hover:bg-indigo-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                            Guardar Nómina
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

