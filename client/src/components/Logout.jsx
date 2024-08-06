import {useEffect} from "react";

const Logout = ({ user }) => {

    useEffect(() => {
        const API_URL = import.meta.env.VITE_HOST_IP;

        const logout = async () => {
            try {
                // 로그아웃 이벤트리스너
                const token = localStorage.getItem('accessToken');
                console.log('logout accessToken:',token)

                await fetch(`${API_URL}/api/logout`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include'
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

