const mongoose = require('mongoose');

const orderSchama = new mongoose.Schema({
    userId: String,
    userName: String,
    userEmail: String,
    OrderStatus: String,
    paymentMethod: String,
    paymentStatus: String,
    orderDate: Date,
    paymentId: String,
    payerId: String,
    instructorId: String,
    instructorName: String,
    courseImage: String,
    courseTitle: String,
    courseId: String,
    coursePricing: String,
});

const Order = mongoose.model('Order', orderSchama);
module.exports = Order;