import {Navigate, Outlet} from "react-router-dom";
import {memo, useEffect, useState} from "react";

import authFetch from '../../fetchInterceptorAuthToken'

const ProtectedPage = () => {
    // const API_URL ='http://192.168.0.103:3000';
    // const API_URL ='http://192.168.0.14:3000';
    // const API_URL ='http://192.168.0.13:3000';
    // const API_URL ='http://192.168.220.1:3000';
    const API_URL ='http://localhost:3000';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await authFetch(`${API_URL}/api/authPage`);
                console.log(data.message);
            } catch (e) {
                console.error(e);
            }
        };

        checkAuth();

    }, []);

    if (!localStorage.getItem('accessToken')) { return <Navigate to="/login" replace />; }

    return <Outlet />;

}

export default memo(ProtectedPage);