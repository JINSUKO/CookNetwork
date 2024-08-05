import authFetch from '../fetchInterceptorAuthToken';
import {useEffect} from "react";

const Logout = ({ user }) => {

    useEffect(() => {
        // const API_URL ='http://192.168.0.103:3000';
        // const API_URL ='http://192.168.0.14:3000';
        // const API_URL ='http://192.168.0.13:3000';
        const API_URL ='http://192.168.220.1:3000';

        const logout = async () => {
            try {
                // 로그아웃 이벤트리스너
                const token = localStorage.getItem('accessToken');

                await fetch(`${API_URL}/api/logout`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'credentials': 'include'
                    }
                });

                localStorage.removeItem('accessToken');
                localStorage.removeItem('loginUser');


                // window.location.href = '/login';
            } catch (error) {
                console.error('로그아웃 중 오류 발생:', error);
            }
        }

        logout();
    }, []);


    return (
        <span></span>
    )


}

export default Logout;

