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

export type RecipeFormData = Omit<Recipe, 'duration' | 'id' | 'serves'> & {
	duration: number | string
	id?: number
	serves: number | string
}
