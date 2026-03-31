import { useTaskContext } from '../context/TaskContext'
import styles from './TaskItem.module.css'

function TaskItem({ task }) {
  const { toggleTask, deleteTask } = useTaskContext()

  return (
    <li className={styles.item}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
        aria-label={`Marcar "${task.text}" como ${task.completed ? 'pendiente' : 'completada'}`}
      />
      <span className={`${styles.text} ${task.completed ? styles.textDone : ''}`}>
        {task.text}
      </span>
      <button
        onClick={() => deleteTask(task.id)}
        className={styles.deleteBtn}
        aria-label={`Eliminar "${task.text}"`}
        title="Eliminar tarea"
      >
        ✕
      </button>
    </li>
  )
}

export default TaskItem
