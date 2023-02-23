import { createRouter, createWebHistory } from 'vue-router'
import ListRecipes from './views/ListRecipes.vue'

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
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('./views/AddRecipe.vue'),
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
})

export default router
