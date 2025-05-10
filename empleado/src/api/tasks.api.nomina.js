import axios from 'axios';

const taskApiNomina = axios.create({
   baseURL: "http://localhost:8000/tasks/api/v1/nomina/",
});

export const getAllTasks = () => taskApiNomina.get("/");

export const getTask = (id) => taskApiNomina.get(`/${id}/`);

export const createTask = (task) => taskApiNomina.post("/", task);

export const deleteTask = (id) => taskApiNomina.delete(`/${id}`);

export const updateTask = (id, task) => taskApiNomina.put(`/${id}/`, task);

export const getNominasPorEmpleado = (empleadoId) =>
  taskApiNomina.get(`/empleado/${empleadoId}/`);
