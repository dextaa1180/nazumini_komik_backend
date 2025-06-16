const authService = require('./auth.service');
const asyncErrorHandler = require('../../errors/asyncErrorHandler');
const { SuccessResponse } = require('../../utils/apiResponse');

const registerUser = asyncErrorHandler(async (req, res, next) => {
    const newUser = await authService.createUser(req.body);
    const userJson = newUser.toJSON();
    delete userJson.password;
    new SuccessResponse({
        statusCode: 201,
        message: 'Registrasi berhasil. Silakan login.',
        data: userJson,
    }).send(res);
});

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  const userJson = user.toJSON();
  delete userJson.password;
  new SuccessResponse({
    message: 'Login berhasil.',
    data: { user: userJson, token: token, },
  }).send(res);
});

module.exports = {
    registerUser,
    loginUser,
};