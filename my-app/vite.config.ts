import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
//import mkcert from 'vite-plugin-mkcert'
//import fs from 'fs';
//import path from 'path';

export default defineConfig({
  plugins: [
      react(),
      //mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "GIBDD",
        short_name: "GIBDD",
        start_url: "/RIP_frontend/",
        scope: "/RIP_frontend/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4938",
        orientation: "portrait-primary",
        icons: [
          {
            "src": "/RIP_frontend/logo192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "/RIP_frontend/logo512.png",
            "type": "image/png",
            "sizes": "512x512"
          }
        ],
        screenshots: [
          {
            "src": "/RIP_frontend/scr1.png", // <-- Исправленный путь
            "sizes": "1262x768",
            "type": "image/png",
            "form_factor": "wide"
          },
          {
            "src": "/RIP_frontend/scr2.png",
            "sizes": "720x1280",
            "type": "image/png"
          }
        ]
      }
    })
  ],
  base: "/RIP_frontend",

  server: {
    //https: {
      //key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      //cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    //},
    port: 3000,

  },
});
