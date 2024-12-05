const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../Config/serverConfig');


const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({
                success: false,
                message: 'User is not authorized',
                data: null,
                error: null,
            });
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, JWT_SECRET);
        // console.log(payload);
        req.user = payload;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: 'Login again',
            data: null,
            error: error,
        });
    }
}

module.exports = {
    authenticate,
}