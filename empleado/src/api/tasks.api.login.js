import axios from 'axios';

export const login = async (username, password) => {
  try {
    // Usar URL absoluta para el login JWT
    const response = await axios.post('http://localhost:8000/api/token/', {
      username,
      password,
    });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return true;
  } catch (error) {
    console.error('Error de login:', error);
    return false;
  }
};
