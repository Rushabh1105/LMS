import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { captureFinalizePaymentService } from '@/services';
import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

function PaypalPaymentReturnPage() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get('paymentId');
    const payerId = params.get('PayerID');
    // console.log(payerId, " ", paymentId);
    const hasCalled = useRef(false);

    async function capturePayment() {
        const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
        const response = await captureFinalizePaymentService(paymentId, payerId, orderId);
        console.log(response)
        if(response?.success){
            sessionStorage.removeItem('currentOrderId');
            window.location.href = '/student-courses';
        }
    }
    // console.log(params);
    useEffect(() => {
        if(paymentId && payerId && !hasCalled.current){
            hasCalled.current = true;
            capturePayment();
        }
    }, [paymentId, payerId])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Processing Payment... Please Wait</CardTitle>
            </CardHeader>
        </Card>
    )
}

export default PaypalPaymentReturnPage