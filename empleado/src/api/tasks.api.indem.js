import axios from 'axios';

const taskApiIndem = axios.create({
   baseURL: "http://localhost:8000/tasks/api/v1/indemnizacion/",
});

export const getAllTasks = () => taskApiIndem.get("/");

export const getTask = (id) => taskApiIndem.get(`/${id}/`);

export const createTask = (task) => taskApiIndem.post("/", task);

export const deleteTask = (id) => taskApiIndem.delete(`/${id}`);

export const updateTask = (id, task) => taskApiIndem.put(`/${id}/`, task);

export { taskApiIndem };