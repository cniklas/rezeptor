<script setup>
import { ref, computed, inject, onMounted, onBeforeUnmount } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import SortIcons from '@/components/SortIcons.vue'
import AppLoader from '@/components/AppLoader.vue'
import { RouterLink } from 'vue-router'
import { useStore } from '../use/store'

const hashids = inject('hashids')
const _complexity = inject('complexity')
const _categories = inject('categories')
const { state, search, sorting, fetchEntries, setHasHistory } = useStore()

const isLoading = ref(false)
const fetchRecipes = () => {
	if (!isLoading.value) {
		isLoading.value = true
		fetchEntries()
	}
}

const sortBy = key => {
	fetchRecipes()

	if (key === sorting.key) {
		sorting.order[key] = sorting.order[key] * -1
	} else {
		sorting.key = key
		// sorting.order[key] = 1
	}
}
const sortClass = key => (sorting.order[key] > 0 ? 'asc' : 'desc') + (sorting.key === key ? ' active' : '')

const filteredList = computed(() => {
	// https://vuejs.org/v2/examples/grid-component.html
	const filterKey = search.value && search.value.toLowerCase()
	const key = sorting.key
	const order = sorting.order[key] || 1
	let filteredList = state.recipes

	if (filterKey) {
		filteredList = filteredList.filter(item => {
			return (
				item.name.toLowerCase().indexOf(filterKey) !== -1 || item.ingredients.toLowerCase().indexOf(filterKey) !== -1
			)
		})
	}

	if (key) {
		filteredList = filteredList.slice().sort((a, b) => {
			a = a[key]
			b = b[key]
			return Number.isInteger(a) ? (a === b ? 0 : a > b ? 1 : -1) * order : a.localeCompare(b) * order
		})
	}

	return filteredList
})
const resetList = () => {
	search.value = ''
}

const encodeId = id => hashids.encode(id)

const loader = ref(null)
let observer = null
const _startObserver = () => {
	observer = new IntersectionObserver(
		([entry], self) => {
			if (entry.isIntersecting) {
				fetchRecipes()
				self.unobserve(entry.target)
			}
		},
		{ rootMargin: '0px 0px 120px 0px', threshold: 0 }
	)
	observer.observe(loader.value)
}
const _stopObserver = () => {
	if (observer) observer.disconnect()
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
	<section>
		<ListHeader :has-authenticated="state.hasAuthenticated" @reset="resetList">
			<input
				v-model.trim="search"
				type="search"
				id="search"
				class="form-control"
				placeholder="Suche"
				autocorrect="off"
				autocomplete="off"
				@keyup.esc="resetList"
				@focus.once="fetchRecipes"
			/>
		</ListHeader>

		<table class="table-striped table-stacked w-full">
			<thead class="thead">
				<tr class="tr">
					<th
						class="th sort w-1/4 whitespace-nowrap p-2 text-left align-bottom font-semibold"
						:class="sortClass('name')"
						@click="sortBy('name')"
					>
						Name <SortIcons />
					</th>
					<th
						class="th sort whitespace-nowrap p-2 text-left align-bottom font-semibold"
						:class="sortClass('category_id')"
						@click="sortBy('category_id')"
					>
						Kategorie <SortIcons />
					</th>
					<th
						class="th sort whitespace-nowrap p-2 text-left align-bottom font-semibold"
						:class="sortClass('complexity')"
						@click="sortBy('complexity')"
					>
						Schwierigkeit <SortIcons />
					</th>
					<th
						class="th sort whitespace-nowrap p-2 text-left align-bottom font-semibold"
						:class="sortClass('duration')"
						@click="sortBy('duration')"
					>
						Zubereitungszeit <SortIcons />
					</th>
					<th class="th whitespace-nowrap p-2 text-left align-bottom font-semibold">besondere Zutaten</th>
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
						><template v-if="leftovers"> 🆁</template><template v-if="recommended"> 🥕</template>
					</td>

					<td class="td p-2 align-top">{{ _categories.get(category_id) }}</td>

					<td class="td hidden-xxs p-2 align-top">{{ _complexity.get(complexity) || 'n.a.' }}</td>

					<td class="td p-2 align-top">
						<template v-if="duration > 0">{{ duration }} Minuten</template>
					</td>

					<td class="td p-2 align-top">{{ remarkable_ingredients }}</td>
				</tr>
			</tbody>
		</table>

		<div ref="loader" class="mx-auto mt-4 w-7" :class="{ 'invisible': !isLoading, 'hidden': state.hasLoaded }">
			<AppLoader class="h-7 w-7" />
		</div>
	</section>
</template>

<style lang="postcss">
:root {
	--table-border-color: #d4d4d8;
}

.table-striped .tbody .tr:nth-of-type(odd) {
	background-color: #fafafa;
}

.th {
	border-bottom: 2px solid var(--table-border-color);
}

.sort {
	color: #0369a1;
	cursor: pointer;
	user-select: none;

	&.active {
		background-color: #f4f4f5;
	}

	.icon-sort {
		display: none;
		fill: #1e293b; /* body color */
		width: 1.125rem;
		height: 1.125rem;
		vertical-align: -0.25rem;
	}

	&.active .icon-sort {
		display: inline-block;
	}

	&.active.asc .icon-sort {
		transform: scaleY(-1);
	}
}

.td {
	border-top: 1px solid var(--table-border-color);
}

/* Responsive Table, inspired by https://codepen.io/geoffyuen/pen/FCBEg */
@media screen and (max-width: 639px) {
	.table-stacked {
		width: 100vw !important;
		margin-left: -0.75rem;
		margin-right: -0.75rem;

		.thead {
			display: none;
		}

		.tbody .tr {
			border-top: 1px solid var(--table-border-color);
			display: block;
			padding: 0.375rem 0.75rem;
		}

		.td {
			display: flex;
			padding: 0.125rem 0;
			border: 0;

			&:empty,
			&.hidden-xxs {
				display: none;
			}

			&::before {
				content: attr(data-th) ':';
				flex: 0 0 38.2%;
				font-weight: 600;
				overflow: hidden;
				padding-right: 0.375rem;
				text-overflow: ellipsis;
			}

			&:nth-child(1)::before {
				content: 'Name:';
			}
			&:nth-child(2)::before {
				content: 'Kategorie:';
			}
			&:nth-child(4)::before {
				content: 'Zubereitungszeit:';
			}
			&:nth-child(5)::before {
				content: 'bes. Zutaten:';
			}
		}

		.nav-link {
			margin-right: 0.25rem;
		}
	}
}
</style>
