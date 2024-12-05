const express = require('express');
const { createOrder, capturePayment } = require('../../Controllers/order.controller');

const orderRouter = express.Router();

orderRouter.post('/create', createOrder);
orderRouter.post('/finalize', capturePayment);


module.exports = orderRouter;