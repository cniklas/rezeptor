<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { useStore } from '../use/store'

const { state } = useStore()

const router = useRouter()
const goBack = () => {
	router.back()
}
</script>

<template>
	<a
		v-if="state.hasHistory"
		class="back-link inline-block max-w-full mb-2.5 hover:underline focus:underline"
		role="button"
		@click="goBack"
		>zurück</a
	>
	<RouterLink
		v-else
		:to="{ name: 'recipes' }"
		class="back-link inline-block max-w-full mb-2.5 hover:underline focus:underline"
		>Home</RouterLink
	>
</template>
