import { defineConfig, presetWind } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
	// theme: {
	// },

	// custom CSS
	// rules: [['class-name', { 'rule-name': 'rule-value' }]],

	// shortcuts: {
	// 	'headline': 'border-b border-b-[#334155]',
	// },

	// https://unocss.dev/presets/wind
	presets: [presetWind()],
	// https://unocss.dev/transformers/directives
	transformers: [transformerDirectives()],
})
