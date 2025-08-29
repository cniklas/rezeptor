<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackLink from '@/components/BackLink.vue'
import RecipeForm from '@/components/RecipeForm.vue'
import type { CreateRecipeData } from '@/types/Recipe.type'
import { useStore } from '@/use/store'

const router = useRouter()

const { addEntry } = useStore()

const formData = ref<CreateRecipeData>({
	category_id: 0,
	cook_book_id: 1,
	complexity: 2,
	duration: '',
	ingredients: '',
	leftovers: false,
	name: '',
	notes: '',
	recommended: false,
	remarkable_ingredients: '',
	serves: '',
})
const isSubmitLocked = ref(false)
const submitForm = async () => {
	if (isSubmitLocked.value) return
	isSubmitLocked.value = true

	await addEntry(formData.value)
	router.push({ name: 'recipes' })
}
</script>

<template>
	<div>
		<BackLink class="mb-2.5 inline-block" />

		<h1 id="aria-heading-add-recipe" class="headline mb-5 mt-2.5">Rezept hinzufügen</h1>

		<form aria-labelledby="aria-heading-add-recipe" @submit.prevent="submitForm">
			<RecipeForm v-model="formData" class="mb-4" />

			<div class="flex gap-x-4">
				<button type="submit" class="primary-button" :aria-disabled="isSubmitLocked">Speichern</button>
				<RouterLink :to="{ name: 'recipes' }" class="secondary-button">Abbrechen</RouterLink>
			</div>
		</form>
	</div>
</template>
