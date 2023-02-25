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

const app = createApp(App)
app.provide('hashids', new Hashids('', 3, 'abcdefghijklmnopqrstuvwxyz'))
app.use(router)
app.mount('#app')
