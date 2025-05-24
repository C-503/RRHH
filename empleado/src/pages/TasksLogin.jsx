import React, { useState } from 'react';
import { login } from '../api/tasks.api.login';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      // Guardamos usuario y contraseña en localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      navigate('/tasks');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#202020] font-inter">
      
      <form
        onSubmit={handleSubmit}
        className="bg-gray-600 p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white-700">
          Iniciar Sesión
        </h2>
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-white-700 text-sm font-bold mb-2">
            Usuario
          </label>
          <input
            type="text"
            id="username"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-white-700 text-sm mb-2">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;