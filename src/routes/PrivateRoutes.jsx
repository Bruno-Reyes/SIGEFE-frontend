import { Navigate, Route, Routes } from 'react-router';
import HomePage from '../modules/home';
import Becas from '../components/apoyos_economicos/asignarBeca';
import UserDetailView from '../components/apoyos_economicos/consultarInfoUusario';

export const PrivateRoutes = () => {
    return (
        <Routes>
            <Route path='/home' element={<HomePage />} />
            <Route path='/becas' element={<Becas />} />
            <Route path='/usuario' element={<UserDetailView />} />
            <Route path='*' element={<Navigate to='/home' replace />} />
        </Routes>
    );
};