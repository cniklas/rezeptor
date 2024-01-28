import type { InjectionKey } from 'vue'
import type Sqids from 'sqids'

export const PROVIDE_CATEGORIES: InjectionKey<Map<number, string>> = Symbol('categories')
export const PROVIDE_COMPLEXITY: InjectionKey<Map<number, string>> = Symbol('complexity')
export const PROVIDE_COOKBOOKS: InjectionKey<Map<number, string>> = Symbol('cookbooks')
export const PROVIDE_SQIDS: InjectionKey<Sqids> = Symbol('sqids')
