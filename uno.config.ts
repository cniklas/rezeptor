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
		[
			'sr-only',
			{
				position: 'absolute',
				width: '1px',
				height: '1px',
				padding: '0',
				margin: '-1px',
				overflow: 'hidden',
				clip: 'rect(0, 0, 0, 0)',
				'white-space': 'nowrap',
				'border-width': '0',
			},
		],
	],

	shortcuts: {
		'inline-list-dt': 'md:overflow-clip md:text-ellipsis md:whitespace-nowrap md:text-right',
	},

	// https://unocss.dev/presets/mini
	presets: [presetMini()],
	// https://unocss.dev/transformers/directives
	transformers: [transformerDirectives()],
})
