import React, { useEffect, useState } from 'react';
import { getAllTasks as getEmpleados } from '../api/tasks.api';
import { getAllTasks as getAsistencias, createTask as createAsistencia } from '../api/tasks.api.asistencia';

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

function getCurrentWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Domingo, 1=Lunes, ...
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return DIAS_SEMANA.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function TasksAsis() {
  const [empleados, setEmpleados] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const weekDates = getCurrentWeekDates();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [empRes, asisRes] = await Promise.all([
        getEmpleados(),
        getAsistencias()
      ]);
      setEmpleados(empRes.data);
      setAsistencias(asisRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleCheck = async (empleadoId, fecha, tipo) => {
    const now = new Date();
    const hora = now.toTimeString().slice(0, 8);
    const asis = asistencias.find(a => a.empleado === empleadoId && a.asistencia_fecha === fecha);
    if (!asis && tipo === 'entrada') {
      await createAsistencia({
        empleado: empleadoId,
        asistencia_fecha: fecha,
        asistencia_h_entrada: hora,
        asistencia_h_salida: null
      });
    } else if (asis && tipo === 'salida' && !asis.asistencia_h_salida) {
      // ACTUALIZAR asistencia existente usando PUT
      await fetch(`http://localhost:8000/tasks/api/v1/asistencias/${asis.id || asis.asistencia_id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empleado: empleadoId,
          asistencia_fecha: fecha,
          asistencia_h_entrada: asis.asistencia_h_entrada,
          asistencia_h_salida: hora
        })
      });
    }
    const asisRes = await getAsistencias();
    setAsistencias(asisRes.data);
  };

  if (loading) return <div className="text-gray-300">Cargando asistencias...</div>;

  return (
    <div className="container mx-auto p-4 text-gray-300">
      <h2 className="text-2xl font-bold mb-4 text-center">Asistencia semanal</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-zinc-900 shadow-md rounded-lg">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Empleado</th>
              {weekDates.map((fecha, idx) => (
                <th key={fecha} className="px-4 py-2 text-center text-gray-400">{DIAS_SEMANA[idx]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empleados.map(emp => (
              <tr key={emp.id_empleado} className="hover:bg-zinc-800">
                <td className="border px-4 py-2 font-medium whitespace-nowrap">{emp.nombre} {emp.apellido}</td>
                {weekDates.map(fecha => {
                  const asis = asistencias.find(a => a.empleado === emp.id_empleado && a.asistencia_fecha === fecha);
                  return (
                    <td key={fecha} className="border px-4 py-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <label className="inline-flex items-center justify-center">
                          <span className="mr-1 text-xs text-gray-400">Hora entrada</span>
                          <input
                            type="checkbox"
                            checked={!!asis && !!asis.asistencia_h_entrada}
                            onChange={() => !asis && handleCheck(emp.id_empleado, fecha, 'entrada')}
                            disabled={!!asis && !!asis.asistencia_h_entrada}
                            className="accent-green-500 w-4 h-4 rounded focus:ring-0 border-zinc-600 bg-zinc-900"
                          />
                          <span className="ml-1 text-xs text-green-400 font-mono">{asis && asis.asistencia_h_entrada ? asis.asistencia_h_entrada : ''}</span>
                        </label>
                        <label className="inline-flex items-center justify-center">
                          <span className="mr-1 text-xs text-gray-400">Hora salidaa</span>
                          <input
                            type="checkbox"
                            checked={!!asis && !!asis.asistencia_h_salida}
                            onChange={() => asis && !asis.asistencia_h_salida && handleCheck(emp.id_empleado, fecha, 'salida')}
                            disabled={!asis || !!asis.asistencia_h_salida}
                            className="accent-blue-500 w-4 h-4 rounded focus:ring-0 border-zinc-600 bg-zinc-900"
                          />
                          {asis && asis.asistencia_h_salida && (
                            <span className="ml-1 text-xs text-blue-400 font-mono">{asis.asistencia_h_salida}</span>
                          )}
                        </label>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            {empleados.length === 0 && (
              <tr>
                <td colSpan={weekDates.length + 1} className="text-center text-gray-400 py-4">No hay empleados registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
