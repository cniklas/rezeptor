<script setup>
import { RouterLink } from 'vue-router'

defineEmits(['reset'])
defineProps({
	hasAuthenticated: Boolean,
})
</script>

<template>
	<nav class="search-form mb-6 py-2">
		<label for="search" class="inline-block font-medium mb-2 hidden-md-down">Suche nach Rezept oder Zutaten:</label>

		<div class="flex justify-between">
			<div class="flex-auto relative sm:max-w-xs">
				<slot />

				<button
					type="reset"
					aria-label="Reset"
					class="reset-button absolute top-0 bottom-0 right-px flex items-center px-3 focus:ring-transparent focus:ring-offset-transparent"
					@click="$emit('reset')"
				>
					<svg class="icon-clear inline-block fill-current stroke-current stroke-0 w-4 h-4">
						<use href="@/assets/app.svg#clear"></use>
					</svg>
				</button>
			</div>

			<RouterLink :to="{ name: hasAuthenticated ? 'add-recipe' : 'login' }" class="btn btn-primary hidden-md-down">
				{{ hasAuthenticated ? 'Rezept hinzufügen' : 'Anmelden' }}
			</RouterLink>
		</div>
	</nav>
</template>

<style scoped>
:deep(.form-control) {
	padding-right: 2.875rem;
}

.reset-button {
	border-radius: 0 3px 3px 0;
}

.icon-clear {
	margin-left: -3px;
	margin-right: -3px;
}
</style>
