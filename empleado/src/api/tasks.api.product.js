import axios from 'axios';

const taskProdu = axios.create({
    baseURL: "http://localhost:8000/tasks/api/v1/productividad/",
});

export const getAllTasks = () => taskProdu.get("/");

export const getTask = (id) => taskProdu.get(`/${id}/`);

export const createTask = (task) => taskProdu.post("/", task);

export const deleteTask = (id) => taskProdu.delete(`/${id}`);

export const updateTask = (id, task) => taskProdu.put(`/${id}/`, task);