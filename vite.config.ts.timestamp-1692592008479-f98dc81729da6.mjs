// vite.config.ts
import solid from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/solid-start@0.2.26_k7cq3lnzhrtazj2aycgxghc35u/node_modules/solid-start/vite/plugin.js";
import netlify from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/solid-start-netlify@0.2.26_solid-start@0.2.26/node_modules/solid-start-netlify/index.js";
import node from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/solid-start-node@0.2.26_j7nikcp2fpat5dsz7kzozatuja/node_modules/solid-start-node/index.js";
import vercel from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/solid-start-vercel@0.2.26_sqz3tnbgiqyjstyl465zp6m6oq/node_modules/solid-start-vercel/index.js";
import cloudflare from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/solid-start-cloudflare-workers@0.2.26_sqz3tnbgiqyjstyl465zp6m6oq/node_modules/solid-start-cloudflare-workers/index.js";
import { defineConfig } from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/vite@4.3.3_@types+node@18.16.2/node_modules/vite/dist/node/index.js";
import unocss from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/unocss@0.51.8_wdcre2zacvaevqmily4uyc37y4/node_modules/unocss/dist/vite.mjs";
import {
  presetUno,
  presetIcons,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup
} from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/unocss@0.51.8_wdcre2zacvaevqmily4uyc37y4/node_modules/unocss/dist/index.mjs";
import { VitePWA } from "file:///Users/ronaldo/Documents/chatgpt-vercel/node_modules/.pnpm/vite-plugin-pwa@0.14.7_w23kinkln7ysd6v4dhp4ifp3vm/node_modules/vite-plugin-pwa/dist/index.mjs";
var adapter = () => {
  if (process.env.VERCEL) {
    return vercel({ edge: true });
  } else if (process.env.NETLIFY) {
    return netlify({ edge: true });
  } else if (process.env.CF_WORKER) {
    return cloudflare({});
  } else {
    return node();
  }
};
var vite_config_default = defineConfig({
  envPrefix: "CLIENT_",
  plugins: [
    unocss({
      mergeSelectors: false,
      transformers: [transformerDirectives(), transformerVariantGroup()],
      presets: [
        presetUno(),
        presetTypography({
          cssExtend: {
            ":not(pre) > code::before,:not(pre) > code::after": {
              content: ""
            }
          }
        }),
        presetIcons()
      ],
      shortcuts: {
        "input-box": "max-w-150px ml-1em px-1 text-slate-7 dark:text-slate rounded-sm bg-slate bg-op-15 focus:(bg-op-20 ring-0 outline-none)"
      }
    }),
    solid({ ssr: false, adapter: adapter() }),
    VitePWA({
      base: "/",
      scope: "/",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      registerType: "autoUpdate",
      manifest: {
        name: "ChatGPT",
        lang: "zh-cn",
        short_name: "ChatGPT",
        background_color: "#f6f8fa",
        icons: [
          {
            src: "192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "256.png",
            sizes: "256x256",
            type: "image/png"
          },
          {
            src: "512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "apple-touch-icon.png",
            sizes: "192x192",
            type: "image/png"
          }
        ]
      },
      disable: !!process.env.NETLIFY,
      devOptions: {
        enabled: true
      }
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcm9uYWxkby9Eb2N1bWVudHMvY2hhdGdwdC12ZXJjZWxcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9yb25hbGRvL0RvY3VtZW50cy9jaGF0Z3B0LXZlcmNlbC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcm9uYWxkby9Eb2N1bWVudHMvY2hhdGdwdC12ZXJjZWwvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgc29saWQgZnJvbSBcInNvbGlkLXN0YXJ0L3ZpdGVcIlxuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IG5ldGxpZnkgZnJvbSBcInNvbGlkLXN0YXJ0LW5ldGxpZnlcIlxuLy8gQHRzLWlnbm9yZVxuaW1wb3J0IG5vZGUgZnJvbSBcInNvbGlkLXN0YXJ0LW5vZGVcIlxuaW1wb3J0IHZlcmNlbCBmcm9tIFwic29saWQtc3RhcnQtdmVyY2VsXCJcbmltcG9ydCBjbG91ZGZsYXJlIGZyb20gXCJzb2xpZC1zdGFydC1jbG91ZGZsYXJlLXdvcmtlcnNcIlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHVub2NzcyBmcm9tIFwidW5vY3NzL3ZpdGVcIlxuaW1wb3J0IHtcbiAgcHJlc2V0VW5vLFxuICBwcmVzZXRJY29ucyxcbiAgcHJlc2V0VHlwb2dyYXBoeSxcbiAgdHJhbnNmb3JtZXJEaXJlY3RpdmVzLFxuICB0cmFuc2Zvcm1lclZhcmlhbnRHcm91cFxufSBmcm9tIFwidW5vY3NzXCJcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCJcblxuY29uc3QgYWRhcHRlciA9ICgpID0+IHtcbiAgaWYgKHByb2Nlc3MuZW52LlZFUkNFTCkge1xuICAgIHJldHVybiB2ZXJjZWwoeyBlZGdlOiB0cnVlIH0pXG4gIH0gZWxzZSBpZiAocHJvY2Vzcy5lbnYuTkVUTElGWSkge1xuICAgIHJldHVybiBuZXRsaWZ5KHsgZWRnZTogdHJ1ZSB9KVxuICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52LkNGX1dPUktFUikge1xuICAgIHJldHVybiBjbG91ZGZsYXJlKHt9KVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBub2RlKClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBlbnZQcmVmaXg6IFwiQ0xJRU5UX1wiLFxuICBwbHVnaW5zOiBbXG4gICAgdW5vY3NzKHtcbiAgICAgIG1lcmdlU2VsZWN0b3JzOiBmYWxzZSxcbiAgICAgIHRyYW5zZm9ybWVyczogW3RyYW5zZm9ybWVyRGlyZWN0aXZlcygpLCB0cmFuc2Zvcm1lclZhcmlhbnRHcm91cCgpXSxcbiAgICAgIHByZXNldHM6IFtcbiAgICAgICAgcHJlc2V0VW5vKCksXG4gICAgICAgIHByZXNldFR5cG9ncmFwaHkoe1xuICAgICAgICAgIGNzc0V4dGVuZDoge1xuICAgICAgICAgICAgXCI6bm90KHByZSkgPiBjb2RlOjpiZWZvcmUsOm5vdChwcmUpID4gY29kZTo6YWZ0ZXJcIjoge1xuICAgICAgICAgICAgICBjb250ZW50OiBcIlwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KSxcbiAgICAgICAgcHJlc2V0SWNvbnMoKVxuICAgICAgXSxcbiAgICAgIHNob3J0Y3V0czoge1xuICAgICAgICBcImlucHV0LWJveFwiOlxuICAgICAgICAgIFwibWF4LXctMTUwcHggbWwtMWVtIHB4LTEgdGV4dC1zbGF0ZS03IGRhcms6dGV4dC1zbGF0ZSByb3VuZGVkLXNtIGJnLXNsYXRlIGJnLW9wLTE1IGZvY3VzOihiZy1vcC0yMCByaW5nLTAgb3V0bGluZS1ub25lKVwiXG4gICAgICB9XG4gICAgfSksXG4gICAgc29saWQoeyBzc3I6IGZhbHNlLCBhZGFwdGVyOiBhZGFwdGVyKCkgfSksXG4gICAgVml0ZVBXQSh7XG4gICAgICBiYXNlOiBcIi9cIixcbiAgICAgIHNjb3BlOiBcIi9cIixcbiAgICAgIGluY2x1ZGVBc3NldHM6IFtcImZhdmljb24uc3ZnXCIsIFwiYXBwbGUtdG91Y2gtaWNvbi5wbmdcIl0sXG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogXCJDaGF0R1BUXCIsXG4gICAgICAgIGxhbmc6IFwiemgtY25cIixcbiAgICAgICAgc2hvcnRfbmFtZTogXCJDaGF0R1BUXCIsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiI2Y2ZjhmYVwiLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCIxOTIucG5nXCIsXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6IFwiMjU2LnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMjU2eDI1NlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBcIjUxMi5wbmdcIixcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogXCJhcHBsZS10b3VjaC1pY29uLnBuZ1wiLFxuICAgICAgICAgICAgc2l6ZXM6IFwiMTkyeDE5MlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZS9wbmdcIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIGRpc2FibGU6ICEhcHJvY2Vzcy5lbnYuTkVUTElGWSxcbiAgICAgIGRldk9wdGlvbnM6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gIF1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVTLE9BQU8sV0FBVztBQUV6VCxPQUFPLGFBQWE7QUFFcEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFlBQVk7QUFDbkI7QUFBQSxFQUNFO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE9BQ0s7QUFDUCxTQUFTLGVBQWU7QUFFeEIsSUFBTSxVQUFVLE1BQU07QUFDcEIsTUFBSSxRQUFRLElBQUksUUFBUTtBQUN0QixXQUFPLE9BQU8sRUFBRSxNQUFNLEtBQUssQ0FBQztBQUFBLEVBQzlCLFdBQVcsUUFBUSxJQUFJLFNBQVM7QUFDOUIsV0FBTyxRQUFRLEVBQUUsTUFBTSxLQUFLLENBQUM7QUFBQSxFQUMvQixXQUFXLFFBQVEsSUFBSSxXQUFXO0FBQ2hDLFdBQU8sV0FBVyxDQUFDLENBQUM7QUFBQSxFQUN0QixPQUFPO0FBQ0wsV0FBTyxLQUFLO0FBQUEsRUFDZDtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsV0FBVztBQUFBLEVBQ1gsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsZ0JBQWdCO0FBQUEsTUFDaEIsY0FBYyxDQUFDLHNCQUFzQixHQUFHLHdCQUF3QixDQUFDO0FBQUEsTUFDakUsU0FBUztBQUFBLFFBQ1AsVUFBVTtBQUFBLFFBQ1YsaUJBQWlCO0FBQUEsVUFDZixXQUFXO0FBQUEsWUFDVCxvREFBb0Q7QUFBQSxjQUNsRCxTQUFTO0FBQUEsWUFDWDtBQUFBLFVBQ0Y7QUFBQSxRQUNGLENBQUM7QUFBQSxRQUNELFlBQVk7QUFBQSxNQUNkO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxhQUNFO0FBQUEsTUFDSjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsTUFBTSxFQUFFLEtBQUssT0FBTyxTQUFTLFFBQVEsRUFBRSxDQUFDO0FBQUEsSUFDeEMsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsZUFBZSxDQUFDLGVBQWUsc0JBQXNCO0FBQUEsTUFDckQsY0FBYztBQUFBLE1BQ2QsVUFBVTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osa0JBQWtCO0FBQUEsUUFDbEIsT0FBTztBQUFBLFVBQ0w7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsVUFDQTtBQUFBLFlBQ0UsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsTUFBTTtBQUFBLFVBQ1I7QUFBQSxVQUNBO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVMsQ0FBQyxDQUFDLFFBQVEsSUFBSTtBQUFBLE1BQ3ZCLFlBQVk7QUFBQSxRQUNWLFNBQVM7QUFBQSxNQUNYO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
