<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabase'
import BackLink from '@/components/BackLink.vue'
import { useToast } from '@/use/toast'

const { addToast } = useToast()

const email = ref('')
const password = ref('')
const isSubmitLocked = ref(false)

const onSubmit = async () => {
	if (isSubmitLocked.value) return
	isSubmitLocked.value = true

	try {
		const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
		if (error) throw error
	} catch (error) {
		addToast((error as Error).message ?? 'Anmeldung fehlgeschlagen.', false)
		isSubmitLocked.value = false
	}
}
</script>

<template>
	<div>
		<BackLink class="mb-2.5 inline-block" />

		<h1 id="aria-heading-login" class="headline mb-8 mt-2.5">Anmelden</h1>

		<form class="max-w-sm" novalidate aria-labelledby="aria-heading-login" @submit.prevent="onSubmit">
			<div class="mb-4">
				<label for="email" class="text-label">E-Mail</label>
				<input v-model.trim="email" type="text" class="form-control" id="email" autocomplete="username" />
			</div>

			<div class="mb-4">
				<label for="password" class="text-label">Passwort</label>
				<input
					v-model.trim="password"
					type="password"
					class="form-control"
					id="password"
					autocomplete="current-password"
					enterkeyhint="go"
				/>
			</div>

			<button type="submit" class="primary-button" :aria-disabled="isSubmitLocked">Anmelden</button>
		</form>
	</div>
</template>
