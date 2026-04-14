import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // uview-pro still uses @import; Vite may use Sass legacy API — silence until toolchain upgrades
        silenceDeprecations: ['import', 'legacy-js-api'],
      },
    },
  },
})
