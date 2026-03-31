import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import TaskForm from '../components/TaskForm'
import { renderWithContext } from './helpers/renderWithContext'

describe('TaskForm — renderizado', () => {
  it('muestra el campo de texto', () => {
    renderWithContext(<TaskForm />)
    expect(screen.getByPlaceholderText('Nueva tarea...')).toBeInTheDocument()
  })

  it('muestra el botón Agregar', () => {
    renderWithContext(<TaskForm />)
    expect(screen.getByRole('button', { name: 'Agregar' })).toBeInTheDocument()
  })

  it('el campo inicia vacío', () => {
    renderWithContext(<TaskForm />)
    expect(screen.getByPlaceholderText('Nueva tarea...')).toHaveValue('')
  })
})

describe('TaskForm — agregar tarea', () => {
  it('llama a addTask con el texto ingresado', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<TaskForm />)

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Comprar pan')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(contextValue.addTask).toHaveBeenCalledWith('Comprar pan')
  })

  it('llama a addTask al presionar Enter', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<TaskForm />)

    await user.type(screen.getByPlaceholderText('Nueva tarea...'), 'Tarea con Enter{Enter}')

    expect(contextValue.addTask).toHaveBeenCalledWith('Tarea con Enter')
  })

  it('limpia el campo después de enviar', async () => {
    const user = userEvent.setup()
    renderWithContext(<TaskForm />)
    const input = screen.getByPlaceholderText('Nueva tarea...')

    await user.type(input, 'Tarea de prueba')
    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(input).toHaveValue('')
  })

  it('llama a addTask incluso con texto vacío (la validación está en el hook)', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<TaskForm />)

    await user.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(contextValue.addTask).toHaveBeenCalledWith('')
  })
})
