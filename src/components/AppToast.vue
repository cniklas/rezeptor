<script setup>
import { onMounted } from 'vue'

const emit = defineEmits(['removeToast'])
const props = defineProps({
	timeout: {
		type: Boolean,
	},
})

onMounted(() => {
	if (props.timeout) {
		setTimeout(emit, 1800, 'removeToast')
	}
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
	cursor: pointer;
	pointer-events: auto;
	padding: 0.375rem 1rem;
	font-size: 1rem;
	text-align: center;
	border-radius: 1rem;
	margin-bottom: 0.625rem;

	&.success {
		background-color: #10b981;
		color: #fff;
	}

	&.danger {
		background-color: #f43f5e;
		color: #fff;
	}
}
</style>
