import axios from 'axios';

const taskApiPrestacion = axios.create({
   baseURL: "http://localhost:8000/tasks/api/v1/prestaciones/",
});

export const getAllTasks = () => taskApiPrestacion.get("/");

export const getTask = (id) => taskApiPrestacion.get(`${id}/`); // Quitar barra inicial aquí también por consistencia

export const createTask = (task) => taskApiPrestacion.post("/", task);

export const deleteTask = (id) => taskApiPrestacion.delete(`${id}/`); // Quitar barra inicial aquí también

// 👇 Corrección aquí 👇
export const updateTask = (id, task) => taskApiPrestacion.put(`${id}/`, task); // Quita la barra inicial