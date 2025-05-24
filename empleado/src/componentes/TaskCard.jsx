import { useNavigate } from "react-router-dom";

export function TaskCard({ task }) {
  const navigate = useNavigate();

  const initials = `${task.nombre?.charAt(0) ?? ""}${task.apellido?.charAt(0) ?? ""}`;

  return (
    <div
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm hover:shadow-md border border-zinc-200 dark:border-zinc-700 transition-all duration-200 cursor-pointer p-4 w-44 h-24 flex flex-col justify-center items-center text-center"
      onClick={() => navigate(`/tasks/${task.id_empleado}`)}
    >
      <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mb-1">
        {initials}
      </div>
      <p className="text-sm font-medium text-zinc-900 dark:text-white truncate w-full">
        {task.nombre} {task.apellido}
      </p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 tracking-wide uppercase truncate">
        {task.pueesto}
      </p>
    </div>
  );
}
