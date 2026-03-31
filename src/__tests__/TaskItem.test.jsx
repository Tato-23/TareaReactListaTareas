import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import TaskItem from '../components/TaskItem'
import { renderWithContext } from './helpers/renderWithContext'

const pendingTask   = { id: '1', text: 'Estudiar React', completed: false }
const completedTask = { id: '2', text: 'Leer documentación', completed: true }

describe('TaskItem — renderizado', () => {
  it('muestra el texto de la tarea', () => {
    renderWithContext(<TaskItem task={pendingTask} />)
    expect(screen.getByText('Estudiar React')).toBeInTheDocument()
  })

  it('muestra el checkbox sin marcar cuando la tarea está pendiente', () => {
    renderWithContext(<TaskItem task={pendingTask} />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('muestra el checkbox marcado cuando la tarea está completada', () => {
    renderWithContext(<TaskItem task={completedTask} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('no aplica clase de tachado cuando la tarea está pendiente', () => {
    renderWithContext(<TaskItem task={pendingTask} />)
    expect(screen.getByText('Estudiar React').className).not.toContain('textDone')
  })

  it('aplica clase de tachado cuando la tarea está completada', () => {
    renderWithContext(<TaskItem task={completedTask} />)
    expect(screen.getByText('Leer documentación').className).toContain('textDone')
  })

  it('muestra el botón de eliminar', () => {
    renderWithContext(<TaskItem task={pendingTask} />)
    expect(screen.getByRole('button', { name: /eliminar/i })).toBeInTheDocument()
  })
})

describe('TaskItem — marcar como completada', () => {
  it('llama a toggleTask con el id de la tarea al hacer click en el checkbox', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<TaskItem task={pendingTask} />)

    await user.click(screen.getByRole('checkbox'))

    expect(contextValue.toggleTask).toHaveBeenCalledTimes(1)
    expect(contextValue.toggleTask).toHaveBeenCalledWith('1')
  })

  it('llama a toggleTask para desmarcar una tarea completada', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<TaskItem task={completedTask} />)

    await user.click(screen.getByRole('checkbox'))

    expect(contextValue.toggleTask).toHaveBeenCalledWith('2')
  })
})

describe('TaskItem — eliminar tarea', () => {
  it('llama a deleteTask con el id de la tarea al hacer click en Eliminar', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<TaskItem task={pendingTask} />)

    await user.click(screen.getByRole('button', { name: /eliminar/i }))

    expect(contextValue.deleteTask).toHaveBeenCalledTimes(1)
    expect(contextValue.deleteTask).toHaveBeenCalledWith('1')
  })
})
