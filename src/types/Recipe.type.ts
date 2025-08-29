import type { InstaQLEntity } from '@instantdb/core'
import type { AppSchema } from '@/instant.schema'

export type Recipe = InstaQLEntity<AppSchema, 'recipes', object, undefined, true>

export type CreateRecipeData = Omit<Recipe, 'duration' | 'id' | 'index' | 'serves'> & {
	duration: string
	serves: string
}

export type UpdateRecipeData = Omit<Recipe, 'duration' | 'serves'> & {
	duration: number | string
	serves: number | string
}
