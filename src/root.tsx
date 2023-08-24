// @refresh reload
import { Suspense } from "solid-js"
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts
} from "solid-start"
import "@unocss/reset/tailwind.css"
import "~/styles/main.css"
import "uno.css"
import "katex/dist/katex.min.css"
import "highlight.js/styles/atom-one-dark.css"
import PrefixTitle from "./components/PrefixTitle"
import { useRegisterSW } from "virtual:pwa-register/solid"
import { onMount } from "solid-js"
// @ts-ignore
import { pwaInfo } from "virtual:pwa-info"

export default function Root() {
  useRegisterSW({ immediate: true })

  onMount(() => {
    // Your script here
    (function () {
      const el = document.querySelector('body');
      const theme = localStorage.getItem('THEME') ?? 'dark';
      el!.setAttribute('class', theme);
      localStorage.setItem('THEME', theme);
      const html = document.documentElement;

      function setFont() {
        const cliWidth = html.clientWidth;
        if (cliWidth > 1920) {
          html.style.fontSize = '16px';
          return;
        }
        let fontSize = (16 * (cliWidth / 1920) < 10 ? 10 : 16 * (cliWidth / 1920))
        fontSize = Math.max(fontSize, 14)
        html.style.fontSize = fontSize + 'px';
      }

      setFont();

      window.onresize = function () {
        setFont();
      };
    })();
  });

  return (
    <Html lang="zh-cn" class="dark">
      <Head>
        <PrefixTitle />
        <Meta charset="utf-8" />
        <Meta name="description" lang="en" content="Explore the endless possibilities of ChatGPT conversations and AI drawing. Our platform offers advanced chatbot experiences and innovative AI drawing tools for easy creation and interaction." />
        <Link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Link rel="stylesheet" href="/fonts/iconfont.css" />
        <Meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <Link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="192x192"
        />
        {pwaInfo?.webManifest?.href ? (
          <Link rel="manifest" href={pwaInfo.webManifest.href} />
        ) : (
          ""
        )}
        <Meta name="theme-color" content="#f6f8fa" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
