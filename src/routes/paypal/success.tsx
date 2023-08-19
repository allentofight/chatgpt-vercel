import { onMount } from "solid-js";

export default function () {
    const getOrderId = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get("token");
        console.log("Order ID:", orderId);
    };


    onMount(() => {
        getOrderId();
    })

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Your payment has been successfully processed.</p>
        </div>
    );
};
