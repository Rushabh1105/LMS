const { createNewOrder, capturePaymentAndFinalizeOrder } = require("../Servieces/order.serviece");


const createOrder = async(req, res, next) => {
    try {
        // console.log(req.body)
        const data = await createNewOrder(req.body);
        // console.log(data);
        return res.status(201).json({
            success: true,
            message: 'Payment is underway',
            data: data,
            error: null,
        });
    } catch (error) {
        next(error);
    }
}

const capturePayment = async(req, res, next) => {
    try {
        // console.log(req.body);
        const order = await capturePaymentAndFinalizeOrder(req.body);
        return res.status(200).json({
            success: true,
            message: 'payment confirmed',
            data: order,
            error: null
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createOrder,
    capturePayment
}