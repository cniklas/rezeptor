import { defineConfig, presetMini, transformerDirectives } from 'unocss'

export default defineConfig({
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
				'clip-path': 'inset(50%)',
				'white-space': 'nowrap',
				'border-width': 0,
			},
		],
	],

	shortcuts: {
		'inline-list-dt': 'text-right after:content-[":"]',
	},

	// https://unocss.dev/presets/mini
	presets: [presetMini()],
	// https://unocss.dev/transformers/directives
	transformers: [transformerDirectives()],
})
