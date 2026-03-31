import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import FilterButtons from '../components/FilterButtons'
import { renderWithContext } from './helpers/renderWithContext'

describe('FilterButtons — renderizado', () => {
  it('muestra los tres botones de filtro', () => {
    renderWithContext(<FilterButtons />)
    expect(screen.getByRole('button', { name: 'Todas' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pendientes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Completadas' })).toBeInTheDocument()
  })

  it('todos los botones tienen el atributo aria-pressed', () => {
    renderWithContext(<FilterButtons />)
    screen.getAllByRole('button').forEach(btn => {
      expect(btn).toHaveAttribute('aria-pressed')
    })
  })
})

describe('FilterButtons — filtro activo', () => {
  it('marca "Todas" como activo cuando el filtro es "all"', () => {
    renderWithContext(<FilterButtons />, { filter: 'all' })
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Pendientes' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Completadas' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('marca "Pendientes" como activo cuando el filtro es "pending"', () => {
    renderWithContext(<FilterButtons />, { filter: 'pending' })
    expect(screen.getByRole('button', { name: 'Pendientes' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Completadas' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('marca "Completadas" como activo cuando el filtro es "completed"', () => {
    renderWithContext(<FilterButtons />, { filter: 'completed' })
    expect(screen.getByRole('button', { name: 'Completadas' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Todas' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Pendientes' })).toHaveAttribute('aria-pressed', 'false')
  })
})

describe('FilterButtons — interacción', () => {
  it('llama a setFilter con "all" al hacer click en Todas', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<FilterButtons />, { filter: 'pending' })

    await user.click(screen.getByRole('button', { name: 'Todas' }))

    expect(contextValue.setFilter).toHaveBeenCalledWith('all')
  })

  it('llama a setFilter con "pending" al hacer click en Pendientes', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<FilterButtons />)

    await user.click(screen.getByRole('button', { name: 'Pendientes' }))

    expect(contextValue.setFilter).toHaveBeenCalledWith('pending')
  })

  it('llama a setFilter con "completed" al hacer click en Completadas', async () => {
    const user = userEvent.setup()
    const { contextValue } = renderWithContext(<FilterButtons />)

    await user.click(screen.getByRole('button', { name: 'Completadas' }))

    expect(contextValue.setFilter).toHaveBeenCalledWith('completed')
  })
})
