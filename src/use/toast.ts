import { reactive, readonly } from 'vue'

type Toast = {
	id: number
	message: string
	class: string
}

let tid = 0
const toasts = reactive<Toast[]>([])

const addToast = (message: string, success = true) => {
	toasts.push({ id: ++tid, message, class: success ? 'success' : 'danger' })
}

const removeToast = (id: number) => {
	const index = toasts.findIndex(item => item.id === id) // im Fehlerfall `-1`
	if (index >= 0) toasts.splice(index, 1)
}

export const useToast = () => ({
	toasts: readonly(toasts),
	addToast,
	removeToast,
})
