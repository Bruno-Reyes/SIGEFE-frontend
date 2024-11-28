import { Navigate, Route, Routes } from 'react-router';
import HomePage from '../modules/home';

export const PrivateRoutes = () => {
    return (
        <Routes>
            <Route path='/home' element={<HomePage />} />
            <Route path='*' element={<Navigate to='/home' replace />} />
        </Routes>
    );
};