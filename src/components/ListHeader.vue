<script setup>
import { RouterLink } from 'vue-router'

defineEmits(['reset'])
defineProps({
	hasAuthenticated: Boolean,
})
</script>

<template>
	<div class="py-2">
		<label for="search" class="<md:hidden mb-2 inline-block font-medium">Suche nach Rezept oder Zutaten:</label>

		<div class="flex justify-between">
			<div class="relative flex-auto sm:max-w-xs">
				<slot />

				<button
					type="reset"
					aria-label="Eingabe löschen"
					class="reset-button absolute bottom-0 right-px top-0 flex items-center px-3"
					@click="$emit('reset')"
				>
					<svg
						class="icon-clear inline-block h-4 w-4 fill-current stroke-current stroke-0"
						aria-hidden="true"
						width="16"
						height="16"
					>
						<use href="@/assets/app.svg#clear"></use>
					</svg>
				</button>
			</div>

			<RouterLink :to="{ name: hasAuthenticated ? 'add-recipe' : 'login' }" class="btn btn-primary !<md:hidden">
				{{ hasAuthenticated ? 'Rezept hinzufügen' : 'Anmelden' }}
			</RouterLink>
		</div>
	</div>
</template>

<style scoped>
/* Input field slot */
:deep(.form-control) {
	padding-right: 2.875rem;
}

.reset-button {
	border-radius: 0 3px 3px 0;
}

.icon-clear {
	margin-inline: -3px;
}
</style>
