const clearRefreshToken = (response) => {
    response.clearCookie('refreshToken');
}

module.exports = clearRefreshToken;