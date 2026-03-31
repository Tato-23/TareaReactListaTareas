import { createContext, useContext } from 'react'
import { useTasks } from '../hooks/useTasks'

export const TaskContext = createContext(null)

export function TaskProvider({ children }) {
  const value = useTasks()
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTaskContext debe usarse dentro de <TaskProvider>')
  return context
}
