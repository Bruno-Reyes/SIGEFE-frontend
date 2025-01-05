import { Navigate, Route, Routes } from 'react-router';
import LandingPage from '../modules/landingPage';
import Login from '../modules/login';
import Register from '../components/captacion/RegistroCandidato';

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
};


