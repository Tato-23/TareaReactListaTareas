import { useReducer, useEffect } from 'react'
import { taskReducer, ACTIONS, initialState } from '../reducers/taskReducer'

const STORAGE_KEY = 'tasks'

function loadInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...initialState, tasks: JSON.parse(stored) } : initialState
  } catch {
    return initialState
  }
}

export function useTasks() {
  const [state, dispatch] = useReducer(taskReducer, null, loadInitialState)

  // Sincroniza solo las tareas con localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks))
  }, [state.tasks])

  function addTask(text) {
    if (!text.trim()) return
    dispatch({
      type: ACTIONS.ADD_TASK,
      payload: { id: crypto.randomUUID(), text: text.trim(), completed: false },
    })
  }

  function deleteTask(id) {
    dispatch({ type: ACTIONS.DELETE_TASK, payload: id })
  }

  function updateTask(id, changes) {
    dispatch({ type: ACTIONS.UPDATE_TASK, payload: { id, changes } })
  }

  function toggleTask(id) {
    dispatch({ type: ACTIONS.TOGGLE_TASK, payload: id })
  }

  function setFilter(filter) {
    dispatch({ type: ACTIONS.SET_FILTER, payload: filter })
  }

  const filteredTasks = state.tasks.filter(task => {
    if (state.filter === 'completed') return task.completed
    if (state.filter === 'pending')   return !task.completed
    return true
  })

  return { tasks: filteredTasks, filter: state.filter, setFilter, addTask, deleteTask, updateTask, toggleTask }
}
