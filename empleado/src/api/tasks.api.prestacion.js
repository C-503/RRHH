import axios from 'axios';

const taskApiPrestacion = axios.create({
   baseURL: "http://localhost:8000/tasks/api/v1/prestaciones/",
});

export const getAllTasks = () => taskApiPrestacion.get("/");

export const getTask = (id) => taskApiPrestacion.get(`${id}/`);

export const createTask = (task) => taskApiPrestacion.post("/", task);

export const deleteTask = (id) => taskApiPrestacion.delete(`${id}/`); 

export const updateTask = (id, task) => taskApiPrestacion.put(`${id}/`, task);