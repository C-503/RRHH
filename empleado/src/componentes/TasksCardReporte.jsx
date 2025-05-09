import { useNavigate } from "react-router-dom";

export function TasksCardReporte({ empleadoId, reporteTipo, reporteId }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-zinc-800 p-4 w-35 h-20 hover:bg-zinc-700 hover:cursor-pointer"
      onClick={() => {
        navigate(`/tasks-reporte/${empleadoId}/${reporteId}`);
      }}
    >
      <p className="font-bold uppercase">{reporteId}</p>
      <p className="text-slate-300">{reporteTipo}</p>
    </div>
  );
}
