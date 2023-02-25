<script setup>
import { watch } from 'vue'
import AppToast from './components/AppToast.vue'
import { useRoute, RouterView } from 'vue-router'
import { useToast } from './useToast'
import { emitter } from './useMitt'

// const hashids = inject('hashids')
const route = useRoute()
// const router = useRouter()

const { toasts, removeToast } = useToast()

// const _defaultTitle = document.title
// const _getNameById = (data, id) => data.find(item => item.id === id)?.name ?? ''
const _setTitle = () => {
	// document.title =
	// 	route.params.id && state.recipes.length
	// 		? _getNameById(state.recipes, hashids.decode(route.params.id)[0])
	// 		: _defaultTitle
}
watch(route, _setTitle)
// watch(() => state.recipes, _setTitle)

const onBeforeEnter = () => {
	emitter.emit('TriggerScroll')
}
</script>

<template>
	<main id="content" class="bg-white mx-auto px-3 pt-4 pb-8 lg:px-4 lg:py-8">
		<div>
			<RouterView class="has-transition" v-slot="{ Component }">
				<Transition name="page" mode="out-in" @before-enter="onBeforeEnter">
					<Component :is="Component" />
				</Transition>
			</RouterView>
		</div>
	</main>

	<TransitionGroup name="toasted" tag="div" id="toaster">
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

/*
@keyframes fade-in {
	from { opacity: 0; }
	to { }
}

.page-enter-active {
	animation: fade-in 180ms ease-out forwards;
}

.page-leave-active {
	animation: fade-in 180ms ease-in reverse forwards;
} */
.page-enter-active,
.page-leave-active {
	transition: opacity 180ms ease; /* ease-out */
}

/* .page-leave-active {
	transition-timing-function: ease-in;
} */

.page-enter-from,
.page-leave-to {
	opacity: 0;
}

.has-transition {
	transform: translateZ(0); /* use GPU acceleration */
}

#toaster {
	pointer-events: none;
	position: fixed;
	z-index: 1;
	top: 2rem;
	left: 50%;
	transform: translateX(-50%);
	width: calc(100vw - 30px);
	max-width: 380px;
	display: flex;
	flex-direction: column;
	align-items: center;
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
