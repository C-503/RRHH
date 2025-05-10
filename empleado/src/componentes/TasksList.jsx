import { useEffect, useState } from "react";
import { getAllTasks } from "../api/tasks.api";
import { TaskCard } from "./TaskCard";

export function TasksList() {
    const [empleados, setEmpleados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                // Obtenemos todos los empleados
                const empleadosRes = await getAllTasks();
                setEmpleados(empleadosRes.data);
            } catch (err) {
                console.error("Error al cargar empleados:", err);
                setError("Error al cargar la información de los empleados.");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Filtramos los empleados que tienen un estado_indemnizacion igual a 0
    const empleadosSinIndemnizacionActiva = empleados.filter(empleado => empleado.estado_indemnizacion === 0);

    if (loading) {
        return <p className="text-gray-300">Cargando empleados...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="grid grid-cols-7 gap-7">
            {empleadosSinIndemnizacionActiva.map(empleado => (
                <TaskCard key={empleado.id_empleado} task={empleado} />
            ))}
        </div>
    );
}