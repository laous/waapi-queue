import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthProvider() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
  }, [navigate]);

  return null;
}

export default AuthProvider;
