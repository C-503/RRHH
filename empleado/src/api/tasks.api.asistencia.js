import axios from 'axios';

const taskAsis = axios.create({
    baseURL: "http://localhost:8000/tasks/api/v1/asistencias/",
});

export const getAllTasks = () => taskAsis.get("/");

export const getTask = (id) => taskAsis.get(`/${id}/`);

export const createTask = (task) => taskAsis.post("/", task);

export const deleteTask = (id) => taskAsis.delete(`/${id}`);

export const updateTask = (id, task) => taskAsis.put(`/${id}/`, task);