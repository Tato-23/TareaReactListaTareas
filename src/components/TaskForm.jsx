import { useState } from 'react'
import { useTaskContext } from '../context/TaskContext'
import styles from './TaskForm.module.css'

function TaskForm() {
  const { addTask } = useTaskContext()
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    addTask(text)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        className={styles.input}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Nueva tarea..."
        aria-label="Nueva tarea"
      />
      <button type="submit" className={styles.button}>
        Agregar
      </button>
    </form>
  )
}

export default TaskForm
