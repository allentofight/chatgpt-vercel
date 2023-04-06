// src/components/LoginDialog.tsx
import { createSignal } from 'solid-js';
import toast, { Toaster } from 'solid-toast';

export default function LoginDialog() {

  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Add your login logic here
  };

  const handleForgotPasswordClick = async () => {
    if (!email()) {
      toast.error("请先输入邮箱");
      return;
    }

    // Send a request to your server to trigger the password reset email
    const response = await fetch('/api/send-reset-password-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email() }),
    });

    if (response.ok) {
      toast.success("Reset password email sent");
    } else {
      toast.error("Error sending reset password email");
    }
  };

  return (
    <>
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div class="bg-gray-100 border border-gray-300 rounded-lg p-6 w-full max-w-md mx-auto">
          <h2 class="mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                id="email"
                value={email()}
                onInput={(e: Event) => setEmail((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium mb-2">Password:</label>
              <input
                type="password"
                id="password"
                value={password()}
                onInput={(e: Event) => setPassword((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button type="submit" class="w-full bg-green-500 text-white py-2 px-4 rounded-md font-bold uppercase">Login</button>
            <button type="button" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md font-bold uppercase mt-2" onClick={handleForgotPasswordClick}>Forgot Password?</button>
          </form>
        </div>
        <Toaster position="top-center" />
      </div>
    </>
  );
}
