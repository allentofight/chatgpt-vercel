import { onMount, createSignal } from "solid-js";

// Import the API utility function
import { paypalConfirm } from '~/utils/api'

// Function to get the order ID from the URL query parameters
const getOrderIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("token");
};

export default function PaymentSuccess() {
    const [paySuccess, setPaySuccess] = createSignal(false);

    // Function to confirm the payment and set the paySuccess state
    const confirmPayment = async () => {
        const orderId = getOrderIdFromUrl();
        console.log("Order ID:", orderId);
        // Uncomment the following line to confirm the payment with the API
        await paypalConfirm(orderId!);
        setPaySuccess(true);
    };

    // Confirm the payment on component mount
    onMount(() => {
        confirmPayment();
    });

    return (
        <>
            <style>
                {`
                    .animate-dots::after {
                        content: '.';
                        animation: dots 1s steps(5, end) infinite;
                    }
                    
                    @keyframes dots {
                        0%, 20% {
                            color: rgba(0, 0, 0, 0);
                            text-shadow: .25em 0 0 rgba(0, 0, 0, 0), .5em 0 0 rgba(0, 0, 0, 0);
                        }
                        40% {
                            color: gray;
                            text-shadow: .25em 0 0 rgba(0, 0, 0, 0), .5em 0 0 rgba(0, 0, 0, 0);
                        }
                        60% {
                            text-shadow: .25em 0 0 gray, .5em 0 0 rgba(0, 0, 0, 0);
                        }
                        80%, 100% {
                            text-shadow: .25em 0 0 gray, .5em 0 0 gray;
                        }
                    }
                    
                `}
            </style>
            <div class="flex flex-col items-center justify-center mt-10">
                {paySuccess() ? (
                    <div class="bg-green-100 p-5 rounded-lg shadow-md text-center">
                        <h1 class="text-2xl font-bold text-green-700">Payment Successful</h1>
                        <p class="text-green-600 mt-2">Your payment has been successfully processed.</p>
                        <button
                            class="bg-green-500 hover:bg-green-600 mt-4 text-white px-6 py-2 rounded-full transition duration-300 ease-in-out"
                            onClick={() => {
                                window.location.href = '/';
                            }}>
                            Return to Home
                        </button>
                    </div>
                ) : (
                    <div class="bg-white rounded-lg flex flex-col items-center text-xl font-semibold text-gray-600">
                        <div class="mt-6">
                            <span>paying</span>
                            <span class="animate-dots"></span>
                        </div>
                        <div class="mb-2">
                            <img src="https://pic.imgdb.cn/item/64e2178e661c6c8e54d12f28.webp" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
