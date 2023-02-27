import { ref, reactive, readonly } from 'vue'
// import { auth } from '@/firebase'
// import { useToast } from './toast'

// const { addToast } = useToast()
// let firebaseKeys = []

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

const setAuthState = (hasAuthenticated = false) => {
	state.hasAuthenticated = hasAuthenticated
}

// Singleton State Pattern, see https://markus.oberlehner.net/blog/vue-composition-api-composables/#the-singleton-state-pattern
export const useStore = () => ({
	state: readonly(state),
	search, // mutable
	sorting, // mutable
	setAuthState,
})
