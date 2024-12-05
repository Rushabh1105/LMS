const axios = require('axios');
const paypal = require("../Helpers/payments");
const Order = require("../Models/order.model");
const StudentCourses = require("../Models/studentCourse.model");
const Course = require("../Models/course.model");
const { CLIENT_URL } = require("../Config/serverConfig");


const createNewOrder = async (data) => {
    try {
        const {userId, userName, userEmail, OrderStatus, paymentMethod, paymentStatus, orderDate, paymentId, payerId,
            instructorId, instructorName, courseImage, courseTitle, courseId, coursePricing,} = data;
    // IMPLEMENT PRICE INR TO USD AND AGAIN INR
        const {convertedAmount, rate} = await currencyConverter(coursePricing, 'INR', 'USD');

        const createPaymentJSON = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: `${CLIENT_URL}/payment-return`,
                cancel_url: `${CLIENT_URL}/payment-cancel`,
            },
            transactions: [
                {
                    item_list: {
                        items: [
                            {
                                name: courseTitle,
                                sku: courseId,
                                price: convertedAmount,
                                currency: 'USD',
                                quantity: 1
                            }
                        ]
                    },
                    amount: {
                        currency: 'USD',
                        total: convertedAmount,
                    },
                    description: courseTitle
                }
            ]
        }

        let paymentInfo;

        try {
            paymentInfo = await new Promise((resolve, reject) => {
                paypal.payment.create(createPaymentJSON, (error, payment) => {
                    if(error) reject(error);
                    else resolve(payment);
                })
            })    
        } catch (error) {
            throw (error);
        }

        if(paymentInfo){
            const newCreatedCourseOrder = new Order({
                userId, userName, userEmail, OrderStatus, paymentMethod, paymentStatus, orderDate, paymentId, payerId,
                instructorId, instructorName, courseImage, courseTitle, courseId, coursePricing
            });
            const newCreatedCourseOrderSaved = await newCreatedCourseOrder.save();
            const approvalUrl = paymentInfo.links.find((link) => link.rel == 'approval_url').href;
            return {approvalUrl, orderId: newCreatedCourseOrderSaved._id};
        }
        // paypal.payment.create(createPaymentJSON, async (error, paymentInfo) => {
        //     if(error){
        //         console.log(error);
        //         throw {error};
        //     }else{
        //         const newCreatedCourseOrder = new Order({
        //             userId, userName, userEmail, OrderStatus, paymentMethod, paymentStatus, orderDate, paymentId, payerId,
        //             instructorId, instructorName, courseImage, courseTitle, courseId, coursePricing
        //         });
        //         const newCreatedCourseOrderSaved = await newCreatedCourseOrder.save();
        //         const approvalUrl = paymentInfo.links.find((link) => link.rel == 'approval_url').href;
        //         // console.log(approvalUrl);
        //         return {approvalUrl, orderId: newCreatedCourseOrderSaved._id};
        //     }
        // });
        return new Error('Something went wrong');
        
    } catch (error) {
        console.log(error);
        throw {error}
    }
}

const capturePaymentAndFinalizeOrder = async(data) => {
    try {
        const {paymentId, payerId, orderId} = data;
        // console.log(orderId);
        let order = await Order.findById(orderId);
        if(!order){
            throw new Error("Order not found");
        }

        order.paymentStatus = 'paid';
        order.OrderStatus = 'confirmed';
        order.paymentId= paymentId;
        order.payerId= payerId;

        await order.save();

        const studentCourses = await StudentCourses.findOne({userId: order.userId});
        
        if(studentCourses){
            console.log('if');
            
            let course = {
                courseId: order.courseId,
                title: order.courseTitle,
                instructorId: order.instructorId,
                instructorName: order.instructorName,
                dateOfPurchase: order.orderDate,
                courseImage: order.courseImage,
            }
            studentCourses.courses.push(course);
            await studentCourses.save();
        }else{
            console.log('else');
            
            const newStudentCourses = new StudentCourses({
                userId: order.userId,
                courses: [
                    {
                        courseId: order.courseId,
                        title: order.courseTitle,
                        instructorId: order.instructorId,
                        instructorName: order.instructorName,
                        dateOfPurchase: order.orderDate,
                        courseImage: order.courseImage,
                    }
                ]
            });
            await newStudentCourses.save();
        }

        const course = await Course.findByIdAndUpdate(order.courseId, {
            $addToSet: {
                students: {
                    studentId: order.userId,
                    studentName: order.userName,
                    studentEmail: order.userEmail,
                    paidAmount: order.coursePricing,
                }
            }
        });

        return order;
    } catch (error) {
        throw {error};
    }
}

async function currencyConverter(amount, from, to) {
    const apiUrl = `https://open.er-api.com/v6/latest/${from}`;
    try {
        const response = await axios.get(apiUrl);
        const rates = response.data.rates;
        if(!rates[to]){
            throw new Error('Currency not found');
        }
        const rate = rates[to];
        const convertedAmount = (amount * rate).toFixed(2);
        return {
            convertedAmount,
            rate
        }
    } catch (error) {
        throw {error};
    }
}

module.exports = {
    createNewOrder,
    capturePaymentAndFinalizeOrder,
}