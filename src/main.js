import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Hashids from 'hashids'

const app = createApp(App)
app.provide('hashids', new Hashids('', 3, 'abcdefghijklmnopqrstuvwxyz'))
app.use(router)
app.mount('#app')
