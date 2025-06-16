const router = require('express').Router();
const validate = require('../../middlewares/validation.middlewares');
const { registerUserSchema, loginUserSchema } = require('./auth.validator');
const authController = require('./auth.controller');

router.post(
    '/register',
    validate(registerUserSchema), 
    authController.registerUser
);

router.post(
    '/login',
    validate(loginUserSchema),
    authController.loginUser
);

module.exports = router;