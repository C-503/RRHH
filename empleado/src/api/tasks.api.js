import axios from 'axios';

const taskApi = axios.create({
    baseURL: "http://localhost:8000/tasks/api/v1/empleados/",
});

export const getAllTasks = () => taskApi.get("/");

export const getTask = (id) => taskApi.get(`/${id}/`);

export const createTask = (task) => taskApi.post("/", task);

export const deleteTask = (id) => taskApi.delete(`/${id}`);

export const updateTask = (id, task) => taskApi.put(`/${id}/`, task);

export const updateEmpleado = async (id, empleadoData) => {
    try {
        const response = await taskApi.put(`/${id}/`, empleadoData);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el empleado:", error);
        throw error;
    }
};

export const updateEmpleadoEstadoIndemnizacion = async (idEmpleado, estado) => {
    try {
        const response = await taskApi.patch(`/${idEmpleado}/`, {
            estado_indemnizacion: estado,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el estado de la indemnización del empleado:", error);
        throw error;
    }
};