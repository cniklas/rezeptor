import { inject, unref, type InjectionKey, type Ref } from 'vue'

// https://logaretm.com/blog/type-safe-provide-inject/
const injectStrict = <T>(key: InjectionKey<T>, fallback?: T) => {
	const resolved = inject(key, fallback)
	if (!resolved) throw new Error(`Could not resolve ${key.description}`)
	return resolved
}

const collator = new Intl.Collator('de', { sensitivity: 'base' })

const isEmpty = (...args: (Ref<string> | string)[]) => args.some(val => !unref(val).length)

export { injectStrict, collator, isEmpty }
