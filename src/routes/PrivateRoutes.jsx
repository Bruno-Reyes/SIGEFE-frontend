import { Navigate, Route, Routes } from 'react-router';
import HomePage from '../modules/home';
import Becas from '../components/apoyos_economicos/asignarBeca';

export const PrivateRoutes = () => {
    return (
        <Routes>
            <Route path='/home' element={<HomePage />} />
            <Route path='becas' element={<Becas />} />
            <Route path='*' element={<Navigate to='/home' replace />} />
        </Routes>
    );
};