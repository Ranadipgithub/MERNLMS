import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePaymentService } from "@/services";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PaypalPaymentReturn() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paymentId = params.get("paymentId");
    const payerId = params.get("PayerID");
    useEffect(() => {
        if (paymentId && payerId) {
            async function capturePayment() {
                const orderId = JSON.parse(sessionStorage.getItem("orderId"));

                const response = await capturePaymentService(
                    paymentId,
                    payerId,
                    orderId
                );

                if (response?.success) {
                    sessionStorage.removeItem("orderId");
                    window.location.href = "/student-courses";
                }
            }

            capturePayment();
        }
    }, [payerId, paymentId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">
                    Processing your payment, please wait...
                </CardTitle>
            </CardHeader>
        </Card>
    );
}

export default PaypalPaymentReturn;