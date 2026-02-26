import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const hasCert = fs.existsSync('.ssl/key.pem') && fs.existsSync('.ssl/cert.pem')

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    https: hasCert ? {
      key: fs.readFileSync('.ssl/key.pem'),
      cert: fs.readFileSync('.ssl/cert.pem'),
    } : false
  }
})
