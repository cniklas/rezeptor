<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from './supabase'
import AppToast from './components/AppToast.vue'
import { useStore } from './use/store'
import { useToast } from './use/toast'
import { emitter } from './use/emitter'

const route = useRoute()
const router = useRouter()

const { state, fetchEntries, setAuthState } = useStore()
const { toasts, removeToast } = useToast()

const onBeforeEnter = () => {
	emitter.emit('TriggerScroll')
}

const fetchRecipes = async () => {
	try {
		await router.isReady()
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		// console.error(error)
	}

	const limit = route.name === 'recipes' ? 24 : 0
	fetchEntries(limit)
}
fetchRecipes()

// const logout = async () => {
// 	try {
// 		let { error } = await supabase.auth.signOut()
// 		if (error) throw error
// 	} catch (error) {
// 		console.error(error)
// 	}
// }

supabase.auth.onAuthStateChange((_, session) => {
	setAuthState(session !== null)
})
watch(
	() => state.isAuthenticated,
	async val => {
		await router.isReady()

		if (!val && route.name === 'add-recipe') {
			router.push('/')
			return
		}

		if (val && route.name === 'login') {
			router.replace((route.query.redirectTo as string) ?? '/')
			return
		}
	},
)
</script>

<template>
	<main class="mx-auto max-w-7xl bg-white px-3 pb-8 pt-4 lg:px-4 lg:py-8">
		<div v-if="!state.recipes.length" class="text-center text-base font-light md:text-xl">Rezepte laden …</div>

		<RouterView v-else class="has-transition" v-slot="{ Component }">
			<Transition name="page" mode="out-in" @before-enter="onBeforeEnter">
				<Component :is="Component" />
			</Transition>
		</RouterView>
	</main>

	<TransitionGroup name="toasted" tag="div" class="toaster" aria-live="assertive">
		<!-- /!\ als `:key` keinesfalls den Array-Index verwenden; Indizes werden bei `splice` neu geschrieben -->
		<AppToast
			v-for="toast in toasts"
			:key="toast.id"
			:class="toast.class"
			:timeout="toast.class === 'success'"
			@click="removeToast(toast.id)"
			@remove-toast="removeToast(toast.id)"
		>
			{{ toast.message }}
		</AppToast>
	</TransitionGroup>
</template>

<style>
:is(.page-enter-active, .page-leave-active) {
	transition: opacity 180ms ease;
}

:is(.page-enter-from, .page-leave-to) {
	opacity: 0;
}

.has-transition {
	transform: translateZ(0); /* use GPU acceleration */
}
</style>
