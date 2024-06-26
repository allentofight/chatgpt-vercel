// @refresh reload
import { Suspense } from 'solid-js';
import {
    Body,
    ErrorBoundary,
    FileRoutes,
    Head,
    Html,
    Link,
    Meta,
    Routes,
    Scripts,
} from 'solid-start';
import '@unocss/reset/tailwind.css';
import '~/styles/main.css';
import 'uno.css';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/atom-one-dark.css';
import PrefixTitle from './components/PrefixTitle';
import { useRegisterSW } from 'virtual:pwa-register/solid';
import { onMount } from 'solid-js';
// @ts-ignore
import { pwaInfo } from 'virtual:pwa-info';

export default function Root() {
    useRegisterSW({ immediate: true });

    onMount(() => {
        // Your script here
        (function () {
            const theme = localStorage.getItem('gpt-theme') ?? 'light';
            localStorage.setItem('gpt-theme', theme);
            const html = document.documentElement;

            function setFont() {
                const cliWidth = html.clientWidth;
                if (cliWidth > 1920) {
                    html.style.fontSize = '16px';
                    return;
                }
                let fontSize =
                    16 * (cliWidth / 1920) < 10 ? 10 : 16 * (cliWidth / 1920);
                fontSize = Math.max(fontSize, 14);
                html.style.fontSize = fontSize + 'px';
            }

            html.setAttribute('class', theme);
            setFont();

            window.onresize = function () {
                setFont();
            };

            window.MathJax = {
                tex: {
                    inlineMath: [
                        ['$', '$'],
                        ['\\(', '\\)'],
                    ],
                    displayMath: [
                        ['$$', '$$'],
                        ['\\[', '\\]'],
                    ],
                },
                options: {
                    skipHtmlTags: [
                        'script',
                        'noscript',
                        'style',
                        'textarea',
                        'pre',
                    ],
                },
                startup: {
                    ready: () => {
                        window.MathJax.startup.defaultReady();
                        // Ensure that MathJax is ready
                        document.dispatchEvent(new Event('MathJaxLoaded'));
                    },
                },
            };

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            script.async = true;
            document.head.appendChild(script);
        })();
    });

    return (
        <Html lang="zh-cn">
            <Head>
                <PrefixTitle />
                <Meta charset="utf-8" />
                <Meta
                    name="description"
                    lang="en"
                    content="Explore the endless possibilities of ChatGPT conversations and AI drawing. Our platform offers advanced chatbot experiences and innovative AI drawing tools for easy creation and interaction."
                />
                <Meta
                    name="description"
                    lang="zh-cn"
                    content="使用ChatGPT对话和AI绘图探索无尽的可能性。 我们的平台提供高级聊天机器人体验和创新的AI绘图工具，便于创建和交互。"
                />
                <Link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <Link rel="stylesheet" href="/fonts/iconfont.css" />
                <Meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
                />
                <Link
                    rel="apple-touch-icon"
                    href="/apple-touch-icon.png"
                    sizes="192x192"
                />
                {pwaInfo?.webManifest?.href ? (
                    <Link rel="manifest" href={pwaInfo.webManifest.href} />
                ) : (
                    ''
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
    );
}
