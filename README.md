# Rezeptor

Sometimes I cook, so I've built a little web app to collect my recipes digitally. The ingredients list is also very helpful when grocery shopping.

I used Google Firebase for a while, but at some point I switched to [Supabase](https://supabase.com/). In the long run Superbase became annoying because your projects are paused if they are inactive for more than 7 days. That's why I made another switch and now use [Instant](https://www.instantdb.com/).

## Example code from the Instant Todo app

```ts
// Subscribe to data
db.subscribeQuery({ todos: {} }, resp => {
	if (resp.error) {
		renderError(resp.error.message)
		return
	}
	if (resp.data) {
		render(resp.data)
	}
})

// Write Data
function addTodo(text: string) {
	db.transact(
		db.tx.todos[id()].update({
			text,
			done: false,
			createdAt: Date.now(),
		}),
	)
}

function deleteTodoItem(todo: Todo) {
	db.transact(db.tx.todos[todo.id].delete())
}

function toggleDone(todo: Todo) {
	db.transact(db.tx.todos[todo.id].update({ done: !todo.done }))
}

function deleteCompleted(todos: Todo[]) {
	const completed = todos.filter(todo => todo.done)
	const txs = completed.map(todo => db.tx.todos[todo.id].delete())
	db.transact(txs)
}

function toggleAllTodos(todos: Todo[]) {
	const newVal = !todos.every(todo => todo.done)
	db.transact(todos.map(todo => db.tx.todos[todo.id].update({ done: newVal })))
}
```
