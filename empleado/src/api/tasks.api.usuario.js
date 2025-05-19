import axios from 'axios';

const taskUSer = axios.create({
   baseURL: "http://localhost:8000/tasks/api/v1/usuario/",
});

export const getAllTasks = () => taskUSer.get("/");

export const getTask = (id) => taskUSer.get(`${id}/`);

export const createTask = (task) => taskUSer.post("/", task);

export const deleteTask = (id) => taskUSer.delete(`${id}/`); 

export const updateTask = (id, task) => taskUSer.put(`${id}/`, task);