// Docs: https://www.instantdb.com/docs/modeling-data
import { i } from '@instantdb/core'

const _schema = i.schema({
	entities: {
		$files: i.entity({
			path: i.string().unique().indexed(),
			url: i.string().optional(),
		}),
		$users: i.entity({
			email: i.string().unique().indexed().optional(),
		}),
		recipes: i.entity({
			category_id: i.number(),
			complexity: i.number(),
			cook_book_id: i.number(),
			duration: i.number(),
			index: i.number().unique().indexed(),
			ingredients: i.string(),
			leftovers: i.boolean(),
			name: i.string().indexed(),
			notes: i.string(),
			recommended: i.boolean(),
			remarkable_ingredients: i.string(),
			serves: i.number(),
		}),
	},
	links: {},
	rooms: {},
})

// this helps Typescript display nicer intellisense
type _AppSchema = typeof _schema
type AppSchema = _AppSchema
const schema: AppSchema = _schema

export type { AppSchema }
export default schema
