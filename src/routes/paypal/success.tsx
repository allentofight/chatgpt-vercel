import { order } from "paypal-rest-sdk";
import { onMount } from "solid-js";

import { paypalConfirm } from '~/utils/api'

export default function () {
    const getOrderId = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get("token");
        console.log("Order ID:", orderId);
        await paypalConfirm(orderId!)
    };

    onMount(() => {
        getOrderId();
    })

    return (
        <div class="flex justify-center text-white mt-5">
            <h1>Payment Successful</h1>
            <p>Your payment has been successfully processed.</p>
        </div>
    );
};
