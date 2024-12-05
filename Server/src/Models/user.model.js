const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'User name should be unique'],
    },
    userEmail: {
        type: String,
        unique: [true, 'Email already exist in database please sign in'],
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please enter a valid email address',
        ],
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: true,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;