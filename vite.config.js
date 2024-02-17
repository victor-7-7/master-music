import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
// import visualizer from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  // see vitest.config.js
  /*test: {
    globals: true,
  },*/

  plugins: [
    vue(),
    // Плагин сгенерит json-манифест, в котором ключи будут в виде строк,
    // а здесь мы пишем свойства объектов
    VitePWA({
      // Для возможности частичного offline функционала надо, чтобы
      // браузер кэшировал данные этого приложения, а при подключении
      // к сети обновлял кэш
      registerType: 'autoUpdate',
      devOptions: {
        // Нам не надо генерить манифест при develop-запусках, только в проде
        enabled: true,
      },
      manifest: {
        name: "Music App",
        theme_color: "#ff5e3e",
        // В манифесте свойство "display": "standalone" означает, что при открытии
        // приложения на мобиле (когда оно установлено) оно открывается в "невидимом"
        // браузере - спрятана адресная строка и панель инструментов.
        display: "standalone",
        icons: [
          {
            // master-music/public/assets/...
            src: "assets/img/pwa-192x192.png",
            sizes: "192x192",
            type: "img/png",
          }
        ],
        // https://web.dev/patterns/web-apps/richer-install-ui
        screenshots: [
          // Only JPEG and PNG image formats are supported. А также
          // гифки, собранные из этих форматов.
          // Картинка для десктопа
          {
            // master-music/public/assets/...
            src: "assets/img/picmix.com_11163927.gif",
            // Width and height must be at least 320px and at most 3,840px
            sizes: "500x500",
            type: "img/gif",
            form_factor: "wide",
            label: "Wonder Musics"
          },
          // Картинка для мобилы
          {
            src: "assets/img/picmix.com_11163927.gif",
            // Width and height must be at least 320px and at most 3,840px
            sizes: "500x500",
            type: "img/gif",
            label: "Wonder Musics"
          },
        ],
        // The description member describes the application in the installation
        // prompt, to invite the user to keep the app.
        description: "Install for listen to Great Music!",
      },
      // https://vite-pwa-org.netlify.app/guide/service-worker-precache.html
      // https://developer.chrome.com/docs/workbox/caching-strategies-overview/#caching-strategies
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,gif}"],
        // Если не выбросить из кэша ревизии, то воркер не будет работать
        // с ошибкой Uncaught (in promise) add-to-cache-list-conflicting-entries: add-to-cache-list-conflicting-entries :: [{"firstEntry":"http://localhost:4173/assets/img/pwa-192x192.png","secondEntry":"http://localhost:4173/assets/img/pwa-192x192.png?__WB_REVISION__=25b38533f534eb0f7ea0771021d541a8"}]
        // https://changecast-3.vercel.app/v4.0.0-beta.1
        // Мой костыль не лучшее решение, ибо ревизии нужны...
        dontCacheBustURLsMatching: new RegExp(".*__WB_REVISION__.*"),
      },
    }),
    // Этот плагин позволяет кодеру наблюдать (в виде html-страницы) за bundle size
    // приложения при команде build и оптимизировать его
    // visualizer({ open: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
