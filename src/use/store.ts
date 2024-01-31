import { ref, reactive, readonly } from 'vue'
import { supabase } from '@/supabase'
import type { Recipe, RecipeFormData } from '@/types/Recipe.type'
import { useToast } from './toast'

const { addToast } = useToast()

export const categories = readonly(
	new Map([
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
const sorting = reactive<{
	key: 'name' | 'category_id' | 'complexity' | 'duration'
	order: { name: number; category_id: number; complexity: number; duration: number }
}>({
	key: 'name',
	order: { name: 1, category_id: 1, complexity: 1, duration: 1 },
})

const fetchEntries = async (limit = 0) => {
	if (state.hasLoaded) return

	try {
		const { data, error, status } =
			limit > 0
				? await supabase
						.from('recipes')
						.select()
						.range(0, limit - 1)
						.order('name', { ascending: true })
				: await supabase.from('recipes').select()
		if (error) throw error
		if (data === null) throw new Error('Verbindung zur Datenbank fehlgeschlagen.')

		if (!limit) state.hasLoaded = true
		state.recipes = data
	} catch (error: any) {
		const message = error.message ?? 'Verbindung zum Server fehlgeschlagen.'
		addToast(message) // ¯\\_(ツ)_/¯
	}
}

const _getNextId = () => Math.max(...state.recipes.map(recipe => recipe.id)) + 1

const addEntry = async (formData: RecipeFormData) => {
	if (!state.isAuthenticated) return
	if (!state.hasLoaded) await fetchEntries()

	try {
		formData.id = _getNextId()
		const { error, status } = await supabase.from('recipes').insert(formData) /* .select() */
		if (error) throw error

		state.recipes.push(formData as Recipe)
		addToast('Rezept gespeichert', true)
	} catch (error: any) {
		const message = error.message ?? 'Verbindung zum Server fehlgeschlagen.'
		addToast(message)
	}
}

const updateEntry = async (formData: RecipeFormData) => {
	if (!state.isAuthenticated) return

	const index = state.recipes.findIndex(recipe => recipe.id === formData.id) // im Fehlerfall `-1`

	try {
		const { error, status } = await supabase.from('recipes').update(formData).eq('id', formData.id) /* .select() */
		if (error) throw error
		state.recipes[index] = formData as Recipe

		addToast('Rezept aktualisiert', true)
	} catch (error: any) {
		const message = error.message ?? 'Verbindung zum Server fehlgeschlagen.'
		addToast(message)
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
	sorting, // mutable
	fetchEntries,
	addEntry,
	updateEntry,
	setHasHistory,
	setAuthState,
})
