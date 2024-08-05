import {Navigate, Outlet} from "react-router-dom";
import {memo} from "react";

import authFetch from '../../fetchInterceptorAuthToken'

const ProtectedPage = ({ children }) => {
    // const API_URL ='http://192.168.0.103:3000';
    // const API_URL ='http://192.168.0.14:3000';
    // const API_URL ='http://192.168.0.13:3000';
    const API_URL ='http://192.168.220.1:3000';

    try {
        authFetch(`${API_URL}/api/authPage`)
            .then(data => {
                console.log(data.message);
            })
            .catch(err => console.error(err));

        const accessToken = localStorage.getItem("accessToken");
        console.log('잘오고 있지? at ProtectedPage third', accessToken)

        return children ? children : <Outlet />;

    } catch (e) {
        console.error(e);

        return <Navigate to="/login" replace />;
    }

}

export default memo(ProtectedPage);