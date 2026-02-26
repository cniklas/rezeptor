<script setup lang="ts">
import { useTemplateRef } from 'vue'

const emit = defineEmits<{
	reset: []
}>()
defineProps<{
	isAuthenticated: boolean
}>()

const searchEl = useTemplateRef<HTMLDivElement>('searchEl')
const onReset = () => {
	emit('reset')
	searchEl.value!.focus()
}
</script>

<template>
	<div class="flex items-end justify-between py-2">
		<search ref="searchEl" class="search" tabindex="-1">
			<label for="search" class="text-label !<md:hidden">Suche nach Rezept oder Zutaten:</label>
			<div class="relative">
				<slot />

				<button
					type="button"
					class="reset-button absolute top-0 right-px bottom-0 grid place-content-center px-3"
					aria-label="Eingabe löschen"
					@click="onReset"
				>
					<svg
						class="icon-clear inline-block fill-current stroke-current stroke-0"
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

<style lang="postcss">
.search {
	@apply flex-auto sm:max-w-xs;
}

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
