import { reactive, readonly } from 'vue'

let tid = 0
const toasts = reactive([])

const addToast = (message, success = true) => {
	toasts.push({ id: ++tid, message, class: success ? 'success' : 'danger' })
}

const removeToast = id => {
	const index = toasts.findIndex(item => item.id === id) // im Fehlerfall `-1`
	if (index >= 0) toasts.splice(index, 1)
}

export const useToast = () => ({
	toasts: readonly(toasts),
	addToast,
	removeToast,
})
