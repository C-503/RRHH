import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TasksIndemPages = () => {
    const [indemnizaciones, setIndemnizaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [empleadosData, setEmpleadosData] = useState({});

    const fetchIndemnizaciones = async () => {
        try {
            const response = await axios.get('http://localhost:8000/tasks/api/v1/indemnizacion/');
            setIndemnizaciones(response.data);
        } catch (error) {
            console.error('Error al obtener las indemnizaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmpleado = async (empleadoId) => {
        try {
            const response = await axios.get(`http://localhost:8000/tasks/api/v1/empleados/${empleadoId}/`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener el empleado con ID ${empleadoId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchIndemnizaciones();
        };
        loadData();
    }, []);

    useEffect(() => {
        const getEmpleadosDetails = async () => {
            const empleadosInfo = {};
            for (const indemnizacion of indemnizaciones) {
                if (indemnizacion.empleado) {
                    const empleado = await fetchEmpleado(indemnizacion.empleado);
                    if (empleado) {
                        empleadosInfo[indemnizacion.empleado] = empleado;
                    }
                }
            }
            setEmpleadosData(empleadosInfo);
        };

        if (indemnizaciones.length > 0) {
            getEmpleadosDetails();
        }
    }, [indemnizaciones]);

    if (loading) {
        return <p className="text-gray-300">Cargando indemnizaciones...</p>;
    }

    return (
        <div className="container mx-auto p-4 text-gray-300">
            <h1 className="text-2xl font-bold mb-4">Listado de Indemnizaciones</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-zinc-900 shadow-md rounded-lg">
                    <thead className="bg-zinc-800">
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-400">ID</th>
                            <th className="px-4 py-2 text-left text-gray-400">Empleado</th>
                            <th className="px-4 py-2 text-left text-gray-400">Fecha de Terminación</th>
                            <th className="px-4 py-2 text-center text-gray-400">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {indemnizaciones.map((indemnizacion) => (
                            <tr key={indemnizacion.indem_id} className="hover:bg-zinc-800">
                                <td className="border px-4 py-2">{indemnizacion.indem_id}</td>
                                <td className="border px-4 py-2">
                                    {empleadosData[indemnizacion.empleado] ?
                                        `${empleadosData[indemnizacion.empleado].nombre} ${empleadosData[indemnizacion.empleado].apellido}` :
                                        'Cargando...'
                                    }
                                </td>
                                <td className="border px-4 py-2">{indemnizacion.fecha_terminacion}</td>
                                <td className="border px-4 py-2 text-center">
                                    <Link
                                        to={`/tasks-indem/${indemnizacion.indem_id}`}
                                        className="bg-green-800 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
                                    >
                                        Ver detalles
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TasksIndemPages;