import { defineConfig, presetWind } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
	// theme: {
	// },

	// custom CSS
	// rules: [['class-name', { 'rule-name': 'rule-value' }]],

	shortcuts: {
		'inline-list-dt': 'md:overflow-clip md:text-ellipsis md:whitespace-nowrap md:text-right',
	},

	// https://unocss.dev/presets/wind
	presets: [presetWind()],
	// https://unocss.dev/transformers/directives
	transformers: [transformerDirectives()],
})
