import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TaskList from '../components/TaskList'
import { renderWithContext } from './helpers/renderWithContext'

const sampleTasks = [
  { id: '1', text: 'Primera tarea', completed: false },
  { id: '2', text: 'Segunda tarea', completed: true },
  { id: '3', text: 'Tercera tarea', completed: false },
]

describe('TaskList — renderizado', () => {
  it('muestra mensaje cuando no hay tareas', () => {
    renderWithContext(<TaskList />, { tasks: [] })
    expect(screen.getByText('No hay tareas para mostrar.')).toBeInTheDocument()
  })

  it('no muestra el mensaje vacío cuando hay tareas', () => {
    renderWithContext(<TaskList />, { tasks: sampleTasks })
    expect(screen.queryByText('No hay tareas para mostrar.')).not.toBeInTheDocument()
  })

  it('renderiza el número correcto de items', () => {
    renderWithContext(<TaskList />, { tasks: sampleTasks })
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('muestra el texto de cada tarea', () => {
    renderWithContext(<TaskList />, { tasks: sampleTasks })
    expect(screen.getByText('Primera tarea')).toBeInTheDocument()
    expect(screen.getByText('Segunda tarea')).toBeInTheDocument()
    expect(screen.getByText('Tercera tarea')).toBeInTheDocument()
  })

  it('renderiza un checkbox por cada tarea', () => {
    renderWithContext(<TaskList />, { tasks: sampleTasks })
    expect(screen.getAllByRole('checkbox')).toHaveLength(3)
  })

  it('renderiza un botón eliminar por cada tarea', () => {
    renderWithContext(<TaskList />, { tasks: sampleTasks })
    expect(screen.getAllByRole('button', { name: /eliminar/i })).toHaveLength(3)
  })
})

describe('TaskList — estados de tareas', () => {
  it('muestra el checkbox marcado solo para las tareas completadas', () => {
    renderWithContext(<TaskList />, { tasks: sampleTasks })
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked() // Primera tarea: pendiente
    expect(checkboxes[1]).toBeChecked()     // Segunda tarea: completada
    expect(checkboxes[2]).not.toBeChecked() // Tercera tarea: pendiente
  })
})
