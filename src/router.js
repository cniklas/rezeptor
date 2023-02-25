import { createRouter, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import ListRecipes from './views/ListRecipes.vue'
import { emitter } from './useMitt'
import { auth } from './firebase'

let scrollPosition = null
emitter.on('TriggerScroll', async () => {
	await nextTick()
	window.scrollTo(scrollPosition || { top: 0 })
})

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'recipes',
			component: ListRecipes,
		},
		{
			path: '/add',
			name: 'add-recipe',
			component: () => import('./views/AddRecipe.vue'),
			beforeEnter: to => {
				if (!auth.currentUser)
					return {
						name: 'login',
						query: {
							redirectTo: to.fullPath,
						},
					}
			},
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('./views/LoginView.vue'),
		},
		{
			path: '/:id',
			name: 'view-recipe',
			component: () => import('./views/RecipeView.vue'),
		},
	],

	// `savedPosition` is only available if this is a popstate navigation (triggered by the browser’s back/forward buttons)
	scrollBehavior(to, from, savedPosition) {
		scrollPosition = savedPosition
	},
})

export default router
