import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import postcssNesting from 'postcss-nesting'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), UnoCSS()],
	css: {
		postcss: {
			plugins: [postcssNesting],
		},
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
})
