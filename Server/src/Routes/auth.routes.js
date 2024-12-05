const express = require('express');
const { registerUser, loginUser, checkAuth } = require('../Controllers/auth.controller');
const { authenticate } = require('../Middlewares/auth.middleware');
const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser)
authRouter.get('/check-auth', authenticate, checkAuth);

module.exports = authRouter;