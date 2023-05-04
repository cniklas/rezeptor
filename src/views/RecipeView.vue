<script setup>
import { ref, reactive, computed, inject } from 'vue'
import BackLink from '@/components/BackLink.vue'
import RecipeForm from '@/components/RecipeForm.vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useStore } from '../use/store'
import { useToast } from '../use/toast'

const hashids = inject('hashids')
const _complexity = inject('complexity')
const _cookbooks = inject('cookbooks')

const route = useRoute()
const router = useRouter()

const { state, updateEntry } = useStore()
const { addToast } = useToast()

const _id = hashids.decode(route.params.id)[0]
const recipe = computed(() => state.recipes.find(item => item.id === _id))
const ingredients = computed(() => (recipe.value.ingredients ? recipe.value.ingredients.split('\n') : []))
const notes = computed(() =>
	recipe.value.notes.replace(
		/(\b(https?|):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi,
		'<a href="$1" rel="noopener">$1</a>'
	)
)

const form = reactive({})
const edit = ref(false)
const isLocked = ref(false)
const setForm = () => {
	edit.value = true
	Object.assign(form, {
		...recipe.value,
		duration: recipe.value.duration || '',
		serves: recipe.value.serves || '',
		leftovers: recipe.value.leftovers ?? false, // /!\ `leftovers` ist eine neue Property und daher nicht in allen Records enthalten
	})

	window.scrollTo(0, 0)
}
const leaveForm = () => {
	edit.value = false
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

const headline = computed(() => (!edit.value ? recipe.value.name : form.name))

const isShareSupported = 'share' in navigator
const share = () => {
	try {
		navigator.share({
			title: 'Rezeptor',
			text: recipe.value.name,
			url: route.fullPath,
		})
	} catch (error) {
		// console.error(error)
		addToast('Sharing failed')
	}
}
</script>

<template>
	<section>
		<template v-if="recipe">
			<div class="flex justify-between">
				<BackLink />
				<button
					v-if="isShareSupported && !edit"
					type="button"
					class="back-link mb-2.5 inline-block max-w-full hover:underline focus:underline"
					@click="share"
				>
					Link teilen
				</button>
			</div>

			<h2 class="headline mb-5 mt-2.5 pb-2.5 text-2xl font-medium md:text-3xl">{{ headline }}</h2>

			<template v-if="!edit">
				<dl class="md:grid md:grid-cols-[min(38.2%,280px),61.8%]">
					<dt class="inline-list-dt font-bold">
						Zutaten <template v-if="recipe.serves > 0">für {{ recipe.serves }}</template>
					</dt>
					<dd>
						<ul v-if="ingredients.length" class="mb-2 ml-5 list-disc">
							<li v-for="(ingredient, i) in ingredients" :key="i">{{ ingredient }}</li>
						</ul>
					</dd>

					<dt class="inline-list-dt font-bold">Zubereitungszeit</dt>
					<dd>
						<template v-if="recipe.duration > 0">{{ recipe.duration }} Minuten</template>
					</dd>

					<dt class="inline-list-dt font-bold">Schwierigkeit</dt>
					<dd>{{ _complexity.get(recipe.complexity) || 'n.a.' }}</dd>

					<dt class="inline-list-dt font-bold">Kochbuch</dt>
					<dd>{{ _cookbooks.get(recipe.cook_book_id) }}</dd>
				</dl>

				<dl v-if="recipe.notes" class="mt-4 md:grid md:grid-cols-[min(38.2%,280px),61.8%]">
					<dt class="inline-list-dt font-bold">Tipps</dt>
					<dd class="whitespace-pre-line break-words" v-html="notes"></dd>
				</dl>

				<div v-if="state.hasAuthenticated" class="mt-5 print:hidden">
					<button type="button" class="btn btn-primary" @click="setForm">Rezept bearbeiten</button>
				</div>
			</template>

			<form v-else role="form" @submit.prevent="submitForm">
				<RecipeForm :form-data="form" />

				<div class="submit">
					<button type="submit" class="btn btn-primary" :disabled="isLocked">Speichern</button>
					<button type="button" class="btn btn-default ml-2" @click="leaveForm">Abbrechen</button>
				</div>
			</form>
		</template>

		<template v-else>
			<RouterLink
				:to="{ name: 'recipes' }"
				class="back-link mb-2.5 inline-block max-w-full hover:underline focus:underline"
				>zurück</RouterLink
			>
			<div class="text-center text-base font-light md:text-xl">Ungültige Rezept-ID</div>
		</template>
	</section>
</template>

<style lang="postcss">
@media screen and (min-width: 768px) {
	.inline-list-dt {
		@apply overflow-hidden overflow-ellipsis whitespace-nowrap pr-5 text-right;
	}
}
</style>
