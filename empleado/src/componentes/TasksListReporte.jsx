import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReportesPorEmpleado } from "../api/tasks.api.reporte";
import { TasksCardReporte } from "../componentes/TasksCardReporte";

export function TasksListReporte() {
    const { id } = useParams();
    const [reportes, setReportes] = useState([]);

    useEffect(() => {
        async function loadReportes() {
            if (id) {
                try {
                    const res = await getReportesPorEmpleado(id);
                    setReportes(res.data);
                } catch (error) {
                    console.error("Error al obtener los reportes:", error);
                }
            }
        }
        loadReportes();
    }, [id]);

    return (
        <div className="grid grid-cols-2 gap-4">
            {reportes.map((reporte) => (
                <TasksCardReporte
                    key={reporte.reporte_id}
                    reporteId={reporte.reporte_id}
                    empleadoId={reporte.empleado}
                    reporteTipo={reporte.reporte_tipo}
                />
            ))}
        </div>
    );
}