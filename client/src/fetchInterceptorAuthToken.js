/* 로그인 검증이 필요한 fetch 요청마다 매번 토큰을 검증하는 과정을 사전에 진행해서 토큰 유효성을 확인해야합니다.
* 로그인 검증 기증을 구현하기 위해서 요청마다 똑같은 토큰 검증 요청 코드를 붙여야 합니다.
* 이러면 코드 중복이 발생하고, 어차피 토큰 검증하는 요청 코드는 매번 동일하기 때문에,
* 검증 코드만 따로 작성해서 로그인 검증이 필요할 때 갖다씁니다.
* 사용자가 보내는 fetch 요청을 이 코드 블록에서 가로채서 검증 코드를 붙인 후 요청 여부를 여기서 판단합니다.
* 따라서 interceptor 역할을 하는 코드라고 할 수 있습니다. */

const fetchInterceptorAuthToken = async (url, options = {}) => {
    const accessToken = localStorage.getItem('accessToken');

    // accessToken이 있으면 헤더에 추가해서 인증 토큰을 서버에 보냅니다.
    if (!options.headers || typeof options.headers !== 'object') {
        options.headers = {};
    }

    if (accessToken) {
        options.headers.Authorization = `Bearer ${accessToken}`;
        options.credentials = 'include';
    }

    try {
        const response = await fetch(url, options);

        // Access Token이 없거나, Access Token 정보가 이상한 경우.
        // response.status === 401 || response.status === 403
        // if (!response.ok) { return await response.json() ; }
        if (!response.ok) {

            localStorage.removeItem('accessToken');
            localStorage.removeItem('loginUser');
            alert(` 로그인을 진행해주세요.`)
            // 로그인 페이지로 리다이렉트
            window.location.href = '/login';

            throw new Error((await response.json()).error);
        }

        const data = await response.json();

        if (data.accessToken) localStorage.setItem('accessToken', data.accessToken);

        console.log("data:", data)

        return data;

    } catch (e) {

        console.error(e);

    }
}

export default fetchInterceptorAuthToken;