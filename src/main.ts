import 'virtual:uno.css'
// https://unocss.dev/guide/style-reset
import '@unocss/reset/tailwind-compat.css'
import './assets/main.css'

import { createApp } from 'vue'
import { PROVIDE_SQIDS } from './keys'
import App from './App.vue'
import router from './router'
import Sqids from 'sqids'

const app = createApp(App)
app.provide(PROVIDE_SQIDS, new Sqids({ minLength: 3, alphabet: 'abcdefghijklmnopqrstuvwxyz' }))
app.use(router)
app.mount('#app')
