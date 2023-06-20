import { onMount } from 'solid-js';

const CaptchaForm = () => {
  onMount(() => {
    const script = document.createElement('script');
    script.src = "https://js.hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  });

  return (
    <div class="w-full">
      <div class="h-captcha" data-sitekey="28c45e00-2210-422a-9d06-000cf9d691b2"></div>
    </div>
  );
};

export default CaptchaForm;
