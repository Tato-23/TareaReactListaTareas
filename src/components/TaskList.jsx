import { useTaskContext } from '../context/TaskContext'
import TaskItem from './TaskItem'
import styles from './TaskList.module.css'

function TaskList() {
  const { tasks } = useTaskContext()

  if (tasks.length === 0) {
    return (
      <div className={styles.empty} role="status" aria-live="polite">
        <span className={styles.emptyIcon} aria-hidden="true">📋</span>
        No hay tareas para mostrar.
      </div>
    )
  }

  return (
    <ul className={styles.list} aria-label="Lista de tareas">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
