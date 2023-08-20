export default function () {
    return (
        <div class="flex flex-col items-center text-white mt-5">
            <h1>Payment Canceled</h1>
            <p>Your payment has been canceled. If you have any questions, please contact us.</p>
            <a href="/">Return to Home</a>
            <button
                class={`bg-blue-500 mt-3 text-white px-4 py-2 rounded`}
                onClick={() => {
                    window.location.href = '/'
                }}>
                Return to Home
            </button>
        </div>
    );
};
