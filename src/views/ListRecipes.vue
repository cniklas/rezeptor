<script setup lang="ts">
import { ref, useTemplateRef, computed, onMounted, onBeforeUnmount } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import SortIcon from '@/components/SortIcon.vue'
import AppLoader from '@/components/AppLoader.vue'
import { PROVIDE_SQIDS } from '@/keys'
import { injectStrict, collator } from '@/use/helper'
import { useStore, categories, complexities } from '@/use/store'

const sqids = injectStrict(PROVIDE_SQIDS)
const { state, search, currentCategory, sorting, fetchEntries, setHasHistory } = useStore()

const isLoading = ref(false)
const fetchRecipes = () => {
	if (!isLoading.value) {
		isLoading.value = true
		fetchEntries()
	}
}

const sortBy = (key: 'name' | 'complexity' | 'duration') => {
	fetchRecipes()

	if (key === sorting.key) {
		sorting.order[key] = sorting.order[key] * -1
	} else {
		sorting.key = key
		// sorting.order[key] = 1
	}
}
const ariaSorting = (key: 'name' | 'complexity' | 'duration') => {
	if (sorting.key !== key) return undefined
	return sorting.order[key] > 0 ? 'ascending' : 'descending'
}

const categoryList = computed(() => {
	const _categoryMap = new Map<number | null, string>([[null, 'Alle'], ...categories])
	return new Map([..._categoryMap.entries()].sort((a, b) => collator.compare(a[1], b[1])))
})
const setCategory = (id: number | null) => {
	currentCategory.value = id
}

const filteredList = computed(() => {
	// https://vuejs.org/v2/examples/grid-component.html
	const filterKey = search.value.toLowerCase()
	const key = sorting.key
	const order = sorting.order[key] || 1
	let filteredList = state.recipes

	if (currentCategory.value) {
		filteredList = filteredList.filter(item => item.category_id === currentCategory.value)
	}

	if (filterKey) {
		filteredList = filteredList.filter(
			item =>
				item.name.toLowerCase().indexOf(filterKey) !== -1 || item.ingredients.toLowerCase().indexOf(filterKey) !== -1,
		)
	}

	if (key) {
		filteredList = filteredList.slice().sort((a, b) => {
			const _a = a[key]
			const _b = b[key]
			return Number.isInteger(_a)
				? (_a === _b ? 0 : _a > _b ? 1 : -1) * order
				: collator.compare(_a as string, _b as string) * order
		})
	}

	return filteredList
})

const inputEl = useTemplateRef('inputEl')
const resetSearch = () => {
	search.value = ''
}

const encodeId = (id: number) => sqids.encode([id])

const loaderEl = useTemplateRef('loaderEl')
let observer: IntersectionObserver | null = null
const _startObserver = () => {
	if (!loaderEl.value) return

	observer = new IntersectionObserver(
		([entry], self) => {
			if (entry?.isIntersecting) {
				fetchRecipes()
				self.unobserve(entry.target)
			}
		},
		{ rootMargin: '0px 0px 120px 0px', threshold: 0 },
	)
	observer.observe(loaderEl.value)
}
const _stopObserver = () => {
	observer?.disconnect()
}

onMounted(() => {
	if (!state.hasLoaded) _startObserver()
	if (!state.hasHistory) setHasHistory()
})
onBeforeUnmount(() => {
	_stopObserver()
})
</script>

