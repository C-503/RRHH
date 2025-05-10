import axios from 'axios';

const taskApiProduc = axios.create({
   baseURL: "http://localhost:8000/tasks/api/v1/productividad/",
});

export const getAllTasks = () => taskApiProduc.get("/");

export const getTask = (id) => taskApiProduc.get(`/${id}/`);

export const createTask = (task) => taskApiProduc.post("/", task);

export const deleteTask = (id) => taskApiProduc.delete(`/${id}`);

export const updateTask = (id, task) => taskApiProduc.put(`/${id}/`, task);