<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import ListHeader from '@/components/ListHeader.vue'
import SortIcons from '@/components/SortIcons.vue'
import AppLoader from '@/components/AppLoader.vue'
import { PROVIDE_CATEGORIES, PROVIDE_COMPLEXITY, PROVIDE_SQIDS } from '@/keys'
import { injectStrict } from '@/use/helper'
import { useStore } from '@/use/store'

const sqids = injectStrict(PROVIDE_SQIDS)
const categories = injectStrict(PROVIDE_CATEGORIES)
const complexities = injectStrict(PROVIDE_COMPLEXITY)
const { state, search, sorting, fetchEntries, setHasHistory } = useStore()

const isLoading = ref(false)
const fetchRecipes = () => {
	if (!isLoading.value) {
		isLoading.value = true
		fetchEntries()
	}
}

const sortBy = (key: 'name' | 'category_id' | 'complexity' | 'duration') => {
	fetchRecipes()

	if (key === sorting.key) {
		sorting.order[key] = sorting.order[key] * -1
	} else {
		sorting.key = key
		// sorting.order[key] = 1
	}
}
const ariaSorting = (key: 'name' | 'category_id' | 'complexity' | 'duration') => {
	if (sorting.key !== key) return null
	return sorting.order[key] > 0 ? 'ascending' : 'descending'
}

const filteredList = computed(() => {
	// https://vuejs.org/v2/examples/grid-component.html
	const filterKey = search.value && search.value.toLowerCase()
	const key = sorting.key
	const order = sorting.order[key] || 1
	let filteredList = state.recipes

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
				: (_a as string).localeCompare(_b as string) * order
		})
	}

	return filteredList
})
const resetList = () => {
	search.value = ''
}

const encodeId = (id: number) => sqids.encode([id])

const loaderEl = ref(null)
let observer: IntersectionObserver | null = null
const _startObserver = () => {
	if (!loaderEl.value) return

	observer = new IntersectionObserver(
		([entry], self) => {
			if (entry.isIntersecting) {
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
		<ListHeader class="mb-6" :has-authenticated="state.hasAuthenticated" @reset="resetList">
			<input
				v-model.trim="search"
				type="search"
				id="search"
				class="form-control"
				placeholder="Suche"
				autocorrect="off"
				autocomplete="off"
				enterkeyhint="search"
				@keyup.enter="($event.target as HTMLInputElement).blur()"
				@keyup.esc="resetList"
				@focus.once="fetchRecipes"
			/>
		</ListHeader>

		<table class="table-striped table-stacked w-full text-sm">
			<thead class="thead select-none whitespace-nowrap">
				<tr class="tr">
					<th scope="col" class="th w-1/4" :aria-sorting="ariaSorting('name')">
						<button type="button" class="sort-button" @click="sortBy('name')">
							Name <SortIcons width="18" height="18" />
						</button>
					</th>
					<th scope="col" class="th" :aria-sorting="ariaSorting('category_id')">
						<button type="button" class="sort-button" @click="sortBy('category_id')">
							Kategorie <SortIcons width="18" height="18" />
						</button>
					</th>
					<th scope="col" class="th <md:hidden" :aria-sorting="ariaSorting('complexity')">
						<button type="button" class="sort-button" @click="sortBy('complexity')">
							Schwierigkeit <SortIcons width="18" height="18" />
						</button>
					</th>
					<th scope="col" class="th" :aria-sorting="ariaSorting('duration')">
						<button type="button" class="sort-button" @click="sortBy('duration')">
							Aufwand <SortIcons width="18" height="18" />
						</button>
					</th>
					<th scope="col" class="th whitespace-nowrap p-2 text-left align-bottom">besondere Zutaten</th>
				</tr>
			</thead>

			<tbody class="tbody">
				<tr
					v-for="{
						id,
						name,
						leftovers,
						recommended,
						category_id,
						complexity,
						duration,
						remarkable_ingredients,
					} in filteredList"
					:key="id"
					class="tr"
				>
					<td class="td p-2 align-top">
						<RouterLink :to="{ name: 'view-recipe', params: { id: encodeId(id) } }" class="nav-link">{{
							name
						}}</RouterLink
						><template v-if="leftovers"> (Reste)</template><template v-if="recommended"> 🥕</template>
					</td>

					<td class="td p-2 align-top" data-th="Kategorie">{{ categories.get(category_id) }}</td>

					<td class="td !<md:hidden p-2 align-top" data-th="Schwierigkeit">
						{{ complexities.get(complexity) ?? 'n.a.' }}
					</td>

					<td class="td whitespace-nowrap p-2 align-top" data-th="Aufwand">
						<template v-if="duration > 0">{{ duration }} Minuten</template>
					</td>

					<td class="td p-2 align-top" data-th="bes. Zutaten">{{ remarkable_ingredients }}</td>
				</tr>
			</tbody>
		</table>

		<div ref="loaderEl" class="mx-auto mt-4 w-7" :class="{ invisible: !isLoading, hidden: state.hasLoaded }">
			<AppLoader class="aspect-1 w-7" width="28" height="28" />
		</div>
	</div>
</template>

<style>
:root {
	--table-border-color: #d4d4d8;
}

.table-striped .tbody .tr:nth-of-type(odd) {
	background-color: #fafafa;
}

.th {
	border-bottom: 2px solid var(--table-border-color);
	font-weight: 600;
}

.sort-button {
	color: var(--primary-color);
	width: 100%;
	height: 2.25rem;
	padding-inline: 0.5rem;
	text-align: left;

	[aria-sorting] > & {
		background-color: #f4f4f5;
	}
}

.sort-icon {
	display: none;
	fill: var(--base-text-color);
	width: 1.125rem;
	aspect-ratio: 1;
	vertical-align: -0.25rem;

	[aria-sorting] & {
		display: inline-block;
	}

	[aria-sorting='ascending'] & {
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
					/* font-weight: 600; */
					font-weight: 500;
					overflow: hidden;
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