<template>
	<div>
		<ListHeader class="mb-6" :is-authenticated="state.isAuthenticated" @reset="resetSearch">
			<input
				ref="inputEl"
				v-model.trim="search"
				type="search"
				id="search"
				class="form-control"
				placeholder="Suche"
				autocorrect="off"
				autocomplete="off"
				enterkeyhint="search"
				@keydown.enter="inputEl!.blur()"
				@keyup.esc="resetSearch"
				@focus.once="fetchRecipes"
			/>
		</ListHeader>

		<div class="category-list" role="radiogroup" aria-label="Kategorien" tabindex="-1">
			<label
				v-for="[id, name] of categoryList"
				:key="`category-${id}`"
				:for="`category-${id ?? 'all'}`"
				class="category-button"
			>
				<input
					type="radio"
					name="category"
					class="sr-only"
					:id="`category-${id ?? 'all'}`"
					:checked="currentCategory === id"
					@click="setCategory(id)"
				/>
				{{ name }}
			</label>
		</div>

		<table class="table-striped table-stacked w-full text-sm">
			<thead class="thead select-none">
				<tr class="tr">
					<th scope="col" class="th w-1/4" :aria-sort="ariaSorting('name')">
						<button type="button" class="sort-button" @click="sortBy('name')">Name <SortIcon /></button>
					</th>
					<th scope="col" class="th h-9 px-2 text-left">Kategorie</th>
					<th scope="col" class="th <md:hidden" :aria-sort="ariaSorting('complexity')">
						<button type="button" class="sort-button" @click="sortBy('complexity')">Schwierigkeit <SortIcon /></button>
					</th>
					<th scope="col" class="th" :aria-sort="ariaSorting('duration')">
						<button type="button" class="sort-button" @click="sortBy('duration')">Aufwand <SortIcon /></button>
					</th>
					<th scope="col" class="th h-9 px-2 text-left">besondere Zutaten</th>
				</tr>
			</thead>

			<tbody class="tbody">
				<tr
					v-for="{
						index,
						name,
						leftovers,
						recommended,
						category_id,
						complexity,
						duration,
						remarkable_ingredients,
					} in filteredList"
					:key="index"
					class="tr"
				>
					<td class="td p-2 align-top">
						<RouterLink :to="{ name: 'view-recipe', params: { id: encodeId(index) } }" class="nav-link">{{
							name
						}}</RouterLink
						><template v-if="leftovers"> (Reste)</template><template v-if="recommended"> 🥕</template>
					</td>

					<td class="td p-2 align-top" data-th="Kategorie">{{ categories.get(category_id) }}</td>

					<td class="td !<md:hidden p-2 align-top" data-th="Schwierigkeit">
						{{ complexities.get(complexity) ?? 'n.a.' }}
					</td>

					<td class="td p-2 align-top whitespace-nowrap" data-th="Aufwand">
						<template v-if="duration > 0">{{ duration }} Minuten</template>
					</td>

					<td class="td p-2 align-top" data-th="bes. Zutaten">{{ remarkable_ingredients }}</td>
				</tr>
			</tbody>
		</table>

		<div ref="loaderEl" class="mx-auto mt-4 w-7" :class="{ invisible: !isLoading, hidden: state.hasLoaded }">
			<AppLoader width="28" height="28" />
		</div>
	</div>
</template>

<style lang="postcss">
.category-list {
	@apply -mt-1 mb-5 flex gap-x-3 py-1;
	display: flex;
	overflow-x: auto;
	overscroll-behavior-x: contain;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

.category-button {
	@apply h-7 rounded-md px-2;
	display: inline-flex;
	align-items: center;
	position: relative;
	white-space: nowrap;
	background-color: var(--secondary);
	cursor: pointer;

	@media (hover: hover) and (pointer: fine) {
		&:hover {
			background-color: var(--secondary-hover);
		}
	}

	&:has(:focus-visible),
	&:has(:active:where(:not(:checked))) {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}

	&:has(:checked) {
		background-color: var(--primary);
		color: #fff;
		cursor: default;

		&:has(:focus-visible) {
			outline-color: var(--primary);
		}
	}
}
</style>

<style>
:root {
	--table-border-color: oklch(87.11% 0.005 286.29);
}

.table-striped .tbody .tr:nth-of-type(odd) {
	background-color: oklch(98.51% 0 0);
}

.th {
	border-bottom: 2px solid var(--table-border-color);
	font-weight: 600;
}

.sort-button {
	color: var(--primary);
	width: 100%;
	height: 2.25rem;
	padding-inline: 0.5rem;
	text-align: left;
	white-space: nowrap;

	[aria-sort] > & {
		background-color: oklch(96.74% 0.001 286.38);
	}
}

.sort-icon {
	display: none;
	fill: var(--base-text);
	vertical-align: -0.25rem;

	[aria-sort] & {
		display: inline-block;
	}

	[aria-sort='ascending'] & {
		transform: scaleY(-1);
	}
}

.td {
	border-top: 1px solid var(--table-border-color);
}

/* Responsive Table, inspired by https://codepen.io/geoffyuen/pen/FCBEg */
@media not all and (min-width: 40em) {
	.table-stacked {
		width: 100vw;
		margin-inline: -0.75rem;

		.thead {
			display: none;
		}

		.tbody .tr {
			border-top: 1px solid var(--table-border-color);
			display: block;
			padding: 0.375rem 0.75rem;
		}

		.td {
			display: block;
			padding: 0.125rem 0;
			border: 0;

			&:first-child {
				font-size: 1rem;
				line-height: 1.5;
			}

			&[data-th] {
				display: grid;
				grid-template-columns: calc(38.2% - 0.25rem) calc(61.8% - 0.25rem);
				column-gap: 0.5rem;

				&::before {
					content: attr(data-th) ':';
					font-weight: 500;
					overflow: clip;
					text-overflow: ellipsis;
				}
			}

			&:empty {
				display: none;
			}
		}

		.nav-link {
			margin-right: 0.25rem;
		}
	}
}
</style>
