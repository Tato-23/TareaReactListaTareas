import { useTaskContext } from '../context/TaskContext'
import styles from './FilterButtons.module.css'

const FILTERS = [
  { value: 'all',       label: 'Todas' },
  { value: 'pending',   label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]

function FilterButtons() {
  const { filter, setFilter } = useTaskContext()

  return (
    <div role="group" aria-label="Filtrar tareas" className={styles.group}>
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          aria-pressed={filter === value}
          className={`${styles.button} ${filter === value ? styles.active : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons
