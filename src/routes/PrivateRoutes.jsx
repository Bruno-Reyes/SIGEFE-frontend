import { Navigate, Route, Routes } from 'react-router';
import HomePage from '../modules/home';
import DetalleCandidato from '../components/Candidatos/DetalleCandidato';

export const PrivateRoutes = () => {
    return (
        <Routes>
            <Route path='/home' element={<HomePage />} />
            <Route path='*' element={<Navigate to='/home' replace />} />
            <Route path="/detalle/:id" element={<DetalleCandidato />} />
        </Routes>
    );
};