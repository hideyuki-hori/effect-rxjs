import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    setupFiles: [path.join(__dirname, 'setup-tests.ts')],
    include: ['./src/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@template/basic/test': path.join(__dirname, 'test'),
      '@template/basic': path.join(__dirname, 'src'),
    },
  },
})
