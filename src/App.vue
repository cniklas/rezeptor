<script setup>
import { watch, inject } from 'vue'
import AppToast from './components/AppToast.vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
import { auth } from './firebase'
import { onAuthStateChanged /* signOut */ } from 'firebase/auth'
import { useStore } from './use/store'
import { useToast } from './use/toast'
import { emitter } from './use/emitter'

const hashids = inject('hashids')
const route = useRoute()
const router = useRouter()

const { state, fetchEntries, setAuthState } = useStore()
const { toasts, removeToast } = useToast()

const _getNameById = (data, id) => data.find(item => item.id === id)?.name ?? ''
const _defaultTitle = document.title
const _setTitle = () => {
	document.title =
		route.params.id && state.recipes.length
			? _getNameById(state.recipes, hashids.decode(route.params.id)[0])
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

// const logout = () => {
// 	try {
// 		signOut(auth)
// 	} catch (error) {
// 		console.log(error)
// 	}
// }

onAuthStateChanged(auth, user => {
	setAuthState(user !== null)
})
watch(
	() => state.hasAuthenticated,
	val => {
		if (!val && route.name === 'add-recipe') {
			router.push('/')
			return
		}

		if (val && route.name === 'login') {
			router.replace(route.query.redirectTo ?? '/')
			return
		}
	}
)
</script>

<template>
	<main id="content" class="mx-auto bg-white px-3 pt-4 pb-8 lg:px-4 lg:py-8">
		<div v-show="!state.recipes.length" class="text-center text-base font-light md:text-xl">Rezepte laden …</div>

		<div v-show="state.recipes.length">
			<RouterView class="has-transition" v-slot="{ Component }">
				<Transition name="page" mode="out-in" @before-enter="onBeforeEnter">
					<Component :is="Component" />
				</Transition>
			</RouterView>
		</div>
	</main>

	<TransitionGroup
		name="toasted"
		tag="div"
		class="pointer-events-none fixed top-8 left-1/2 z-[1] flex w-[calc(100vw-30px)] max-w-[380px] -translate-x-1/2 transform flex-col items-center"
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

<style lang="postcss">
#content {
	@media screen and (min-width: 768px) {
		width: 750px;
	}

	@media screen and (min-width: 992px) {
		width: 970px;
	}

	@media screen and (min-width: 1200px) {
		width: 1170px;
	}
}

.page-enter-active,
.page-leave-active {
	transition: opacity 180ms ease;
}

.page-enter-from,
.page-leave-to {
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
