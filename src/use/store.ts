import { ref, reactive, readonly } from 'vue'
import { id as createUuid } from '@instantdb/core'
import { instant } from '@/instant'
import type { Recipe, CreateRecipeData, UpdateRecipeData } from '@/types/Recipe.type'
import { useToast } from './toast'

const { addToast } = useToast()

export const categories = readonly(
	new Map([
		[70, 'kleine Mahlzeit'],
		[100, 'Salat'],
		[80, 'Suppe'],
		[60, 'vegetarisch'],
		[5, 'Pasta'],
		[30, 'Geflügel'],
		[25, 'Lamm'],
		[10, 'Rind'],
		[20, 'Schwein'],
		[40, 'sonstiges Fleisch'],
		[50, 'Fisch'],
		[90, 'Beilage'],
		[92, 'Sauce'],
		[110, 'Dessert'],
		[200, 'Sonstiges'],
	]),
)

export const complexities = readonly(
	new Map([
		[1, 'leicht'],
		[2, 'mittel'],
		[3, 'komplex'],
	]),
)

export const cookbooks = readonly(
	new Map([
		[2, 'Cook Clever mit Jamie'],
		[3, 'Essen ist fertig!'],
		[4, 'Genial kochen mit Jamie Oliver'],
		[6, 'Jamie kocht Italien'],
		[1, 'Jamies Kochschule'],
		[5, 'Oma Liselotte'],
		[20, 'Sonstige'],
	]),
)

const state = reactive<{
	recipes: Recipe[]
	hasLoaded: boolean
	hasHistory: boolean
	isAuthenticated: boolean
}>({
	recipes: [],
	hasLoaded: false,
	hasHistory: false,
	isAuthenticated: false,
})

const search = ref('')
const currentCategory = ref<number | null>(null)
const sorting = reactive<{
	key: 'name' | 'complexity' | 'duration'
	order: { name: number; complexity: number; duration: number }
}>({
	key: 'name',
	order: { name: 1, complexity: 1, duration: 1 },
})

type Query = { recipes: { $: { order: { name: 'asc' | 'desc' }; limit?: number } } }

const CONNECTION_ERROR = 'Verbindung zum Server fehlgeschlagen.' // ¯\\_(ツ)_/¯
const fetchEntries = async (limit = 0) => {
	if (state.hasLoaded) return

	try {
		const query: Query = { recipes: { $: { order: { name: 'asc' } } } }
		if (limit > 0) query.recipes.$.limit = limit

		// fetch data once. `queryOnce` will throw an error if the user is offline
		const { data } = await instant.queryOnce(query)
		if (data === null) throw new Error('Verbindung zur Datenbank fehlgeschlagen.')

		if (!limit) state.hasLoaded = true
		state.recipes = data.recipes
	} catch (error) {
		addToast((error as Error).message ?? CONNECTION_ERROR, false)
	}
}

const _getNextIndex = () => Math.max(...state.recipes.map(recipe => recipe.index)) + 1

const addEntry = async (formData: CreateRecipeData) => {
	if (!state.isAuthenticated) return
	if (!state.hasLoaded) await fetchEntries()

	try {
		const recipe: Recipe = {
			...formData,
			id: createUuid(),
			index: _getNextIndex(),
			duration: +formData.duration,
			serves: +formData.serves,
		}
		await instant.transact(instant.tx.recipes[recipe.id]!.update(recipe))

		state.recipes.push(recipe)
		addToast('Rezept gespeichert')
	} catch (error) {
		addToast((error as Error).message ?? CONNECTION_ERROR, false)
	}
}

const updateEntry = async (formData: UpdateRecipeData) => {
	if (!state.isAuthenticated) return

	const index = state.recipes.findIndex(recipe => recipe.id === formData.id) // im Fehlerfall `-1`

	try {
		const recipe: Recipe = {
			...formData,
			duration: +formData.duration,
			serves: +formData.serves,
		}
		await instant.transact(instant.tx.recipes[recipe.id]!.update(recipe))

		state.recipes[index] = recipe
		addToast('Rezept aktualisiert')
	} catch (error) {
		addToast((error as Error).message ?? CONNECTION_ERROR, false)
	}
}

const setHasHistory = () => {
	state.hasHistory = true
}

const setAuthState = (isAuthenticated = false) => {
	state.isAuthenticated = isAuthenticated
}

// Singleton State Pattern, see https://markus.oberlehner.net/blog/vue-composition-api-composables/#the-singleton-state-pattern
export const useStore = () => ({
	state: readonly(state),
	search, // mutable
	currentCategory, // mutable
	sorting, // mutable
	fetchEntries,
	addEntry,
	updateEntry,
	setHasHistory,
	setAuthState,
})
