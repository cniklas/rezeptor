<script setup lang="ts">
defineEmits<{
	(event: 'reset'): void
}>()
defineProps<{
	isAuthenticated: boolean
}>()
</script>

<template>
	<div class="flex items-end justify-between py-2">
		<search class="flex-auto sm:max-w-xs">
			<label for="search" class="text-label !<md:hidden">Suche nach Rezept oder Zutaten:</label>
			<div class="relative">
				<slot />

				<button
					type="button"
					aria-label="Eingabe löschen"
					class="reset-button absolute bottom-0 right-px top-0 grid place-content-center px-3"
					@click="$emit('reset')"
				>
					<svg
						class="icon-clear inline-block h-4 w-4 fill-current stroke-current stroke-0"
						aria-hidden="true"
						width="16"
						height="16"
					>
						<use href="/app.svg#clear"></use>
					</svg>
				</button>
			</div>
		</search>

		<RouterLink :to="{ name: isAuthenticated ? 'add-recipe' : 'login' }" class="primary-button !<md:hidden">
			{{ isAuthenticated ? 'Rezept hinzufügen' : 'Anmelden' }}
		</RouterLink>
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
