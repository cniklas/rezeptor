import { defineConfig } from 'windicss/helpers'

export default defineConfig({
	prefixer: false,
	theme: {
		extend: {
			screens: {
				print: { raw: 'print' },
			},
		},
	},
})
