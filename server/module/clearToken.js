const clearToken = (response) => {
    response.clearCookie('refreshToken');
    response.clearCookie('accessToken');
}

module.exports = clearToken;