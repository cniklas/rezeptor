<script setup>
import { reactive, inject } from 'vue'

const _complexity = inject('complexity')
const _categories = inject('categories')
const _cookbooks = inject('cookbooks')

const props = defineProps({
	// /!\ Objects and arrays in JavaScript are passed by reference, so if the prop is an array or object, mutating the object or array itself inside the child component will affect parent state.
	formData: {
		type: Object,
		default: () => null,
	},
})
// 'Fix' für ESLint Error 'vue/no-mutating-props'
const form = reactive(props.formData)
</script>

<template>
	<div class="grid gap-x-8 md:grid-cols-2">
		<div>
			<div class="mb-4 is-required">
				<label for="name" class="inline-block font-medium mb-1.5">Name</label>
				<input
					v-model.trim="form.name"
					type="text"
					class="form-control"
					id="name"
					required="required"
					autocomplete="off"
					autocorrect="off"
				/>
			</div>

			<div class="checkbox flex gap-x-2 mb-3">
				<input v-model="form.leftovers" type="checkbox" class="mt-1" id="leftovers" />
				<label for="leftovers" class="inline-block cursor-pointer">Fleischreste-Verwertung</label>
			</div>

			<div class="checkbox flex gap-x-2 mb-3 -mt-1.5">
				<input v-model="form.recommended" type="checkbox" class="mt-1" id="recommended" />
				<label for="recommended" class="inline-block cursor-pointer">Empfehlung</label>
			</div>

			<div class="grid gap-x-4 md:grid-cols-2">
				<div class="mb-4">
					<label for="categoryId" class="inline-block font-medium mb-1.5">Kategorie</label>
					<select v-model.number="form.category_id" class="form-control" id="categoryId">
						<option value="0"></option>
						<option v-for="[key, category] of _categories" :key="`category-${key}`" :value="key">{{ category }}</option>
					</select>
				</div>

				<div class="mb-4">
					<label for="cookBookId" class="inline-block font-medium mb-1.5">Kochbuch</label>
					<select v-model.number="form.cook_book_id" class="form-control" id="cookBookId">
						<option v-for="[key, book] of _cookbooks" :key="`book-${key}`" :value="key">{{ book }}</option>
					</select>
				</div>
			</div>

			<div class="radio mb-3">
				<div class="font-medium mb-0.5">Schwierigkeit</div>
				<template v-for="[key, complexity] of _complexity" :key="`complexity-${key}`">
					<input
						v-model.number="form.complexity"
						type="radio"
						class="mt-1 mr-1.5 ml-4 align-top"
						:id="`complexity${key}`"
						name="complexity"
						:value="key"
					/><label :for="`complexity${key}`" class="inline-block cursor-pointer">{{ complexity }}</label>
				</template>
			</div>

			<div class="mb-4">
				<label for="notes" class="inline-block font-medium mb-1.5">Tipps</label>
				<textarea v-model.trim="form.notes" class="form-control" id="notes" cols="30" rows="6"></textarea>
			</div>
		</div>

		<div>
			<div class="grid gap-x-4 grid-cols-2">
				<div class="mb-4">
					<label for="duration" class="inline-block font-medium mb-1.5">Zubereitungszeit</label>
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
					<label for="serves" class="inline-block font-medium mb-1.5">Anzahl Portionen</label>
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
				<label for="ingredients" class="inline-block font-medium mb-1.5">Zutaten</label>
				<textarea v-model.trim="form.ingredients" class="form-control" id="ingredients" cols="30" rows="10"></textarea>
			</div>

			<div class="mb-4">
				<label for="remarkableIngredients" class="inline-block font-medium mb-1.5">besondere Zutaten</label>
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
