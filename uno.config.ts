import { defineConfig, presetMini } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
	// theme: {
	// },

	// custom CSS
	// missing in presetMini
	rules: [['list-disc', { 'list-style-type': 'disc' }]],

	shortcuts: {
		'inline-list-dt': 'text-right after:content-[":"]', // overflow-clip text-ellipsis whitespace-nowrap
	},

	// https://unocss.dev/presets/mini
	presets: [presetMini()],
	// https://unocss.dev/transformers/directives
	transformers: [transformerDirectives()],
})
