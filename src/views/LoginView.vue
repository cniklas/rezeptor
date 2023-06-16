<script setup>
import { ref } from 'vue'
import BackLink from '@/components/BackLink.vue'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useToast } from '@/use/toast'

const { addToast } = useToast()

const email = ref('')
const password = ref('')
const isSubmitLocked = ref(false)

const onSubmit = async () => {
	if (isSubmitLocked.value) return

	isSubmitLocked.value = true

	try {
		await signInWithEmailAndPassword(auth, email.value, password.value)
	} catch (error) {
		const message = error.message ?? 'Anmeldung fehlgeschlagen.'
		addToast(message, false)
		isSubmitLocked.value = false
	}
}
</script>

<template>
	<section>
		<BackLink />

		<h2 class="headline mb-8 mt-2.5 pb-2.5 text-2xl font-medium md:text-3xl">Anmelden</h2>

		<form novalidate @submit.prevent="onSubmit">
			<div class="md:w-6/12 lg:w-5/12 xl:w-4/12">
				<div class="is-required mb-4">
					<label for="email" class="sr-only">E-Mail</label>
					<input
						v-model.trim="email"
						type="text"
						class="form-control"
						id="email"
						placeholder="E-Mail"
						autocomplete="username"
						enterkeyhint="go"
					/>
				</div>

				<div class="is-required mb-4">
					<label for="password" class="sr-only">Passwort</label>
					<input
						v-model.trim="password"
						type="password"
						class="form-control"
						id="password"
						placeholder="Passwort"
						autocomplete="current-password"
						enterkeyhint="go"
					/>
				</div>
			</div>

			<div class="submit">
				<button type="submit" class="btn btn-primary" :disabled="isSubmitLocked">Anmelden</button>
			</div>
		</form>
	</section>
</template>
