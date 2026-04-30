import { useEffect, useState } from 'react'
import './App.css'

const API_URL = '/api/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTodos()
  }, [])

  async function loadTodos() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Failed to load todos')
      const data = await response.json()
      setTodos(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddTodo(event) {
    event.preventDefault()
    const title = newTodoTitle.trim()
    if (!title) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!response.ok) throw new Error('Failed to add todo')
      const created = await response.json()
      setTodos((current) => [created, ...current])
      setNewTodoTitle('')
    } catch (err) {
      setError(err.message || 'Unable to add todo')
    }
  }

  async function handleToggleComplete(todo) {
    const updatedTodo = { ...todo, completed: !todo.completed }

    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      })
      if (!response.ok) throw new Error('Failed to update todo')
      const returned = await response.json()
      setTodos((current) =>
        current.map((item) => (item.id === todo.id ? returned : item))
      )
    } catch (err) {
      setError(err.message || 'Unable to update todo')
    }
  }

  async function handleDeleteTodo(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete todo')
      setTodos((current) => current.filter((todo) => todo.id !== id))
    } catch (err) {
      setError(err.message || 'Unable to delete todo')
    }
  }

  return (
    <main className="app-shell">
      <section className="todo-card">
        <header className="todo-header">
          <div>
            <p className="eyebrow">Todo App</p>
            <h1>Simple task manager</h1>
            <p className="subtext">Add tasks, mark them complete, and remove items.</p>
          </div>
          <div className="status-pill">
            {loading ? 'Loading…' : `${todos.length} todo${todos.length === 1 ? '' : 's'}`}
          </div>
        </header>

        <form className="todo-form" onSubmit={handleAddTodo}>
          <label htmlFor="newTodo" className="sr-only">
            New todo title
          </label>
          <input
            id="newTodo"
            type="text"
            value={newTodoTitle}
            onChange={(event) => setNewTodoTitle(event.target.value)}
            placeholder="Add a new task"
            className="todo-input"
          />
          <button type="submit" className="button-primary">
            Add
          </button>
        </form>

        {error && <div className="todo-error">{error}</div>}

        <div className="todo-list-wrapper">
          {todos.length === 0 && !loading ? (
            <p className="empty-state">No todos yet. Add one to get started.</p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo.id} className="todo-item">
                  <button
                    type="button"
                    className={`checkbox ${todo.completed ? 'checked' : ''}`}
                    aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
                    onClick={() => handleToggleComplete(todo)}
                  >
                    <span>{todo.completed ? '✓' : ''}</span>
                  </button>

                  <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                    {todo.title}
                  </span>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
