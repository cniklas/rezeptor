<script setup lang="ts">
import { reactive } from 'vue'
import type { RecipeFormData } from '@/types/Recipe.type'
import { categories, complexities, cookbooks } from '@/use/store'

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
			<div class="mb-4">
				<label for="name" class="text-label">Name <span aria-hidden="true">*</span></label>
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
				<input v-model="form.leftovers" type="checkbox" class="shrink-0" id="leftovers" />
				<label for="leftovers" class="inline-block">Fleischreste-Verwertung</label>
			</div>

			<div class="-mt-1.5 mb-3 flex gap-x-2">
				<input v-model="form.recommended" type="checkbox" class="shrink-0" id="recommended" />
				<label for="recommended" class="inline-block">Empfehlung</label>
			</div>

			<div class="grid gap-x-4 md:grid-cols-2">
				<div class="mb-4">
					<label for="categoryId" class="text-label">Kategorie</label>
					<select v-model.number="form.category_id" class="form-control" id="categoryId">
						<option value="0"></option>
						<option v-for="[key, category] of categories" :key="`category-${key}`" :value="key">{{ category }}</option>
					</select>
				</div>

				<div class="mb-4">
					<label for="cookBookId" class="text-label">Kochbuch</label>
					<select v-model.number="form.cook_book_id" class="form-control" id="cookBookId">
						<option v-for="[key, book] of cookbooks" :key="`book-${key}`" :value="key">{{ book }}</option>
					</select>
				</div>
			</div>

			<div class="mb-3">
				<div class="mb-0.5 font-medium">Schwierigkeit</div>
				<div class="flex">
					<template v-for="[key, complexity] of complexities" :key="`complexity-${key}`">
						<input
							v-model.number="form.complexity"
							type="radio"
							class="mr-1.5 align-top"
							:id="`complexity${key}`"
							name="complexity"
							:value="key"
						/><label :for="`complexity${key}`" class="mr-4 inline-block last:mr-0">{{ complexity }}</label>
					</template>
				</div>
			</div>

			<div class="mb-4">
				<label for="notes" class="text-label">Tipps</label>
				<textarea v-model.trim="form.notes" class="form-control" id="notes" cols="30" rows="6"></textarea>
			</div>
		</div>

		<div>
			<div class="grid grid-cols-2 gap-x-4">
				<div class="mb-4">
					<label for="duration" class="text-label">Zubereitungszeit</label>
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
					<label for="serves" class="text-label">Anzahl Portionen</label>
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
				<label for="remarkableIngredients" class="text-label">besondere Zutaten</label>
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
