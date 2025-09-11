import { defineConfig, presetMini } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
	// theme: {
	// },

	// custom CSS
	// missing in presetMini
	rules: [
		['list-disc', { 'list-style-type': 'disc' }],
		[
			'sr-only',
			{
				position: 'absolute',
				width: '1px',
				height: '1px',
				padding: 0,
				margin: '-1px',
				overflow: 'hidden',
				// clip: 'rect(0, 0, 0, 0)',
				'clip-path': 'inset(50%)',
				'white-space': 'nowrap',
				'border-width': 0,
			},
		],
	],

	shortcuts: {
		'inline-list-dt': 'text-right after:content-[":"]', // overflow-clip text-ellipsis whitespace-nowrap
	},

	// https://unocss.dev/presets/mini
	presets: [presetMini()],
	// https://unocss.dev/transformers/directives
	transformers: [transformerDirectives()],
})
