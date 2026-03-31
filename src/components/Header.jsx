import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.icon} aria-hidden="true">✅</span>
      <h1 className={styles.title}>Lista de Tareas</h1>
      <p className={styles.subtitle}>Organiza tu día, una tarea a la vez</p>
    </header>
  )
}

export default Header
