import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { createTask, updateTask, getTask, deleteTask, getNominasPorEmpleado } from "../api/tasks.api.nomina"; 

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
            nomina_horasextra: 0,
            nomina_sueldo: 0,
            nomina_bono: 0,
            nomina_incentivos: 0,
            nomina_isr: 0,
            nomina_iggs: 0,
            nomina_tipo: "",
            nom_fecha: "",
            empleado: null,
            nombre_empleado: "",
            salario_base: null,
            bono_total: 0, // Nuevo campo
        }
    });
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from;
    const { id: empleadoIdParaNomina, nomina_id } = useParams();
    const isCreating = !nomina_id;

    // Estados
    const [empleados, setEmpleados] = useState([]);
    const [salarioBaseEmpleado, setSalarioBaseEmpleado] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false); // Estado para controlar la eliminación
    const [bonoAcumulado, setBonoAcumulado] = useState(0); // Acumulado de bonos anteriores

    //Observadores de Campos
    const nominaHorasExtra = watch("nomina_horasextra", 0);
    const tipoNomina = watch("nomina_tipo", "");
    const bono = watch("nomina_bono", 0);
    const incentivo = watch("nomina_incentivos", 0);
    const isr = watch("nomina_isr", 0);
    const bonoTotal = watch("bono_total", 0); // Nuevo observador

    //Efectos
    // 1. Carga empleados
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

    // 2. Precarga datos del empleado por ID
    useEffect(() => {
        async function loadEmpleadoInfo() {
            if (empleadoIdParaNomina) {
                try {
                    const empleado = empleados.find(emp => emp.id_empleado === parseInt(empleadoIdParaNomina));
                    if (empleado) {
                        setValue("empleado", parseInt(empleadoIdParaNomina), { shouldValidate: true });
                        setValue("nombre_empleado", `${empleado.nombre} ${empleado.apellido}`, { shouldValidate: false });
                        setValue("salario_base", parseFloat(empleado.salario_base), { shouldValidate: false });
                        setSalarioBaseEmpleado(parseFloat(empleado.salario_base));
                        // Obtener bonos acumulados
                        const res = await getNominasPorEmpleado(empleadoIdParaNomina);
                        const totalBonos = res.data.reduce((acc, nomina) => acc + (parseFloat(nomina.nomina_bono) || 0), 0);
                        setBonoAcumulado(totalBonos);
                    } else {
                        toast.error("Empleado no encontrado.");
                        navigate("/tasks");
                    }
                } catch (error) {
                    console.error("Error al cargar los datos del empleado:", error);
                    toast.error("No se pudieron cargar los datos del empleado.");
                    navigate("/tasks");
                }
            }
        }

        if (empleados.length > 0 && empleadoIdParaNomina) {
            loadEmpleadoInfo();
        } else if (!empleadoIdParaNomina) {
            setValue("nombre_empleado", "", { shouldValidate: false });
            setValue("salario_base", null, { shouldValidate: false });
            setSalarioBaseEmpleado(null);
            setValue("empleado", null, { shouldValidate: false });
        }
    }, [empleadoIdParaNomina, setValue, empleados, navigate]);

    // 3. Carga los datos de la nómina para la edición
    useEffect(() => {
        async function loadNomina() {
            if (!isCreating && nomina_id) {
                console.log("nomina_id en loadNomina:", nomina_id);
                try {
                    const { data } = await getTask(nomina_id);
                    console.log("Datos de la nómina cargados:", data);
                    setValue("empleado", data.empleado ? (typeof data.empleado === 'object' ? data.empleado.id_empleado : data.empleado) : null);
                    setValue("nomina_horasextra", data.nomina_horasextra || 0);
                    setValue("nomina_sueldo", data.nomina_sueldo || 0);
                    setValue("nomina_bono", data.nomina_bono || 0);
                    setValue("nomina_incentivos", data.nomina_incentivos || 0);
                    setValue("nomina_isr", data.nomina_isr || 0);
                    setValue("nomina_tipo", data.nomina_tipo || "");
                    setValue("nom_fecha", data.nom_fecha ? data.nom_fecha.split('T')[0] : "");

                    const empleadoData = empleados.find(emp => emp.id_empleado === (typeof data.empleado === 'object' ? data.empleado.id_empleado : data.empleado));
                    if (empleadoData) {
                        setValue("nombre_empleado", `${empleadoData.nombre} ${empleadoData.apellido}`, { shouldValidate: false });
                        setValue("salario_base", parseFloat(empleadoData.salario_base), { shouldValidate: false });
                        setSalarioBaseEmpleado(parseFloat(empleadoData.salario_base));
                    }

                } catch (error) {
                    console.error("Error cargando la nómina:", error);
                    toast.error("No se pudieron cargar los datos de la nómina.");
                }
            }
        }

        if (!isCreating && nomina_id && empleados.length > 0) {
            loadNomina();
        }
    }, [nomina_id, setValue, isCreating, empleados]);

    // 4. Obtiene Salario Base Original del empleado
    useEffect(() => {
        const empleadoSeleccionadoId = watch("empleado");
        if (empleadoSeleccionadoId && empleados.length > 0) {
            const empleado = empleados.find(emp => emp.id_empleado === parseInt(empleadoSeleccionadoId));
            setSalarioBaseEmpleado(empleado ? parseFloat(empleado.salario_base) : null);
        } else if (empleadoIdParaNomina && empleados.length > 0) {
            const empleado = empleados.find(emp => emp.id_empleado === parseInt(empleadoIdParaNomina));
            setSalarioBaseEmpleado(empleado ? parseFloat(empleado.salario_base) : null);
        } else if (!empleadoSeleccionadoId && !empleadoIdParaNomina) {
            setSalarioBaseEmpleado(null);
        }
    }, [empleadoIdParaNomina, watch, empleados]);

    // 5. Calcula Ingresos Brutos, Deducciones y Sueldo Neto y Bono Total (reinicio en agosto)
    useEffect(() => {
        const calcularBonos = async () => {
            const base = parseFloat(salarioBaseEmpleado);
            const hours = parseFloat(nominaHorasExtra) || 0;
            let bonusAmount = parseFloat(bono) || 0;
            const incentivesAmount = parseFloat(incentivo) || 0;
            const isrDeduction = parseFloat(isr) || 0;
            const tipoNomina = watch("nomina_tipo", "");
            const fechaNomina = watch("nom_fecha", "");
            const empleadoId = watch("empleado");

            // --- Cálculo de Bono 14 ---
            let bono14 = 0;
            if (!isNaN(base) && base > 0 && tipoNomina && fechaNomina) {
                const fecha = new Date(fechaNomina);
                if (tipoNomina === "Mensual") {
                    bono14 = base / 12;
                } else if (tipoNomina === "Quincenal") {
                    if (fecha.getDate() > 15) {
                        bono14 = base / 24;
                    }
                } else if (tipoNomina === "Semanal") {
                    const lastDayOfMonth = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
                    if (fecha.getDate() > lastDayOfMonth - 7) {
                        bono14 = base / 52;
                    }
                }
            }
            if (bono14 > 0 && Math.abs(bono - bono14) > 0.01) {
                setValue("nomina_bono", bono14.toFixed(2), { shouldValidate: false });
                bonusAmount = bono14;
            } else if (bono14 === 0 && bono !== 0) {
                setValue("nomina_bono", 0, { shouldValidate: false });
                bonusAmount = 0;
            }

            // --- Cálculo de bono_total con reinicio en agosto ---
            let bonoTotalCalculado = 0;
            if (empleadoId && fechaNomina) {
                try {
                    const res = await getNominasPorEmpleado(empleadoId);
                    const fechaActual = new Date(fechaNomina);
                    const anioActual = fechaActual.getFullYear();
                    const mesActual = fechaActual.getMonth() + 1; // 1-12
                    if (mesActual === 8) { // Agosto: reinicio, solo el bono de agosto
                        bonoTotalCalculado = parseFloat(bonusAmount) || 0;
                    } else if (mesActual > 8 && mesActual <= 12) { // Septiembre a diciembre
                        const bonosDesdeAgosto = res.data.filter(nomina => {
                            if (!nomina.nom_fecha) return false;
                            const fechaNom = new Date(nomina.nom_fecha);
                            return fechaNom.getFullYear() === anioActual && (fechaNom.getMonth() + 1) >= 8 && (fechaNom.getMonth() + 1) < mesActual;
                        });
                        // Si se está editando, excluir la nómina actual
                        const bonosFiltrados = isCreating
                            ? bonosDesdeAgosto
                            : bonosDesdeAgosto.filter(nomina => String(nomina.id) !== String(nomina_id) && String(nomina.nomina_id) !== String(nomina_id));
                        bonoTotalCalculado = bonosFiltrados.reduce((acc, nomina) => acc + (parseFloat(nomina.nomina_bono) || 0), 0);
                        bonoTotalCalculado += parseFloat(bonusAmount) || 0;
                    } else if (mesActual >= 1 && mesActual <= 7) { // Enero a julio
                        const bonosDesdeAgostoAnterior = res.data.filter(nomina => {
                            if (!nomina.nom_fecha) return false;
                            const fechaNom = new Date(nomina.nom_fecha);
                            const anioNom = fechaNom.getFullYear();
                            const mesNom = fechaNom.getMonth() + 1;
                            return (
                                (anioNom === (anioActual - 1) && mesNom >= 8) ||
                                (anioNom === anioActual && mesNom <= mesActual && mesNom <= 7)
                            );
                        });
                        const bonosFiltrados = isCreating
                            ? bonosDesdeAgostoAnterior
                            : bonosDesdeAgostoAnterior.filter(nomina => String(nomina.id) !== String(nomina_id) && String(nomina.nomina_id) !== String(nomina_id));
                        bonoTotalCalculado = bonosFiltrados.reduce((acc, nomina) => acc + (parseFloat(nomina.nomina_bono) || 0), 0);
                        bonoTotalCalculado += parseFloat(bonusAmount) || 0;
                    }
                } catch (e) {
                    bonoTotalCalculado = parseFloat(bonusAmount) || 0;
                }
            } else {
                bonoTotalCalculado = parseFloat(bonusAmount) || 0;
            }
            setValue("bono_total", bonoTotalCalculado.toFixed(2), { shouldValidate: false });

            let sueldoBasePeriodo = 0;
            if (!isNaN(base) && base > 0 && tipoNomina) {
                switch (tipoNomina) {
                    case "Mensual":
                        sueldoBasePeriodo = base;
                        break;
                    case "Quincenal":
                        sueldoBasePeriodo = base / 2;
                        break;
                    case "Semanal":
                        sueldoBasePeriodo = base / 4;
                        break;
                    default:
                        sueldoBasePeriodo = base;
                        break;
                }
            }

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

            let grossRemuneration = sueldoBasePeriodo + pagoCalculadoOT + bonusAmount + incentivesAmount;
            const iggsCalculado = grossRemuneration * IGSS_RATE;
            const sueldoNominaCalculado = grossRemuneration - iggsCalculado - isrDeduction;
            setValue("nomina_iggs", iggsCalculado.toFixed(2));
            setValue("nomina_sueldo", sueldoNominaCalculado.toFixed(2));
        };
        calcularBonos();
    }, [salarioBaseEmpleado, nominaHorasExtra, tipoNomina, bono, incentivo, isr, setValue, watch, isCreating, nomina_id]);

    //Manejador de Envío
    const onSubmit = handleSubmit(async data => {
        let bonoTotalFinal = 0;
        try {
            if (data.empleado && data.nom_fecha) {
                const res = await getNominasPorEmpleado(data.empleado);
                const fechaActual = new Date(data.nom_fecha);
                const anioActual = fechaActual.getFullYear();
                const mesActual = fechaActual.getMonth() + 1; // 1-12
                if (mesActual === 8) { // Agosto: reinicio, solo el bono de agosto
                    bonoTotalFinal = parseFloat(data.nomina_bono) || 0;
                } else if (mesActual > 8 && mesActual <= 12) { // Septiembre a diciembre
                    const nominasDesdeAgosto = res.data.filter(nomina => {
                        if (!nomina.nom_fecha) return false;
                        const fechaNom = new Date(nomina.nom_fecha);
                        return fechaNom.getFullYear() === anioActual && (fechaNom.getMonth() + 1) >= 8 && (fechaNom.getMonth() + 1) < mesActual;
                    });
                    const bonosDesdeAgosto = isCreating
                        ? nominasDesdeAgosto
                        : nominasDesdeAgosto.filter(nomina => String(nomina.id) !== String(nomina_id) && String(nomina.nomina_id) !== String(nomina_id));
                    bonoTotalFinal = bonosDesdeAgosto.reduce((acc, nomina) => acc + (parseFloat(nomina.nomina_bono) || 0), 0);
                    bonoTotalFinal += parseFloat(data.nomina_bono) || 0;
                } else if (mesActual >= 1 && mesActual <= 7) { // Enero a julio
                    // Sumar bonos desde agosto del año anterior hasta el mes actual
                    const nominasDesdeAgostoAnterior = res.data.filter(nomina => {
                        if (!nomina.nom_fecha) return false;
                        const fechaNom = new Date(nomina.nom_fecha);
                        const anioNom = fechaNom.getFullYear();
                        const mesNom = fechaNom.getMonth() + 1;
                        return (
                            (anioNom === (anioActual - 1) && mesNom >= 8) ||
                            (anioNom === anioActual && mesNom <= mesActual && mesNom <= 7)
                        );
                    });
                    const bonosDesdeAgostoAnterior = isCreating
                        ? nominasDesdeAgostoAnterior
                        : nominasDesdeAgostoAnterior.filter(nomina => String(nomina.id) !== String(nomina_id) && String(nomina.nomina_id) !== String(nomina_id));
                    bonoTotalFinal = bonosDesdeAgostoAnterior.reduce((acc, nomina) => acc + (parseFloat(nomina.nomina_bono) || 0), 0);
                    bonoTotalFinal += parseFloat(data.nomina_bono) || 0;
                }
            } else {
                bonoTotalFinal = parseFloat(data.nomina_bono) || 0;
            }
        } catch (e) {
            bonoTotalFinal = parseFloat(data.nomina_bono) || 0;
        }
        const payload = {
            ...data,
            empleado: parseInt(data.empleado) || null,
            nomina_sueldo: parseFloat(data.nomina_sueldo) || 0,
            nomina_horasextra: parseFloat(data.nomina_horasextra) || 0,
            nomina_bono: parseFloat(data.nomina_bono) || 0,
            nomina_incentivos: parseFloat(data.nomina_incentivos) || 0,
            nomina_isr: parseFloat(data.nomina_isr) || 0,
            nomina_iggs: parseFloat(data.nomina_iggs) || 0,
            bono_total: bonoTotalFinal.toFixed(2), // Enviar como string decimal
        };
        console.log("Payload a enviar:", payload);
        try {
            if (isCreating) {
                await createTask(payload);
                toast.success("Nómina creada!");
            } else {
                await updateTask(nomina_id, payload);
                toast.success("Nómina actualizada!");
            }
            navigate(`/tasks-nomina/${empleadoIdParaNomina}`);
        } catch (error) {
            console.error("Error al guardar:", error);
            const errorMsg = error.response?.data?.detail || error.message || "Error desconocido.";
            toast.error(`Error: ${errorMsg}`);
        }
    });

    // Función para eliminar la nómina
    const handleDeleteNomina = async () => {
        if (nomina_id && !isDeleting) {
            setIsDeleting(true);
            try {
                await deleteTask(nomina_id);
                toast.success("Nómina eliminada!");
                navigate(`/tasks-nomina/${empleadoIdParaNomina}`);
            } catch (error) {
                console.error("Error al eliminar la nómina:", error);
                toast.error("No se pudo eliminar la nómina.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    //Renderizado JSX
    return (
        <div className="max-w-xl mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">
                {isCreating ? 'Crear Nómina' : 'Editar Nómina'}
            </h1>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

                {/* Columna 1 */}
                <div className="space-y-5">
                    {/* Empleado (Campo de texto no editable) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Empleado</label>
                        <input
                            type="text"
                            className="bg-zinc-800 p-3 rounded-lg block w-full h-14 text-gray-400 border border-zinc-700"
                            readOnly
                            value={watch("nombre_empleado") || ""}
                        />
                    </div>

                    {/* Salario Base Original (Campo de texto no editable) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Salario Base</label>
                        <input
                            type="number"
                            className="bg-zinc-800 p-3 rounded-lg block w-full h-14 text-gray-400 border border-zinc-700"
                            readOnly
                            value={watch("salario_base") !== null && watch("salario_base") !== undefined ? watch("salario_base").toFixed(2) : ''}
                        />
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

                    {/* Nomina Horas Extra */}
                    <div>
                        <label htmlFor="nomina_horasextra" className="block text-sm font-medium text-gray-300 mb-1">Nomina Horas Extra</label>
                        <input id="nomina_horasextra"
                            type="number"
                            placeholder="0"
                            {...register("nomina_horasextra", {
                                valueAsNumber: true,
                                min: { value: 0, message: "No puede ser negativo" }
                            })}
                            className={`bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white ${errors.nomina_horasextra ? 'border-red-500 border' : 'border-zinc-600 border'}`}
                        />
                        {errors.nomina_horasextra && <span className="text-red-400 text-xs mt-1">{errors.nomina_horasextra.message}</span>}
                    </div>

                    {/* Bonos */}
                    <div>
                        <label htmlFor="nomina_bono" className="block text-sm font-medium text-gray-300 mb-1">Bonos</label>
                        <input id="nomina_bono"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...register("nomina_bono", { valueAsNumber: true, min: 0 })}
                            className="bg-zinc-700 p-3 rounded-lg block w-full h-14 text-white border border-zinc-600"
                        />
                        
                    </div>
                    {/* Bono Total (solo visualización, no input) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Bono Total Acumulado</label>
                        <div className="bg-zinc-800 p-3 rounded-lg block w-full h-14 text-gray-400 border border-zinc-700 flex items-center">
                            {Number(watch("bono_total")).toFixed(2)}
                        </div>
                    </div>
                    <div className="md:col-span-2 mt-4 flex justify-between">
                         <button type="button" 
                         onClick={() => {
                             if (from === "rep-nomina") {
                              navigate("/tasks-rep-nomina");
                             } else {
                              navigate(`/tasks-nomina/${empleadoIdParaNomina}`);
                                    }
                                 }}
                         className="w-full bg-orange-600 p-3 rounded-lg
                            text-white font-semibold hover:bg-orange-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
                            Cancelar
                        </button>
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
                            placeholder = "0.00"
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

                    {/* Botón Guardar / Actualizar */}
                    <div className="md:col-span-2 mt-4">
                        <button type="submit" className="w-full bg-indigo-600 p-3 rounded-lg
                            text-white font-semibold hover:bg-indigo-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                            {isCreating ? 'Guardar Nómina' : 'Actualizar Nómina'}
                        </button>
                    </div>
                    <div className="md:col-span-2 mt-4">
                       {!isCreating && (
                            <button
                                type="button"
                                onClick={handleDeleteNomina}
                                className={`w-full bg-red-600 p-3 rounded-lg
                            text-white font-semibold hover:bg-red-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50" ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar Nómina'}
                            </button>
                        )}
                        </div>
                </div>
            </form>
        </div>
    );
}