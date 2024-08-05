const clearRefreshToken = (response) => {
    response.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'strict'
    });
}

module.exports = clearRefreshToken;