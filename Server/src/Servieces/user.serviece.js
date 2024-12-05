const User = require('../Models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, EXPIRES_IN } = require('../Config/serverConfig');

const addNewUser = async(userData) => {
    try {
        const password = userData.password;

        const encryptedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            userEmail: userData.userEmail,
            userName: userData.userName,
            password: encryptedPassword,
            role: userData.role
        }

        console.log(encryptedPassword);
        console.log(newUser);
        return await new User(newUser).save();
    } catch (error) {
        throw (error);
    }
}

const validateUser = async(userData) => {
    try {
        
        const {userEmail, password, userName} = userData;
        // console.log(!userEmail || !userName);
        if(!userEmail && !userName){
            throw new Error('Email or Username is required');
        }
        if(!password){
            throw new Error('Password is required');
        }
        let user, compare = false;
        if(userEmail){
            user = await User.findOne({userEmail});
        }
        if(userName){
            user = await User.findOne({userName});
        }

        if(user){
            compare = await bcrypt.compare(password, user.password);
        }

        if(!compare){
            throw new Error('Wrong password');
        }

        const accessToken = jwt.sign({
            _id: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            role: user.role
        }, JWT_SECRET, {expiresIn: EXPIRES_IN});

        return {
            accessToken,
            user: {
                _id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                role: user.role
            }
        };

    } catch (error) {
        throw (error);
    }
}

module.exports = {
    addNewUser,
    validateUser,
}