import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

initializeApp({
	apiKey: import.meta.env.VITE_API_KEY,
	authDomain: import.meta.env.VITE_AUTH_DOMAIN,
	databaseURL: import.meta.env.VITE_DATABASE_URL,
	projectId: import.meta.env.VITE_PROJECT_ID,
	appId: import.meta.env.VITE_APP_ID,
})
const database = getFirestore()
// database.enablePersistence()

export const db = database
