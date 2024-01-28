import 'virtual:uno.css'
// https://unocss.dev/guide/style-reset
import '@unocss/reset/tailwind-compat.css'
import './assets/main.css'

import { createApp } from 'vue'
import { PROVIDE_CATEGORIES, PROVIDE_COMPLEXITY, PROVIDE_COOKBOOKS, PROVIDE_SQIDS } from './keys'
import App from './App.vue'
import router from './router'
import Sqids from 'sqids'

const categories = new Map([
	[5, 'Pasta'],
	[10, 'Rind'],
	[20, 'Schwein'],
	[25, 'Lamm'],
	[30, 'Geflügel'],
	[40, 'sonstiges Fleisch'],
	[50, 'Fisch'],
	[60, 'vegetarisch'],
	[70, 'kleine Mahlzeit'],
	[80, 'Suppe'],
	[90, 'Beilage'],
	[92, 'Sauce'],
	[100, 'Salat'],
	[110, 'Dessert'],
	[200, 'Sonstiges'],
])
const complexity = new Map([
	[1, 'leicht'],
	[2, 'mittel'],
	[3, 'komplex'],
])
const cookbooks = new Map([
	[2, 'Cook Clever mit Jamie'],
	[3, 'Essen ist fertig!'],
	[4, 'Genial kochen mit Jamie Oliver'],
	[6, 'Jamie kocht Italien'],
	[1, 'Jamies Kochschule'],
	[5, 'Oma Liselotte'],
	[20, 'Sonstige'],
])

const app = createApp(App)
app.provide(PROVIDE_SQIDS, new Sqids({ minLength: 3, alphabet: 'abcdefghijklmnopqrstuvwxyz' }))
app.provide(PROVIDE_CATEGORIES, categories)
app.provide(PROVIDE_COMPLEXITY, complexity)
app.provide(PROVIDE_COOKBOOKS, cookbooks)
app.use(router)
app.mount('#app')
