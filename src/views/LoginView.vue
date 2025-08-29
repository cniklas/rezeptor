<script setup lang="ts">
import { ref, useTemplateRef, watch, nextTick } from 'vue'
import { instant } from '@/instant'
import BackLink from '@/components/BackLink.vue'
import { isEmpty } from '@/use/helper'
import { useToast } from '@/use/toast'

const { addToast } = useToast()

const email = ref('')
const passcode = ref('')
watch(passcode, input => {
	if (input.length === 6) onSubmit()
})

const formEl = useTemplateRef('formEl')
const isSubmitLocked = ref(false)
const isFirstStep = ref(true)
watch(isFirstStep, async () => {
	await nextTick()
	formEl.value?.querySelector('input')?.focus()
	isSubmitLocked.value = false
})

const onSubmit = () => {
	if (isFirstStep.value) _onSubmitEmail()
	else _onSubmitCode()
}

const _onSubmitEmail = async () => {
	if (isSubmitLocked.value || isEmpty(email)) return
	isSubmitLocked.value = true

	try {
		await instant.auth.sendMagicCode({ email: email.value })
		isFirstStep.value = false
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		addToast(error.body?.message ?? 'Anmeldung 1/2 fehlgeschlagen.', false)
		isSubmitLocked.value = false
	}
}

const _onSubmitCode = async () => {
	if (isSubmitLocked.value || isEmpty(email, passcode)) return
	isSubmitLocked.value = true

	try {
		await instant.auth.signInWithMagicCode({ email: email.value, code: passcode.value })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		addToast(error.body?.message ?? 'Anmeldung 2/2 fehlgeschlagen.', false)
		isSubmitLocked.value = false

		// if ((error as AuthError).code === 'otp_expired') {
		// 	isFirstStep.value = true
		// 	passcode.value = ''
		// }
	}
}
</script>

<template>
	<div>
		<BackLink class="mb-2.5 inline-block" />

		<h1 id="aria-heading-login" class="headline mb-8 mt-2.5">Anmelden</h1>

		<form ref="formEl" class="max-w-sm" novalidate aria-labelledby="aria-heading-login" @submit.prevent="onSubmit">
			<div class="mb-4">
				<template v-if="isFirstStep">
					<label for="email" class="text-label">E-Mail</label>
					<input
						v-model.trim="email"
						type="email"
						class="form-control"
						id="email"
						autocomplete="username"
						enterkeyhint="go"
					/>
				</template>

				<template v-else>
					<label for="code" class="text-label">Code</label>
					<input
						v-model.trim="passcode"
						type="text"
						class="form-control"
						id="code"
						inputmode="decimal"
						maxlength="6"
						pattern="\d{6,6}"
						autocomplete="one-time-code"
						enterkeyhint="go"
					/>
				</template>
			</div>

			<button type="submit" class="primary-button" :aria-disabled="isSubmitLocked">
				{{ isFirstStep ? 'Code anfordern' : 'Anmelden' }}
			</button>
		</form>
	</div>
</template>
