import { defineConfig, presetMini } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
	// theme: {
	// },

	// custom CSS
	// missing in presetMini
	rules: [
		['list-disc', { 'list-style-type': 'disc' }],
		['touch-manipulation', { 'touch-action': 'manipulation' }],
	],

	shortcuts: {
		'inline-list-dt': 'overflow-clip text-ellipsis whitespace-nowrap text-right',
	},

	// https://unocss.dev/presets/mini
	presets: [presetMini()],
	// https://unocss.dev/transformers/directives
	transformers: [transformerDirectives()],
})
