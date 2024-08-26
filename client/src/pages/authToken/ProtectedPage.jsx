import {Navigate, Outlet} from "react-router-dom";
import {memo, useEffect} from "react";

import authFetch from '../../fetchInterceptorAuthToken'
import authManager from "../../authManager";

const ProtectedPage = () => {

    const API_URL = import.meta.env.VITE_HOST_IP;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await authManager.addRequest(() => authFetch(`${API_URL}/api/authPage`));
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