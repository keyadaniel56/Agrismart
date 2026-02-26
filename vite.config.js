import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    https: {
      key: fs.readFileSync('.ssl/key.pem'),
      cert: fs.readFileSync('.ssl/cert.pem'),
    }
  }
})
