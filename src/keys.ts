import type { InjectionKey } from 'vue'
import type Sqids from 'sqids'

export const PROVIDE_SQIDS: InjectionKey<Sqids> = Symbol('sqids')
