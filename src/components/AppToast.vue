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
	@apply pointer-events-auto mb-2.5 cursor-pointer rounded-2xl px-4 py-1.5 text-center text-base/5 text-white;

	&.success {
		background-color: #10b981;
	}

	&.danger {
		background-color: #f43f5e;
	}
}
</style>
