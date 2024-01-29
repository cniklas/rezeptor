<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { supabase } from './supabase'
import AppToast from './components/AppToast.vue'
import type { Recipe } from './types/Recipe.type'
import { PROVIDE_SQIDS } from './keys'
import { useStore } from './use/store'
import { useToast } from './use/toast'
import { emitter } from './use/emitter'
import { injectStrict } from './use/helper'

const sqids = injectStrict(PROVIDE_SQIDS)
const route = useRoute()
const router = useRouter()

const { state, fetchEntries, setAuthState } = useStore()
const { toasts, removeToast } = useToast()

const _getNameById = (data: Readonly<Recipe[]>, id: number) => data.find(item => item.id === id)?.name ?? ''
const _defaultTitle = document.title
const _setTitle = () => {
	document.title =
		route.params.id && state.recipes.length
			? _getNameById(state.recipes, sqids.decode(route.params.id as string).at(0) as number)
			: _defaultTitle
}
watch(route, _setTitle)
watch(() => state.recipes, _setTitle)

const onBeforeEnter = () => {
	emitter.emit('TriggerScroll')
}

const fetchRecipes = async () => {
	try {
		await router.isReady()
	} catch (error) {
		// console.error(error)
	}

	const limited = route.name === 'recipes'
	fetchEntries(limited)
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
	() => state.hasAuthenticated,
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
		<div v-show="!state.recipes.length" class="text-center text-base font-light md:text-xl">Rezepte laden …</div>

		<RouterView v-show="state.recipes.length" class="has-transition" v-slot="{ Component }">
			<Transition name="page" mode="out-in" @before-enter="onBeforeEnter">
				<Component :is="Component" />
			</Transition>
		</RouterView>
	</main>

	<TransitionGroup
		name="toasted"
		tag="div"
		class="pointer-events-none fixed left-1/2 top-8 z-[1] flex w-[calc(100vw-30px)] max-w-[380px] -translate-x-1/2 transform flex-col items-center"
	>
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

@keyframes slide-fade-in {
	from {
		opacity: 0;
		transform: translateY(1.25rem);
	}
	to {
		transform: translateY(0);
	}
}

@keyframes fade-out {
	to {
		opacity: 0;
	}
}

.toasted-enter-active {
	animation: slide-fade-in 360ms ease-out forwards;
}

.toasted-leave-active {
	animation: fade-out 360ms ease-out forwards;
}
</style>
