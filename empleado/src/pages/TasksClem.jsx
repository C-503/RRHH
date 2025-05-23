import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function TasksClem() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtenemos usuario y contraseña del localStorage
    const storedUser = localStorage.getItem('username') || '';
    const storedPassword = localStorage.getItem('password') || '';
    setUser(storedUser);
    setPassword(storedPassword);
  }, []);

  const handleLogout = () => {
    // Limpiamos los datos de login y redirigimos al login
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md relative">
      {/* Esquina superior derecha, texto pequeño */}
      <span className="absolute top-2 right-4 text-xs text-[#FFD600] font-mono">Clemonoit503</span>
      <h1 className="text-xl text-gray-700 text-center mb-2">Modulo Admin</h1>
      <h2 className="text-2xl text-gray-700 mb-4 text-center">Datos de Sesión</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Usuario:</label>
        <input
          type="text"
          value={user}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 text-gray-700"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-1">Contraseña:</label>
        <input
          type="password"
          value={password}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 text-gray-700"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate('/tasks')}
          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Regresar
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
