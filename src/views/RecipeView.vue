<script setup lang="ts">
import { ref, reactive, computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackLink from '@/components/BackLink.vue'
import type { RecipeFormData } from '@/types/Recipe.type'
import { PROVIDE_SQIDS } from '@/keys'
import { injectStrict } from '@/use/helper'
import { useStore, complexities, cookbooks } from '@/use/store'

const sqids = injectStrict(PROVIDE_SQIDS)

const route = useRoute()
const router = useRouter()

const RecipeForm = defineAsyncComponent(() => import('@/components/RecipeForm.vue'))
const { state, updateEntry } = useStore()

const _id = sqids.decode(route.params.id as string).at(0) as number
const recipe = computed(() => state.recipes.find(item => item.id === _id))
const ingredients = computed(() => (recipe.value?.ingredients ? recipe.value.ingredients.split('\n') : []))
const notes = computed(() =>
	recipe.value?.notes.replace(
		/(\b(https?|):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
		'<a href="$1" rel="noopener">$1</a>',
	),
)

const form = reactive<RecipeFormData>({} as RecipeFormData)
const isFormOpen = ref(false)
const isLocked = ref(false)
const setForm = () => {
	Object.assign(form, {
		...recipe.value,
		duration: recipe.value?.duration || '',
		serves: recipe.value?.serves || '',
		leftovers: recipe.value?.leftovers ?? false, // /!\ `leftovers` ist eine neue Property und daher nicht in allen Records enthalten
	})

	isFormOpen.value = true
	window.scrollTo(0, 0)
}
const leaveForm = () => {
	isFormOpen.value = false
	window.scrollTo(0, 0)
}
const submitForm = async () => {
	isLocked.value = true

	const formData = {
		...form,
		duration: form.duration || 0,
		serves: form.serves || 0,
	}
	await updateEntry(formData)

	router.push({ name: 'recipes' })
}

const headline = computed(() => (!isFormOpen.value ? recipe.value?.name : form.name))
</script>

<template>
	<div>
		<template v-if="recipe">
			<div class="mb-5 print:hidden">
				<BackLink />
			</div>

			<h1 class="headline mb-5 mt-2.5">{{ headline }}</h1>

			<template v-if="!isFormOpen">
				<dl class="md:grid md:grid-cols-[calc(min(38.2%,280px)-0.625rem)_calc(61.8%-0.625rem)] md:gap-x-5">
					<dt class="md:inline-list-dt font-semibold">
						Zutaten <template v-if="recipe.serves > 0">für {{ recipe.serves }}</template>
					</dt>
					<dd>
						<ul v-if="ingredients.length" class="ml-5 list-disc">
							<li v-for="(ingredient, i) in ingredients" :key="i">{{ ingredient }}</li>
						</ul>
					</dd>

					<dt class="md:inline-list-dt <md:mt-2 font-semibold">Zubereitungszeit</dt>
					<dd>
						<template v-if="recipe.duration > 0">{{ recipe.duration }} Minuten</template>
					</dd>

					<dt class="md:inline-list-dt <md:mt-2 font-semibold">Schwierigkeit</dt>
					<dd>{{ complexities.get(recipe.complexity) ?? 'n.a.' }}</dd>

					<dt class="md:inline-list-dt <md:mt-2 font-semibold">Kochbuch</dt>
					<dd>{{ cookbooks.get(recipe.cook_book_id) }}</dd>
				</dl>

				<dl
					v-if="recipe.notes"
					class="mt-4 md:grid md:grid-cols-[calc(min(38.2%,280px)-0.625rem)_calc(61.8%-0.625rem)] md:gap-x-5"
				>
					<dt class="md:inline-list-dt font-semibold">Tipps</dt>
					<dd class="whitespace-pre-line break-words" v-html="notes"></dd>
				</dl>

				<div v-if="state.isAuthenticated" class="mt-8 print:hidden">
					<button type="button" class="primary-button" @click="setForm">Rezept bearbeiten</button>
				</div>
			</template>

			<form v-else aria-label="Rezept bearbeiten" @submit.prevent="submitForm">
				<RecipeForm v-model="form" class="mb-4" />

				<div class="submit">
					<button type="submit" class="primary-button" :disabled="isLocked">Speichern</button>
					<button type="button" class="secondary-button ml-2" @click="leaveForm">Abbrechen</button>
				</div>
			</form>
		</template>

		<template v-else>
			<RouterLink :to="{ name: 'recipes' }" class="back-link mb-2.5 inline-block">Home</RouterLink>
			<div class="text-center text-base font-light md:text-xl">Ungültige Rezept-ID</div>
		</template>
	</div>
</template>
