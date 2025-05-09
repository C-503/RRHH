import axios from 'axios';

const taskApiReporte = axios.create({
   baseURL: "http://localhost:8000/tasks/api/v1/reporte/",
});

export const getAllTasks = () => taskApiReporte.get("/");

export const getTask = (id) => taskApiReporte.get(`/${id}/`);

export const createTask = (task) => taskApiReporte.post("/", task);

export const deleteTask = (id) => taskApiReporte.delete(`/${id}`);

export const updateTask = (id, task) => taskApiReporte.put(`/${id}/`, task);

export const getReportesPorEmpleado = (id_empleado) =>
    taskApiReporte.get(`/empleado/${id_empleado}`);