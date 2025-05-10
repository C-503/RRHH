import axios from 'axios';

const taskApiPresta = axios.create({
   baseURL: "http://localhost:8000/tasks/api/v1/prestacion_dias/",
});

export const getAllTasks = () => taskApiPresta.get("/");

export const getTask = (id) => taskApiPresta.get(`/${id}/`);

export const createTask = (task) => taskApiPresta.post("/", task);

export const deleteTask = (id) => taskApiPresta.delete(`/${id}`);

export const updateTask = (id, task) => taskApiPresta.put(`/${id}/`, task);