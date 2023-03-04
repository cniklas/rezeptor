<script setup>
import { onMounted } from 'vue'

const emit = defineEmits(['removeToast'])
const props = defineProps({
	timeout: {
		type: Boolean,
	},
})

onMounted(() => {
	if (props.timeout) setTimeout(emit, 1800, 'removeToast')
})

// https://nolanlawson.com/2020/02/19/fixing-memory-leaks-in-web-applications/
// onBeforeUnmount(() => {
// 	clearTimeout( … )
// })
</script>

<template>
	<div class="toast">
		<slot />
	</div>
</template>

<style lang="postcss">
.toast {
	@apply cursor-pointer leading-5 mb-2.5 pointer-events-auto px-4 py-1.5 rounded-2xl text-base text-center text-white;

	&.success {
		background-color: #10b981;
	}

	&.danger {
		background-color: #f43f5e;
	}
}
</style>
