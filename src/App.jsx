import { lazy, Suspense } from 'react'
import { TaskProvider } from './context/TaskContext'
import Header from './components/Header'
import TaskList from './components/TaskList'
import LoadingSpinner from './components/LoadingSpinner'
import styles from './App.module.css'

const TaskForm      = lazy(() => import('./components/TaskForm'))
const FilterButtons = lazy(() => import('./components/FilterButtons'))

function App() {
  return (
    <TaskProvider>
      <div className={styles.app}>
        <Header />
        <Suspense fallback={<LoadingSpinner />}>
          <TaskForm />
        </Suspense>
        <Suspense fallback={<LoadingSpinner />}>
          <FilterButtons />
        </Suspense>
        <TaskList />
      </div>
    </TaskProvider>
  )
}

export default App
