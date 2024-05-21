<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
	(event: 'removeToast'): void
}>()
const props = defineProps<{
	timeout: boolean
}>()

let _timeout: number
onMounted(() => {
	if (props.timeout) _timeout = window.setTimeout(emit, 1800, 'removeToast')
})

// https://nolanlawson.com/2020/02/19/fixing-memory-leaks-in-web-applications/
onBeforeUnmount(() => {
	if (_timeout) window.clearTimeout(_timeout)
})
</script>

<template>
	<div class="toast">
		<slot />
	</div>
</template>

<style lang="postcss">
.toast {
	@apply rounded-2xl px-4 py-1.5 text-base/5;
	margin-inline: auto;
	color: oklch(1 0 0);
	text-align: center;
	cursor: pointer;
	pointer-events: auto;

	&.success {
		background-color: oklch(69.59% 0.149 162.48);
	}

	&.danger {
		background-color: oklch(64.5% 0.215 16.44);
	}
}
</style>
