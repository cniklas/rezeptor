<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter, type LocationQueryValue } from 'vue-router'
import { instant } from '@/instant'
import AppToast from './components/AppToast.vue'
import { useStore } from './use/store'
import { useToast } from './use/toast'
import { emitter } from './use/emitter'

const route = useRoute()
const router = useRouter()

const { state, fetchEntries, setAuthState } = useStore()
const { toasts, addToast, removeToast } = useToast()

const onBeforeEnter = () => {
	emitter.emit('TriggerScroll')
}

const fetchRecipes = async () => {
	try {
		await router.isReady()
	} catch {
		// console.error(error)
	}

	const limit = route.name === 'recipes' ? 24 : 0
	fetchEntries(limit)
}
fetchRecipes()

// const logout = async () => {
// 	try {
// 		await instant.auth.signOut()
// 	} catch (error) {
// 		console.error(error)
// 	}
// }

instant.subscribeAuth(auth => {
	if (auth.error) addToast(auth.error.message, false)
	setAuthState(!!auth.user)
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
			router.replace((route.query.redirectTo as LocationQueryValue) ?? '/')
			return
		}
	},
)
</script>

<template>
	<main
		class="mx-auto max-w-7xl bg-white px-3 pb-8 pt-4 lg:px-4 lg:py-8"
		:class="{ '<lg:min-h-[100dvh] content-center': !state.recipes.length }"
	>
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
