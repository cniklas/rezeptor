import { ref, readonly } from 'vue'

type Toast = {
	id: number
	message: string
	class: string
}

let tid = 0
const toasts = ref<Toast[]>([])

const addToast = (message: string, success = true) => {
	toasts.value.push({ id: ++tid, message, class: success ? 'success' : 'danger' })
}

const removeToast = (id: number) => {
	const index = toasts.value.findIndex(item => item.id === id) // im Fehlerfall `-1`
	if (index >= 0) toasts.value.splice(index, 1)
}

export const useToast = () => ({
	toasts: readonly(toasts.value),
	addToast,
	removeToast,
})
