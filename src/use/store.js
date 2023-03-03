import { ref, reactive, readonly } from 'vue'
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useToast } from './toast'

const { addToast } = useToast()
let firebaseKeys = []

const state = reactive({
	recipes: [],
	hasLoaded: false,
	hasHistory: false,
	hasAuthenticated: false,
})

const search = ref('')
const sorting = reactive({
	key: 'name',
	order: { name: 1, category_id: 1, complexity: 1, duration: 1 },
})

const fetchEntries = async (limit = false) => {
	if (state.hasLoaded) return

	try {
		// `get` ist statisch; `onSnapshot` wird in real time aktualisiert?
		const keys = []
		const recipes = []
		// 🔺 TODO
		// const snapshot = limit
		// 	? await db.collection('recipes').orderBy('name').limit(24).get()
		// 	: await db.collection('recipes').orderBy('name').get()
		const snapshot = await getDocs(collection(db, 'recipes'))
		snapshot.forEach(doc => {
			keys.push(doc.id)
			// recipes.push({ category_id: doc.data().category_id, … })
			recipes.push(doc.data())
		})

		if (!limit) {
			state.hasLoaded = true
		}
		firebaseKeys = [...keys]
		state.recipes = [...recipes]
	} catch (error) {
		const message = error.message ?? 'Verbindung zum Server fehlgeschlagen.'
		addToast(message) // ¯\\_(ツ)_/¯
	}
}

const updateEntry = async (recipe) => {
	if (!state.hasAuthenticated) return

	const index = state.recipes.findIndex(item => item.id === recipe.id) // im Fehlerfall `-1`
	const key = firebaseKeys[index] // im Fehlerfall `undefined`
	if (key === undefined) return

	try {
		// 🔺 TODO
		// await db.collection('recipes').doc(key).set(recipe)
		state.recipes[index] = recipe

		addToast('Rezept aktualisiert', true)
	} catch (error) {
		const message = error.message ?? 'Verbindung zum Server fehlgeschlagen.'
		addToast(message)
	}
}

const setHasHistory = () => {
	state.hasHistory = true
}

const setAuthState = (hasAuthenticated = false) => {
	state.hasAuthenticated = hasAuthenticated
}

// Singleton State Pattern, see https://markus.oberlehner.net/blog/vue-composition-api-composables/#the-singleton-state-pattern
export const useStore = () => ({
	state: readonly(state),
	search, // mutable
	sorting, // mutable
	fetchEntries,
	updateEntry,
	setHasHistory,
	setAuthState,
})
