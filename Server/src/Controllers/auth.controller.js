const { addNewUser, validateUser } = require("../Servieces/user.serviece");


const registerUser = async(req, res, next) => {
    try {
        const response = await addNewUser(req.body);
        
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: response,
            error: null,
        })
    } catch (error) {
        next(error);
    }
}

const loginUser = async(req, res, next) => {
    try {
        const response = await validateUser(req.body);

        return res.status(200).json({
            success: true,
            message: 'User validated successfully',
            data: response,
            error: null,
        })
    } catch (error) {
        next(error);
    }
}

const checkAuth = async(req, res, next) => {
    try {
        const response = req.user;
        return res.status(200).json({
            success: true,
            message: 'Authenticated user',
            data: response,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    registerUser,
    loginUser,
    checkAuth
}