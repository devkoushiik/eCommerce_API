const createTokenUser = (user) => {
    const { name, email, role, _id } = user;
    const tokenUser = { user: { name, email, role, userId: _id } };
    return tokenUser;
}

module.exports = createTokenUser;