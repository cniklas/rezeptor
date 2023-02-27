<script setup>
import { ref, inject } from 'vue'
import ListHeader from '@/components/ListHeader.vue'
import AppLoader from '@/components/AppLoader.vue'
import { useStore } from '../use/store'

const _complexity = inject('complexity')
const _categories = inject('categories')
const { state, search } = useStore()

const isLoading = ref(false)
const fetchRecipes = () => {}

const resetList = () => {
	search.value = ''
}
</script>

<template>
	<section>
		ListRecipes

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

		<div ref="loader" class="w-7 mt-4 mx-auto" :class="{ invisible: !isLoading, hidden: state.hasLoaded }">
			<AppLoader />
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
		font-size: 1.125rem;
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
		width: 100vw;
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

.icon-loader {
	font-size: 1.75rem;
}
</style>
