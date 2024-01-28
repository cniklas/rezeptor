<script setup lang="ts">
import { reactive } from 'vue'
import type { RecipeFormData } from '@/types/Recipe.type'
import { PROVIDE_CATEGORIES, PROVIDE_COMPLEXITY, PROVIDE_COOKBOOKS } from '@/keys'
import { injectStrict } from '@/use/helper'

const categories = injectStrict(PROVIDE_CATEGORIES)
const complexities = injectStrict(PROVIDE_COMPLEXITY)
const cookbooks = injectStrict(PROVIDE_COOKBOOKS)

const props = defineProps<{
	// /!\ Objects and arrays in JavaScript are passed by reference, so if the prop is an array or object, mutating the object or array itself inside the child component will affect parent state.
	formData: RecipeFormData
}>()
// 'Fix' für ESLint Error 'vue/no-mutating-props'
const form = reactive(props.formData)
</script>

<template>
	<div class="grid gap-x-8 md:grid-cols-2">
		<div>
			<div class="is-required mb-4">
				<label for="name" class="mb-1.5 inline-block font-medium">Name</label>
				<input
					v-model.trim="form.name"
					type="text"
					class="form-control"
					id="name"
					required
					autocomplete="off"
					autocorrect="off"
				/>
			</div>

			<div class="mb-3 flex gap-x-2">
				<input v-model="form.leftovers" type="checkbox" class="mt-1 flex-shrink-0" id="leftovers" />
				<label for="leftovers" class="inline-block cursor-pointer">Fleischreste-Verwertung</label>
			</div>

			<div class="-mt-1.5 mb-3 flex gap-x-2">
				<input v-model="form.recommended" type="checkbox" class="mt-1 flex-shrink-0" id="recommended" />
				<label for="recommended" class="inline-block cursor-pointer">Empfehlung</label>
			</div>

			<div class="grid gap-x-4 md:grid-cols-2">
				<div class="mb-4">
					<label for="categoryId" class="mb-1.5 inline-block font-medium">Kategorie</label>
					<select v-model.number="form.category_id" class="form-control" id="categoryId">
						<option value="0"></option>
						<option v-for="[key, category] of categories" :key="`category-${key}`" :value="key">{{ category }}</option>
					</select>
				</div>

				<div class="mb-4">
					<label for="cookBookId" class="mb-1.5 inline-block font-medium">Kochbuch</label>
					<select v-model.number="form.cook_book_id" class="form-control" id="cookBookId">
						<option v-for="[key, book] of cookbooks" :key="`book-${key}`" :value="key">{{ book }}</option>
					</select>
				</div>
			</div>

			<div class="mb-3">
				<div class="mb-0.5 font-medium">Schwierigkeit</div>
				<template v-for="[key, complexity] of complexities" :key="`complexity-${key}`">
					<input
						v-model.number="form.complexity"
						type="radio"
						class="mr-1.5 mt-1 align-top"
						:id="`complexity${key}`"
						name="complexity"
						:value="key"
					/><label :for="`complexity${key}`" class="mr-4 inline-block cursor-pointer last:mr-0">{{ complexity }}</label>
				</template>
			</div>

			<div class="mb-4">
				<label for="notes" class="mb-1.5 inline-block font-medium">Tipps</label>
				<textarea v-model.trim="form.notes" class="form-control" id="notes" cols="30" rows="6"></textarea>
			</div>
		</div>

		<div>
			<div class="grid grid-cols-2 gap-x-4">
				<div class="mb-4">
					<label for="duration" class="mb-1.5 inline-block font-medium">Zubereitungszeit</label>
					<input
						v-model.number="form.duration"
						type="number"
						inputmode="numeric"
						class="form-control"
						id="duration"
						min="0"
						max="360"
						step="5"
						placeholder="Minuten"
					/>
				</div>

				<div class="mb-4">
					<label for="serves" class="mb-1.5 inline-block font-medium">Anzahl Portionen</label>
					<input
						v-model.number="form.serves"
						type="number"
						inputmode="numeric"
						class="form-control"
						id="serves"
						min="0"
						max="12"
					/>
				</div>
			</div>

			<div class="mb-4">
				<label for="ingredients" class="mb-1.5 inline-block font-medium">Zutaten</label>
				<textarea v-model.trim="form.ingredients" class="form-control" id="ingredients" cols="30" rows="10"></textarea>
			</div>

			<div class="mb-4">
				<label for="remarkableIngredients" class="mb-1.5 inline-block font-medium">besondere Zutaten</label>
				<input
					v-model.trim="form.remarkable_ingredients"
					type="text"
					class="form-control"
					id="remarkableIngredients"
					autocomplete="off"
				/>
			</div>
		</div>
	</div>
</template>
