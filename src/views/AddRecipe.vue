<script setup>
import BackLink from '@/components/BackLink.vue'
import RecipeForm from '@/components/RecipeForm.vue'
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useStore } from '../use/store'

const router = useRouter()

const { addEntry } = useStore()

const form = reactive({
	name: '',
	cook_book_id: 1,
	category_id: 0,
	complexity: 2,
	duration: '',
	leftovers: false,
	recommended: false,
	notes: '',
	ingredients: '',
	remarkable_ingredients: '',
	serves: '',
})
const isLocked = ref(false)
const submitForm = async () => {
	isLocked.value = true

	const formData = {
		...form,
		duration: form.duration || 0,
		serves: form.serves || 0,
	}
	await addEntry(formData)

	router.push({ name: 'recipes' })
}
</script>

<template>
	<div>
		<BackLink class="mb-2.5 inline-block" />

		<h2 class="headline mb-5 mt-2.5">Rezept hinzufügen</h2>

		<form @submit.prevent="submitForm">
			<RecipeForm :form-data="form" />

			<div class="submit">
				<button type="submit" class="btn btn-primary" :disabled="isLocked">Speichern</button>
				<RouterLink :to="{ name: 'recipes' }" class="btn btn-default ml-2">Abbrechen</RouterLink>
			</div>
		</form>
	</div>
</template>
