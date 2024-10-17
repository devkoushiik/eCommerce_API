const createTokenUser = (user) => {
    const {name,email,role,userId} = user;
    const tokenUser = {user:{name,email, role, userId}}
    return tokenUser;
}

module.exports = createTokenUser;