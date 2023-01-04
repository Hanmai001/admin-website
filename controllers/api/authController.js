const authService = require('../../model/authService');

let verifyEmail = async (req, res) => {
    const { email } = req.params;
    const result = await authService.emailExists(email);
    return res.status(200).json(!result)
};
let verifyUsername = async (req, res) => {
    const { username } = req.params;
    const result = await authService.usernameExists(username);
    return res.status(200).json(!result)
};

module.exports = {
    verifyEmail,
    verifyUsername,
}

