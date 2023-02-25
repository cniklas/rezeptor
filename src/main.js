import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Hashids from 'hashids'

// // dev test
// import { db } from './firebase'
// import { collection, getDocs } from 'firebase/firestore'
// const querySnapshot = await getDocs(collection(db, 'recipes'))
// querySnapshot.forEach(doc => {
// 	console.log(doc.data().name)
// })
// // END dev test

const complexity = new Map([
	[1, 'leicht'],
	[2, 'mittel'],
	[3, 'komplex'],
])
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
app.provide('hashids', new Hashids('', 3, 'abcdefghijklmnopqrstuvwxyz'))
app.provide('complexity', complexity)
app.provide('categories', categories)
app.provide('cookbooks', cookbooks)
app.use(router)
app.mount('#app')
