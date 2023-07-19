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
	<button v-if="state.hasHistory" type="button" class="back-link" @click="goBack">zurück</button>
	<RouterLink v-else :to="{ name: 'recipes' }" class="back-link">Home</RouterLink>
</template>
