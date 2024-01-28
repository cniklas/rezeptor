import { ref, reactive, readonly } from 'vue'
import { supabase } from '@/supabase'
import type { Recipe, RecipeFormData } from '@/types/Recipe.type'
import { useToast } from './toast'

const { addToast } = useToast()

const state = reactive<{
	recipes: Recipe[]
	hasLoaded: boolean
	hasHistory: boolean
	hasAuthenticated: boolean
}>({
	recipes: [],
	hasLoaded: false,
	hasHistory: false,
	hasAuthenticated: false,
})

const search = ref('')
const sorting = reactive<{
	key: 'name' | 'category_id' | 'complexity' | 'duration'
	order: { name: number; category_id: number; complexity: number; duration: number }
}>({
	key: 'name',
	order: { name: 1, category_id: 1, complexity: 1, duration: 1 },
})

const fetchEntries = async (limited = false) => {
	if (state.hasLoaded) return

	try {
		const { data, error, status } = limited
			? await supabase.from('recipes').select().range(0, 24).order('name', { ascending: true })
			: await supabase.from('recipes').select()
		if (error) throw error
		if (data === null) throw new Error('Verbindung zur Datenbank fehlgeschlagen.')

		if (!limited) state.hasLoaded = true
		state.recipes = data
	} catch (error: any) {
		const message = error.message ?? 'Verbindung zum Server fehlgeschlagen.'
		addToast(message) // ¯\\_(ツ)_/¯
	}
}

const _getNextId = () => Math.max(...state.recipes.map(recipe => recipe.id)) + 1

const addEntry = async (formData: RecipeFormData) => {
	if (!state.hasAuthenticated) return
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
	if (!state.hasAuthenticated) return

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

const setAuthState = (hasAuthenticated = false) => {
	state.hasAuthenticated = hasAuthenticated
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
