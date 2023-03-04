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
		class="back-link mb-2.5 inline-block max-w-full hover:underline focus:underline"
		role="button"
		@click="goBack"
		>zurück</a
	>
	<RouterLink
		v-else
		:to="{ name: 'recipes' }"
		class="back-link mb-2.5 inline-block max-w-full hover:underline focus:underline"
		>Home</RouterLink
	>
</template>
