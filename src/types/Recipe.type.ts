export type Recipe = {
	category_id: number
	complexity: number
	cook_book_id: number
	duration: number
	id: number
	ingredients: string
	leftovers: boolean
	name: string
	notes: string
	recommended: boolean
	remarkable_ingredients: string
	serves: number
}

export type RecipeFormData = {
	category_id: number
	complexity: number
	cook_book_id: number
	duration: number | string
	id?: number
	ingredients: string
	leftovers: boolean
	name: string
	notes: string
	recommended: boolean
	remarkable_ingredients: string
	serves: number | string
}
