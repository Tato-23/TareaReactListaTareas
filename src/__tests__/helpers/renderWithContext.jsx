import { render } from '@testing-library/react'
import { TaskContext } from '../../context/TaskContext'
import { vi } from 'vitest'

export function buildContextValue(overrides = {}) {
  return {
    tasks: [],
    filter: 'all',
    setFilter: vi.fn(),
    addTask: vi.fn(),
    deleteTask: vi.fn(),
    updateTask: vi.fn(),
    toggleTask: vi.fn(),
    ...overrides,
  }
}

export function renderWithContext(ui, contextValue = {}) {
  const value = buildContextValue(contextValue)
  return {
    ...render(
      <TaskContext.Provider value={value}>{ui}</TaskContext.Provider>
    ),
    contextValue: value,
  }
}
