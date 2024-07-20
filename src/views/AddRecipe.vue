<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import BackLink from '@/components/BackLink.vue'
import RecipeForm from '@/components/RecipeForm.vue'
import type { RecipeFormData } from '@/types/Recipe.type'
import { useStore } from '@/use/store'

const router = useRouter()

const { addEntry } = useStore()

const form = reactive<RecipeFormData>({
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

		<h1 id="aria-heading-add-recipe" class="headline mb-5 mt-2.5">Rezept hinzufügen</h1>

		<form aria-labelledby="aria-heading-add-recipe" @submit.prevent="submitForm">
			<RecipeForm class="mb-4" :form-data="form" />

			<div class="submit">
				<button type="submit" class="primary-button" :disabled="isLocked">Speichern</button>
				<RouterLink :to="{ name: 'recipes' }" class="secondary-button ml-2">Abbrechen</RouterLink>
			</div>
		</form>
	</div>
</template>
